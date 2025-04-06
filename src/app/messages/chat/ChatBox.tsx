"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAbly, useChannel } from "ably/react";
import axios from "axios";
import {
    Avatar,
    Box,
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [queuedFiles, setQueuedFiles] = useState<File[]>([]);

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
        let attachments: any[] = [];
        setMessageText("");
        try {
            if (queuedFiles.length > 0) {
                await Promise.all(
                    queuedFiles.slice(0, 6).map(async (file) => {
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch(`/api/chat/${chatId}/attachments`, {
                            method: "POST",
                            body: formData,
                        });
                        if (!res.ok) {
                            //TODO alex fa o notificare frumoasa si baga tipuri
                            console.log("error uploading file");
                            return;
                        }
                        const data = await res.json();
                        attachments.push({
                            name: file.name,
                            type: data.type,
                            url: data.url,
                        });
                        console.log(attachments);
                    })
                );
                setQueuedFiles([]);
            }
            let newMessage = {
                message: messageText,
                senderId: user.id,
                chatId,
                attachments,
            };
            const res = await fetch(`/api/chat/${chatId}/messages`, {
                method: "POST",
                body: JSON.stringify({ message: newMessage }),
            });
            if (!res.ok) {
                return;
            }
            const data = await res.json();
            const publishMessage = {
                ...newMessage,
                message: data["message"] as string,
                timestamp: Date.now(),
                sender: { name: user.name, profileImage: user.profileImage },
            };
            const channel = ably.channels.get(`chat-${chatId}`);
            channel.publish("message", publishMessage);
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
        <Stack
            flex={3}
            sx={{
                //  borderLeft: 1,
                backgroundColor: theme.palette.background.default,
            }}
        >
            <Toolbar sx={{ gap: 1, ml: 3 }} disableGutters>
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

            <Container
                sx={{
                    flex: 1,
                    overflowY: "scroll",
                    overflowX: "hidden",
                    backgroundColor: "#fdfaf6",
                    // borderRadius: 2,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                    border: "1px solid #e0e0e0",
                }}
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
            <Container disableGutters>
                <Box position="relative">
                    {queuedFiles.length > 0 && (
                        <Stack
                            direction="row"
                            spacing={2}
                            position="absolute"
                            bottom="100%"
                            width="100%"
                            zIndex={10}
                            p={2}
                            sx={{
                                backdropFilter: "blur(12px)",
                                backgroundColor: "rgba(255, 255, 255, 0.75)",
                                background: "transparent",
                                borderRadius: 2,
                                boxShadow: 3,
                                overflowX: "auto",
                            }}
                        >
                            {queuedFiles.map((file, index) => (
                                <Box
                                    key={index}
                                    position="relative"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        border: "1px solid #ccc",
                                        borderRadius: 2,
                                        padding: 1,
                                        maxWidth: 160,
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setQueuedFiles((files) =>
                                                files.filter((_, i) => i !== index)
                                            )
                                        }
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            zIndex: 1,
                                            color: "#333",
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>

                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            style={{
                                                maxHeight: 100,
                                                maxWidth: 120,
                                                borderRadius: 8,
                                            }}
                                        />
                                    ) : (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            mt={2}
                                        >
                                            <InsertDriveFileIcon />
                                            <Typography variant="body2" noWrap maxWidth={100}>
                                                {file.name}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    )}

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

                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt"
                            hidden
                            multiple
                            ref={fileInputRef}
                            onChange={(e) => {
                                if (e.target.files) {
                                    setQueuedFiles([...queuedFiles, ...Array.from(e.target.files)]);
                                }
                            }}
                        />

                        <Fab
                            size="small"
                            color="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ width: 40, height: 40 }}
                        >
                            <AttachFileIcon fontSize="small" />
                        </Fab>

                        <Fab
                            type="submit"
                            color="primary"
                            disabled={!messageText.trim()}
                            sx={{ width: 40, height: 40 }}
                        >
                            <SendIcon fontSize="small" />
                        </Fab>
                    </Toolbar>
                </Box>
            </Container>
        </Stack>
    );
}
