import React from "react";
import { Typography, Paper, Stack, Avatar, Link } from "@mui/material";
import { Message } from "./types";
import MuiMarkdown from "mui-markdown";

interface ChatMessageProps {
    message: Message;
    userId: string;
    groupChat?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, userId }) => {
    const isMyself = message.senderId === userId;

    return (
        <Stack direction="column" gap={0.5} alignItems={isMyself ? "end" : "start"}>
            {!isMyself && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <Avatar
                        src={message?.sender?.profileImage || ""}
                        sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2" fontSize={12} color="textSecondary">
                        {message?.sender?.name || ""}
                    </Typography>
                </Stack>
            )}
            <Paper
                elevation={3}
                component={Stack}
                px={1}
                py={0.5}
                maxWidth="90%"
                width="fit-content"
                overflow="hidden"
                sx={{
                    backgroundColor: isMyself ? "#D0E8FF" : undefined,
                    color: isMyself ? "black" : undefined,
                    "& img": {
                        maxHeight: 200,
                    },
                }}
            >
                <Typography component="div" variant="body1">
                    <MuiMarkdown
                        overrides={{
                            a: {
                                component: Link,
                                props: {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    underline: "hover",
                                },
                            },
                        }}
                    >
                        {message.message}
                    </MuiMarkdown>
                </Typography>
                <Typography variant="caption" color="textSecondary" textAlign="right">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Typography>
            </Paper>
        </Stack>
    );
};

export default ChatMessage;
