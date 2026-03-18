import { jQuery, createStorageAPI } from "./base.js";

// Create sessionStorage API
jQuery.beeico.storage.session = createStorageAPI( window.sessionStorage, "sessionStorage" );

export { jQuery };
