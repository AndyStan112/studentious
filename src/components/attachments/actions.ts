"use server";

import { prisma } from "@/utils";
import { AttachmentType } from "@prisma/client";

export async function getAttachmentsByChatId(chatId: string, type: AttachmentType) {
    return prisma.attachment.findMany({
        where: {
            chatId,
            type,
        },
        orderBy: {
            uploadedAt: "desc",
        },
    });
}
