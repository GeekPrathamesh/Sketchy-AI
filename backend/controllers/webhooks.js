import Stripe from "stripe";
import Transaction from "../models/transactions.js";
import User from "../models/userschema.js";

export const stripeWebHooks = async(req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`webhook error : ${error.message}`);
  }

  try {
    switch(event.type){
      case "payment_intent.succeeded" :{
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent:paymentIntent.id,
        });


        const session = sessionList.data[0];
        const {transactionId,appId}=session.metadata;

        if(appId==="SketchyAI"){
          const transaction =await Transaction.findOne({_id:transactionId,isPaid:false})

          //update credits in user account
          await User.updateOne({_id:transaction.userId},{$inc:{credits:transaction.credits}});

          //update credit payment status
          transaction.isPaid=true;
          await transaction.save();
        }
        else{
          return res.json({received:true,message:"Ignored event:Invalid App"})
        }
        break;


      }
      default:
        console.log("unhandled event type",event.type);
        
        break;
    }
    res.json({received:true})
  } catch (error) {
    console.error("webhook processing error",error)
    res.status(500).send("Internal Server Error")
  }
};
