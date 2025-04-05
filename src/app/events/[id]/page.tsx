import { prisma } from "@/utils";
import { notFound } from "next/navigation";
import { Container, Typography, Box, Chip, Grid } from "@mui/material";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EventDetailPage({ params }: PageProps) {
    const eventId = params.id;

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
    );
    
}
