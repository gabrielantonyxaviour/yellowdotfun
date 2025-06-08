import { uploadImageToPinata } from "@/lib/pinata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Starting image upload to Pinata");
  try {
    const formData = await request.formData();
    console.log("Form data received");

    // Bypass TypeScript's broken type detection
    const file = (formData as unknown as { get(name: string): unknown }).get(
      "file"
    ) as File;

    if (!file || !(file instanceof File)) {
      console.error("Invalid file received");
      return new Response("Invalid file", { status: 400 });
    }
    console.log("File validated:", file.name, file.type, file.size);

    console.log("Uploading to Pinata...");
    const url = await uploadImageToPinata(file);
    console.log("Upload successful, URL:", url);

    return new Response(JSON.stringify({ success: true, url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Upload failed with error:", err);
    return new Response("Upload failed", { status: 500 });
  }
}
