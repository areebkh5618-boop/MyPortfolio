import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes, createHash } from "crypto";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// Keep small: base64 lives inside MongoDB documents (16MB hard limit per doc)
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

async function uploadToCloudinary(
  buffer: Buffer,
  mime: string
): Promise<string> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) throw new Error("CLOUDINARY_NOT_CONFIGURED");

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";
  const toSign = `folder=${folder}&timestamp=${timestamp}${secret}`;
  const signature = createHash("sha1").update(toSign).digest("hex");
  const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;

  const body = new URLSearchParams({
    file: dataUri,
    api_key: key,
    timestamp: String(timestamp),
    folder,
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url as string;
}

/** Store image as base64 data URL — saved inside MongoDB with the project */
function toDataUrl(buffer: Buffer, mime: string): string {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function uploadLocal(buffer: Buffer, mime: string): Promise<string> {
  const ext =
    mime === "image/svg+xml"
      ? "svg"
      : mime.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, GIF, SVG allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error:
            "Max image size is 2MB when storing in database. Compress the image and try again.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Mode: database | cloudinary | local
    // Default = database (base64 in MongoDB) — no Cloudinary needed
    const mode = (process.env.IMAGE_STORAGE || "database").toLowerCase();

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (mode === "cloudinary" || (mode === "auto" && hasCloudinary)) {
      if (!hasCloudinary) {
        return NextResponse.json(
          { error: "Cloudinary env vars not set" },
          { status: 500 }
        );
      }
      const url = await uploadToCloudinary(buffer, file.type);
      return NextResponse.json({ url, provider: "cloudinary" });
    }

    if (mode === "local") {
      try {
        const url = await uploadLocal(buffer, file.type);
        return NextResponse.json({ url, provider: "local" });
      } catch {
        // fall through to database
      }
    }

    // Default: embed in DB as data URL (works on Vercel with only MongoDB)
    const url = toDataUrl(buffer, file.type);
    return NextResponse.json({ url, provider: "database" });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
