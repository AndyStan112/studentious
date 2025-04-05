// app/events/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Container, Typography, Box, Chip, Grid } from "@mui/material";

const prisma = new PrismaClient();

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EventDetailPage({ params }: PageProps) {
    const eventId = parseInt(params.id, 10);

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            organizer: true,
            registrations: true,
        },
    });

    if (!event) {
        notFound();
    }

    return (
        <Container sx={{ mt: 4 }}>
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
                    {event.tags.map((tag: string, index: number) => (
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
        </Container>
    );
}
