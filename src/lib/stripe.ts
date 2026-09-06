import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
