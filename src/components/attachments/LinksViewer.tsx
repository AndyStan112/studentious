"use client";

import { useEffect, useState } from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { getAttachmentsByChatId } from "./actions";
import { Attachment, AttachmentType } from "@prisma/client";

export default function LinksViewer({ chatId }: { chatId: string }) {
    const [links, setLinks] = useState<Attachment[]>([]);

    useEffect(() => {
        getAttachmentsByChatId(chatId, "LINK").then((l) => setLinks(l));
    }, [chatId]);

    return (
        <Box p={2}>
            <Typography variant="h6" mb={2}>
                Links
            </Typography>
            <Stack spacing={2}>
                {links.map((link) => (
                    <Stack key={link.id} direction="row" spacing={1} alignItems="center">
                        <LinkIcon />
                        <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.url}
                        </Link>
                    </Stack>
                ))}
            </Stack>
        </Box>
    );
}
