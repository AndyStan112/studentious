import Link from "next/link";
import { Container, Typography, Button, Grid, Box } from "@mui/material";
import { prisma } from "@/utils";
import EventCard, { Event } from "./EventCard";

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function groupEvents(events: Event[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    const groups: { [key: string]: Event[] } = {
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
    const events: Event[] = await prisma.event.findMany({
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
                    {Object.entries(groupedEvents).map(([groupName, eventsInGroup]) =>
                        eventsInGroup.length > 0 ? (
                            <div key={groupName}>
                                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                    {groupName}
                                </Typography>
                                <Grid container spacing={2}>
                                    {eventsInGroup.map((event) => (
                                        <Grid item key={event.id} sx={{ width: 500 }}>
                                            <EventCard event={event} />
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
