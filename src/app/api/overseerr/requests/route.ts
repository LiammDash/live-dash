import { NextRequest, NextResponse } from 'next/server';

const OVERSEERR_API_URL = 'http://192.168.2.150:30002';
const OVERSEERR_API_KEY = process.env.OSsecret;

export async function POST(req: NextRequest) {
    if (!OVERSEERR_API_URL || !OVERSEERR_API_KEY) {
        return NextResponse.json({ error: 'Overseerr API not configured' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `${OVERSEERR_API_URL}/api/v1/request?filter=pending&take=1000`,
            {
            headers: {
                'X-Api-Key': OVERSEERR_API_KEY,
            },
            }
        );

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch requests' }, { status: response.status });
        }

        const data = await response.json();

        // data.results is assumed to be an array of requests
        const requests = await Promise.all(
            (data.results || []).map(async (request: any) => {
            const tmdbId = request.media?.tmdbId;
            let mediaName = null;
            let mediaBackdrop = null;
            if (tmdbId) {
                if (request.type === 'movie') {
                    const movieRes = await fetch(
                        `${OVERSEERR_API_URL}/api/v1/movie/${tmdbId}`,
                        {
                            headers: {
                                'X-Api-Key': OVERSEERR_API_KEY,
                            },
                        }
                    );
                    if (movieRes.ok) {
                        const movieData = await movieRes.json();
                        mediaName = movieData.title || null;
                        mediaBackdrop = movieData.backdropPath || null;
                    }
                } else if (request.type === 'tv') {
                    const tvRes = await fetch(
                        `${OVERSEERR_API_URL}/api/v1/tv/${tmdbId}`,
                        {
                            headers: {
                                'X-Api-Key': OVERSEERR_API_KEY,
                            },
                        }
                    );
                    if (tvRes.ok) {
                        
                        const tvData = await tvRes.json();
                        mediaName = tvData.name;
                        mediaBackdrop = tvData.backdropPath || null;
                    }
                }
                
            }

            const type = request.type === "tv" ? "tv show" : request.type;
            return {
                id: request.id,
                name: mediaName,
                requester: request.requestedBy?.displayName || null,
                type: type || null,
                backdrop: mediaBackdrop
            };
            })
        );

        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}