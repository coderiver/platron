/*!
 * $ Migrate - v1.2.1 - 2013-05-08
 * https://github.com/$/$-migrate
 * Copyright 2005, 2013 $ Foundation, Inc. and other contributors; Licensed MIT
 */
(function( $, window, undefined ) {
// See http://bugs.$.com/ticket/13335
// "use strict";


var warnedAbout = {};

// List of warnings already given; public read only
$.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
// $.migrateMute = false;

// Show a message on the console so devs know we're active
if ( !$.migrateMute && window.console && window.console.log ) {
	window.console.log("JQMIGRATE: Logging is active");
}

// Set to false to disable traces that appear with warnings
if ( $.migrateTrace === undefined ) {
	$.migrateTrace = true;
}

// Forget any warnings we've already given; public
$.migrateReset = function() {
	warnedAbout = {};
	$.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	var console = window.console;
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		$.migrateWarnings.push( msg );
		if ( console && console.warn && !$.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( $.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	$._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( document.compatMode === "BackCompat" ) {
	// $ has never supported or tested Quirks Mode
	migrateWarn( "$ is not compatible with Quirks Mode" );
}


var attrFn = $( "<input/>", { size: 1 } ).attr("size") && $.attrFn,
	oldAttr = $.attr,
	valueAttrGet = $.attrHooks.value && $.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = $.attrHooks.value && $.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// $.attrFn
migrateWarnProp( $, "attrFn", attrFn || {}, "$.attrFn is deprecated" );

$.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new $
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("$.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : $.isFunction($.fn[name])) ) {
			return $( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !$.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		$.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = $.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					$.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = $.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "$.fn.attr('" + lowerName + "') may use property instead of attribute" );
		}
	}

	return oldAttr.call( $, elem, name, value );
};

// attrHooks: value
$.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("$.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("$.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};


var matched, browser,
	oldInit = $.fn.init,
	oldParseJSON = $.parseJSON,
	// Note: XSS check is done below after string is trimmed
	rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

// $(html) "looks like html" rule change
$.fn.init = function( selector, context, root$ ) {
	var match;

	if ( selector && typeof selector === "string" && !$.isPlainObject( context ) &&
			(match = rquickExpr.exec( $.trim( selector ) )) && match[ 0 ] ) {
		// This is an HTML string according to the "old" rules; is it still?
		if ( selector.charAt( 0 ) !== "<" ) {
			migrateWarn("$(html) HTML strings must start with '<' character");
		}
		if ( match[ 3 ] ) {
			migrateWarn("$(html) HTML text after last tag is ignored");
		}
		// Consistently reject any HTML-like string starting with a hash (#9521)
		// Note that this may break $ 1.6.x code that otherwise would work.
		if ( match[ 0 ].charAt( 0 ) === "#" ) {
			migrateWarn("HTML string cannot start with a '#' character");
			$.error("JQMIGRATE: Invalid selector string (XSS)");
		}
		// Now process using loose rules; let pre-1.8 play too
		if ( context && context.context ) {
			// $ object as context; parseHTML expects a DOM object
			context = context.context;
		}
		if ( $.parseHTML ) {
			return oldInit.call( this, $.parseHTML( match[ 2 ], context, true ),
					context, root$ );
		}
	}
	return oldInit.apply( this, arguments );
};
$.fn.init.prototype = $.fn;

// Let $.parseJSON(falsy_value) return null
$.parseJSON = function( json ) {
	if ( !json && json !== null ) {
		migrateWarn("$.parseJSON requires a valid JSON string");
		return null;
	}
	return oldParseJSON.apply( this, arguments );
};

$.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing $.browser in case it's different
if ( !$.browser ) {
	matched = $.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	$.browser = browser;
}

// Warn if the code tries to get $.browser
migrateWarnProp( $, "browser", $.browser, "$.browser is deprecated" );

$.sub = function() {
	function $Sub( selector, context ) {
		return new $Sub.fn.init( selector, context );
	}
	$.extend( true, $Sub, this );
	$Sub.superclass = this;
	$Sub.fn = $Sub.prototype = this();
	$Sub.fn.constructor = $Sub;
	$Sub.sub = this.sub;
	$Sub.fn.init = function init( selector, context ) {
		if ( context && context instanceof $ && !(context instanceof $Sub) ) {
			context = $Sub( context );
		}

		return $.fn.init.call( this, selector, context, root$Sub );
	};
	$Sub.fn.init.prototype = $Sub.fn;
	var root$Sub = $Sub(document);
	migrateWarn( "$.sub() is deprecated" );
	return $Sub;
};


// Ensure that $.ajax gets the new parseJSON defined in core.js
$.ajaxSetup({
	converters: {
		"text json": $.parseJSON
	}
});


var oldFnData = $.fn.data;

$.fn.data = function( name ) {
	var ret, evt,
		elem = this[0];

	// Handles 1.7 which has this behavior and 1.8 which doesn't
	if ( elem && name === "events" && arguments.length === 1 ) {
		ret = $.data( elem, name );
		evt = $._data( elem, name );
		if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
			migrateWarn("Use of $.fn.data('events') is deprecated");
			return evt;
		}
	}
	return oldFnData.apply( this, arguments );
};


var rscriptType = /\/(java|ecma)script/i,
	oldSelf = $.fn.andSelf || $.fn.addBack;

$.fn.andSelf = function() {
	migrateWarn("$.fn.andSelf() replaced by $.fn.addBack()");
	return oldSelf.apply( this, arguments );
};

// Since $.clean is used internally on older versions, we only shim if it's missing
if ( !$.clean ) {
	$.clean = function( elems, context, fragment, scripts ) {
		// Set context per 1.8 logic
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		migrateWarn("$.clean() is deprecated");

		var i, elem, handleScript, jsTags,
			ret = [];

		$.merge( ret, $.buildFragment( elems, context ).childNodes );

		// Complex logic lifted directly from $ 1.8
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( $.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use $.merge to ensure snapshot iteration
						jsTags = $.grep( $.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	};
}

var eventAdd = $.event.add,
	eventRemove = $.event.remove,
	eventTrigger = $.event.trigger,
	oldToggle = $.fn.toggle,
	oldLive = $.fn.live,
	oldDie = $.fn.die,
	ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	hoverHack = function( events ) {
		if ( typeof( events ) !== "string" || $.event.special.hover ) {
			return events;
		}
		if ( rhoverHack.test( events ) ) {
			migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
		}
		return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

// Event props removed in 1.9, put them back if needed; no practical way to warn them
if ( $.event.props && $.event.props[ 0 ] !== "attrChange" ) {
	$.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
}

// Undocumented $.event.handle was "deprecated" in $ 1.7
if ( $.event.dispatch ) {
	migrateWarnProp( $.event, "handle", $.event.dispatch, "$.event.handle is undocumented and deprecated" );
}

// Support for 'hover' pseudo-event and ajax event warnings
$.event.add = function( elem, types, handler, data, selector ){
	if ( elem !== document && rajaxEvent.test( types ) ) {
		migrateWarn( "AJAX events should be attached to document: " + types );
	}
	eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
};
$.event.remove = function( elem, types, handler, selector, mappedTypes ){
	eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
};

$.fn.error = function() {
	var args = Array.prototype.slice.call( arguments, 0);
	migrateWarn("$.fn.error() is deprecated");
	args.splice( 0, 0, "error" );
	if ( arguments.length ) {
		return this.bind.apply( this, args );
	}
	// error event should not bubble to window, although it does pre-1.7
	this.triggerHandler.apply( this, args );
	return this;
};

$.fn.toggle = function( fn, fn2 ) {

	// Don't mess with animation or css toggles
	if ( !$.isFunction( fn ) || !$.isFunction( fn2 ) ) {
		return oldToggle.apply( this, arguments );
	}
	migrateWarn("$.fn.toggle(handler, handler...) is deprecated");

	// Save reference to arguments for access in closure
	var args = arguments,
		guid = fn.guid || $.guid++,
		i = 0,
		toggler = function( event ) {
			// Figure out which function to execute
			var lastToggle = ( $._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			$._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		};

	// link all the functions, so any of them can unbind this click handler
	toggler.guid = guid;
	while ( i < args.length ) {
		args[ i++ ].guid = guid;
	}

	return this.click( toggler );
};

$.fn.live = function( types, data, fn ) {
	migrateWarn("$.fn.live() is deprecated");
	if ( oldLive ) {
		return oldLive.apply( this, arguments );
	}
	$( this.context ).on( types, this.selector, data, fn );
	return this;
};

$.fn.die = function( types, fn ) {
	migrateWarn("$.fn.die() is deprecated");
	if ( oldDie ) {
		return oldDie.apply( this, arguments );
	}
	$( this.context ).off( types, this.selector || "**", fn );
	return this;
};

// Turn global events into document-triggered events
$.event.trigger = function( event, data, elem, onlyHandlers  ){
	if ( !elem && !rajaxEvent.test( event ) ) {
		migrateWarn( "Global events are undocumented and deprecated" );
	}
	return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
};
$.each( ajaxEvents.split("|"),
	function( _, name ) {
		$.event.special[ name ] = {
			setup: function() {
				var elem = this;

				// The document needs no shimming; must be !== for oldIE
				if ( elem !== document ) {
					$.event.add( document, name + "." + $.guid, function() {
						$.event.trigger( name, null, elem, true );
					});
					$._data( this, name, $.guid++ );
				}
				return false;
			},
			teardown: function() {
				if ( this !== document ) {
					$.event.remove( document, name + "." + $._data( this, name ) );
				}
				return false;
			}
		};
	}
);


})( $, window );
