import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/utils";
import { auth } from "@clerk/nextjs/server";

const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
const SUPPORTED_DOC_TYPES = ["application/pdf", "text/plain"];

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;
    if (!chatId) {
        return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const upploaderId = formData.get("upploaderId") as string;

        if (!file || !file.type) {
            return NextResponse.json({ error: "Invalid file upload" }, { status: 400 });
        }

        const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);
        const isDocument = SUPPORTED_DOC_TYPES.includes(file.type);

        if (!isImage && !isDocument) {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }

        const upload = await put(file.name, file, { access: "public" });

        await prisma.attachment.create({
            data: {
                url: upload.url,
                type: isImage ? "IMAGE" : "DOCUMENT",
                chatId,
                upploaderId,
            },
        });
        console.log(upload.url);
        return NextResponse.json(
            {
                success: true,
                url: upload.url,
                type: isImage ? "IMAGE" : "DOCUMENT",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
