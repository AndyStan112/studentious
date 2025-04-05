"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/events/create/actions";
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    Container,
    Paper,
} from "@mui/material";
import dynamic from "next/dynamic";

export interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    tags: string;
    image: File | null;
    eventType: "online" | "offline";
    url?: string;
    lat?: number;
    long?: number;
}

const Map = dynamic(() => import("@/components/input/LeafletMap"), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                height: "250px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ccc",
                borderRadius: 4,
            }}
        >
            <Typography variant="body2">Loading map...</Typography>
        </Box>
    ),
});

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
        eventType: "offline",
        url: "",
        lat: 0,
        long: 0,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [position, setPosition] = useState<[number, number] | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEventFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEventTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEventFormData((prev) => ({
            ...prev,
            eventType: event.target.value as "online" | "offline",
            url: event.target.value === "online" ? prev.url : "",
            lat: undefined,
            lng: undefined,
        }));
        if (event.target.value === "online") {
            setPosition(null);
        }
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

        const updatedEventData = { ...eventFormData };
        if (position) {
            updatedEventData.lat = position[0];
            updatedEventData.long = position[1];
        }

        await createEvent(updatedEventData);
        router.push("/events");
    };

    const triggerImageUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleMapClick = (coordinates: [number, number]) => {
        setPosition(coordinates);
        setEventFormData((prev) => ({
            ...prev,
            lat: coordinates[0],
            lng: coordinates[1],
        }));
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate>
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
                            rows={3}
                            variant="outlined"
                        />

                        <Box sx={{ display: "flex", gap: 2 }}>
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
                        </Box>

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Event Type</FormLabel>
                            <RadioGroup
                                row
                                name="eventType"
                                value={eventFormData.eventType}
                                onChange={handleEventTypeChange}
                            >
                                <FormControlLabel
                                    value="online"
                                    control={<Radio />}
                                    label="Online Event"
                                />
                                <FormControlLabel
                                    value="offline"
                                    control={<Radio />}
                                    label="Offline Event"
                                />
                            </RadioGroup>
                        </FormControl>

                        {eventFormData.eventType === "online" && (
                            <TextField
                                required
                                fullWidth
                                label="Event URL"
                                name="url"
                                value={eventFormData.url || ""}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="https://..."
                            />
                        )}

                        {eventFormData.eventType === "offline" && (
                            <Box sx={{ width: "100%", marginBottom: "32px" }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Click on the map to set event location
                                </Typography>
                                <Map position={position} onMapClick={handleMapClick} />
                                {position && (
                                    <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                                        Location: {position[0].toFixed(4)}, {position[1].toFixed(4)}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <TextField
                            required
                            fullWidth
                            label="Tags (comma separated)"
                            name="tags"
                            value={eventFormData.tags}
                            onChange={handleChange}
                            variant="outlined"
                        />

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <Button variant="outlined" onClick={triggerImageUpload} fullWidth>
                            {eventFormData.image ? "Change Event Image" : "Upload Event Image"}
                        </Button>

                        {imagePreview && (
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Image Preview:
                                </Typography>
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    alt="Event image preview"
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        objectFit: "contain",
                                        borderRadius: 1,
                                    }}
                                />
                            </Box>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                        >
                            Create Event
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}
