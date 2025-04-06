"use client";
import { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    Skeleton,
    Button,
} from "@mui/material";
import { getChats } from "./actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MessagesPage({ children }) {
    const pathname = usePathname();
    const isChatPage = /^\/messages\/.+/.test(pathname);

    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            try {
                const chats = await getChats();
                setChats(chats);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    return (
        <Stack
            flex={1}
            direction="row"
            justifyContent="stretch"
            maxHeight={{ xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" }}
        >
            {!isChatPage && <Box flex={{ xs: 0, sm: 1 }} />}
            <Stack
                flex={1}
                minWidth={300}
                visibility={{ xs: isChatPage ? "collapse" : "visible", md: "visible" }}
                maxWidth={isChatPage ? 0 : 500}
            >
                <Toolbar>
                    <Typography variant="h6">Active Chats</Typography>
                </Toolbar>

                <Box flex={1} sx={{ overflowY: "auto" }}>
                    {loading ? (
                        <List>
                            {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <ListItem key={`skeleton-${index}`} disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Skeleton
                                                    variant="circular"
                                                    width={40}
                                                    height={40}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText>
                                                <Skeleton variant="text" width="80%" height={24} />
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                    ) : chats.length > 0 ? (
                        <List>
                            {chats.map((chat) => (
                                <ListItem key={chat.id} disablePadding>
                                    <ListItemButton component={Link} href={`/messages/${chat.id}`}>
                                        <ListItemAvatar>
                                            <Avatar src={chat.imageUrl || "/"} alt={chat.name} />
                                        </ListItemAvatar>
                                        <ListItemText>{chat.name}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                            textAlign="center"
                            p={3}
                        >
                            <Typography variant="h6" gutterBottom>
                                No Active Chats
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                It looks like you don't have any active chats at the moment. Start a
                                new conversation to see it listed here.
                            </Typography>
                            <Button variant="contained" component={Link} href="/start-chat">
                                Start a New Chat
                            </Button>
                        </Box>
                    )}
                </Box>
            </Stack>
            {!isChatPage && <Box flex={{ xs: 0, sm: 1 }} />}
            {children}
        </Stack>
    );
}
