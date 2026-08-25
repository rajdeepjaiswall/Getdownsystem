export const APP_NAME = "Getdown Fitness";
export const FOUNDATION = "Get Down Foundation";
export const FOUNDATION_CITY = "Prayagraj";
export const WHATSAPP_LINK =
  "https://wa.me/919335123456?text=" +
  encodeURIComponent("Hi, I want Getdown Fitness for my gym.");
export const SUPPORT_EMAIL = "hello@getdownfitness.in";

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 2500,
    memberCap: 50,
    popular: false,
    enterprise: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: 4500,
    memberCap: 100,
    popular: true,
    enterprise: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 6000,
    memberCap: 150,
    popular: false,
    enterprise: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    memberCap: 9999,
    popular: false,
    enterprise: true,
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];

export const PLAN_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<
  PlanId,
  (typeof PLANS)[number]
>;

export const ROLES = [
  "super_admin",
  "gym_owner",
  "staff",
  "trainer",
  "member",
] as const;
export type Role = (typeof ROLES)[number];

export const DEMO_GYM_ID = "gym_shakti";
export const DEMO_GYM_SLUG = "shakti-fitness";

export const DEFAULT_AMENITIES = [
  { name: "Air conditioning", icon: "wind" },
  { name: "Changing rooms", icon: "door-open" },
  { name: "Lockers", icon: "lock" },
  { name: "Drinking water", icon: "droplets" },
  { name: "Parking", icon: "car" },
  { name: "Shower", icon: "shower-head" },
  { name: "Wi-Fi", icon: "wifi" },
  { name: "Ladies hours", icon: "clock" },
  { name: "Personal training", icon: "user" },
  { name: "Group classes", icon: "users" },
  { name: "Steam room", icon: "cloud" },
  { name: "Juice bar", icon: "cup-soda" },
];

export const DEFAULT_EQUIPMENT = [
  { name: "Treadmills", icon: "activity" },
  { name: "Dumbbells", icon: "dumbbell" },
  { name: "Barbells & plates", icon: "weight" },
  { name: "Cable machines", icon: "stretch-horizontal" },
  { name: "Benches", icon: "armchair" },
  { name: "Squat rack", icon: "columns-3" },
  { name: "Spin bikes", icon: "bike" },
  { name: "Yoga mats", icon: "waves" },
  { name: "Kettlebells", icon: "circle" },
  { name: "Smith machine", icon: "box" },
];

export const DEFAULT_MEMBERSHIP_PLANS = [
  { name: "Monthly", durationDays: 30, price: 1500 },
  { name: "Quarterly", durationDays: 90, price: 4000 },
  { name: "Yearly", durationDays: 365, price: 12000 },
];
