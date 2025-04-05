// app/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Avatar,
} from "@mui/material";

interface ProfileData {
    name: string;
    preferences: string; // Comma-separated string in the UI
    profileImage: string; // URL for the profile picture
}

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        preferences: "",
        profileImage: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    // Fetch the user's current profile data
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            const fetchProfile = async () => {
                setLoading(true);
                try {
                    const res = await fetch("/api/profile", { method: "GET" });
                    if (res.ok) {
                        const data = await res.json();
                        setProfileData({
                            name: data.name || "",
                            preferences: data.preferences ? data.preferences.join(", ") : "",
                            profileImage: data.profileImage || "",
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
    }, [isLoaded, isSignedIn]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input change and upload the image
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            // Upload the file to /api/upload
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                // Update the profile image URL in state
                setProfileData((prev) => ({ ...prev, profileImage: data.url }));
            } else {
                console.error("File upload failed");
            }
        } catch (error) {
            console.error("Error uploading file", error);
        } finally {
            setUploading(false);
        }
    };

    // Submit updated profile data
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Convert preferences from comma-separated string to an array
            const preferencesArray = profileData.preferences
                .split(",")
                .map((pref) => pref.trim())
                .filter((pref) => pref.length > 0);
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profileData.name,
                    preferences: preferencesArray,
                    profileImage: profileData.profileImage,
                }),
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
        <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
                <Typography variant="h5" gutterBottom>
                    Profile Settings
                </Typography>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={profileData.profileImage} sx={{ width: 80, height: 80 }} />
                        <Button variant="contained" component="label" disabled={uploading}>
                            {uploading ? "Uploading..." : "Change Picture"}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Stack>
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
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
