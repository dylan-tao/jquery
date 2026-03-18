QUnit.module( "beeico-ajax", {
	afterEach: function() {
		jQuery( document ).off( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess" );
		moduleTeardown.apply( this, arguments );
	}
} );

( function() {

	// Skip tests if beeico ajax module is not included
	if ( !includesModule( "ajax" ) || typeof jQuery.beeico === "undefined" ) {
		return;
	}

	QUnit.test( "jQuery.beeico namespace exists", function( assert ) {
		assert.expect( 4 );

		assert.ok( jQuery.beeico, "jQuery.beeico exists" );
		assert.ok( jQuery.beeico.url, "jQuery.beeico.url exists" );
		assert.ok( jQuery.beeico.form, "jQuery.beeico.form exists" );
		assert.ok( jQuery.beeico.json, "jQuery.beeico.json exists" );
	} );

	QUnit.test( "jQuery.beeico.url API methods exist", function( assert ) {
		assert.expect( 4 );

		assert.strictEqual( typeof jQuery.beeico.url.getJson, "function", "getJson is a function" );
		assert.strictEqual( typeof jQuery.beeico.url.getText, "function", "getText is a function" );
		assert.strictEqual( typeof jQuery.beeico.url.deleteJson, "function", "deleteJson is a function" );
		assert.strictEqual( typeof jQuery.beeico.url.deleteText, "function", "deleteText is a function" );
	} );

	QUnit.test( "jQuery.beeico.form API methods exist", function( assert ) {
		assert.expect( 4 );

		assert.strictEqual( typeof jQuery.beeico.form.postJson, "function", "postJson is a function" );
		assert.strictEqual( typeof jQuery.beeico.form.postText, "function", "postText is a function" );
		assert.strictEqual( typeof jQuery.beeico.form.putJson, "function", "putJson is a function" );
		assert.strictEqual( typeof jQuery.beeico.form.putText, "function", "putText is a function" );
	} );

	QUnit.test( "jQuery.beeico.json API methods exist", function( assert ) {
		assert.expect( 4 );

		assert.strictEqual( typeof jQuery.beeico.json.postJson, "function", "postJson is a function" );
		assert.strictEqual( typeof jQuery.beeico.json.postText, "function", "postText is a function" );
		assert.strictEqual( typeof jQuery.beeico.json.putJson, "function", "putJson is a function" );
		assert.strictEqual( typeof jQuery.beeico.json.putText, "function", "putText is a function" );
	} );

	// Only run AJAX tests if we have PHP support and not running from file://
	if ( isLocal || !hasPHP ) {
		return;
	}

	ajaxTest( "jQuery.beeico.url.getJson() - basic request", 2, function( assert ) {
		return {
			url: baseURL + "mock.php?action=json",
			create: function() {
				return jQuery.beeico.url.getJson( baseURL + "mock.php?action=json", { header: "json" } );
			},
			success: function( json ) {
				assert.ok( Array.isArray( json ), "Response is an array" );
				assert.ok( json.length >= 2, "Response has at least 2 items" );
			}
		};
	} );

	ajaxTest( "jQuery.beeico.url.getText() - text response", 2, function( assert ) {
		return {
			create: function() {
				return jQuery.beeico.url.getText( baseURL + "text.txt" );
			},
			success: function( text ) {
				assert.strictEqual( typeof text, "string", "Response is a string" );
				assert.ok( text.length > 0, "Response is not empty" );
			}
		};
	} );

	ajaxTest( "jQuery.beeico.json.postJson() - JSON body", 3, function( assert ) {
		return {
			create: function() {
				return jQuery.beeico.json.postJson(
					baseURL + "mock.php?action=json",
					{ name: "test", value: 123 }
				);
			},
			success: function( json ) {
				assert.ok( Array.isArray( json ) || typeof json === "object", "Response is JSON" );
			},
			complete: function( xhr ) {
				assert.strictEqual( xhr.status, 200, "Request succeeded" );
				assert.ok( xhr.getResponseHeader( "Content-Type" ).indexOf( "application/json" ) > -1 ||
					xhr.getResponseHeader( "Content-Type" ).indexOf( "text/html" ) > -1,
					"Response has correct content type" );
			}
		};
	} );

	ajaxTest( "jQuery.beeico.form.postJson() - form data", 2, function( assert ) {
		return {
			create: function() {
				return jQuery.beeico.form.postJson(
					baseURL + "mock.php?action=name",
					{ name: "peter" }
				);
			},
			success: function( data ) {
				assert.ok( data, "Received response" );
				assert.strictEqual( typeof data, "string", "Response is a string" );
			}
		};
	} );

	ajaxTest( "jQuery.beeico.form.postJson() - FormData support", 3, function( assert ) {
		var formData = new FormData();
		formData.append( "name", "peter" );

		return {
			create: function() {
				return jQuery.beeico.form.postJson( baseURL + "mock.php?action=name", formData );
			},
			success: function( data ) {
				assert.ok( data, "Received response" );
			},
			complete: function( xhr ) {
				assert.strictEqual( xhr.status, 200, "Request succeeded" );
				assert.ok( true, "FormData was sent successfully" );
			}
		};
	} );

	ajaxTest( "jQuery.beeico.json.putJson() - PUT request", 2, function( assert ) {
		return {
			create: function() {
				return jQuery.beeico.json.putJson(
					baseURL + "mock.php?action=echoMethod",
					{ method: "put", data: "test" }
				);
			},
			success: function( data ) {
				assert.ok( data, "Received response" );
				assert.strictEqual( data, "PUT", "PUT request method was correctly received" );
			}
		};
	} );

	ajaxTest( "jQuery.beeico.url.deleteJson() - DELETE request", 2, function( assert ) {
		return {
			create: function() {
				return jQuery.beeico.url.deleteJson( baseURL + "mock.php?action=echoMethod", { id: 123 } );
			},
			success: function( data ) {
				assert.ok( data, "DELETE request received response" );
				assert.strictEqual( data, "DELETE", "DELETE request method was correctly received" );
			}
		};
	} );

	QUnit.test( "jQuery.beeico AJAX methods return jQuery XHR", function( assert ) {
		assert.expect( 3 );

		var jqXHR = jQuery.beeico.url.getJson( baseURL + "mock.php?action=json" );

		assert.ok( jqXHR, "Request returned a value" );
		assert.strictEqual( typeof jqXHR.done, "function", "Returned value has done method" );
		assert.strictEqual( typeof jqXHR.fail, "function", "Returned value has fail method" );

		jqXHR.abort();
	} );

} )();
