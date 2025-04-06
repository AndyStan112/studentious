import { NextResponse } from "next/server";
import { prisma } from "@/utils";
import { AttachmentType } from "@prisma/client";
import { put } from "@vercel/blob";

export async function GET(req: Request, context: { params: { chatId?: string } }) {
    const { chatId } = await context.params;
    console.log(chatId);
    if (!chatId) {
        return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    try {
        const messages = await prisma.messages.findMany({
            where: { chatId },
            include: { sender: { select: { name: true, profileImage: true } } },
            orderBy: { timestamp: "asc" },
        });
        // console.log(messages);
        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
    }
}

export async function POST(req: Request, context: { params: { chatId?: string } }) {
    const { chatId } = await context.params;

    if (!chatId) {
        return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    try {
        const { message } = await req.json();
        console.log(message);
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.message.match(urlRegex);

        if (urls && urls.length > 0) {
            await Promise.all(
                urls.map((url: string) =>
                    prisma.attachment.create({
                        data: {
                            url,
                            type: AttachmentType.LINK,
                            chatId,
                        },
                    })
                )
            );
        }

        const attachmentMarkdown =
            message.attachments && message.attachments.length > 0
                ? message.attachments
                      .map((file: any) => {
                          if (file.type == "IMAGE") {
                              return `![image](${file.url})`;
                          } else {
                              return `[📄 ${file.name}](${file.url})`;
                          }
                      })
                      .join("\n")
                : "";
        const markdown = message.message + attachmentMarkdown;
        await prisma.messages.create({
            data: { message: markdown, senderId: message.senderId, chatId },
        });

        return NextResponse.json({ message: markdown }, { status: 201 });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Error sending message" }, { status: 500 });
    }
}
