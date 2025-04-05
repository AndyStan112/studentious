"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Stack } from "@mui/material";
import { createEvent } from "@/app/events/create/actions";

export interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    tags: string;
}

export default function EventForm() {
    const router = useRouter();
    const [eventFormData, setEventFormData] = useState<EventFormData>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        tags: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEventFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        await createEvent({
                title: eventFormData.title,
                description: eventFormData.description,
                startTime: eventFormData.startTime,
                endTime: eventFormData.endTime,
                tags: eventFormData.tags,
            })
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Stack spacing={2}>
                <TextField
                    required
                    fullWidth
                    label="Event Title"
                    name="title"
                    value={eventFormData.title}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Event Description"
                    name="description"
                    value={eventFormData.description}
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
                    value={eventFormData.startTime}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={eventFormData.endTime}
                    onChange={handleChange}
                    variant="outlined"
                />
                <TextField
                    required
                    fullWidth
                    label="Tags (comma separated)"
                    name="tags"
                    value={eventFormData.tags}
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
