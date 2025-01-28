const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Map of avatar IDs to their local image paths
const avatarImages: { [key: string]: { image: string, video: string } } = {
    'Santa_Fireplace_Front_public': {
        image: '/images/avatars/preview_target1.webp',
        video: '/images/avatars/eric.mp4'
    },
    'Ann_Doctor_Standing2_public': {
        image: '/images/avatars/preview_target2.webp',
        video: '/images/avatars/tyler.mp4'
    },
    'Ann_Doctor_Sitting_public': {
        image: '/images/avatars/preview_target3.webp',
        video: '/images/avatars/anna.mp4'
    },
    'Ann_Therapist_public': {
        image: '/images/avatars/preview_target4.webp',
        video: '/images/avatars/susan.mp4'
    },
    'Shawn_Therapist_public': {
        image: '/images/avatars/preview_target5.webp',
        video: '/images/avatars/josh.mp4'
    },
    'Bryan_FitnessCoach_public': {
        image: '/images/avatars/preview_target6.webp',
        video: '/images/avatars/josh.mp4'
    }
};

export async function GET() {
    try {
        if (!HEYGEN_API_KEY) {
            console.error("API key is missing");
            return new Response(
                JSON.stringify({ error: "API key configuration error" }),
                { status: 401 }
            );
        }

        const response = await fetch('https://api.heygen.com/v1/streaming/avatar.list', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Api-Key': HEYGEN_API_KEY.trim(),
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Transform the response and use local image paths
        const transformedData = {
            data: {
                avatars: data.data.map((avatar: any) => ({
                    avatar_id: avatar.avatar_id,
                    avatar_name: avatar.avatar_id,
                    preview_image_url: avatarImages[avatar.avatar_id]?.image || '/images/avatars/default.jpg',
                    preview_video_url: avatarImages[avatar.avatar_id]?.video || '',
                    gender: avatar.gender || '',
                    is_public: avatar.is_public,
                    status: avatar.status
                }))
            }
        };
        
        return new Response(JSON.stringify(transformedData), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });

    } catch (error) {
        console.error("Error fetching avatars:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch avatars" }), 
            { status: 500 }
        );
    }
}