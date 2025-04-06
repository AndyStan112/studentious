import Link from "next/link";
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from "@mui/material";
import { joinEvent } from "@/app/events/actions";

export interface Event {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime?: string;
    url?: string;
    image?: string;
}

export default function EventCard({ event }: { event: Event }) {
    return (
        <Card sx={{ width: "100%" }}>
            <Box display="flex" justifyContent="space-between">
                <CardContent>
                    <Typography variant="h6">{event.title}</Typography>
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
                    <Chip
                        label={event.url ? "Online" : "Offline"}
                        color={event.url ? "success" : "default"}
                        sx={{ mt: 1 }}
                    />
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
            <CardActions>
                <form
                    action={async () => {
                        "use server";
                        await joinEvent(event.id);
                    }}
                >
                    <Button
                        type="submit"
                        size="small"
                        sx={{
                            backgroundColor: "primary.light",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "primary.main",
                            },
                        }}
                    >
                        Join
                    </Button>
                </form>
                <Button size="small" component={Link} href={`/events/${event.id}`}>
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
}
