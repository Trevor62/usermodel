// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import axios from "axios";
// import dotenv from "dotenv";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// // /placing user order for frontend
// const placeOrder = async (req, res) => {
//   const frontend_url = "http://localhost:5174";

//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     const line_items = req.body.items.map((item) => ({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.name,
//           },
//           unit_amount: Math.round(item.price * 100), // Convert price in USD to cents
//         },
//         quantity: item.quantity,
//       }));

//       // Add delivery charges in cents (for example, 500 cents = $5.00)
//       line_items.push({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Delivery charges",
//           },
//           unit_amount: 500, // Delivery fee in cents (for $5.00)
//         },
//         quantity: 1,
//       });

//     const session = await stripe.checkout.sessions.create({
//       line_items: line_items,
//       mode: "payment",
//       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//     });
//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };
// const userOrders = async (req, res) => {
//     try {
//       const orders = await orderModel.find({ userId: req.body.userId });
//       res.json({ success: true, data: orders });
//     } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: "Error retrieving user orders" });
//     }
//   };


// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.body;
//   try {
//     if (success === "true") {
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       res.json({ success: true, message: "paid" });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false, message: "Not paid" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "error" });
//   }
// };
// const listOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error retrieving orders" });
//   }
// };

// // Update order status API
// const updateStatus = async (req, res) => {
//   try {
//     await orderModel.findByIdAndUpdate(req.body.orderId, {
//       status: req.body.status,
//     });
//     res.json({ success: true, message: "Order status updated" });
//   } catch (error) {
//     res.json({ success: false, message: "Error updating order status" });
//   }
// };



//  export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const FLW_BASE_URL = "https://api.flutterwave.com/v3";
// const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

// // Placing user order for frontend
// const placeOrder = async (req, res) => {
//   const frontend_url = "http://localhost:5174";

//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     // Prepare items for Flutterwave
//     const line_items = req.body.items.map((item) => ({
//       name: item.name,
//       amount: Math.round(item.price), // Flutterwave uses regular currency values, not cents
//       quantity: item.quantity,
//     }));

//     // Add delivery charges (if applicable)
//     line_items.push({
//       name: "Delivery charges",
//       amount: 5.00, // Delivery fee in dollars
//       quantity: 1,
//     });

//     // Flutterwave payload for initiating payment
//     const payload = {
//       tx_ref: newOrder._id.toString(), // Unique transaction reference
//       amount: newOrder.amount + 5.00, // Total amount including delivery
//       currency: "USD",
//       redirect_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//       customer: {
//         email: req.body.customerEmail, // Customer's email address
//         phone_number: req.body.customerPhone, // Customer's phone number
//         name: req.body.customerName // Customer's name
//       },
//       customizations: {
//         title: "Food Order Payment",
//         description: "Payment for your food order",
//         logo: "http://www.yourlogo.com/logo.png",
//       },
//     };

//     // Send request to Flutterwave for payment initiation
//     const response = await axios.post(`${FLW_BASE_URL}/payments`, payload, {
//       headers: {
//         Authorization: `Bearer ${FLW_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.data.status === "success") {
//       res.json({ success: true, session_url: response.data.data.link });
//     } else {
//       throw new Error("Payment initiation failed");
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error in placing the order" });
//   }
// };

// // Verifying the order
// const verifyOrder = async (req, res) => {
//   const { orderId, success } = req.query;

//   try {
//     if (success === "true") {
//       // Check the order details in the database
//       const order = await orderModel.findById(orderId);
//       if (!order) {
//         return res.json({ success: false, message: "Order not found" });
//       }

//       // Verify the payment status from Flutterwave
//       const response = await axios.get(
//         `${FLW_BASE_URL}/transactions/${orderId}/verify`,
//         {
//           headers: {
//             Authorization: `Bearer ${FLW_SECRET_KEY}`,
//           },
//         }
//       );

//       if (response.data.data.status === "successful") {
//         // Mark order as paid
//         await orderModel.findByIdAndUpdate(orderId, { payment: true });
//         res.json({ success: true, message: "Payment verified and order paid" });
//       } else {
//         // Payment failed, delete the order
//         await orderModel.findByIdAndDelete(orderId);
//         res.json({ success: false, message: "Payment failed or incomplete" });
//       }
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false, message: "Order was not paid" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error during verification" });
//   }
// };

// // Fetching user orders
// const userOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({ userId: req.body.userId });
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error retrieving user orders" });
//   }
// };

// // Fetch all orders for the admin panel
// const listOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.json({ success: true, data: orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error retrieving orders" });
//   }
// };

// // Update the order status
// const updateStatus = async (req, res) => {
//   try {
//     await orderModel.findByIdAndUpdate(req.body.orderId, {
//       status: req.body.status,
//     });
//     res.json({ success: true, message: "Order status updated" });
//   } catch (error) {
//     res.json({ success: false, message: "Error updating order status" });
//   }
// };

// export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FLW_BASE_URL = "https://api.flutterwave.com/v3";
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

// Placing user order for frontend
const placeOrder = async (req, res) => {
  // const frontend_url = "http://localhost:5174";
  const frontend_url = "https://amaphill-palace.web.app";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount, // This should be in NGN now
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Prepare items for Flutterwave
    const line_items = req.body.items.map((item) => ({
      name: item.name,
      amount: Math.round(item.price), // Now this should reflect NGN prices
      quantity: item.quantity,
    }));

    // Add delivery charges (if applicable)
    line_items.push({
      name: "Delivery charges",
      amount: 3000.00, // Adjusted delivery fee in Naira
      quantity: 1,
    });

    // Flutterwave payload for initiating payment
    const payload = {
      tx_ref: newOrder._id.toString(), // Unique transaction reference
      amount: newOrder.amount + 3000.00, // Total amount including delivery (in NGN)
      currency: "NGN", // Changed to Naira
      redirect_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      customer: {
        email: req.body.customerEmail, // Customer's email address
        phone_number: req.body.customerPhone, // Customer's phone number
        name: req.body.customerName // Customer's name
      },
      customizations: {
        title: "Food Order Payment",
        description: "Payment for your food order",
        logo: "http://www.yourlogo.com/logo.png",
      },
    };

    // Send request to Flutterwave for payment initiation
    const response = await axios.post(`${FLW_BASE_URL}/payments`, payload, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.status === "success") {
      res.json({ success: true, session_url: response.data.data.link });
    } else {
      throw new Error("Payment initiation failed");
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in placing the order" });
  }
};

// Verifying the order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.query;

  try {
    if (success === "true") {
      // Check the order details in the database
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      // Verify the payment status from Flutterwave
      const response = await axios.get(
        `${FLW_BASE_URL}/transactions/${orderId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${FLW_SECRET_KEY}`,
          },
        }
      );

      if (response.data.data.status === "successful") {
        // Mark order as paid
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        res.json({ success: true, message: "Payment verified and order paid" });
      } else {
        // Payment failed, delete the order
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: false, message: "Payment failed or incomplete" });
      }
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Order was not paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error during verification" });
  }
};

// Fetching user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving user orders" });
  }
};

// Fetch all orders for the admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving orders" });
  }
};

// Update the order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.json({ success: false, message: "Error updating order status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
