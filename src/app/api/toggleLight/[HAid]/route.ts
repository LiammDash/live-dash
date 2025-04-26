import { env } from "process";

export async function POST(request: Request, { params }: { params: { HAid: string } }) {
  const { HAid } = params 
  const url = 'http://192.168.2.150:30103/api/services/light/toggle'; // Replace with your API URL
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': env.HAsecret ?? '',
    },
    body: JSON.stringify({
      // Your request payload here
      "entity_id": HAid,
    }),
  };

  const response = await fetch(url, options);
  const responseBody = { status: response.status, body: await response.json() };
  return new Response(JSON.stringify(responseBody), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  }