"use server";

import { prisma } from "@/utils";
import { EventWithOrganizer } from "./page";
import { auth } from "@clerk/nextjs/server";

export async function getEventById(id: string): Promise<EventWithOrganizer> {
    const { userId } = await auth();
    const event = (await prisma.event.findUnique({
        where: { id },
        include: {
            organizer: true,
            registrations: true,
        },
    })) as any;
    return {
        ...event,
        joined: event.registrations.some(
            (registration: { userId: string | null }) => registration.userId === userId
        ),
    };
}
