import { jQuery, createStorageAPI } from "./base.js";

// Create localStorage API
jQuery.beeico.storage.local = createStorageAPI( window.localStorage, "localStorage" );

export { jQuery };
