# Booking Platform

A React-based booking platform with QR code and payment implementation.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/ritesh8073/Booking-Platform---basic-with-qr-payment-implementation--Razor-Pay-.git
cd Booking-Platform---basic-with-qr-payment-implementation--Razor-Pay-
```

2. Install dependencies:
```bash
npm install
```

3. Configure Supabase:
   - Create a Supabase account at https://supabase.com
   - Create a new project
   - Copy your project URL and anon key from Project Settings > API
   - Create a `.env` file in the project root and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Features
- User authentication
- Appointment booking
- QR code generation
- Razorpay payment integration
- Real-time slot availability