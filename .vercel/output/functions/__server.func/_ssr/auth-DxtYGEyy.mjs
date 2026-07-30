import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as i18n_default } from "./i18n-BnUAatYi.mjs";
import { n as objectType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DxtYGEyy.js
var $$splitComponentImporter = () => import("./auth-BbohZkkI.mjs");
var searchSchema = objectType({ mode: enumType(["signin", "signup"]).optional() });
var Route = createFileRoute("/auth")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: `${i18n_default.t("common.signIn")} · ${i18n_default.t("common.appName")}` }, {
		name: "description",
		content: "Sign in to your shop dashboard or create a new shop on FoodCourtNotify."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
