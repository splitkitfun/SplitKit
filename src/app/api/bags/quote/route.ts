import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = "https://public-api-v2.bags.fm/api/v1";
const isLive = () => process.env.NEXT_PUBLIC_TOKEN_LIVE === "true";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const inputMint = searchParams.get("inputMint");
    const outputMint = searchParams.get("outputMint");
    const amount = searchParams.get("amount"); // smallest unit
    const slippageMode = searchParams.get("slippageMode") ?? "auto";
    const slippageBps = searchParams.get("slippageBps");

    if (!inputMint || !outputMint || !amount) {
      return NextResponse.json(
        { success: false, error: "inputMint, outputMint, amount are required" },
        { status: 400 }
      );
    }

    const qs = new URLSearchParams({ inputMint, outputMint, amount, slippageMode });
    if (slippageBps) qs.set("slippageBps", slippageBps);

    const r = await fetch(`${BASE_URL}/trade/quote?${qs.toString()}`, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
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

