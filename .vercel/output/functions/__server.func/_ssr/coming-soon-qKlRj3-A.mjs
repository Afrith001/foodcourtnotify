import "../_libs/firebase.mjs";
import { c as signOut } from "../_libs/firebase__auth.mjs";
import { o as getFirebaseAuth } from "./firebase-BQC3oBr4.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-l9FdWCHm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coming-soon-qKlRj3-A.js
var import_jsx_runtime = require_jsx_runtime();
function ComingSoon() {
	const navigate = useNavigate();
	const handleLogout = async () => {
		await signOut(getFirebaseAuth());
		navigate({ to: "/auth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Coming soon"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4",
				children: "This role's dashboard is coming soon. Please contact your shop owner for access."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleLogout,
					variant: "outline",
					children: "Logout"
				})
			})
		]
	});
}
//#endregion
export { ComingSoon as component };
