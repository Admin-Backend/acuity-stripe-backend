require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Stripe Checkout Session Route
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: 'https://acuity-stripe-backend-production.up.railway.app/success',
            cancel_url: 'https://acuity-stripe-backend-production.up.railway.app/cancel',
            line_items: [
                {
                    price_data: {
                        currency: 'AUD',
                        product_data: {
                            name: 'Appointment Payment',
                        },
                        unit_amount: 8495, // AUD 84.95 in cents
                    },
                    quantity: 1,
                },
            ],
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Fix Port Issue - Match Railway's Assigned Port
const PORT = process.env.PORT || 8080;  // Use 8080 since Railway assigned it
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Test Route to Verify Deployment
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});
