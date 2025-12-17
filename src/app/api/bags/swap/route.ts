import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = "https://public-api-v2.bags.fm/api/v1";
const isLive = () => process.env.NEXT_PUBLIC_TOKEN_LIVE === "true";

export async function POST(req: Request) {
  try {
    if (!isLive()) {
      return NextResponse.json(
        { success: false, error: "Token is not live yet." },
        { status: 403 }
      );
    }

    const apiKey = process.env.BAGS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing BAGS_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { quoteResponse, userPublicKey } = body ?? {};
    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { success: false, error: "quoteResponse and userPublicKey are required" },
        { status: 400 }
      );
    }

    const r = await fetch(`${BASE_URL}/trade/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ quoteResponse, userPublicKey }),
    });

    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
