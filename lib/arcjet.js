import arcjet, { tokenBucket } from "@arcjet/next";

// Arcjet rate limiter using a token-bucket algorithm.
// Each user gets a bucket that refills over time; each protected
// request consumes tokens. When the bucket is empty, requests are denied.
const aj = arcjet({
  key: process.env.ARCJET_KEY, // set this in your .env
  characteristics: ["userId"], // rate-limit per authenticated user
  rules: [
    tokenBucket({
      mode: "LIVE", // "LIVE" enforces; "DRY_RUN" only logs
      refillRate: 10, // tokens added...
      interval: 3600, // ...every 3600 seconds (1 hour)
      capacity: 10, // max tokens a user can hold (max burst)
    }),
  ],
});

export default aj;