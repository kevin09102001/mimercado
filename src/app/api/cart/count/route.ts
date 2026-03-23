import { NextResponse } from "next/server";
import { getCartCount } from "@/actions/cart";

export async function GET() {
  try {
    const count = await getCartCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
