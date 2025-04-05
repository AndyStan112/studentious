// app/events/page.tsx
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Container, Typography, Button, Grid, Card, CardContent, CardActions } from "@mui/material";

// Instantiate a single PrismaClient instance (consider using a singleton pattern in production)
const prisma = new PrismaClient();

export default async function EventsPage() {
    // Fetch events from the database, ordered by newest first
    const events = await prisma.event.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Events
            </Typography>
            <Button variant="contained" component={Link} href="/events/create" sx={{ mb: 2 }}>
                Create New Event
            </Button>

            {events.length === 0 ? (
                <Typography variant="body1">
                    No events found. Please create an event to get started.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {events.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.description || "No description provided"}
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                        Start: {new Date(event.startTime).toLocaleString()}
                                    </Typography>
                                    {event.endTime && (
                                        <Typography variant="caption" display="block">
                                            End: {new Date(event.endTime).toLocaleString()}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        component={Link}
                                        href={`/events/${event.id}`}
                                    >
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
