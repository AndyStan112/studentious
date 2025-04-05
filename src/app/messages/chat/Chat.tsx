"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import ChatBox from "./ChatBox";
import { CircularProgress, Stack } from "@mui/material";

interface ChatProps {
    chatId: string;
}

export default function Chat({ chatId }: ChatProps) {
    const { isLoaded, user } = useUser();
    const [client, setClient] = useState<Ably.Realtime | null>(null);

    useEffect(() => {
        const ablyClient = new Ably.Realtime({ authUrl: "/api/socket/auth" });
        setClient(ablyClient);

        return () => {
            ablyClient.close();
        };
    }, []);

    if (!isLoaded)
        return (
            <Stack flex={3} alignItems="center" justifyContent="center">
                <CircularProgress />
            </Stack>
        );
    if (!user) return <p>You must be logged in to access the chat.</p>;
    if (!client) return <p>Initializing chat...</p>;

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={`chat-${chatId}`}>
                <ChatBox chatId={chatId} />
            </ChannelProvider>
        </AblyProvider>
    );
}
