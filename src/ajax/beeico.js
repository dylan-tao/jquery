import { jQuery } from "../core.js";
import "../ajax.js";

// beeico ajax namespace
jQuery.beeico = {
	url: {},
	form: {},
	json: {}
};

// Helper function to process URL query parameters (GET/DELETE)
function processQueryData( data ) {
	if ( typeof data === "string" ) {
		return data;
	}
	return jQuery.param( data );
}

// Helper function to process form data (POST/PUT)
function processFormData( data ) {
	if ( typeof data === "string" ) {
		return data;
	}

	// Check if it's FormData (multipart/form-data)
	if ( data instanceof window.FormData ) {
		return data;
	}

	// Default to application/x-www-form-urlencoded
	return jQuery.param( data );
}

// Helper function to get AJAX options
// Optimization: avoid deep extend for simple cases
function getAjaxOptions( url, data, options ) {
	var opts = options ? jQuery.extend( {}, options ) : {};
	opts.url = url;
	opts.data = data;
	return opts;
}

// Helper to apply FormData settings if needed
function applyFormDataOptions( opts, data ) {

	// Auto-detect FormData for multipart/form-data
	if ( data instanceof window.FormData ) {
		opts.processData = false;
		opts.contentType = false;
	}
	return opts;
}

// URL query parameters methods (GET/DELETE)
// beeico.url.getJson - send URL query parameters, expect JSON response
jQuery.beeico.url.getJson = function( url, data, options ) {
	var opts = getAjaxOptions( url, processQueryData( data ), options );
	opts.type = "GET";
	opts.dataType = "json";
	return jQuery.ajax( opts );
};

// beeico.url.getText - send URL query parameters, expect text/html response
jQuery.beeico.url.getText = function( url, data, options ) {
	var opts = getAjaxOptions( url, processQueryData( data ), options );
	opts.type = "GET";
	opts.dataType = "text";
	return jQuery.ajax( opts );
};

// beeico.url.deleteJson - send URL query parameters, expect JSON response
jQuery.beeico.url.deleteJson = function( url, data, options ) {
	var opts = getAjaxOptions( url, processQueryData( data ), options );
	opts.type = "DELETE";
	opts.dataType = "json";
	return jQuery.ajax( opts );
};

// beeico.url.deleteText - send URL query parameters, expect text/html response
jQuery.beeico.url.deleteText = function( url, data, options ) {
	var opts = getAjaxOptions( url, processQueryData( data ), options );
	opts.type = "DELETE";
	opts.dataType = "text";
	return jQuery.ajax( opts );
};

// Form body methods (POST/PUT) - auto-detect multipart/form-data

// beeico.form.postJson - send form data via POST, expect JSON response
jQuery.beeico.form.postJson = function( url, data, options ) {
	var opts = applyFormDataOptions(
		getAjaxOptions( url, processFormData( data ), options ),
		data
	);
	opts.type = "POST";
	opts.dataType = "json";
	return jQuery.ajax( opts );
};

// beeico.form.postText - send form data via POST, expect text/html response
jQuery.beeico.form.postText = function( url, data, options ) {
	var opts = applyFormDataOptions(
		getAjaxOptions( url, processFormData( data ), options ),
		data
	);
	opts.type = "POST";
	opts.dataType = "text";
	return jQuery.ajax( opts );
};

// beeico.form.putJson - send form data via PUT, expect JSON response
jQuery.beeico.form.putJson = function( url, data, options ) {
	var opts = applyFormDataOptions(
		getAjaxOptions( url, processFormData( data ), options ),
		data
	);
	opts.type = "PUT";
	opts.dataType = "json";
	return jQuery.ajax( opts );
};

// beeico.form.putText - send form data via PUT, expect text/html response
jQuery.beeico.form.putText = function( url, data, options ) {
	var opts = applyFormDataOptions(
		getAjaxOptions( url, processFormData( data ), options ),
		data
	);
	opts.type = "PUT";
	opts.dataType = "text";
	return jQuery.ajax( opts );
};

// beeico.json.postJson - send JSON data via POST, expect JSON response
jQuery.beeico.json.postJson = function( url, data, options ) {
	var opts = getAjaxOptions( url, data, options );
	opts.type = "POST";
	opts.dataType = "json";
	opts.data = JSON.stringify( data );
	opts.contentType = "application/json";
	return jQuery.ajax( opts );
};

// beeico.json.postText - send JSON data via POST, expect text/html response
jQuery.beeico.json.postText = function( url, data, options ) {
	var opts = getAjaxOptions( url, data, options );
	opts.type = "POST";
	opts.dataType = "text";
	opts.data = JSON.stringify( data );
	opts.contentType = "application/json";
	return jQuery.ajax( opts );
};

// beeico.json.putJson - send JSON data via PUT, expect JSON response
jQuery.beeico.json.putJson = function( url, data, options ) {
	var opts = getAjaxOptions( url, data, options );
	opts.type = "PUT";
	opts.dataType = "json";
	opts.data = JSON.stringify( data );
	opts.contentType = "application/json";
	return jQuery.ajax( opts );
};

// beeico.json.putText - send JSON data via PUT, expect text/html response
jQuery.beeico.json.putText = function( url, data, options ) {
	var opts = getAjaxOptions( url, data, options );
	opts.type = "PUT";
	opts.dataType = "text";
	opts.data = JSON.stringify( data );
	opts.contentType = "application/json";
	return jQuery.ajax( opts );
};

export { jQuery };
