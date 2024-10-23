import { NextResponse } from 'next/server';

export async function POST(request) {
  const { origin, destination } = await request.json();

  if (!origin || !destination) {
    return NextResponse.json({ message: 'Origin and destination are required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//   console.log("/////// apiKey ////////",apiKey);

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&mode=driving&units=metric&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: 'Unable to calculate distance' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
