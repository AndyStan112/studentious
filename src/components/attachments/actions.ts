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

export async function addCurriculum(chatId: string, url: string) {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { event: true },
    });

    if (!chat?.event) {
        throw new Error("Chat or associated event not found.");
    }

    const eventId = chat.event.id;

    return prisma.curriculum.create({
        data: {
            url,
            eventId,
        },
    });
}

export async function removeCurriculum(chatId: string, url: string) {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { event: true },
    });

    if (!chat?.event) {
        throw new Error("Chat or associated event not found.");
    }

    const eventId = chat.event.id;

    return prisma.curriculum.deleteMany({
        where: {
            url,
            eventId,
        },
    });
}
