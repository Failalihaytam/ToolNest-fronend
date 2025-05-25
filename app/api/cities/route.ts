// filepath: c:\wamp64\www\PhpProject\core\frontend\app\api\cities\route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace with your actual Laravel backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tool-nest-backend-glfb9n7sf-failalihaytams-projects.vercel.app/api';
    const response = await fetch(`${backendUrl}/api/cities`); 

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to fetch cities from backend:', errorData);
      return NextResponse.json({ message: `Failed to fetch cities: ${response.statusText}` }, { status: response.status });
    }

    const cities = await response.json();
    return NextResponse.json(cities);

  } catch (error: any) {
    console.error('Error in /api/cities Next.js route:', error);
    return NextResponse.json({ message: 'Internal server error fetching cities', error: error.message }, { status: 500 });
  }
}