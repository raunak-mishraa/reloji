import * as React from 'react';

interface BookingStatusUpdateEmailProps {
  userName: string;
  listingTitle: string;
  status: string;
  bookingUrl: string;
}

export const BookingStatusUpdateEmail: React.FC<Readonly<BookingStatusUpdateEmailProps>> = ({ userName, listingTitle, status, bookingUrl }) => (
  <div>
    <h1>Booking Status Update</h1>
    <p>Hello {userName},</p>
    <p>The status of your booking for "{listingTitle}" has been updated to: <strong>{status}</strong></p>
    <p>
      <a href={bookingUrl}>Click here to view the booking details</a>
    </p>
  </div>
);
