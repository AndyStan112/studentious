import { prisma } from "@/utils";
import { notFound } from "next/navigation";
import { Button, Container, Typography, Stack } from "@mui/material";
import Link from "next/link";

export default async function JoinedPage({ params }: { params: { id: string } }) {
    const param = await params;
    const { id } = param;
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            chat: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!event) return notFound();

    const icsUrl = `/api/calendar/${event.id}`;
    const location =
        event.url ??
        (event.lat && event.long ? `https://www.google.com/maps?q=${event.lat},${event.long}` : "");

    const gcalUrl =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(event.title)}` +
        `&dates=${formatGoogleDate(event.startTime)}/${formatGoogleDate(
            event.endTime ?? event.startTime
        )}` +
        `&details=${encodeURIComponent(event.description ?? "")}` +
        (location ? `&location=${encodeURIComponent(location)}` : "");

    return (
        <Container sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                You're in!! 🎉
            </Typography>
            <Typography variant="h6" gutterBottom>
                {event.title}
            </Typography>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                sx={{ mt: 4 }}
            >
                <Button
                    variant="contained"
                    href={icsUrl}
                    sx={{
                        width: { xs: "50%", sm: "auto" },
                    }}
                >
                    Add to Calendar (.ics)
                </Button>
                <Button
                    variant="outlined"
                    href={gcalUrl}
                    target="_blank"
                    sx={{
                        width: { xs: "50%", sm: "auto" },
                    }}
                >
                    Google Calendar
                </Button>
                {event.chat && event.chat.length > 0 && (
                    <Button
                        component={Link}
                        href={`/messages/${event.chat[0].id}`}
                        sx={{
                            width: { xs: "50%", sm: "auto" },
                        }}
                    >
                        Event Chat
                    </Button>
                )}
                <Button
                    component={Link}
                    href="/events"
                    sx={{
                        width: { xs: "50%", sm: "auto" },
                    }}
                >
                    Back to Events
                </Button>
            </Stack>
        </Container>
    );
}

function formatGoogleDate(date: Date) {
    return new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}
