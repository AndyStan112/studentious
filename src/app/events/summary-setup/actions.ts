"use server";

import { prisma } from "@/utils";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { OpenAI, toFile } from "openai";

import axios from "axios";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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

export async function generateSummaryFromUrls(urls: string[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const filePromises = urls.map(
        async (url, index) =>
            await openai.files.create({
                file: await fetch(url),
                purpose: "user_data",
            })
    );

    const uploadedFiles = await Promise.all(filePromises);

    const file_content = uploadedFiles.map((file) => {
        return { type: "input_file" as "input_file", file_id: file.id };
    });

    const response = await openai.responses.create({
        model: "gpt-4o",
        instructions:
            "Please summarize the following documents comprehensively and clearly. Create a plain text summary that is audio friendly, suitable for being passed to another model for text to speech. Aim for around 3 minutes of talking",
        input: [
            {
                role: "user",
                content: [...file_content],
            },
        ],
    });

    console.log(response.output_text);
    return response.output_text;
}
export async function generateAudioFromText(text: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const response = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "nova",
        input: text,
    });

    const arrayBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });

    const file = new File([audioBlob], "summary.mp3", { type: "audio/mpeg" });
    const uploaded = await put("summary.mp3", file, { access: "public" });

    return uploaded.url;
}
