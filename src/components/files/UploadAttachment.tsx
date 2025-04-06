"use client";

import React, { useRef, useState } from "react";
import { IconButton, Stack, Tooltip } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function UploadAttachment({ chatId }: { chatId: string }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const res = await fetch(`/api/chat/${chatId}/attachments`, {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            console.log("Uploaded:", result);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <Stack direction="row" spacing={1}>
            <input
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.txt"
                hidden
                ref={fileInputRef}
                onChange={handleUpload}
            />
            <Tooltip title="Upload image/document">
                <IconButton disabled={loading} onClick={() => fileInputRef.current?.click()}>
                    <InsertDriveFileIcon />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
