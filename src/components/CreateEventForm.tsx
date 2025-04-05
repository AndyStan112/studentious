"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/events/create/actions";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";

export interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    tags: string;
    image: File | null;
}

export default function EventForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [eventFormData, setEventFormData] = useState<EventFormData>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        tags: "",
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEventFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setEventFormData((prev) => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        await createEvent({
                title: eventFormData.title,
                description: eventFormData.description,
                startTime: eventFormData.startTime,
                endTime: eventFormData.endTime,
                tags: eventFormData.tags,
                image: eventFormData.image
            })
        router.push("/events")
    };

    const triggerImageUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                />

                {/* Image upload button */}
                <Button variant="outlined" onClick={triggerImageUpload} fullWidth>
                    {eventFormData.image ? "Change Event Image" : "Upload Event Image"}
                </Button>

                {/* Image preview */}
                {imagePreview && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Image Preview:
                        </Typography>
                        <Box
                            component="img"
                            src={imagePreview}
                            alt="Event image preview"
                            sx={{
                                maxWidth: "100%",
                                maxHeight: "300px",
                                objectFit: "contain",
                                borderRadius: 1,
                            }}
                        />
                    </Box>
                )}

                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                    Create Event
                </Button>
            </Stack>
        </Box>
    );
}
