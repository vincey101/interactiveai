const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
    try {
        if (!HEYGEN_API_KEY) {
            throw new Error("API key is missing from .env");
        }

        const response = await fetch('https://api.heygen.com/v2/avatars', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': HEYGEN_API_KEY,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || response.statusText);
        }

        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error("Error fetching avatars:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch avatars" }), 
            { 
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}