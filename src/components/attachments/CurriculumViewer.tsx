"use client";

import { useEffect, useState } from "react";
import { Box, IconButton, Stack, Tooltip, Typography, Link as MuiLink } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
    getAttachmentsByChatId,
    removeCurriculum,
    getCurriculumByChat,
    AttachmentWithUpploader,
} from "./actions";

interface Curriculum {
    id: string;
    url: string;
}

interface Props {
    chatId: string;
    userId: string;
    creatorId: string;
}

export default function CurriculumViewer({ chatId, userId, creatorId }: Props) {
    const [docs, setDocs] = useState<AttachmentWithUpploader[]>([]);
    const [curriculumDocs, setCurriculumDocs] = useState<Curriculum[]>([]);

    const isCreator = userId === creatorId;

    useEffect(() => {
        const fetchData = async () => {
            const [attachments, curriculum] = await Promise.all([
                getAttachmentsByChatId(chatId, "DOCUMENT"),
                getCurriculumByChat(chatId),
            ]);

            setDocs(attachments);
            setCurriculumDocs(curriculum);
        };

        fetchData();
    }, [chatId]);

    const isInCurriculum = (url: string) => {
        return curriculumDocs.some((c) => c.url === url);
    };

    const handleRemove = async (doc: AttachmentWithUpploader) => {
        setCurriculumDocs((prev) => prev.filter((c) => c.url !== doc.url));
        await removeCurriculum(chatId, doc.url);
    };

    return (
        <Box p={2}>
            <Typography variant="h6" mb={2}>
                Curriculum
            </Typography>
            <Stack spacing={2}>
                {docs
                    .filter((doc) => isInCurriculum(doc.url))
                    .map((doc) => (
                        <Stack
                            key={doc.id}
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Stack direction="column">
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

                                <Typography variant="caption" color="text.secondary">
                                    Uploaded by {doc.upploader.name || doc.upploader.email} on{" "}
                                    {new Date(doc.uploadedAt).toLocaleString()}
                                </Typography>
                            </Stack>

                            {isCreator && (
                                <Tooltip title="Remove from curriculum">
                                    <IconButton onClick={() => handleRemove(doc)}>
                                        <RemoveCircleOutlineIcon color="error" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    ))}
            </Stack>
        </Box>
    );
}
