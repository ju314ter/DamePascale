import { handleStripeWebhook } from "@/app/(main)/(context)/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const formData = new FormData();
  formData.append("body", body);

  const result = await handleStripeWebhook(formData);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
