"use client";

import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { getAttachmentsByChatId } from "./actions";
import { Attachment, AttachmentType } from "@prisma/client";

interface Props {
    chatId: string;
    userId: string;
    creatorId: string;
    isEvent: boolean;
}

export default function DocumentsViewer({ chatId, userId, creatorId, isEvent }: Props) {
    const [docs, setDocs] = useState<Attachment[]>([]);

    useEffect(() => {
        getAttachmentsByChatId(chatId, "DOCUMENT").then((d) => setDocs(d));
        console.log(userId);
        console.log(creatorId);
        console.log(isEvent);
    }, [chatId]);

    const handleAddToCurriculum = async (doc: Attachment) => {
        await fetch("/api/curriculum/add", {
            method: "POST",
            body: JSON.stringify({ chatId, documentUrl: doc.url }),
        });
    };

    return (
        <Box p={2}>
            <Typography variant="h6" mb={2}>
                Documents
            </Typography>
            <Stack spacing={2}>
                {docs.map((doc) => (
                    <Stack
                        key={doc.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <InsertDriveFileIcon />
                            <Typography>{doc.url.split("/").pop()}</Typography>
                        </Stack>
                        {userId === creatorId && isEvent && (
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleAddToCurriculum(doc)}
                            >
                                Add to Curriculum
                            </Button>
                        )}
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
