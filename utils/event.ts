// Everything event-specific lives here, so the next edition is a one-file change.
export const EVENT = {
  name: "Littlepreneurs",
  edition: "Season 02 · Christmas Special",
  editionShort: "Season 02",
  presenter: "Late Checkout + Dolce Amore",
  dateLong: "Sunday, 20 December 2026",
  dateShort: "20 December",
  hours: "12–5 PM",
  venue: "T-Works",
  city: "Hyderabad",
  ages: "4–16",
  // Flip to false to close the public form. This also controls whether the
  // public (unauthenticated) create endpoint is reachable — see proxy.ts.
  // Staff can always register from /onboard.
  registrationOpen: true,
  closedTitle: "Registrations have closed.",
  closedNote: "Walk in on the day and meet us at the T-Works reception, and we'll help you from there.",
  guestInvite: "Come see what little founders can build.",
  stallInvite: "A table for their ideas. A moment they'll own.",
  // Table pricing from the brochure (shown on the stall form for reference only).
  prices: { single: "₹8,000", shared: "₹10,000" },
  // Stall categories. Two children sharing a table must be in the same category.
  categories: [
    "Food & beverages",
    "Art & craft",
    "Books & stories",
    "Toys & games",
    "Fashion & accessories",
    "Stationery & gifting",
    "Plants & home décor",
    "Services & experiences",
    "Other",
  ],
  minAge: 4,
  maxAge: 16,
  instagram: "@littlepreneurs.kids",
} as const;
