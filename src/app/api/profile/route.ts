// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { userId } = getAuth(request as any);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return only necessary fields for the profile
        return NextResponse.json({
            name: user.name,
            email: user.email,
            preferences: user.preferences,
        });
    } catch (error) {
        console.error("GET /api/profile error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { userId } = getAuth(request as any);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, preferences } = body;

        if (!name || !preferences || !Array.isArray(preferences)) {
            return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, preferences },
        });

        return NextResponse.json({
            name: updatedUser.name,
            email: updatedUser.email,
            preferences: updatedUser.preferences,
        });
    } catch (error) {
        console.error("PUT /api/profile error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
