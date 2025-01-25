const apiKey = process.env.DODO_PAYMENTS_API_KEY
if (!apiKey) {
  throw new Error('Missing DODO_PAYMENTS_API_KEY environment variable')
}

export const createPayment = async (params: {
  customer: { email: string; name: string };
  product_cart: Array<{ product_id: string; quantity: number }>;
  metadata: Record<string, string>;
  payment_link?: boolean;
}) => {
  const response = await fetch('https://live.dodopayments.com/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payment_link: true,
      ...params,
      billing: {
        city: 'City',
        country: 'US',
        state: 'State',
        street: 'Street',
        zipcode: '12345'
      }
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Payment API error (${response.status}): ${text}`)
  }

  return response.json()
}

export const getPaymentStatus = async (paymentId: string) => {
  const response = await fetch(`https://live.dodopayments.com/payments/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Payment status check failed: ${response.status}`);
  }

  return response.json();
}; 