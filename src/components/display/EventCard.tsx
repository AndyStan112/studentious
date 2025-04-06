import Link from "next/link";
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from "@mui/material";
import { joinEvent } from "@/app/events/actions";

export interface Event {
    registrations: any;
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    url?: string;
    image?: string;
    joined?: boolean;
}

export default function EventCard({ event }: { event: Event }) {
    return (
        <Card sx={{ width: "100%", height: 280, display: "flex", flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" sx={{ flex: 1 }}>
                <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                        {event.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            height: "4.5em",
                        }}
                    >
                        {event.description || "No description provided"}
                    </Typography>
                    <Box sx={{ mt: "auto" }}>
                        <Typography variant="caption" display="block">
                            Start: {new Date(event.startTime).toLocaleString()}
                        </Typography>
                        {event.endTime && (
                            <Typography variant="caption" display="block">
                                End: {new Date(event.endTime).toLocaleString()}
                            </Typography>
                        )}
                        <Chip
                            label={event.url ? "Online" : "Offline"}
                            color={event.url ? "success" : "default"}
                            sx={{ mt: 1 }}
                            size="small"
                        />
                    </Box>
                </CardContent>
                <Box
                    sx={{
                        width: 120,
                        height: 120,
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
            <CardActions sx={{ mt: "auto", pt: 0 }}>
                <Button size="small" component={Link} href={`/events/${event.id}`}>
                    View Details
                </Button>
                <form
                    action={async () => {
                        "use server";
                        await joinEvent(event.id);
                    }}
                >
                    <Button
                        type="submit"
                        size="small"
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
            </CardActions>
        </Card>
    );
}
