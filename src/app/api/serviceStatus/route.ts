import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== 'string') {
            return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 });
        }

        try {
            const response = await fetch(url, { method: 'GET' });
            // If we get any response, the service is online
            return NextResponse.json({ success: true, status: response.status });
        } catch (fetchError) {
            // Network error, service is offline
            return NextResponse.json({ success: false, error: 'Network error' });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid request' });
    }
}