"use server";

import { prisma } from "@/utils";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";

export async function uploadCurriculumFile(eventId: string, file: File) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { organizer: true },
    });

    if (!event || event.organizerId !== userId) {
        throw new Error("Unauthorized or event not found");
    }

    const response = await put(file.name, file, { access: "public" });
    const curriculum = await prisma.curriculum.create({
        data: {
            url: response.url,
            eventId,
        },
    });

    return curriculum;
}

export async function updateEventSummary(eventId: string, summary: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event || event.organizerId !== userId) {
        throw new Error("Unauthorized or event not found");
    }

    await prisma.event.update({
        where: { id: eventId },
        data: { summary },
    });

    return { success: true };
}
