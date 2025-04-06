"use client";

import { useEffect, useState } from "react";
import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { getAttachmentsByChatId } from "./actions";
import { Attachment, AttachmentType } from "@prisma/client";

export default function ImagesViewer({ chatId }: { chatId: string }) {
    const [images, setImages] = useState<Attachment[]>([]);

    useEffect(() => {
        getAttachmentsByChatId(chatId, "IMAGE").then((imgs) => setImages(imgs));
    }, [chatId]);

    return (
        <Box p={2}>
            <Typography variant="h6" mb={2}>
                Images
            </Typography>
            <ImageList cols={3} gap={8}>
                {images.map((img) => (
                    <ImageListItem key={img.id}>
                        <img src={img.url} alt="attachment" loading="lazy" />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}
