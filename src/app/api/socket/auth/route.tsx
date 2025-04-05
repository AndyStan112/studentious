import Ably from "ably";

export async function GET() {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY!);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'ably-nextjs-demo' });

    return new Response(JSON.stringify(tokenRequestData), {
        headers: { "Content-Type": "application/json" },
    });
}
