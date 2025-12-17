import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Validate Solana address format (base58, 32-44 chars)
function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  if (address.length < 32 || address.length > 44) return false;
  // Base58 character set
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(address);
}

// Mock strategy - always returns false (for development)
async function checkHolderMock(address: string): Promise<{ isHolder: boolean; balance: number }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // For testing, treat addresses starting with "holder" as holders
  if (address.toLowerCase().startsWith('holder')) {
    return { isHolder: true, balance: 100 };
  }
  
  return { isHolder: false, balance: 0 };
}

// RPC strategy - check actual token balance on Solana
async function checkHolderRPC(address: string): Promise<{ isHolder: boolean; balance: number }> {
  const rpcUrl = process.env.SOLANA_RPC_URL;
  const tokenMint = process.env.HOLDER_TOKEN_MINT;
  const minBalance = Number(process.env.HOLDER_MIN_BALANCE) || 1;

  if (!rpcUrl || !tokenMint) {
    console.error('Missing SOLANA_RPC_URL or HOLDER_TOKEN_MINT env vars');
    return { isHolder: false, balance: 0 };
  }

  try {
    // Get token accounts for the wallet
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { mint: tokenMint },
          { encoding: 'jsonParsed' }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('RPC error:', data.error);
      return { isHolder: false, balance: 0 };
    }

    const accounts = data.result?.value || [];
    
    if (accounts.length === 0) {
      return { isHolder: false, balance: 0 };
    }

    // Sum up balance from all token accounts
    let totalBalance = 0;
    for (const account of accounts) {
      const tokenAmount = account.account?.data?.parsed?.info?.tokenAmount;
      if (tokenAmount) {
        totalBalance += Number(tokenAmount.uiAmount || 0);
      }
    }

    return {
      isHolder: totalBalance >= minBalance,
      balance: totalBalance
    };
  } catch (error) {
    console.error('RPC check failed:', error);
    return { isHolder: false, balance: 0 };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { address } = body;

    // Validate address
    if (!isValidSolanaAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Determine check strategy
    const strategy = process.env.NEXT_PUBLIC_HOLDER_CHECK_STRATEGY || 'mock';
    
    let result: { isHolder: boolean; balance: number };
    
    if (strategy === 'rpc') {
      result = await checkHolderRPC(address);
    } else {
      result = await checkHolderMock(address);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Holder check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


