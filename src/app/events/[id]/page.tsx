"use client";

import { notFound } from "next/navigation";
import { Container, Typography, Box, Chip, Grid, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { getEventById } from "./actions";
import React from "react";
import { Event, Registration, User } from "@prisma/client";

const EventMap = dynamic(() => import("@/components/EventMap"), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});

interface PageProps {
    params: {
        id: string;
    };
}
export interface EventWithOrganizer extends Event {
    organizer: User;
    registrations: Registration[];
}

export default function EventDetailPage({ params }: PageProps) {
    const [event, setEvent] = React.useState<EventWithOrganizer | null>(null);
    const theme = useTheme();
    const param = React.use(params);

    React.useEffect(() => {
        getEventById(param.id).then((event1) => setEvent(event1));
    }, []);

    if (!event) return null;

    return (
        <Container sx={{ mt: 4 }}>
            <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                justifyContent="center"
                gap={{ xs: 2, md: 8 }}
                maxWidth="md"
                mx="auto"
            >
                <Box flex={1} order={{ xs: 1, md: 0 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {event.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {event.description}
                    </Typography>

                    <Box sx={{ my: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" component="div">
                                    <Box component="span" fontWeight="bold" color="text.secondary">
                                        Starts
                                    </Box>
                                    <br />
                                    {new Date(event.startTime).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                    <Box component="span" sx={{ mx: 1 }}>
                                        •
                                    </Box>
                                    {new Date(event.startTime).toLocaleTimeString(undefined, {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </Typography>
                            </Grid>

                            {event.endTime && (
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1" component="div">
                                        <Box
                                            component="span"
                                            fontWeight="bold"
                                            color="text.secondary"
                                        >
                                            Ends
                                        </Box>
                                        <br />
                                        {new Date(event.endTime).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                        <Box component="span" sx={{ mx: 1 }}>
                                            •
                                        </Box>
                                        {new Date(event.endTime).toLocaleTimeString(undefined, {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Tags:
                        </Typography>
                        <Grid container spacing={1}>
                            {event.tags?.map((tag: string, index: number) => (
                                <Grid item key={index}>
                                    <Chip label={tag} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1">
                            Organized by: {event.organizer.name || event.organizer.email}
                        </Typography>
                    </Box>

                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1">
                            Registrations: {event.registrations.length}
                        </Typography>
                    </Box>
                </Box>

                {/* Image - Will appear after text on mobile */}
                <Box
                    sx={{
                        width: { xs: "100%", md: 360 },
                        height: { xs: 300, md: 360 },
                        borderRadius: 2,
                        overflow: "hidden",
                        flexShrink: 0,
                        order: { xs: 0, md: 1 },
                    }}
                >
                    <img
                        src={event.image || "/default_event.png"}
                        alt={event.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Box>
            </Box>

            {/* Location/URL Section */}
            {event.url ? (
                <Box sx={{ my: 2, width: "100%", maxWidth: "md", mx: "auto" }}>
                    <Typography variant="subtitle1">
                        Online Event URL:{" "}
                        <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ wordBreak: "break-all" }}
                        >
                            {event.url}
                        </a>
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ my: 2, width: "100%", maxWidth: "md", mx: "auto" }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Event Location:
                    </Typography>
                    <Box sx={{ height: 400, width: "100%" }}>
                        <EventMap lat={event.lat} long={event.long} />
                    </Box>
                </Box>
            )}
        </Container>
    );
}
