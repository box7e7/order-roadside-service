import React from 'react';

interface OrderConfirmationEmailProps {
  customerName: string;
  serviceType: string;
  vehicleMakeModel: string;
  serviceDate: string;
  pickupLocation: string;
  destination: string;
  total:  number;
  year: string;
}

const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  customerName,
  serviceType,
  vehicleMakeModel,
  serviceDate,
  pickupLocation,
  destination,
  total,
  year,
}) => {
  return (
    <div className="container" style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div className="header" style={{
        backgroundColor: '#1a5f7a',
        padding: '20px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        color: '#ffffff',
        textAlign: 'center',
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '24px',
          letterSpacing: '1px',
          fontWeight: 'bold',
        }}>Order Confirmation</h1>
      </div>
      <div className="content" style={{
        padding: '20px',
      }}>
        <h2 style={{
          fontSize: '20px',
          color: '#1a5f7a',
          marginBottom: '15px',
        }}>Thank you for your order!</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '10px' }}>Dear {customerName},</p>
        <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>Your order for roadside assistance and towing service has been confirmed. Below are the details of your service:</p>

        <div className="order-details" style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#1a5f7a',
            marginBottom: '15px',
            textAlign: 'center',
          }}>Order Details</h3>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 10px',
          }}>
            <tbody>
              {[
                { label: 'Service Type', value: serviceType },
                { label: 'Vehicle', value: vehicleMakeModel },
                { label: 'Service Date', value: serviceDate },
                { label: 'Pickup Location', value: pickupLocation },
                { label: 'Destination', value: destination },
                { label: 'Service Price', value: `$${total.toFixed(2)}` },
              ].map(({ label, value }) => (
                <tr key={label}>
                  <th style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    backgroundColor: '#e8f4f8',
                    color: '#1a5f7a',
                    fontWeight: 'bold',
                    borderRadius: '4px 0 0 4px',
                    fontSize: '14px',
                    width: '40%',
                  }}>{label}</th>
                  <td style={{
                    padding: '12px 15px',
                    textAlign: 'left',
                    backgroundColor: '#ffffff',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    wordBreak: 'break-word',
                  }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '14px', lineHeight: '1.5', marginTop: '20px' }}>If you have any questions or need to update your service details, feel free to contact us at <a href="tel:+12816028213" style={{ color: '#1a5f7a', textDecoration: 'none', fontWeight: 'bold' }}>281-602-8213</a> or email us at <a href="mailto:support@momentum-roadside.com" style={{ color: '#1a5f7a', textDecoration: 'none', fontWeight: 'bold' }}>support@momentum-roadside.com</a>.</p>
        
        <p style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '15px' }}>We appreciate your business and look forward to assisting you!</p>
        
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>Best regards,<br /><strong>Momentum Towing and Roadside Services LLC Team</strong></p>
      </div>
      <div className="footer" style={{
        backgroundColor: '#f4f4f4',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      }}>
        <p>&copy; {year} Momentum Roadside Services LLC. All rights reserved.</p>
        <p><a href="https://momentum-roadside.com/" style={{ color: '#1a5f7a', textDecoration: 'none', fontWeight: 'bold' }}>Visit our website</a> | <a href="tel:+12816028213" style={{ color: '#1a5f7a', textDecoration: 'none', fontWeight: 'bold' }}>Call Support</a></p>
      </div>
    </div>
  );
};

export default OrderConfirmationEmail;
