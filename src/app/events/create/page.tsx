// app/events/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Dynamically import the event form (client component)
const EventForm = dynamic(() => import("../../../components/EventForm"), { ssr: false });

export default function CreateEventModalPage() {
    const router = useRouter();

    const handleClose = () => {
        router.push("/");
    };

    return (
        <Dialog open fullWidth maxWidth="sm" onClose={handleClose}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Create New Event
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <EventForm />
            </DialogContent>
        </Dialog>
    );
}
