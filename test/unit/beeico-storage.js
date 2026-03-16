QUnit.module( "beeico-storage", {
	afterEach: moduleTeardown
} );

( function() {

	// Skip tests if beeico storage module is not included
	if ( typeof jQuery.beeico === "undefined" || typeof jQuery.beeico.storage === "undefined" ) {
		return;
	}

	var STORAGE_PREFIX = "beeico_storage_";

	// Helper to clear all beeico storage items before/after tests
	function clearBeeicoStorage( storageType ) {
		var storage = storageType === "local" ? localStorage : sessionStorage;
		var keys = [];
		var prefix = STORAGE_PREFIX;

		for ( var i = 0; i < storage.length; i++ ) {
			var key = storage.key( i );
			if ( key && key.indexOf( prefix ) === 0 ) {
				keys.push( key );
			}
		}

		keys.forEach( function( key ) {
			storage.removeItem( key );
		} );
	}

	QUnit.test( "jQuery.beeico.storage namespace exists", function( assert ) {
		assert.expect( 3 );

		assert.ok( jQuery.beeico, "jQuery.beeico exists" );
		assert.ok( jQuery.beeico.storage, "jQuery.beeico.storage exists" );
		assert.ok( jQuery.beeico.storage.local && jQuery.beeico.storage.session,
			"jQuery.beeico.storage.local and session exist" );
	} );

	// LocalStorage Tests
	QUnit.module( "beeico-storage.local", {
		afterEach: function() {
			clearBeeicoStorage( "local" );
			moduleTeardown.apply( this, arguments );
		}
	} );

	QUnit.test( "jQuery.beeico.storage.local.supported()", function( assert ) {
		assert.expect( 1 );

		var supported = jQuery.beeico.storage.local.supported();
		assert.strictEqual( typeof supported, "boolean", "supported() returns a boolean" );
	} );

	QUnit.test( "jQuery.beeico.storage.local.set() and get()", function( assert ) {
		assert.expect( 5 );

		if ( !jQuery.beeico.storage.local.supported() ) {
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			return;
		}

		// Test string value
		var result = jQuery.beeico.storage.local.set( "testKey", "testValue" );
		assert.strictEqual( result, true, "set() returns true on success" );
		assert.strictEqual( jQuery.beeico.storage.local.get( "testKey" ), "testValue",
			"get() returns the stored string value" );

		// Test object value
		var testObj = { name: "test", value: 123 };
		jQuery.beeico.storage.local.set( "testObj", testObj );
		assert.deepEqual( jQuery.beeico.storage.local.get( "testObj" ), testObj,
			"get() returns the stored object" );

		// Test non-existent key
		assert.strictEqual( jQuery.beeico.storage.local.get( "nonExistent" ), null,
			"get() returns null for non-existent key" );
	} );

	QUnit.test( "jQuery.beeico.storage.local.remove()", function( assert ) {
		assert.expect( 3 );

		if ( !jQuery.beeico.storage.local.supported() ) {
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			return;
		}

		jQuery.beeico.storage.local.set( "removeTest", "value" );
		assert.strictEqual( jQuery.beeico.storage.local.get( "removeTest" ), "value",
			"Value was stored" );

		var result = jQuery.beeico.storage.local.remove( "removeTest" );
		assert.strictEqual( result, true, "remove() returns true on success" );
		assert.strictEqual( jQuery.beeico.storage.local.get( "removeTest" ), null,
			"Value was removed" );
	} );

	QUnit.test( "jQuery.beeico.storage.local.keys()", function( assert ) {
		assert.expect( 3 );

		if ( !jQuery.beeico.storage.local.supported() ) {
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			return;
		}

		jQuery.beeico.storage.local.set( "key1", "value1" );
		jQuery.beeico.storage.local.set( "key2", "value2" );

		var keys = jQuery.beeico.storage.local.keys();
		assert.ok( Array.isArray( keys ), "keys() returns an array" );
		assert.ok( keys.indexOf( "key1" ) > -1, "keys() contains key1" );
		assert.ok( keys.indexOf( "key2" ) > -1, "keys() contains key2" );
	} );

	QUnit.test( "jQuery.beeico.storage.local.clear()", function( assert ) {
		assert.expect( 3 );

		if ( !jQuery.beeico.storage.local.supported() ) {
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			return;
		}

		jQuery.beeico.storage.local.set( "clearTest1", "value1" );
		jQuery.beeico.storage.local.set( "clearTest2", "value2" );

		var result = jQuery.beeico.storage.local.clear();
		assert.strictEqual( result, true, "clear() returns true on success" );
		assert.strictEqual( jQuery.beeico.storage.local.get( "clearTest1" ), null,
			"clearTest1 was removed" );
		assert.strictEqual( jQuery.beeico.storage.local.get( "clearTest2" ), null,
			"clearTest2 was removed" );
	} );

	QUnit.test( "jQuery.beeico.storage.local storage prefix isolation", function( assert ) {
		assert.expect( 2 );

		if ( !jQuery.beeico.storage.local.supported() ) {
			assert.ok( true, "localStorage not supported - skipping" );
			assert.ok( true, "localStorage not supported - skipping" );
			return;
		}

		// Set a key directly in localStorage (not using beeico API)
		localStorage.setItem( "otherKey", "otherValue" );

		jQuery.beeico.storage.local.set( "beeicoKey", "beeicoValue" );

		var keys = jQuery.beeico.storage.local.keys();
		assert.ok( keys.indexOf( "beeicoKey" ) > -1, "beeicoKey is in keys" );
		assert.strictEqual( keys.indexOf( "otherKey" ), -1,
			"otherKey is not in keys (different prefix)" );

		// Cleanup
		localStorage.removeItem( "otherKey" );
	} );

	// SessionStorage Tests
	QUnit.module( "beeico-storage.session", {
		afterEach: function() {
			clearBeeicoStorage( "session" );
			moduleTeardown.apply( this, arguments );
		}
	} );

	QUnit.test( "jQuery.beeico.storage.session.supported()", function( assert ) {
		assert.expect( 1 );

		var supported = jQuery.beeico.storage.session.supported();
		assert.strictEqual( typeof supported, "boolean", "supported() returns a boolean" );
	} );

	QUnit.test( "jQuery.beeico.storage.session.set() and get()", function( assert ) {
		assert.expect( 4 );

		if ( !jQuery.beeico.storage.session.supported() ) {
			assert.ok( true, "sessionStorage not supported - skipping" );
			assert.ok( true, "sessionStorage not supported - skipping" );
			assert.ok( true, "sessionStorage not supported - skipping" );
			assert.ok( true, "sessionStorage not supported - skipping" );
			return;
		}

		var result = jQuery.beeico.storage.session.set( "sessionKey", "sessionValue" );
		assert.strictEqual( result, true, "set() returns true on success" );
		assert.strictEqual( jQuery.beeico.storage.session.get( "sessionKey" ), "sessionValue",
			"get() returns the stored value" );

		// Test array value
		var testArray = [ 1, 2, 3 ];
		jQuery.beeico.storage.session.set( "sessionArray", testArray );
		assert.deepEqual( jQuery.beeico.storage.session.get( "sessionArray" ), testArray,
			"get() returns the stored array" );

		// Test non-existent key
		assert.strictEqual( jQuery.beeico.storage.session.get( "nonExistent" ), null,
			"get() returns null for non-existent key" );
	} );

	QUnit.test( "jQuery.beeico.storage.session.remove()", function( assert ) {
		assert.expect( 2 );

		if ( !jQuery.beeico.storage.session.supported() ) {
			assert.ok( true, "sessionStorage not supported - skipping" );
			assert.ok( true, "sessionStorage not supported - skipping" );
			return;
		}

		jQuery.beeico.storage.session.set( "removeSessionTest", "value" );
		jQuery.beeico.storage.session.remove( "removeSessionTest" );

		assert.strictEqual( jQuery.beeico.storage.session.get( "removeSessionTest" ), null,
			"Value was removed" );
		assert.strictEqual( jQuery.beeico.storage.session.keys().indexOf( "removeSessionTest" ), -1,
			"Key is not in keys list" );
	} );

	QUnit.test( "jQuery.beeico.storage.session.keys() and clear()", function( assert ) {
		assert.expect( 3 );

		if ( !jQuery.beeico.storage.session.supported() ) {
			assert.ok( true, "sessionStorage not supported - skipping" );
			assert.ok( true, "sessionStorage not supported - skipping" );
			assert.ok( true, "sessionStorage not supported - skipping" );
			return;
		}

		jQuery.beeico.storage.session.set( "sKey1", "value1" );
		jQuery.beeico.storage.session.set( "sKey2", "value2" );

		var keys = jQuery.beeico.storage.session.keys();
		assert.ok( keys.length >= 2, "keys() returns at least 2 keys" );

		jQuery.beeico.storage.session.clear();

		keys = jQuery.beeico.storage.session.keys();
		assert.strictEqual( keys.length, 0, "keys() returns empty array after clear" );
		assert.strictEqual( jQuery.beeico.storage.session.get( "sKey1" ), null,
			"Value was cleared" );
	} );

	// Cross-storage isolation tests
	QUnit.module( "beeico-storage.isolation", {
		afterEach: function() {
			clearBeeicoStorage( "local" );
			clearBeeicoStorage( "session" );
			moduleTeardown.apply( this, arguments );
		}
	} );

	QUnit.test( "localStorage and sessionStorage are isolated", function( assert ) {
		assert.expect( 4 );

		if ( !jQuery.beeico.storage.local.supported() || !jQuery.beeico.storage.session.supported() ) {
			assert.ok( true, "Storage not supported - skipping" );
			assert.ok( true, "Storage not supported - skipping" );
			assert.ok( true, "Storage not supported - skipping" );
			assert.ok( true, "Storage not supported - skipping" );
			return;
		}

		jQuery.beeico.storage.local.set( "sharedKey", "localValue" );
		jQuery.beeico.storage.session.set( "sharedKey", "sessionValue" );

		assert.strictEqual( jQuery.beeico.storage.local.get( "sharedKey" ), "localValue",
			"localStorage has correct value" );
		assert.strictEqual( jQuery.beeico.storage.session.get( "sharedKey" ), "sessionValue",
			"sessionStorage has correct value" );

		// Clear localStorage should not affect sessionStorage
		jQuery.beeico.storage.local.clear();

		assert.strictEqual( jQuery.beeico.storage.local.get( "sharedKey" ), null,
			"localStorage value was cleared" );
		assert.strictEqual( jQuery.beeico.storage.session.get( "sharedKey" ), "sessionValue",
			"sessionStorage value remains" );
	} );

} )();
