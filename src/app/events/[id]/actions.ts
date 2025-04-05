"use server";

import { prisma } from "@/utils";
import { Event } from "@prisma/client";

export async function getEventById(id: string): Promise<Event> {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            organizer: true,
            registrations: true,
        },
    });
    console.log(event);
    return event!;
}
