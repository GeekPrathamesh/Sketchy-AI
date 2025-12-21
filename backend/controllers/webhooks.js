import Stripe from "stripe";

export const stripeWebHooks = (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET_KEY);

  const signature = request.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (error) {
    return response.status(400).send(`webhook error : ${error.message}`);
  }

  try {
    
  } catch (error) {
    
  }
};
