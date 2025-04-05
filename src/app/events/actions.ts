"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils";
import { redirect } from "next/navigation";

export async function joinEvent(eventId: string) {
    const { userId } = await auth();

    if (!userId) throw new Error("Not authenticated");

    await prisma.registration.create({
        data: {
            userId,
            eventId,
        },
    });

    const chat = await prisma.chat.findUnique({
        where: { eventId },
        select: { id: true },
    });

    await prisma.chat.update({
        where: { id: chat!.id },
        data: {
            users: {
                connect: { id: userId },
            },
        },
    });
    redirect(`/events/joined/${eventId}`);
}
