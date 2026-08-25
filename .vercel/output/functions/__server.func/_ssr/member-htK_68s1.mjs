import { r as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as authMiddleware } from "./middleware-DaOqJC0Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/member-htK_68s1.js
var getMemberHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("88b514ea38db5c9dbfb29261e9737a6eeb475ae3139d025a469a6639e9d4870d"));
var memberCheckin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("55bb6692fbd4982fae682edfb176c37a243f950c43342c690f1ad3beac863396"));
var getMemberProgram = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("71c1c835c4da84c7ecdbedd7b83bc6d23167435b9ce0df3c57d7d257281db17d"));
var listProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2a08bb3f5d215a73c92e3e3b6c2d6937a558640d1b562cd3e92ab4f12305957a"));
var addProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("756b46a3d509e5124192b7b9a5f192f2739642804d783d139dc111f565f65257"));
var listTrainerClients = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e8976ce0ab6591e3eee8a2cb84c5eb01859b67e5fdaac6fdd8f781795adfa90e"));
var saveMemberProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("ed4fde08a596408ba4d26d0dd5ed487af14001db3401a5cc76495d68a685dffd"));
var trainerCheckin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("93211f303e44c590569580e72103856ed676dafb3d52c0ab4f30c8bda2ce8fe3"));
var getMemberProgramFor = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("a17e9891f19e7b17da25c0d0007e0025f615bfcb6ed98b9d964821b5d5abca70"));
//#endregion
export { listProgress as a, saveMemberProgram as c, getMemberProgramFor as i, trainerCheckin as l, getMemberHome as n, listTrainerClients as o, getMemberProgram as r, memberCheckin as s, addProgress as t };
