import React, { useEffect, useState } from "react";
import axios from "axios";
import RenderRazorpay from "./RenderRazorpay";

const Right = ({ iteam = [] }) => {
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderId: null,
    currency: null,
    amount: null,
  });
  const [price, setPrice] = useState(0);

  useEffect(() => {
    totalAmount();
  }, [iteam]);

  const totalAmount = () => {
    let total = 0;
    iteam.forEach((item) => {
      total += item.price?.cost * (item.quantity || 1);
    });
    setPrice(total);
  };

  const handleCreateOrder = async (amount, currency) => {
    console.log("Creating Razorpay order...");
    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/orders/order",
        {
          amount: amount * 100,
          currency,
        }
      );

      if (data && data.id) {
        setOrderDetails({
          orderId: data.id,
          currency: data.currency,
          amount: data.amount,
        });
        setDisplayRazorpay(true);
      } else {
        alert("Order creation failed.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong while creating the order.");
    }
  };

  return (
    <div className="right_buy">
      <div className="cost_right">
        <p>Your order is eligible for FREE Delivery</p>
        <br />
        <span style={{ color: "#565959" }}>Select this option at checkout</span>
        <h3>
          Sub Total ({iteam.length} items):{" "}
          <span style={{ fontWeight: 700 }}>₹{price}.00</span>
        </h3>
        <button
          className="rightbuy_btn"
          onClick={() => handleCreateOrder(299, "INR")}
        >
          Proceed to Buy
        </button>
      </div>

      {displayRazorpay && orderDetails.orderId && (
        <RenderRazorpay
          amount={orderDetails.amount}
          currency={orderDetails.currency}
          orderId={orderDetails.orderId}
          keyId=""
        />
      )}
    </div>
  );
};

export default Right;
