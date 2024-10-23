import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface EmailParams {
  customerName: string;
  serviceType: string;
  vehicleMakeModel: string;
  serviceDate: string;
  pickupLocation: string;
  destination: string;
  total: number;
  year: string;
  customerEmail: string;
}

export async function sendOrderConfirmationEmail({
  customerName,
  serviceType,
  vehicleMakeModel,
  serviceDate,
  pickupLocation,
  destination,
  total,
  year,
  customerEmail
}: EmailParams): Promise<void> {
  // Read the HTML content from the file
  const templatePath = path.join(process.cwd(), 'public/order_confirmation_email_template_with_placeholders.html');
  const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders in the HTML template
  const htmlContent = htmlTemplate
    .replace("{{customer_name}}", customerName)
    .replace("{{service_type}}", serviceType)
    .replace("{{vehicle_make_model}}", vehicleMakeModel)
    .replace("{{service_date}}", serviceDate)
    .replace("{{pickup_location}}", pickupLocation)
    .replace("{{destination}}", destination)
    .replace("{{total}}", `$${total.toFixed(2)}`)
    .replace("{{year}}", year);

  // Set the API endpoint
  const url = "https://api.zeptomail.com/v1.1/email";

  // Define the payload using the updated HTML content
  const payload = {
    "from": {
      "address": "noreply@momentum-roadside.com"
    },
    "to": [
      {
        "email_address": {
          "address": customerEmail,
          "name": customerName
        }
      }
    ],
    "subject": "Order Confirmation - Towing and Roadside Service",
    "htmlbody": htmlContent
  };

  // Set the request headers
  const headers = {
    'accept': "application/json",
    'content-type': "application/json",
    'authorization': process.env.ZOHO_API_KEY
  };

  try {
    const response = await axios.post(url, payload, { headers: headers });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}