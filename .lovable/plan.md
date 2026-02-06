

# Plan: Enable Stripe Coupon Codes at Checkout

## Current Issue

The `create-payment` edge function creates a Stripe Checkout session, but it doesn't allow users to enter promotion/coupon codes. The checkout page won't show the "Add promotion code" field.

## Solution

Add `allow_promotion_codes: true` to the checkout session configuration. This is a one-line change.

---

## Implementation

### File: `supabase/functions/create-payment/index.ts`

Update the `stripe.checkout.sessions.create()` call to include the promotion codes option:

```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  customer_email: customerId ? undefined : sanitizedEmail,
  line_items: [
    {
      price: "price_1SnHUGI6zpynUGIHog1UzIhu",
      quantity: 1,
    },
  ],
  mode: "payment",
  allow_promotion_codes: true,  // ← ADD THIS LINE
  success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(sanitizedEmail)}`,
  cancel_url: `${req.headers.get("origin")}/payment-canceled`,
  metadata: {
    email: sanitizedEmail,
  },
});
```

---

## What This Enables

Once deployed, users will see an "Add promotion code" link on the Stripe Checkout page. They can enter the coupon code you created (with 100% off), and the price will update to £0.00 before they complete checkout.

---

## Verification Steps

1. After the change is deployed, go through the payment flow
2. On the Stripe Checkout page, look for "Add promotion code" link
3. Enter your 100% off coupon code
4. Confirm the total changes to £0.00
5. Complete the checkout and verify the user gets lifetime access

