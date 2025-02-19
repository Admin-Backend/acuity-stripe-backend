require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// 1) Direct GET route that creates a Stripe Checkout session & redirects.
app.get('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'https://acuity-stripe-backend.onrender.com/success',
      cancel_url: 'https://acuity-stripe-backend.onrender.com/cancel',
      line_items: [
        {
          price_data: {
            currency: 'AUD',
            product_data: {
              name: 'Appointment Payment',
            },
            unit_amount: 8495, // AUD $84.95 in cents
          },
          quantity: 1,
        },
      ],
    });
    // 2) Redirect the browser to the Stripe Checkout URL
    return res.redirect(303, session.url);
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Optional success page
app.get('/success', (req, res) => {
  res.send('Payment successful! Thank you!');
});

// Optional cancel page
app.get('/cancel', (req, res) => {
  res.send('Payment canceled. Maybe next time!');
});

// Server port
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Test route to confirm the server is running
app.get('/', (req, res) => {
  res.send('✅ Server is running on Render!');
});
