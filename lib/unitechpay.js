import crypto from 'crypto';

const UNITECHPAY_API_URL = 'https://api.unitech.sn/api';

export async function createPayment({ amount, description, orderId, customerName, customerPhone, paymentMethod, appUrl }) {
  try {
    const apiKey = process.env.UNITECHPAY_API_KEY;
    if (!apiKey) {
      console.warn('UNITECHPAY_API_KEY non configurée.');
      return { success: 0, error: 'API key missing' };
    }

    // Determine the action based on paymentMethod
    // Wave: create_wave_payment
    // Orange Money: create_orange_om
    const isOrange = paymentMethod === 'orange_money' || paymentMethod === 'orange';
    const action = isOrange ? 'create_orange_om' : 'create_wave_payment';

    let runtimeAppUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (runtimeAppUrl.includes('localhost')) {
      runtimeAppUrl = 'https://pay.unitech.sn';
    } else if (runtimeAppUrl.startsWith('http://')) {
      runtimeAppUrl = runtimeAppUrl.replace('http://', 'https://');
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    // UnitechPay requires the local 9-digit phone number (e.g. 771234567)
    const customerNumber = cleanPhone.length >= 9 
      ? cleanPhone.substring(cleanPhone.length - 9) 
      : cleanPhone;

    const payload = {
      amount: Math.ceil(amount), // must be integer
      reference: orderId,
      description: description || `Facture commande #${orderId}`,
      customer_number: customerNumber,
      customer_phone: customerPhone,
      customer_name: customerName,
      callback_success: `${runtimeAppUrl}/api/payments/success?order=${orderId}`,
      callback_cancel: `${runtimeAppUrl}/api/payments/cancel?order=${orderId}`,
      webhook_url: `${runtimeAppUrl}/api/payments/webhook`,
      callback_url: `${runtimeAppUrl}/api/payments/webhook`
    };

    console.log(`Calling UnitechPay ${action} with payload:`, JSON.stringify(payload));

    const response = await fetch(`${UNITECHPAY_API_URL}?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`UnitechPay API HTTP error ${response.status}:`, errorText);
      return { success: 0, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    if (!data.success) {
      console.error('UnitechPay API error response:', data);
      return { success: 0, error: data.message || 'Payment creation failed' };
    }

    const resData = data.data || data;
    const redirectUrl = resData.payment_url || resData.deep_link || resData.redirect_url;

    if (!redirectUrl) {
      console.error('UnitechPay API returned success but no redirect URL:', data);
      return { success: 0, error: 'No redirect URL returned' };
    }

    return {
      success: 1,
      redirect_url: redirectUrl,
      reference: resData.reference,
      transaction_id: resData.transaction_id
    };
  } catch (error) {
    console.error('UnitechPay payment creation failed:', error);
    return { success: 0, error: error.message };
  }
}

export function verifyWebhookSignature(rawBody, signature) {
  const apiKey = process.env.UNITECHPAY_API_KEY;
  if (!apiKey) {
    console.error('UNITECHPAY_API_KEY non configurée.');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', apiKey)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    return expectedSignature === signature;
  }
}
