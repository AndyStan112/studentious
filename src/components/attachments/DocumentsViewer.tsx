"use client";

import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, Link as MuiLink } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { getAttachmentsByChatId, addCurriculum } from "./actions";
import { Attachment, AttachmentType } from "@prisma/client";

interface Props {
    chatId: string;
    userId: string;
    creatorId: string;
}

export default function DocumentsViewer({ chatId, userId, creatorId }: Props) {
    const [docs, setDocs] = useState<Attachment[]>([]);

    useEffect(() => {
        getAttachmentsByChatId(chatId, "DOCUMENT").then(setDocs);
    }, [chatId]);

    const handleAddToCurriculum = async (doc: Attachment) => {
        await addCurriculum(chatId, doc.url);
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
                            <MuiLink
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                            >
                                {doc.url.split("/").pop()}
                            </MuiLink>
                        </Stack>
                        {userId === creatorId && (
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
