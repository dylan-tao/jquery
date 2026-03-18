import { jQuery } from "../core.js";

// Initialize beeico.storage namespace
jQuery.beeico = jQuery.beeico || {};
jQuery.beeico.storage = jQuery.beeico.storage || {};

const STORAGE_PREFIX = "beeico_storage_";

/**
 * Create a storage API wrapper for localStorage or sessionStorage
 * @param {Storage} storage - The native storage object (localStorage or sessionStorage)
 * @param {string} type - Storage type name for error messages
 * @returns {Object} The storage API object
 */
function createStorageAPI( storage, type ) {
	var _isSupported = null;

	function getKey( key ) {
		return STORAGE_PREFIX + key;
	}

	return {
		supported: function() {
			if ( _isSupported === null ) {
				_isSupported = typeof storage !== "undefined" &&
					storage !== null &&
					( function() {
						try {
							var testKey = STORAGE_PREFIX + "__test__";
							storage.setItem( testKey, "test" );
							storage.removeItem( testKey );
							return true;
						} catch ( e ) {
							return false;
						}
					} )();
			}
			return _isSupported;
		},

		enable: function() {
			if ( this.supported() ) {
				return true;
			}
			window.alert( "Please enable " + type + " in your browser settings.\n\n" +
				"Chrome: Settings > Privacy and security > Site Settings > Storage\n" +
				"Firefox: Options > Privacy & Security\n" +
				"Edge: Settings > Cookies and site permissions > Storage" );
			return false;
		},

		set: function( key, value ) {
			if ( !this.supported() ) {
				return false;
			}
			try {
				var data = JSON.stringify( {
					value: value,
					timestamp: Date.now()
				} );
				storage.setItem( getKey( key ), data );
				return true;
			} catch ( e ) {
				return false;
			}
		},

		get: function( key ) {
			if ( !this.supported() ) {
				return null;
			}
			try {
				var data = storage.getItem( getKey( key ) );
				return data ? JSON.parse( data ).value : null;
			} catch ( e ) {
				return null;
			}
		},

		remove: function( key ) {
			if ( !this.supported() ) {
				return false;
			}
			try {
				storage.removeItem( getKey( key ) );
				return true;
			} catch ( e ) {
				return false;
			}
		},

		clear: function() {
			if ( !this.supported() ) {
				return false;
			}
			try {
				var prefix = STORAGE_PREFIX,
					i = storage.length,
					itemKey;
				while ( i-- ) {
					itemKey = storage.key( i );
					if ( itemKey && itemKey.indexOf( prefix ) === 0 ) {
						storage.removeItem( itemKey );
					}
				}
				return true;
			} catch ( e ) {
				return false;
			}
		},

		keys: function() {
			if ( !this.supported() ) {
				return [];
			}
			try {
				var keys = [],
					prefix = STORAGE_PREFIX,
					i = storage.length,
					itemKey;
				while ( i-- ) {
					itemKey = storage.key( i );
					if ( itemKey && itemKey.indexOf( prefix ) === 0 ) {
						keys.push( itemKey.substring( prefix.length ) );
					}
				}
				return keys.reverse();
			} catch ( e ) {
				return [];
			}
		}
	};
}

export { STORAGE_PREFIX, createStorageAPI };
export { jQuery };
