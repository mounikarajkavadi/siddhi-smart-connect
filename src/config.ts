export const site = {
  name: "siddhi-E-learn",
  tagline: "every student can learn",
  founder: "Keerthana Raj Kavadi",
  whatsappNumber: "918125105915",
  phoneDisplay: "+91 8125105915",
  email: "mkavadi@crimson.ua.edu",
  instagram: "https://instagram.com/", // <<ADD_INSTAGRAM_LINK>>
};

export const waLink = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const genericMessage =
  "Hi siddhi-E-learn! I'd like to know more about your courses.";

export const courses = [
  {
    id: "upsc",
    title: "UPSC Foundation",
    kicker: "Civil Services",
    description:
      "Structured preparation for UPSC aspirants — clear concepts, current affairs and guidance.",
    price: "₹499",
    period: "/ month",
    message:
      "Hi siddhi-E-learn! I'm interested in the UPSC Foundation course (₹499/month). Please share the details.",
  },
  {
    id: "neet",
    title: "NEET Preparation",
    kicker: "Medical Entrance",
    description:
      "Concept-first NEET coaching covering Physics, Chemistry and Biology fundamentals.",
    price: "₹499",
    period: "/ month",
    message:
      "Hi siddhi-E-learn! I'm interested in the NEET Preparation course (₹499/month). Please share the details.",
  },
  {
    id: "current-affairs",
    title: "Current Affairs & Test Series",
    kicker: "Coming soon",
    description:
      "Weekly current-affairs digests and timed mock tests with detailed solutions.",
    price: "Coming soon",
    period: "",
    message:
      "Hi siddhi-E-learn! I'm interested in the Current Affairs & Test Series. Please share the details.",
  },
  {
    id: "foundation",
    title: "Foundation Basics (Class 11–12)",
    kicker: "Coming soon",
    description:
      "NCERT-first fundamentals to build a strong base before exam preparation begins.",
    price: "Coming soon",
    period: "",
    message:
      "Hi siddhi-E-learn! I'm interested in Foundation Basics (Class 11–12). Please share the details.",
  },
];

export const topics = [
  "UPSC Prelims",
  "UPSC Mains",
  "Polity",
  "History",
  "Geography",
  "Economy",
  "Current Affairs",
  "NEET Physics",
  "NEET Chemistry",
  "NEET Biology",
  "NCERT Foundation",
  "Mock Tests",
  "Doubt Sessions",
];

export const plans = [
  {
    name: "Single Course",
    price: "₹499",
    period: "/ month",
    popular: false,
    features: [
      "Access to one course (UPSC or NEET)",
      "All video lessons + notes",
      "WhatsApp doubt support",
    ],
    message:
      "Hi siddhi-E-learn! I'd like to enroll in the Single Course plan (₹499/month).",
  },
  {
    name: "Both Courses",
    price: "₹899",
    period: "/ month",
    popular: true,
    features: [
      "Access to both UPSC & NEET",
      "All lessons + notes",
      "Priority doubt support",
    ],
    message:
      "Hi siddhi-E-learn! I'd like to enroll in the Both Courses plan (₹899/month).",
  },
  {
    name: "3-Month Saver",
    price: "₹1299",
    period: "/ 3 months",
    popular: false,
    features: [
      "One course for 3 months",
      "Discounted price",
      "All lessons + notes",
    ],
    message:
      "Hi siddhi-E-learn! I'd like to enroll in the 3-Month Saver plan (₹1299).",
  },
];
