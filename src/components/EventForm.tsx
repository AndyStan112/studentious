// components/EventForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";

interface FormData {
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
    const [formData, setFormData] = useState<FormData>({
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFormData((prev) => ({ ...prev, image: file }));

            // Create a preview URL for the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Convert comma-separated tags to an array of trimmed strings
        const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        // Create FormData object for multipart/form-data submission (needed for file upload)
        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("description", formData.description);
        submitData.append("startTime", formData.startTime);
        submitData.append("endTime", formData.endTime);
        submitData.append("tags", JSON.stringify(tagsArray));

        // Append image if one was selected
        if (formData.image) {
            submitData.append("image", formData.image);
        }

        const res = await fetch("/api/events", {
            method: "POST",
            // No Content-Type header needed as FormData sets it automatically with boundary
            body: submitData,
        });

        if (res.ok) {
            router.push("/");
        } else {
            console.error("Failed to create event");
        }
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
                    {formData.image ? "Change Event Image" : "Upload Event Image"}
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
