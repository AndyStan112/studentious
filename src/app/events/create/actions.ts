"use server";
import { EventFormData } from "./page";
import { prisma } from "@/utils";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
export async function createEvent(body: EventFormData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const { title, description, startTime, endTime, tags, image, eventType, url, lat, long } = body;

    if (
        !title ||
        !startTime ||
        !tags ||
        (eventType === "offline" && (!lat || !long)) ||
        (eventType === "online" && !url)
    ) {
        console.log(startTime);
        throw new Error("Missing or invalid required fields");
    }

    const userRecord = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userRecord) {
        throw new Error("User not found in DB");
    }
    const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

    const response = await put(image?.name!, image!, {
        access: "public",
    });

    const imageUrl = response.url;

    const createdEvent = await prisma.event.create({
        data: {
            title,
            description,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            tags: tagsArray,
            organizer: { connect: { id: userRecord.id } },
            image: imageUrl,
            url: eventType === "online" ? url : undefined,
            lat: eventType === "offline" ? lat : undefined,
            long: eventType === "offline" ? long : undefined,
            chat: { create: { users: { connect: { id: userId } } } },
            registrations: { create: { userId } },
        },
    });
    return createdEvent.id;
}
