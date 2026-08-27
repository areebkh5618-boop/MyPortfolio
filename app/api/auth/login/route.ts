import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    if (!checkCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(username);
    return NextResponse.json({ ok: true, user: username });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Server misconfigured. Set ADMIN_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD in .env" },
      { status: 500 }
    );
  }
}
