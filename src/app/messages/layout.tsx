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
} from "@mui/material";
import { getChats } from "./actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MessagesPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = /^\/messages\/.+/.test(pathname);

    const [chats, setChats] = useState<any[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            const chats = await getChats();
            console.log(chats);
            setChats(chats);
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
                <Divider />
                <Box flex={1} sx={{ overflowY: "auto" }}>
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
                </Box>
            </Stack>
            {!isChatPage && <Box flex={{ xs: 0, sm: 1 }} />}
            {children}
        </Stack>
    );
}
