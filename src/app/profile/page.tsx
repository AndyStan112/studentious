"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, TextField, Button, Stack, Typography, CircularProgress } from "@mui/material";

interface ProfileData {
    name: string;
    preferences: string;
}

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        preferences: "",
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const fetchProfile = async () => {
                setLoading(true);
                try {
                    const res = await fetch("/api/profile", { method: "GET" });
                    if (res.ok) {
                        const data = await res.json();
                        setProfileData({
                            name: data.name || "",

                            preferences: data.preferences ? data.preferences.join(", ") : "",
                        });
                    } else {
                        console.error("Error fetching profile data");
                    }
                } catch (error) {
                    console.error("Error fetching profile data", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();
        }
    }, [isLoaded, isSignedIn, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const preferencesArray = profileData.preferences
            .split(",")
            .map((pref) => pref.trim())
            .filter((pref) => pref.length > 0);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: profileData.name, preferences: preferencesArray }),
            });
            if (res.ok) {
                router.refresh();
            } else {
                console.error("Error saving profile");
            }
        } catch (error) {
            console.error("Error saving profile", error);
        } finally {
            setSaving(false);
        }
    };

    if (!isLoaded || loading) {
        return (
            <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!isSignedIn) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6">You must be signed in to view this page.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Profile Settings
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Preferences (comma separated)"
                        name="preferences"
                        value={profileData.preferences}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Stack>
            </form>
        </Container>
    );
}
