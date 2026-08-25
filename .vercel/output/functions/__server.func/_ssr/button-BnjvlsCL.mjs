import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-BRSlrI9s.mjs";
import { _ as require_jsx_runtime, p as Slot } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BnjvlsCL.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,color,border-color,transform,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-white hover:bg-primary-hover",
			secondary: "bg-primary-tint text-primary hover:bg-primary/15 border border-transparent",
			outline: "border border-border bg-surface text-text hover:bg-primary-tint",
			ghost: "text-text-muted hover:bg-primary-tint hover:text-text",
			clay: "bg-accent-clay text-white hover:bg-accent-clay/90",
			danger: "bg-danger text-white hover:bg-danger/90",
			link: "text-primary underline-offset-4 hover:underline rounded-sm px-0"
		},
		size: {
			default: "h-11 px-5",
			sm: "h-9 px-3.5 text-sm rounded-md",
			lg: "h-12 px-6 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
export { Button as t };
