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

function getMatchScore(userPreferences: string[], eventTags: string[]): number {
    return eventTags.filter((tag) => userPreferences.includes(tag)).length;
}

export async function recommendEvents(): Promise<any[]> {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { preferences: true },
    });

    if (!user || !user.preferences || user.preferences.length === 0) {
        return [];
    }
    const userPreferences = user.preferences;

    const events = await prisma.event.findMany({
        orderBy: { startTime: "asc" },
        select: {
            id: true,
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            url: true,
            image: true,
            tags: true,
        },
    });

    const scoredEvents = events
        .map((event) => ({
            event,
            score: getMatchScore(userPreferences, event.tags),
        }))
        .filter((item) => item.score > 0);

    scoredEvents.sort((a, b) => b.score - a.score);
    return scoredEvents.slice(0, 3).map((item) => item.event);
}
