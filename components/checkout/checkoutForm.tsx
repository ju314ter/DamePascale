// components/CheckoutForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  confirmPayment,
  createPaymentIntent,
} from "@/app/(main)/(context)/actions";

export default function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    createPaymentIntent(amount)
      .then(({ clientSecret }: any) => setClientSecret(clientSecret))
      .catch((error) => setError("Failed to initialize payment"));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      setError(result.error.message || "An error occurred");
    } else {
      const confirmResult = await confirmPayment(result.paymentIntent.id);
      if (confirmResult.success) {
        console.log("Payment successful!");
        // Redirect to success page or update UI
      } else {
        setError("Payment failed");
      }
    }

    setProcessing(false);
  };

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div>{error}</div>}
      <button type="submit" disabled={!stripe || processing}>
        Pay ${amount / 100}
      </button>
    </form>
  );
}
