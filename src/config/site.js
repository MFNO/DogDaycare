/**
 * Single source of truth for business content.
 * // TODO: Replace all placeholder values below with real information for your business.
 */

export const site = {
  // TODO: business display name
  businessName: 'Paws & Play Dog Daycare',

  // TODO: short tagline under the hero title
  tagline: 'Safe play, restful naps, and tail-wagging fun while you are away.',

  // TODO: primary CTA label
  heroCtaLabel: 'Book a Stay',

  // TODO: about paragraph — describe your daycare personality and care philosophy
  aboutText:
    'We are a cozy, family-run daycare where dogs socialize in supervised groups, nap in quiet spaces, and go home tired and happy. Our team loves pups like our own.',

  // TODO: hours of operation (lines shown as-is)
  hours: ['Monday–Friday: 7:00 AM – 6:00 PM', 'Saturday: 8:00 AM – 4:00 PM', 'Sunday: Closed'],

  // TODO: address or service area description
  location: '123 Maple Street, Hometown, ST 00000 — serving the metro area within 15 miles.',

  // TODO: public phone
  phone: '(555) 123-4567',

  // TODO: public email
  email: 'hello@pawsandplay.example',

  // TODO: social profile URLs (replace with real links or leave as #)
  social: {
    facebook: 'https://example.com/facebook',
    instagram: 'https://example.com/instagram',
    yelp: 'https://example.com/yelp',
  },

  // TODO: service cards — title + description for each offering
  services: [
    {
      title: 'Full-day daycare',
      description: 'Supervised play groups, rest periods, and plenty of fresh water all day.',
    },
    {
      title: 'Half-day daycare',
      description: 'A shorter stay for pups who need social time without a full day away from home.',
    },
    {
      title: 'Boarding',
      description: 'Overnight care with comfortable sleeping areas and the same loving staff.',
    },
    {
      title: 'Grooming add-on',
      description: 'Bath, brush-out, and nail trim — schedule alongside daycare or boarding.',
    },
    {
      title: 'Puppy program',
      description: 'Gentle introductions and age-appropriate play for dogs under six months.',
    },
    {
      title: 'Senior lounge',
      description: 'Quieter spaces and softer bedding for older dogs who prefer a calmer pace.',
    },
  ],

  // TODO: section headings shown on the page
  sections: {
    about: 'About us',
    services: 'Services',
    gallery: 'Gallery',
    contact: 'Contact & booking',
  },

  // TODO: short line above the contact CTA
  contactIntro:
    'Tell us about your dog and we will follow up with availability.',

  // TODO: published Google Form URL (Share → Get link → Anyone with the link)
  intakeFormUrl: 'https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform',

  // TODO: label for the intake button
  intakeFormButtonLabel: 'Open intake form',

  // TODO: navigation labels (must match section IDs in App.jsx)
  navItems: [
    { key: 'hero', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'services', label: 'Services' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'contact', label: 'Contact' },
  ],
};
