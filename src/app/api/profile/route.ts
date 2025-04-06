"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
}

export async function PUT(request: Request) {
    const { userId } = await auth();
    const { emailAddresses } = await currentUser();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        let profileImageUrl = "";
        const imageFile = formData.get("profileImage") as File;
        if (imageFile) {
            try {
                const response = await put(imageFile.name, imageFile, { access: "public" });
                if (response?.url) {
                    profileImageUrl = response.url;
                } else {
                    console.error("No URL returned from the blob upload");
                }
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError);
            }
        }

        const formDataObj = Object.fromEntries(formData.entries());

        delete formDataObj.profileImage;

        let preferencesArray: string[] = [];
        if (formDataObj.preferences) {
            preferencesArray = formDataObj.preferences
                .toString()
                .split(",")
                .map((pref) => pref.trim())
                .filter(Boolean);
        }

        const dataToUpdate: Record<string, any> = {
            name: formDataObj.name,
            preferences: preferencesArray,
        };
        if (profileImageUrl) {
            dataToUpdate.profileImage = profileImageUrl;
        }
        const updatedUser = await prisma.user.upsert({
            where: { id: userId },
            update: dataToUpdate,
            create: { ...dataToUpdate, id: userId, email: emailAddresses[0].emailAddress },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
