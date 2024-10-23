import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/utils/sendOrderConfirmationEmail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      serviceType,
      vehicleMakeModel,
      serviceDate,
      pickupLocation,
      destination,
      estimatedArrivalTime,
      year,
      customerEmail
    } = body;

    await sendOrderConfirmationEmail({
      customerName,
      serviceType,
      vehicleMakeModel,
      serviceDate,
      pickupLocation,
      destination,
      estimatedArrivalTime,
      year,
      customerEmail
    });

    return NextResponse.json({ message: 'Order confirmation email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in send-order-confirmation API route:', error);
    return NextResponse.json({ error: 'Failed to send order confirmation email' }, { status: 500 });
  }
}