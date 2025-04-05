"use client";

import { notFound } from "next/navigation";
import { Container, Typography, Box, Chip, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { getEventById } from "./actions";
import React from "react";

const EventMap = dynamic(() => import("@/components/EventMap"), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});

interface PageProps {
    params: {
        id: string;
    };
}

export default function EventDetailPage({ params }: PageProps) {
    const [event, setEvent] = React.useState(null);

    const param = React.use(params);

    React.useEffect(() => {
        getEventById(param.id).then((event1) => {
            console.log(event);
            setEvent(event1);
        });
    });

    return event ? (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="center">
                <Box display="flex" gap="100px" maxWidth="md">
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {event.title}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {event.description}
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle1">
                                Start: {new Date(event.startTime).toLocaleString()}
                            </Typography>
                            {event.endTime && (
                                <Typography variant="subtitle1">
                                    End: {new Date(event.endTime).toLocaleString()}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Tags:
                            </Typography>
                            <Grid container spacing={1}>
                                {event.tags &&
                                    event.tags.map((tag: string, index: number) => (
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

                        {event.url ? (
                            <Box sx={{ my: 2 }}>
                                <Typography variant="subtitle1">
                                    Online Event URL:{" "}
                                    <a
                                        href={event.url!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ wordBreak: "break-all" }}
                                    >
                                        {event.url}
                                    </a>
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ my: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Event Location:
                                </Typography>
                                <Box sx={{ height: 400, width: "100%" }}>
                                    <EventMap lat={event.lat!} long={event.long!} />
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: 360,
                            height: 360,
                            m: 2,
                            borderRadius: 2,
                            overflow: "hidden",
                            flexShrink: 0,
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
            </Box>
        </Container>
    ) : (
        <></>
    );
}
