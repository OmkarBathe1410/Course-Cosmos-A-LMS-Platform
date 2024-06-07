import { styles } from "../../../app/styles/style";
import { useCreateOrderMutation } from "../../../redux/features/orders/ordersApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import socketIO from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any;
  data: any;
  userRefetch: any;
  user: any;
  courseDetailsRefetch: any;
};

const CheckoutForm: FC<Props> = ({
  setOpen,
  data,
  userRefetch,
  user,
  courseDetailsRefetch,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);

  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(true);
      await createOrder({ courseId: data?._id, payment_info: paymentIntent });
    }
  };

  useEffect(() => {
    if (orderData) {
      setOpen(false);
      userRefetch();
      courseDetailsRefetch();
      toast.success("Course purchased successfully!");
      socketId.emit("notification", {
        userId: user._id,
        title: "New Order",
        message: `You have a new order for ${data?.name} from ${user?.name}`,
      });
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [orderData, error]);

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="font-Poppins">
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span
          id="button-text"
          className={`${
            styles.button
          } mt-3 !py-0 !h-max !bg-gradient-to-b from-green-400 via-green-500 to-green-700 !rounded-md !px-7 ${
            (isLoading || !stripe || !elements) && "!cursor-no-drop"
          }`}
        >
          {isLoading ? "Payment in progress..." : "Pay Now"}
        </span>
      </button>
      {message && (
        <div className="bg-red-600 text-white font-Poppins mt-2 p-2 rounded-md">
          ERROR: {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
