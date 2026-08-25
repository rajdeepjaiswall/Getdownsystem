import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/god-C5mhhAiC.js
var getGodOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4b6213d66146c4830453c0ef57356e9deb2845d5a6acd0d4bfaa57ba27dcccac"));
var listGodGyms = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d = {}) => d).handler(createSsrRpc("36ea4b41fe79ed6f3f9e90dfe2caaf76cdf6c3d2e0564c3fa0f5446aff8dbf69"));
var getGodGym = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("0eb59207f3adc54d053c1d72853aaa2ff830da7f01168c3636358d2308d3a956"));
var updateGodGym = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("8d82cfc3217c8cfc55cdb2ae014704552218e7ce7e8e040580b0c112c1b8c684"));
var listPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d = {}) => d).handler(createSsrRpc("7a38ba6f7bae5f39da81b5912240b51ea3dcc3109206d2cb2a6135d4580a0278"));
var confirmPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5d7c8a292bc6360c44c1d473e912699fd9421ba3abb28c17c32c9dbaf17926f2"));
var listLeads = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9967e55a9550de7a4682719830e117bf72e06b16986f04fd5d0965415668238f"));
var updateLead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("52d7ead357a7c4f32cbbc7b288c1a11e23b779eb5909f76b5f42bc6ae50a4042"));
var getPaymentSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("db0900396c923e1617ad39828cc0790d623bdce2583b90cce21a54389813af9c"));
var savePaymentSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("fee314b4bc51382aab12a4e8ded2a1a2cbc3399762c641a77b9d13ed39a31dd0"));
var listPlanCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("eaca32a2a80744da8aa6a855150612a345180e4f30d535c9f19a022809f37541"));
var savePlanCatalog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("94ab98dfdb691368b6044e211b79e0ad0357f86b44498c4526ad2bec776c99ef"));
var getPublicCheckout = createServerFn({ method: "GET" }).handler(createSsrRpc("adb13cf41037ea4693764b2309011e7edd7125e8be9c9eda9cc8f29c1347923d"));
var markManualPaid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("e7d3666a8a4a9a11bf0d478ab88f64922f550a8f776d4fb4956b92f83a3819aa"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("e3fc831e8ee46fc0d2b0b6c2b0f89b417ee60eefdcc2ad423de64fc4c88df88a"));
//#endregion
export { getPublicCheckout as a, listPayments as c, savePaymentSettings as d, savePlanCatalog as f, getPaymentSettings as i, listPlanCatalog as l, updateLead as m, getGodGym as n, listGodGyms as o, updateGodGym as p, getGodOverview as r, listLeads as s, confirmPayment as t, markManualPaid as u };
