import React, { useEffect, useState } from 'react';
import { Clock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCodeCanvas from 'qrcode.react';
import { format } from 'date-fns';

interface BookingSlot {
  id: string;
  time: string;
  available: boolean;
}

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [timeSlots, setTimeSlots] = useState<BookingSlot[]>([]);

  useEffect(() => {
    // Fetch available slots from the backend
    fetch('/api/bookings')
      .then((response) => response.json())
      .then((data) => setTimeSlots(data))
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
    setShowPayment(false);
    setPaymentComplete(false);
  };

  const handleSlotSelect = (slot: BookingSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    try {
      const response = await fetch(`/api/bookings/${selectedSlot?.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success('Payment successful!');
        setPaymentComplete(true);
        // Update the local state to reflect the booking
        setTimeSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.id === selectedSlot?.id ? { ...slot, available: false } : slot
          )
        );
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const generateQRCodeValue = () => {
    const bookingDetails = `Booking ID: ${selectedSlot?.id}, Date: ${selectedDate}, Time: ${selectedSlot?.time}`;
    return bookingDetails;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h2>

        {/* Date Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Time Slots */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                disabled={!slot.available}
                className={`p-4 rounded-lg border ${
                  selectedSlot?.id === slot.id
                    ? 'border-blue-500 bg-blue-50'
                    : slot.available
                    ? 'border-gray-200 hover:border-blue-500'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <Clock className="h-5 w-5 text-gray-600 mb-2" />
                <span className={`block ${!slot.available && 'text-gray-400'}`}>
                  {slot.time}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        {showPayment && !paymentComplete && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span>Appointment Fee</span>
                <span className="font-medium">₹500</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Tax (18% GST)</span>
                <span>₹90</span>
              </div>
              <div className="border-t mt-2 pt-2 flex items-center justify-between font-medium">
                <span>Total</span>
                <span>₹590</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Pay Now
            </button>
          </div>
        )}

        {/* Booking Confirmation */}
        {paymentComplete && (
          <div className="border-t pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-green-600 mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-4">
                Your appointment is scheduled for {selectedDate} at{' '}
                {selectedSlot?.time}
              </p>
              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  value={generateQRCodeValue()}
                  size={128}
                  level="H"
                />
              </div>
              <p className="text-sm text-gray-500">
                Please save this QR code for your reference
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
