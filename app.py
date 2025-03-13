from flask import Flask, render_template, request, redirect, url_for
import qrcode
import base64
from io import BytesIO
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Example booking database (in-memory for simplicity)
bookings = {}
# List of available time slots (you can replace this with dynamic time generation)
available_time_slots = [
    "2025-02-10 10:00",
    "2025-02-10 11:00",
    "2025-02-10 12:00",
    "2025-02-10 13:00",
]

# Generate the QR code URL for payment confirmation
def generate_qr_code(booking_id):
    host = '192.168.31.248'  # Use local IP if you're on a local network
    port = '5001'  # Port where the Flask app is running
    confirmation_url = f"http://{host}:{port}/booking_info/{booking_id}"  # URL points to the booking info page
    img = qrcode.make(confirmation_url)
    
    # Convert the QR code image to base64 for embedding in the page
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    return qr_code_base64

# Route for the homepage with time slot selection
@app.route('/')
def homepage():
    return render_template('index.html', time_slots=available_time_slots)

# Route to handle the booking form submission
@app.route('/confirm_booking', methods=['POST'])
def confirm_booking_post():
    name = request.form['name']
    email = request.form['email']
    phone = request.form['phone']
    selected_time_slot = request.form['time_slot']  # The time slot chosen by the user
    booking_id = str(len(bookings) + 1)  # Generate a simple booking ID

    # Check if the time slot is already taken
    if selected_time_slot in [booking['time_slot'] for booking in bookings.values()]:
        return render_template('error.html', message="Time slot is already booked. Please choose another one."), 400

    # Save booking info (in a real app, save this to a database)
    bookings[booking_id] = {
        'name': name,
        'email': email,
        'phone': phone,
        'time_slot': selected_time_slot,
        'confirmed': False,
    }

    # Generate the QR code and pass it to the template
    qr_code_base64 = generate_qr_code(booking_id)
    
    return render_template('booking_summary.html', qr_code=qr_code_base64, booking_id=booking_id, booking=bookings[booking_id])

# Route to display the booking info page (after QR code scan)
@app.route('/booking_info/<booking_id>', methods=['GET'])
def booking_info(booking_id):
    booking = bookings.get(booking_id)
    if not booking:
        return "Booking not found", 404

    # Render a template displaying the booking details
    return render_template('booking_info.html', booking=booking)

# Route to handle the booking confirmation action
@app.route('/confirm_booking/<booking_id>/confirm', methods=['POST'])
def confirm_booking_action(booking_id):
    booking = bookings.get(booking_id)
    if not booking:
        return "Booking not found", 404

    # Confirm the booking and mark the time slot as unavailable
    if not booking['confirmed']:
        booking['confirmed'] = True
        available_time_slots.remove(booking['time_slot'])  # Mark the slot as unavailable
        return redirect(url_for('confirmation_success', booking_id=booking_id))
    else:
        return redirect(url_for('confirmation_success', booking_id=booking_id))


# Route to display the confirmation success page
@app.route('/confirmation_success/<booking_id>', methods=['GET'])
def confirmation_success(booking_id):
    booking = bookings.get(booking_id)
    if not booking:
        return "Booking not found", 404

    return render_template('confirmation_success.html', booking=booking)

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)  # Use host='0.0.0.0' to allow external devices to access the server.
