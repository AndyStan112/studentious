"use client";

import { useEffect, useState } from "react";
import { Box, IconButton, Stack, Tooltip, Typography, Link as MuiLink } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
    getAttachmentsByChatId,
    addCurriculum,
    removeCurriculumByEvent,
    removeCurriculum,
    getCurriculumByChat,
} from "./actions";
import { Attachment } from "@prisma/client";

interface Curriculum {
    id: string;
    url: string;
}

interface Props {
    chatId: string;
    userId: string;
    creatorId: string;
}

export default function DocumentsViewer({ chatId, userId, creatorId }: Props) {
    const [docs, setDocs] = useState<Attachment[]>([]);
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

    const handleAdd = async (doc: Attachment) => {
        const addedCurriculum = await addCurriculum(chatId, doc.url);
        setCurriculumDocs((prev) => [
            ...prev,
            { id: addedCurriculum.id, url: addedCurriculum.url },
        ]);
    };

    const handleRemove = async (doc: Attachment) => {
        setCurriculumDocs((prev) => prev.filter((c) => c.url !== doc.url));
        await removeCurriculum(chatId, doc.url);
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

                        {isCreator && (
                            <>
                                {isInCurriculum(doc.url) ? (
                                    <Tooltip title="Remove from curriculum">
                                        <IconButton onClick={() => handleRemove(doc)}>
                                            <RemoveCircleOutlineIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Add to curriculum">
                                        <IconButton onClick={() => handleAdd(doc)}>
                                            <AddCircleOutlineIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
