import { jQuery } from "../core.js";

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
			alert( "请开启浏览器 " + type + " 权限\n\n设置路径：\n" +
				"Chrome: 设置 > 隐私和安全 > 网站设置 > 存储\n" +
				"Firefox: 选项 > 隐私与安全\n" +
				"Edge: 设置 > Cookies 和网站权限 > 存储" );
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
				console.error( "Storage set failed:", e );
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
				console.error( "Storage get failed:", e );
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
				console.error( "Storage remove failed:", e );
				return false;
			}
		},

		clear: function() {
			if ( !this.supported() ) {
				return false;
			}
			try {
				var prefix = STORAGE_PREFIX;
				var i = storage.length;
				while ( i-- ) {
					var key = storage.key( i );
					if ( key && key.indexOf( prefix ) === 0 ) {
						storage.removeItem( key );
					}
				}
				return true;
			} catch ( e ) {
				console.error( "Storage clear failed:", e );
				return false;
			}
		},

		keys: function() {
			if ( !this.supported() ) {
				return [];
			}
			try {
				var keys = [];
				var prefix = STORAGE_PREFIX;
				var i = storage.length;
				while ( i-- ) {
					var key = storage.key( i );
					if ( key && key.indexOf( prefix ) === 0 ) {
						keys.push( key.substring( prefix.length ) );
					}
				}
				return keys.reverse();
			} catch ( e ) {
				console.error( "Storage keys failed:", e );
				return [];
			}
		}
	};
}

export { STORAGE_PREFIX, createStorageAPI };
export { jQuery };
