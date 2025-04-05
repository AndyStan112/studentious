// app/events/page.tsx
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Container, Typography, Button, Grid, Card, CardContent, CardActions } from "@mui/material";

const prisma = new PrismaClient();

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function groupEvents(events: any[]) {
    const now = new Date();
    // Today's date with time zeroed out
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // End of week: assuming week ends on Saturday (day index 6)
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const groups: { [key: string]: any[] } = {
        Today: [],
        Tomorrow: [],
        "This Week": [],
        "This Month": [],
        Later: [],
    };

    events.forEach((event) => {
        const eventDate = new Date(event.startTime);
        if (isSameDay(eventDate, today)) {
            groups["Today"].push(event);
        } else if (isSameDay(eventDate, tomorrow)) {
            groups["Tomorrow"].push(event);
        } else if (eventDate <= endOfWeek) {
            groups["This Week"].push(event);
        } else if (
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
        ) {
            groups["This Month"].push(event);
        } else {
            groups["Later"].push(event);
        }
    });
    return groups;
}

export default async function EventsPage() {
    // Fetch events ordered by startTime ascending.
    const events = await prisma.event.findMany({
        orderBy: { startTime: "asc" },
    });

    const groupedEvents = groupEvents(events);

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
                <>
                    {Object.entries(groupedEvents).map(([groupName, groupEvents]) =>
                        groupEvents.length > 0 ? (
                            <div key={groupName}>
                                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                    {groupName}
                                </Typography>
                                <Grid container spacing={2}>
                                    {groupEvents.map((event) => (
                                        <Grid
                                            item
                                            key={event.id}
                                            sx={{
                                                width: 300, // fixed width for each card
                                            }}
                                        >
                                            <Card sx={{ width: "100%" }}>
                                                <CardContent>
                                                    <Typography variant="h6">
                                                        {event.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {event.description ||
                                                            "No description provided"}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        display="block"
                                                        sx={{ mt: 1 }}
                                                    >
                                                        Start:{" "}
                                                        {new Date(event.startTime).toLocaleString()}
                                                    </Typography>
                                                    {event.endTime && (
                                                        <Typography
                                                            variant="caption"
                                                            display="block"
                                                        >
                                                            End:{" "}
                                                            {new Date(
                                                                event.endTime
                                                            ).toLocaleString()}
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
                            </div>
                        ) : null
                    )}
                </>
            )}
        </Container>
    );
}
