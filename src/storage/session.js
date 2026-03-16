import { jQuery, createStorageAPI } from "./base.js";

// Initialize namespace
jQuery.beeico = jQuery.beeico || {};
jQuery.beeico.storage = jQuery.beeico.storage || {};

// Create sessionStorage API
jQuery.beeico.storage.session = createStorageAPI( sessionStorage, "sessionStorage" );

export { jQuery };
