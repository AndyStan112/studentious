// app/api/events/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: any) {
    const { userId } = getAuth(request);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, startTime, endTime, tags } = body;

        if (!title || !startTime || !tags || !Array.isArray(tags)) {
            return NextResponse.json(
                { error: "Missing or invalid required fields" },
                { status: 400 }
            );
        }

        const userRecord = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userRecord) {
            return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
        }

        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: endTime ? new Date(endTime) : null,
                tags,
                organizer: { connect: { id: userRecord.id } },
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating event" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const events = await prisma.event.findMany();
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error fetching events" }, { status: 500 });
    }
}
