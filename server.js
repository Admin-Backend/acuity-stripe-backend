require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

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

app.listen(4242, () => console.log("Server running on port 4242"));
