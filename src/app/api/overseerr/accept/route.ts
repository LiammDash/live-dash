import { NextRequest, NextResponse } from 'next/server';

const OVERSEERR_API_URL = 'http://192.168.2.150:30002';
const OVERSEERR_API_KEY = process.env.OSsecret;

export async function POST(req: NextRequest) {
    try {
        const { requestId } = await req.json();

        if (!requestId) {
            return NextResponse.json(
                { success: false, message: 'Missing requestId.' },
                { status: 400 }
            );
        }
        // Call Overseerr API to approve the request
        const overseerrRes = await fetch(
            `${OVERSEERR_API_URL}/api/v1/request/${requestId}/approve`,
            {
                method: 'POST',
                headers: {
                    'X-Api-Key': OVERSEERR_API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!overseerrRes.ok) {
            const errorData = await overseerrRes.json();
            
            return NextResponse.json(
                { success: false, message: errorData.message || 'Failed to approve request.' },
                { status: overseerrRes.status }
            );
        }

        const data = await overseerrRes.json();



        return NextResponse.json({
            success: true,
            message: `Request ${requestId} has been approved through Overseerr.`,
            data,
        });
    } catch (error) {
        
        return NextResponse.json(
            { success: false, message: 'Invalid request body or server error.' },
            { status: 400 }
        );
    }
}