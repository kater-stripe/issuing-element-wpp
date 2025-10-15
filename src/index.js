import {
  loadStripe,
  StripeIssuingAddToWalletButtonElement,
  StripeIssuingAddToWalletButtonElementOptions,
} from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_ACCOUNT = process.env.STRIPE_ACCOUNT;
const CARD_ID = process.env.CARD_ID;

const STYLE = {
  base: {
    color: "white",
    fontSize: "14px",
    lineHeight: "24px",
  },
};

// HACK: this should live on the server, but for now
// we make the request from the client.
const getEphemeralKey = async (nonce) => {
  const response = await fetch("https://api.stripe.com/v1/ephemeral_keys", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Stripe-Version": "2025-06-30.basil",
    },
    body: `issuing_card=${CARD_ID}&nonce=${nonce}`,
  });

  const data = await response.json();
  console.log("ephemeral data", data);
  return data; // Added return statement
};

const getIssuingCard = async (CARD_ID) => {
  const response = await fetch(
    `https://api.stripe.com/v1/issuing/cards/${CARD_ID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        // "Stripe-Account": STRIPE_ACCOUNT,
        "Stripe-Version": "2025-06-30.basil",
      },
    }
  );
  return response.json();
};

const renderCard = async () => {
  /* eslint-disable no-undef */
  const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
  /* eslint-enable no-undef */
  const elements = stripe.elements({
    fonts: [
      {
        cssSrc: "src/fonts.css",
      },
    ],
  });

  // //GA-ed elements do not work with betas
  // const stripe_beta = Stripe(STRIPE_PUBLISHABLE_KEY, {
  //   betas: ["issuing_add_to_wallet_button_element_1", "issuing_elements_2"],
  // });
  // console.log(stripe_beta);

  // if (!stripe_beta) {
  //   console.error("Failed to load Stripe");
  //   return;
  // }

  // const elements_beta = stripe_beta({
  //   fonts: [
  //     {
  //       cssSrc: "src/fonts.css",
  //     },
  //   ],
  // });

  const nonceResult = await stripe.createEphemeralKeyNonce({
    issuingCard: CARD_ID,
  });

  console.log("nonceResult", nonceResult);

  const ephemeralKey = await getEphemeralKey(nonceResult.nonce);
  // console.log("ephemeralKey", ephemeralKey);
  const issuing_card = await getIssuingCard(CARD_ID);

  // const cardholder_name = `${issuing_card.cardholder.individual.first_name} ${issuing_card.cardholder.individual.last_name}`;

  //Hardcoding for the demo
  const cardholder_name = "John Doe";

  const name = document.getElementById("cardholder-name");
  const number = elements.create("issuingCardNumberDisplay", {
    issuingCard: CARD_ID,
    nonce: nonceResult.nonce,
    ephemeralKeySecret: ephemeralKey.secret,
    style: STYLE,
  });
  const expiry = elements.create("issuingCardExpiryDisplay", {
    issuingCard: CARD_ID,
    nonce: nonceResult.nonce,
    ephemeralKeySecret: ephemeralKey.secret,
    style: STYLE,
  });
  const cvc = elements.create("issuingCardCvcDisplay", {
    issuingCard: CARD_ID,
    nonce: nonceResult.nonce,
    ephemeralKeySecret: ephemeralKey.secret,
    style: STYLE,
  });
  const pin = elements.create("issuingCardPinDisplay", {
    issuingCard: CARD_ID,
    nonce: nonceResult.nonce,
    ephemeralKeySecret: ephemeralKey.secret,
    style: STYLE,
  });

  name.textContent = cardholder_name;
  number.mount("#card-number");
  expiry.mount("#card-expiry");
  cvc.mount("#card-cvc");
  pin.mount("#card-pin");
  // addToWalletButton.mount("#add-to-wallet-button");
};

//Add to Wallet

const renderWalletButton = async () => {
  //GA-ed elements do not work with betas
  const stripe_beta = await loadStripe(STRIPE_PUBLISHABLE_KEY, {
    betas: ["issuing_add_to_wallet_button_element_1", "issuing_elements_2"],
  });

  const elements_beta = stripe_beta.elements({
    fonts: [
      {
        cssSrc: "src/fonts.css",
      },
    ],
  });

  const nonceResult_beta = await stripe_beta.createEphemeralKeyNonce({
    issuingCard: CARD_ID,
  });

  console.log("nonceResult", nonceResult_beta);

  const ephemeralKey_beta = await getEphemeralKey(nonceResult_beta.nonce);
  console.log("Apple ephemeralKey", ephemeralKey_beta);

  // // Create Add to Wallet button options
  const addToWalletOptions = {
    nonce: nonceResult_beta.nonce,
    ephemeralKeySecret: ephemeralKey_beta.secret,
    issuingCard: CARD_ID,
    buttonHeight: 40,
    wallet: "apple", // or "google" for Google Wallet
  };

  // @ts-expect-error issuingAddToWalletButton is in beta
  const addToWalletButton = elements_beta.create(
    "issuingAddToWalletButton",
    addToWalletOptions
  ); // as IssuingAddToAppleWalletButtonElement;

  // Register event listeners
  addToWalletButton.on("click", () => {
    console.log("Add to Wallet button clicked");
  });

  addToWalletButton.on("success", () => {
    console.log("Card successfully added to wallet");
  });

  addToWalletButton.on("error", (event) => {
    console.error("Error adding card to wallet:", event);
  });

  addToWalletButton.mount("#add-to-wallet-button");
};

renderCard();
renderWalletButton();
