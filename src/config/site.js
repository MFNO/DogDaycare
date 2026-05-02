export const site = {
  businessName: "Nancy's Bark and Recreation",

  tagline: "Safe play, restful naps, and tail-wagging fun while you are away.",

  heroCtaLabel: "Book a Stay",

  aboutText:
    "We are a cozy, family-run daycare where dogs socialize in supervised groups, nap in quiet spaces, and go home tired and happy. Our team loves pups like our own.",

  hours: ["Monday - Sunday: 24/7"],

  location: "211 Logan Crossing Drive, Davidson, NC 28036",

  email: "njvteach26@yahoo.com",

  social: {
    facebook: "https://example.com/facebook",
    instagram: "https://example.com/instagram",
    yelp: "https://example.com/yelp",
  },

  services: [
    {
      title: "Full-day daycare",
      description:
        "Supervised play groups, rest periods, and plenty of fresh water all day.",
    },
    {
      title: "Half-day daycare",
      description:
        "A shorter stay for pups who need social time without a full day away from home.",
    },
    {
      title: "Boarding",
      description:
        "Overnight care with comfortable sleeping areas and the same loving staff.",
    },
  ],

  sections: {
    about: "About me",
    services: "Services",
    gallery: "Gallery",
    contact: "Contact & booking",
  },

  contactIntro:
    "Tell us about your dog and we will follow up with availability.",

  contactForm: {
    nameLabel: "Your name",
    emailLabel: "Email",
    messageLabel: "Message",
    messagePlaceholder:
      "Dog’s name, dates or times you need, and anything else we should know.",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    successMessage:
      "Thanks — we received your message and will get back to you soon.",
    sendAnotherLabel: "Send another message",
    apiMissingHint:
      "Set VITE_CONTACT_API_URL in .env to your API URL, then restart the dev server (Vite only reads env at startup).",
  },

  navItems: [
    { key: "hero", label: "Home" },
    { key: "about", label: "About" },
    { key: "services", label: "Services" },
    { key: "gallery", label: "Gallery" },
    { key: "contact", label: "Contact" },
  ],
};
