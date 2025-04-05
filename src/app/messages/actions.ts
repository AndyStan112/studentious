"use server";
import { prisma } from "@/utils";
import { auth } from "@clerk/nextjs/server";

export async function createChat({ userId, eventId }: { userId?: string; eventId?: string }) {
    const { userId: currentUserId } = await auth();

    if (!currentUserId) throw new Error("User not authenticated.");

    if (userId && eventId) throw new Error("Provide only userId or eventId, not both.");

    let allMembers: string[] = [];

    if (userId) {
        allMembers = [currentUserId, userId];
    } else if (eventId) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { registrations: { select: { userId: true } } },
        });

        if (!event) throw new Error("event not found.");

        allMembers = [currentUserId, ...event.registrations.map((m) => m.userId)];
    } else {
        throw new Error("Either userId or eventId must be provided.");
    }

    const existingChat = await prisma.chat.findFirst({
        where: {
            users: {
                every: { id: { in: allMembers } },
            },
        },
        select: { id: true },
    });

    if (existingChat) return existingChat.id;

    const newChat = await prisma.chat.create({
        data: {
            users: {
                connect: allMembers.map((id) => ({ id })),
            },
            event: eventId ? { connect: { id: eventId } } : undefined,
        },
        select: { id: true },
    });

    return newChat.id;
}

export async function getChats() {
    const { userId } = await auth();

    const user = await prisma.user.findUnique({
        where: { id: userId! },
        select: {
            chats: {
                include: {
                    event: {
                        select: {
                            title: true,
                            image: true,
                        },
                    },
                    users: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        },
                    },
                    messages: {
                        include: { sender: { select: { name: true, profileImage: true } } },
                    },
                },
            },
        },
    });

    if (!user) return [];
    console.log(user.chats);
    return user.chats.map((chat) => {
        const isEventChat = chat.event !== null;
        const otherUser = chat.users.find((u) => u.id !== userId);

        return {
            id: chat.id,
            name: isEventChat ? chat.event!.title : otherUser?.name || "Unknown Chat",
            imageUrl: isEventChat
                ? chat.event!.image || "/default_event.png"
                : otherUser?.profileImage || "/default_avatar.png",
        };
    });
}

export async function getChatDetails(chatId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated.");

    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
            event: {
                select: {
                    title: true,
                    image: true,
                },
            },
            users: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                },
            },
        },
    });

    if (!chat) throw new Error("Chat not found.");

    const iseventChat = chat.event !== null;
    const otherUser = chat.users.find((u) => u.id !== userId);

    return {
        id: chat.id,
        name: iseventChat ? chat.event!.title : otherUser?.name || "Unknown Chat",
        imageUrl: iseventChat
            ? chat.event!.image || "/default_event.png"
            : otherUser?.profileImage || "/default_avatar.png",
    };
}
