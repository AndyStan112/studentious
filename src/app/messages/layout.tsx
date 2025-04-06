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
} from "@mui/material";
import { getChats } from "./actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MessagesPage({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChatPage = /^\/messages\/.+/.test(pathname);

    const [chats, setChats] = useState<any[]>([]);
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
                    <List>
                        {loading
                            ? // Skeleton loaders for chats while loading
                              Array(5)
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
                                                  <Skeleton
                                                      variant="text"
                                                      width="80%"
                                                      height={24}
                                                  />
                                              </ListItemText>
                                          </ListItemButton>
                                      </ListItem>
                                  ))
                            : chats.map((chat) => (
                                  <ListItem key={chat.id} disablePadding>
                                      <ListItemButton
                                          component={Link}
                                          href={`/messages/${chat.id}`}
                                      >
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
