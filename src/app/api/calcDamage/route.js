import { NextResponse } from "next/server";
import { calcDamageCore } from "./lib/calcDamageCore";

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await calcDamageCore(payload);
    return NextResponse.json({ ...result, status: '200' ,});
  } catch(e){
    return NextResponse.json({ status: '400', error: String(e?.message || e) });
  }
}
