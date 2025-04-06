"use server";

import { prisma } from "@/utils";
import { EventWithOrganizer } from "./page";

export async function getEventById(id: string): Promise<EventWithOrganizer> {
    const event = (await prisma.event.findUnique({
        where: { id },
        include: {
            organizer: true,
            registrations: true,
        },
    })) as EventWithOrganizer;
    return event!;
}
