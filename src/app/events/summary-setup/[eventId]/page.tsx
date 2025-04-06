"use client";
// export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState, useRef } from "react";

import {
    generateSummaryFromUrls,
    updateEventSummary,
    uploadCurriculumFile,
} from "@/app/events/summary-setup/actions";

export default function SummarySetup() {
    const { eventId } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [summaryText, setSummaryText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function uploadAllFiles(eventId: string, files: File[]) {
        const urls: string[] = [];
        for (const file of files) {
            const { url } = await uploadCurriculumFile(eventId, file);
            urls.push(url);
        }
        return urls;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (summaryText.trim()) {
                await updateEventSummary(eventId as string, summaryText);
            }

            let curriculumUrls: string[] = [];
            if (files.length > 0) {
                curriculumUrls = await uploadAllFiles(eventId as string, files);
            }

            console.log("Uploaded URLs:", curriculumUrls);
            await generateSummaryFromUrls(curriculumUrls);
            // router.push("/events/my-events");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Add Event Summary or Upload Supporting Files
            </Typography>

            <Stack spacing={3}>
                <TextField
                    label="Manual Summary"
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    multiline
                    rows={4}
                />

                <input type="file" ref={fileInputRef} hidden multiple onChange={handleFileChange} />
                <Button onClick={() => fileInputRef.current?.click()}>Upload Files</Button>

                {files.length > 0 && (
                    <Box>
                        {files.map((file, i) => (
                            <Typography key={i} variant="body2">
                                {file.name}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : "Continue"}
                </Button>
            </Stack>
        </Container>
    );
}
