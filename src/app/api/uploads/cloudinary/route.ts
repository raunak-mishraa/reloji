import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Disable body size limit if needed (Next.js App Router supports file uploads via formData)
export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = (form.get("folder") as string) || "reloji";

    if (!file || typeof file === "string") {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const arrayBuffer = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    const msg = err?.message || "Upload failed";
    return new NextResponse(msg, { status: 500 });
  }
}
