// netlify/functions/create-checkout-session.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Add your Stripe secret key in Netlify env

exports.handler = async function(event, context) {
  try {
    const { parentEmail, childName } = JSON.parse(event.body);

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Fun Memory Game for ${childName}`,
            },
            unit_amount: 499, // $4.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.URL}/game.html?name=${encodeURIComponent(childName)}`,
      cancel_url: `${process.env.URL}/index.html`,
      customer_email: parentEmail,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
