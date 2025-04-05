"use server";
import { EventFormData } from "@/components/CreateEventForm";
import { prisma } from "@/utils";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
export async function createEvent(body: EventFormData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const { title, description, startTime, endTime, tags, image } = body;

    if (!title || !startTime || !tags) {
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

    const newEvent = await prisma.event.create({
        data: {
            title,
            description,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            tags: tagsArray,
            organizer: { connect: { id: userRecord.id } },
            image: imageUrl,
        },
    });

    return newEvent;
}
