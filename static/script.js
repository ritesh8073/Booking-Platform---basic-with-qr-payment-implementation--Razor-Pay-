document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let selectedDate = null;
    let selectedTime = null;

    // Mock time slots data - in a real app, this would come from a backend
    const timeSlots = [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '12:00', available: true },
        { time: '13:00', available: true },
        { time: '14:00', available: false },
        { time: '15:00', available: true },
        { time: '16:00', available: true },
    ];

    // Initialize date picker
    const datePicker = flatpickr("#datePicker", {
        minDate: "today",
        disable: [
            function(date) {
                return date.getDay() === 0; // Disable Sundays
            }
        ],
        onChange: function(selectedDates) {
            selectedDate = selectedDates[0];
            updateTimeSlots();
            updateSubmitButton();
        }
    });

    // Render time slots
    function renderTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';

        timeSlots.forEach(slot => {
            const button = document.createElement('button');
            button.className = `time-slot ${!slot.available ? 'unavailable' : ''}`;
            button.textContent = slot.time;

            if (slot.available) {
                button.addEventListener('click', () => selectTimeSlot(slot.time));
            }

            if (selectedTime === slot.time) {
                button.classList.add('selected');
            }

            timeSlotsContainer.appendChild(button);
        });
    }

    // Select time slot
    function selectTimeSlot(time) {
        selectedTime = time;
        renderTimeSlots();
        updateSubmitButton();
    }

    // Update submit button state
    function updateSubmitButton() {
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = !selectedDate || !selectedTime;
    }

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: selectedDate.toISOString(),  // Convert the date to ISO string format for consistency
            time: selectedTime
        };

        // Send the booking details to the backend to generate the QR code and booking confirmation
        fetch('/confirm_booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);  // Show error if time slot is already booked or something went wrong
            } else {
                // Show booking summary
                document.getElementById('summaryName').textContent = data.name;
                document.getElementById('summaryEmail').textContent = data.email;
                document.getElementById('summaryPhone').textContent = data.phone;
                document.getElementById('summaryDate').textContent = data.date;
                document.getElementById('summaryTime').textContent = data.time;

                // Show the QR code for payment
                const qrCodeImage = document.createElement('img');
                qrCodeImage.src = `data:image/png;base64,${data.qr_code_base64}`;
                document.getElementById('paymentQRCode').innerHTML = '';
                document.getElementById('paymentQRCode').appendChild(qrCodeImage);

                // Hide the booking form and show the summary
                document.querySelector('.booking-grid').style.display = 'none';
                document.getElementById('bookingSummary').classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Handle payment confirmation
    document.getElementById('confirmPayment').addEventListener('click', function() {
        alert('Proceeding to payment...');
    });

    // Initial render
    renderTimeSlots();
    updateSubmitButton();
});
