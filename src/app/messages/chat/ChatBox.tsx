"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAbly, useChannel } from "ably/react";
import axios from "axios";
import {
    Avatar,
    CircularProgress,
    Container,
    Divider,
    Fab,
    IconButton,
    Stack,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Message } from "./types";
import ChatMessage from "./ChatMessage";
import Link from "next/link";
import { getChatDetails } from "../actions";
import theme from "@/theme";

interface User {
    id: string;
    name: string;
    profileImage?: string;
}

interface ChatBoxProps {
    chatId: string;
}

export default function ChatBox({ chatId }: ChatBoxProps) {
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>("");
    const [details, setDetails] = useState<any>("");
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const ably = useAbly();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/user/me");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    useChannel(`chat-${chatId}`, (message) => {
        setMessages((prevMessages) => [...prevMessages, message.data]);
    });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chat/${chatId}/messages`);
                setMessages(response.data);
                console.log("=====================================");
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getChatDetails(chatId);
                console.log(response);
                setDetails(response);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchDetails();
    }, [chatId]);

    const sendChatMessage = async () => {
        if (!user || messageText.trim().length === 0) return;

        const newMessage = {
            message: messageText,
            senderId: user.id,
            chatId,
        };
        try {
            await axios.post(`/api/chat/${chatId}/messages`, newMessage);
            console.log(user);
            const publishMessage = {
                ...newMessage,
                timestamp: Date.now(),
                sender: { name: user.name, profileImage: user.profileImage },
            };
            const channel = ably.channels.get(`chat-${chatId}`);
            channel.publish("message", publishMessage);

            setMessageText("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleFormSubmission = (event: React.FormEvent) => {
        event.preventDefault();
        sendChatMessage();
    };

    if (!user)
        return (
            <Stack flex={3} alignItems="center" justifyContent="center">
                <CircularProgress />
            </Stack>
        );

    return (
        <Stack flex={3} sx={{ backgroundColor: theme.palette.background.default }}>
            <Toolbar sx={{ gap: 1, px: 1 }} disableGutters>
                <Tooltip title="Go back to messages">
                    <IconButton
                        LinkComponent={Link}
                        href="/messages"
                        sx={{ visibility: { xs: "visible", md: "collapse" } }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <Avatar src={details.imageUrl} sx={{ width: 36, height: 36 }} />
                <Typography>{details.name}</Typography>
            </Toolbar>
            <Divider />
            <Container
                maxWidth="md"
                sx={{ flex: 1, overflowY: "scroll", overflowX: "hidden" }}
                disableGutters
            >
                <Stack
                    p={2}
                    gap={1}
                    maxHeight="100%"
                    height="min-content"
                    sx={{ overflowY: "auto" }}
                >
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} userId={user.id} />
                    ))}
                    <div ref={messageEndRef}></div>
                </Stack>
            </Container>
            <Divider />
            <Container maxWidth="md" disableGutters>
                <Toolbar
                    component="form"
                    onSubmit={handleFormSubmission}
                    sx={{ px: 1.5, py: 1, gap: 1 }}
                    disableGutters
                >
                    <TextField
                        value={messageText}
                        placeholder="Type a message..."
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
                                e.preventDefault();
                                sendChatMessage();
                            }
                        }}
                        variant="outlined"
                        fullWidth
                        multiline
                        maxRows={5}
                        sx={{ flex: 1 }}
                    />
                    <Fab type="submit" color="primary" disabled={!messageText.trim()}>
                        <SendIcon />
                    </Fab>
                </Toolbar>
            </Container>
        </Stack>
    );
}
