"use client";

import { notFound } from "next/navigation";
import { Container, Typography, Box, Chip, Grid, useTheme, Button, Link } from "@mui/material";
import dynamic from "next/dynamic";
import { getEventById } from "./actions";
import React from "react";
import { Event, Registration, User } from "@prisma/client";
import MuiMarkdown from "mui-markdown";
import { joinEvent } from "../actions";

const EventMap = dynamic(() => import("@/components/display/EventMap"), {
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
    joined: boolean;
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
            <Box maxWidth="md" mx="auto" mb={3} display="flex" justifyContent="space-between">
                <Button component={Link} href="/">
                    Back
                </Button>
                <form
                    action={async () => {
                        await joinEvent(event.id);
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={event.joined}
                        sx={{
                            backgroundColor: event.joined ? "grey.500" : "primary.main",
                            color: "white",
                            "&:hover": {
                                backgroundColor: event.joined ? "grey.700" : "primary.dark",
                            },
                        }}
                    >
                        {event.joined ? "Joined" : "Join"}
                    </Button>
                </form>
            </Box>

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

            {event.summary && (
                <Box sx={{ my: 4, maxWidth: "md", mx: "auto" }}>
                    <Typography variant="h6" gutterBottom>
                        Summary
                    </Typography>
                    <MuiMarkdown>{event.summary}</MuiMarkdown>
                </Box>
            )}

            {event.podcast && (
                <Box sx={{ my: 4, maxWidth: "md", mx: "auto" }}>
                    <Typography variant="h6" gutterBottom>
                        Podcast
                    </Typography>
                    <audio controls style={{ width: "100%" }}>
                        <source src={event.podcast} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </Box>
            )}
        </Container>
    );
}
