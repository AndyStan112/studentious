"use client";
import Chat from "@/app/messages/chat/Chat";
import { useParams } from "next/navigation";
import React from "react";

const ChatPage: React.FC = () => {
    const params = useParams();
    const chatId = params?.chatId as string;

    return <Chat chatId={chatId} />;
};

export default ChatPage;
