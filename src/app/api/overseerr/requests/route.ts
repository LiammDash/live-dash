import { env } from "process";

export async function GET(request: Request) {

const url = `http://localhost:5055/api/v1/request?take=20&skip=0&sort=added&requestedBy=1`; 
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': env.OSsecret ?? '',
    },
};

const response = await fetch(url, options);
    if (!response.ok) {
        return new Response('Error fetching data', { status: 500 });
    }
    const data = await response.json();
    console.log(data)
    return data
  }