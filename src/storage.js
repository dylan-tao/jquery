import { jQuery } from "./core.js";

// beeico.storage namespace initialization
jQuery.beeico = jQuery.beeico || {};
jQuery.beeico.storage = {
	local: {},
	session: {}
};

// Export for compatibility
export { jQuery };
