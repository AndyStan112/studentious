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
    preferences: string;
    profileImage: string;
}

export default function ProfilePage() {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        preferences: "",
        profileImage: "",
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setProfileData((prev) => ({
                ...prev,
                profileImage: URL.createObjectURL(selectedFile),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", profileData.name);
            formData.append("preferences", profileData.preferences);
            if (file) {
                formData.append("profileImage", file);
            }
            const res = await fetch("/api/profile", {
                method: "PUT",
                body: formData,
            });
            if (res.ok) {
                router.refresh();
            } else {
                console.error("Error updating profile");
            }
        } catch (error) {
            console.error("Error updating profile", error);
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
                <form onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={profileData.profileImage} sx={{ width: 80, height: 80 }} />
                            <Button variant="contained" component="label">
                                Change Picture
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
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Preferences (comma separated)"
                            name="preferences"
                            value={profileData.preferences}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <Button type="submit" variant="contained" color="primary" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
