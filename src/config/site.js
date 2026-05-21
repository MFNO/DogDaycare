export const site = {
  businessName: "Nancy's Bark and Recreation",

  tagline: "Safe play, restful naps, and tail-wagging fun while you are away.",

  heroCtaLabel: "Book a Stay",

  aboutText: `Hi, I'm Nancy, a reliable and caring dog sitter who treats every pup like part of the family. I've been married to my husband for 17 years, and we have two children in middle and high school, so our home is full of energy, responsibility, and lots of love.

I'm also a proud dog mom to three poodle mixes—Brinkley, Luna, and Lizzie—so I understand firsthand how important it is to find someone you trust with your pets. Whether your dog enjoys playtime or simply relaxing with company, I make sure they feel safe, comfortable, and well cared for.

Before focusing on dog care full-time, I was a teacher and also worked in companion care with the elderly. Those experiences taught me patience, attentiveness, and the importance of creating a calm, dependable environment—qualities I bring to every dog I care for.

As a stay-at-home dog mom, I have the flexibility and time to give your pet the attention they deserve. You can count on regular updates, clear communication, and lots of love while you're away.`,

  hours: ["Monday - Sunday: 24/7"],

  pricing: [
    "$15 per half day (4 hours or less)",
    "$25 per day (up to 8 hours)",
    "Overnight: $40 per night (drop off after 12pm and pick up before 12pm or addtional monies may be requested)",
    "Each additional dog overnight: +$20 per night",
  ],

  dogRequirements: [
    "Friendly",
    "Non-shedding",
    "Hypoallergenic",
    "Under 30 lbs",
  ],

  location: "Davidson/Mooresville border",

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

  reviews: [
    {
      quote:
        'When I tell my dogs they are going to "camp Nancy\'s" they jump into the car with glee!  Nancy is my favorite choice for doggie daycare or overnight pet sitting. She treats my pups as if they were her own, in a loving and safe environment.  Her home is the next best thing to yours…you and your pets will not be disappointed!',
      author: "Melissa M",
    },
    {
      quote:
        "We absolutely love Nancy! Our pups are so spoiled and loved every time they stay — it's truly like going to grandma's house. I think they like her more than us! We never have to worry because we know they're getting the best care, attention, and cuddles. You can tell how much she genuinely loves animals, and our pets are always so happy and comfortable there. We're beyond grateful to have found someone we trust so much!",
      author: "Christie H",
    },
  ],

  sections: {
    about: "About me",
    services: "Services",
    gallery: "Gallery",
    reviews: "Reviews",
    contact: "Contact & booking",
  },

  contactIntro:
    "Tell us about your dog and we will follow up with availability.",

  contactForm: {
    nameLabel: "Your name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    messageLabel: "Message",
    messagePlaceholder:
      "Dog’s name, dates or times you need, and anything else we should know.",
    /** Empty string hides the download link. */
    contractDownloadUrl:
      "https://nancys-bark-and-recreation.s3.us-east-1.amazonaws.com/contract/Contract.docx",
    contractDownloadLabel: "Download contract (.docx)",
    contractUploadLabel: "Signed contract (optional)",
    contractUploadHint:
      "If you upload a completed .docx, we will attach it to the message we receive.",
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
    { key: "reviews", label: "Reviews" },
    { key: "contact", label: "Contact" },
  ],
};
