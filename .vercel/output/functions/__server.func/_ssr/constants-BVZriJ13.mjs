//#region node_modules/.nitro/vite/services/ssr/assets/constants-BVZriJ13.js
var APP_NAME = "Getdown Fitness";
var FOUNDATION = "Get Down Foundation";
var FOUNDATION_CITY = "Prayagraj";
var WHATSAPP_LINK = "https://wa.me/919335123456?text=" + encodeURIComponent("Hi, I want Getdown Fitness for my gym.");
var PLANS = [
	{
		id: "starter",
		name: "Starter",
		price: 2500,
		memberCap: 50,
		popular: false,
		enterprise: false
	},
	{
		id: "growth",
		name: "Growth",
		price: 4500,
		memberCap: 100,
		popular: true,
		enterprise: false
	},
	{
		id: "pro",
		name: "Pro",
		price: 6e3,
		memberCap: 150,
		popular: false,
		enterprise: false
	},
	{
		id: "enterprise",
		name: "Enterprise",
		price: null,
		memberCap: 9999,
		popular: false,
		enterprise: true
	}
];
Object.fromEntries(PLANS.map((p) => [p.id, p]));
var DEFAULT_AMENITIES = [
	{
		name: "Air conditioning",
		icon: "wind"
	},
	{
		name: "Changing rooms",
		icon: "door-open"
	},
	{
		name: "Lockers",
		icon: "lock"
	},
	{
		name: "Drinking water",
		icon: "droplets"
	},
	{
		name: "Parking",
		icon: "car"
	},
	{
		name: "Shower",
		icon: "shower-head"
	},
	{
		name: "Wi-Fi",
		icon: "wifi"
	},
	{
		name: "Ladies hours",
		icon: "clock"
	},
	{
		name: "Personal training",
		icon: "user"
	},
	{
		name: "Group classes",
		icon: "users"
	},
	{
		name: "Steam room",
		icon: "cloud"
	},
	{
		name: "Juice bar",
		icon: "cup-soda"
	}
];
var DEFAULT_EQUIPMENT = [
	{
		name: "Treadmills",
		icon: "activity"
	},
	{
		name: "Dumbbells",
		icon: "dumbbell"
	},
	{
		name: "Barbells & plates",
		icon: "weight"
	},
	{
		name: "Cable machines",
		icon: "stretch-horizontal"
	},
	{
		name: "Benches",
		icon: "armchair"
	},
	{
		name: "Squat rack",
		icon: "columns-3"
	},
	{
		name: "Spin bikes",
		icon: "bike"
	},
	{
		name: "Yoga mats",
		icon: "waves"
	},
	{
		name: "Kettlebells",
		icon: "circle"
	},
	{
		name: "Smith machine",
		icon: "box"
	}
];
var DEFAULT_MEMBERSHIP_PLANS = [
	{
		name: "Monthly",
		durationDays: 30,
		price: 1500
	},
	{
		name: "Quarterly",
		durationDays: 90,
		price: 4e3
	},
	{
		name: "Yearly",
		durationDays: 365,
		price: 12e3
	}
];
//#endregion
export { FOUNDATION as a, WHATSAPP_LINK as c, DEFAULT_MEMBERSHIP_PLANS as i, DEFAULT_AMENITIES as n, FOUNDATION_CITY as o, DEFAULT_EQUIPMENT as r, PLANS as s, APP_NAME as t };
