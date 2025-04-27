import { env } from "process";

export async function POST(request: Request, { params }: { params: { HAid: string } }) {
const { HAid } = await params;
const url = `http://192.168.2.150:30103/api/states/${HAid}`; // Use HAid in the URL for GET
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': env.HAsecret ?? '',
    },
};

const response = await fetch(url, options);
    if (!response.ok) {
        return new Response('Error fetching data', { status: 500 });
    }
    const data = await response.json();
    const state = data.state;
    const rgb = data.attributes.rgb_color;
    const color = rgb
        ? rgb.map((x: number) => x.toString(16).padStart(2, "0")).join("")
        : null;
    const brightness = data.attributes.brightness*4;

    return new Response(JSON.stringify({ 
        state: state,
        color: color,
        brightness: brightness,
     }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

  }