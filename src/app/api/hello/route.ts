import {  NextResponse } from 'next/server';
// import { NextRequest, NextResponse } from 'next/server';
import { useStore } from '@/store/store';

export async function GET() {
  const service = useStore.getState().service;
  console.log("Current count:", service);
  return NextResponse.json({ message: 'Hello from the API!', service });
}

// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   useTestStore.getState().increment();
//   const newCount = useTestStore.getState().count;
//   console.log("New count after increment:", newCount);
  
//   return NextResponse.json({ 
//     message: body,
//     count: newCount
//   });
// }