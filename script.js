// script.js

const payButton = document.getElementById("payButton");

payButton.addEventListener("click", async () => {
  const parentEmail = document.getElementById("parentEmail").value;
  const childName = document.getElementById("childName").value;

  if (!parentEmail || !childName) {
    alert("Please enter parent email and child name.");
    return;
  }

  // Initialize Stripe
  const stripe = Stripe("YOUR_STRIPE_PUBLISHABLE_KEY"); // Replace with your Stripe key

  // Create checkout session (requires a backend endpoint)
  const response = await fetch("/.netlify/functions/create-checkout-session", { // Netlify function
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parentEmail, childName }),
  });

  const session = await response.json();

  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({ sessionId: session.id });

  if (result.error) {
    alert(result.error.message);
  }
});
