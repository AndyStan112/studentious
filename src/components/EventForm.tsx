// components/EventForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Stack } from "@mui/material";

interface FormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    tags: string;
}

export default function EventForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        tags: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Convert comma-separated tags to an array of trimmed strings
        const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        const res = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: formData.title,
                description: formData.description,
                startTime: formData.startTime,
                endTime: formData.endTime,
                tags: tagsArray,
            }),
        });

        if (res.ok) {
            router.push("/");
        } else {
            console.error("Failed to create event");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Stack spacing={2}>
                <TextField
                    required
                    fullWidth
                    label="Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Event Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    variant="outlined"
                />
                <TextField
                    required
                    fullWidth
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={formData.startTime}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={formData.endTime}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    required
                    fullWidth
                    label="Tags (comma separated)"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    variant="outlined"
                />
                <Button type="submit" fullWidth variant="contained" color="primary">
                    Create Event
                </Button>
            </Stack>
        </Box>
    );
}
