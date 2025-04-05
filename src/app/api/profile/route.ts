// app/api/profile/route.ts
"use server";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

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
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        // Attempt to upload a new profile image if provided
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

        // Convert the rest of the form data into an object
        const formDataObj = Object.fromEntries(formData.entries());
        // Remove the file entry since it was already processed
        delete formDataObj.profileImage;

        // Convert preferences from comma-separated string to an array (if provided)
        let preferencesArray: string[] = [];
        if (formDataObj.preferences) {
            preferencesArray = formDataObj.preferences
                .toString()
                .split(",")
                .map((pref) => pref.trim())
                .filter(Boolean);
        }

        // Prepare the data to update
        const dataToUpdate: Record<string, any> = {
            name: formDataObj.name,
            preferences: preferencesArray,
        };
        // Only update the profile image if a new URL was obtained
        if (profileImageUrl) {
            dataToUpdate.profileImage = profileImageUrl;
        }

        // Update the user record in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
