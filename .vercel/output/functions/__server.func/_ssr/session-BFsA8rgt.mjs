import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-BFsA8rgt.js
var getMyContext = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f281262ab680a9470daf98472375bf3ae48d177b4aa5423552422029ee557b2e"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("02e090d156a08e55d9ea1d35040aa84c208e09d70bcd04b404e2e031c93a0e51"));
var startImpersonation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("b9129db2e2f6b92e92f82d684d3366f42c4402ffa2865531634c0cde74912dc9"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("f73486b967c4d7ccaebcfcba3cbf2844d27a3aca062a539c28d3ebc845127a31"));
//#endregion
export { startImpersonation as n, getMyContext as t };
