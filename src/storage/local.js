import { jQuery, createStorageAPI } from "./base.js";

// Initialize namespace
jQuery.beeico = jQuery.beeico || {};
jQuery.beeico.storage = jQuery.beeico.storage || {};

// Create localStorage API
jQuery.beeico.storage.local = createStorageAPI( localStorage, "localStorage" );

export { jQuery };
