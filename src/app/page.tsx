"use client";

import React from "react";
import { Typography, Container, Button, Grid, Box, Card, CardContent, Stack } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
const features = [
    {
        icon: <GroupsIcon fontSize="large" color="primary" />,
        title: "Find Study Groups",
        description: "Easily connect with classmates studying the same material.",
    },
    {
        icon: <AccessTimeIcon fontSize="large" color="primary" />,
        title: "Calendar integration",
        description: "Easily keep track of study sessions with our calendar integration",
    },
    {
        icon: <ChatIcon fontSize="large" color="primary" />,
        title: "Real-Time Chat",
        description: "Stay connected with your study group directly in the app and share materials",
    },
    {
        icon: <ChatIcon fontSize="large" color="primary" />,
        title: "AI Summary",
        description:
            "Bring your study material and we will summarize it using the latest ai technology and offer you a shorter text or even an a podcast to listen to this on the go!",
    },
];
export default function LandingPage() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fdfaf6" }}>
            <Container sx={{ py: 10 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                            Study smarter with your peers.
                        </Typography>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            Studentious helps you find study partners, create sessions, and
                            collaborate in real time.
                        </Typography>
                        <Button variant="contained" size="large" href="/profile">
                            Get Started for Free
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img src="/landing.png" alt="Study Group" style={{ width: "100%" }} />
                    </Grid>
                </Grid>
            </Container>

            <Container sx={{ py: 8 }}>
                <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
                    What makes Studentious awesome?
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gap: 3,
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr",
                        },
                        width: "100%",
                    }}
                >
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            elevation={2}
                            sx={{
                                height: 300,
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <CardContent>
                                {feature.icon}
                                <Typography variant="h6" fontWeight="bold" mt={2}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Container>

            <Box sx={{ bgcolor: "primary.main", py: 8, mt: 6 }}>
                <Container>
                    <Typography variant="h4" color="white" textAlign="center" gutterBottom>
                        Ready to level up your study sessions?
                    </Typography>
                    <Stack direction="row" justifyContent="center" mt={2}>
                        <Button variant="contained" color="secondary" size="large" href="/profile">
                            Join Studentious Now
                        </Button>
                    </Stack>
                </Container>
            </Box>

            <Box sx={{ bgcolor: "#e3f2fd", py: 3, mt: "auto", textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Studentious · Built with students in mind
                </Typography>
            </Box>
        </Box>
    );
}
