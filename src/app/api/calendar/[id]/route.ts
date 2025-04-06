import { prisma } from "@/utils";
import { NextResponse } from "next/server";
import { createEvent } from "ics";
function generateMapLink(lat?: number | null, long?: number | null): string {
    if (lat != null && long != null) {
        return `https://www.google.com/maps?q=${lat},${long}`;
    }
    return "No location provided";
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
    });

    if (!event) {
        console.error("event not found");
        return new NextResponse("Event not found", { status: 404 });
    }

    const start = new Date(event.startTime);
    const end = new Date(event.endTime ?? event.startTime);

    const eventConfig = {
        start: [
            start.getFullYear(),
            start.getMonth() + 1,
            start.getDate(),
            start.getHours(),
            start.getMinutes(),
        ],
        end: [
            end.getFullYear(),
            end.getMonth() + 1,
            end.getDate(),
            end.getHours(),
            end.getMinutes(),
        ],
        title: event.title,
        description: event.description ?? "",
        location: event.url ?? generateMapLink(event.lat, event.long),

        uid: event.id,
        startOutputType: "local",
    };

    try {
        const { error, value } = createEvent(eventConfig);

        if (error) {
            console.error("ICS Error:", error);
            return new NextResponse("Failed to create .ics file", { status: 500 });
        }

        return new NextResponse(value, {
            headers: {
                "Content-Type": "text/calendar",
                "Content-Disposition": `attachment; filename="${event.title.replace(
                    /\s+/g,
                    "_"
                )}.ics"`,
            },
        });
    } catch (err) {
        console.error(err);
        return new NextResponse("Server error", { status: 500 });
    }
}
