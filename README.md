# Affirm

Affirm is a lightweight and highly customizable solution for jQuery modals, alerts, prompts, and confirm dialogs. Create modals that mimic the behavior of built in javascript functions, in addition to a slew of other useful features, including semantic and accessible markup, keyboard shortcuts, modal queueing, default styles, and Bootstrap compatability.

## Basic Usage

`.affirm([options,] [callback])` returns `jQuery`.

Include the jQuery library (version 1.10 or newer) and the affirm plugin files at the bottom of your page, before the closing `<body>` tag.

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
<script src="jquery.affirm.min.js"></script>

<script>
	$(document).ready( function() {
		  $(".affirm").affirm();
	});
</script>
```

Include on your page both the content and triggers for your modal.

```html
<a class="affirm" href="#modal-content">Launch Modal</a>

<div id="modal-content" style="display: none;">Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec id elit non mi porta gravida at eget metus.</div>
```

If you want to trigger specific types of modals -- like the `alert` or `confirm` dialogs --
you can trigger them through the `action` option. The following examples use the same markup as above, but will trigger different results.

### Alert

Affirm's `alert` action duplicates the functionality of javascript's native `alert` function by creating a modal with an "OK" button.

```html
<script>
	$(document).ready( function() {
		  $(".affirm").affirm({ action: "alert" });
	});
</script>
```

### Confirm

Like javascript's native `confirm` function, Affirm's `confirm` delays firing a callback until the user performs an action.

```html
<script>
	$(document).ready( function() {
		  $(".affirm").affirm({ action: "confirm" }, confirmCallback );
		  
		  // Note that if a callback is provided, Affirm will assume
		  // that you want to use the confirm action. As such the
		  // below markup performs identically to the above call.
		  
		  $(".affirm").affirm( confirmCallback );
	});
	
	// The confirm callback is passed no arguments
	function confirmCallback() {
		alert("Confirmed!");
	}
</script>
```

### Prompt

Sometimes you'll require more input from the user than just an OK, in which case you'll want to use Affirm's `prompt` action, which mimics the native `prompt` function by providing the user with a single text input. The value of this input is then passed to the callback function.

```html
<script>
	$(document).ready( function() {
		  $(".affirm").affirm({ action: "prompt" }, promptCallback );
	});
	
	// The prompt callback is passed the user's input
	function promptCallback(userInput) {
		alert("You said: " + userInput);
	}
</script>
```

### Modal

A basic modal is the default action, but can still be triggered explicitly. This may be necessary if you've changed the default action as described in the **Options** section below.

```html
<script>
	$(document).ready( function() {
		  $(".affirm").affirm({ action: "modal" });
	});
</script>
```

## Advanced Use

`jQuery.affirm(content, [options,] [callback])` returns `jQuery`.

Sometimes you'll want to fire an Affirm dialog without relying on a user's click, or you'll want to define content that doesn't already exist on the page. In those instances, it's best to use the jQuery function version of the plugin.

You'll want to include the scripts as above, but can trigger modals programmatically.

```js
$(document).ready( function() {

	// A basic modal
	$.affirm("I'm a modal");
	
	// An alert
	$.affirm("I'm an alert", { action: "alert" });
	
	// A confirm dialog
	$.affirm("I'm an alert", { action: "confirm" }, confirmCallback);
	$.affirm("I'm an alert", confirmCallback);
	$.affirm( confirmCallback );
	
	// A prompt
	$.affirm("I'm an alert", { action: "prompt" }, promptCallback);

});
```

### Content

Content can be passed to `$.affirm` as either a string or a jQuery object. 

```js
$(document).ready( function() {

	$.affirm("I'm a string");
	$.affirm( $("<div/>").html("Dynamic Content") );
	$.affirm($("#modal-content"));

});
```

### Queuing

Sometimes multiple modals may occur at the same time. Affirm handles this gracefully by automatically queuing and displaying concurrent modals on a first-in first-out basis.

```js
$(document).ready( function() {

	// An Alert Queue
	$.affirm("I'm the first modal");
	$.affirm("I'm the second alert", { action: "alert" });
	$.affirm("You won't see me until after you click OK", { action: "confirm" });
	$.affirm("On all the other modals.", { action: "alert" });

});
```

### Hooks

Affirm features two utility hooks for firing functions on showing and hiding modals. These hooks are passed two parameters: the modal itself, and the associated modalTrigger (if the modal was triggered on click using the plugin method above).

```js
$(document).ready( function() {

	// An Alert Queue
	$('.affirm').affirm({
		afterShow: function( modal, modalTrigger ) {
			// Change the link's color to red when the modal shows
			$(modalTrigger).css("color", "red");
		},
		afterHide: function( modal, modalTrigger ) {
			// And to green after the modal disappears
			$(modalTrigger).css("color", "green");
		}
	});

});
```

## Options

Affirm provides a wide variety of options for you to customize. You can set any of these options through the `option` parameter, passed as an object when calling `affirm`.

### Defaults

The default options object:

```js
$.fn.affirm.defaults = {
	action: "modal",
	title: "Modal Title",
	confirmText: "OK",
	cancelText: "Cancel",
	overlay: true,
	overlayDismiss: true,
	keyboard: true,
	animSpeed: 500,
	confirmClass: "btn btn-primary",
	cancelClass: "btn btn-default",
	inputClass: "form-control",
	afterShow: function () { return; },
	afterHide: function () { return; },
	useDefaultCSS: true,
	css: {
		fontFamily: "sans-serif",
		zindex: 1000,
		overlayBackground: "black",
		overlayOpacity: 0.5,
		modalPadding: 10,
		modalBackground: "white",
		modalCornerRadius: 3
	}
};
```
All of these defaults are user accessible and can be changed on a permanent basis by setting them like so:

```js
$.fn.affirm.defaults.action = "alert";
$.fn.affirm.defaults.css.overlayBackground = "orange";
```
When Affirm is subsequently called, your defaults will be used in place of the above object. Details on each option can be found in the table below.

### Modal Options


| Name | Description | Type | Default |
|------|-------------|------|---------|
| action | The default action when calling `affirm` with no arguments | string | "modal" |
| title | The title to be displayed in the modal's header | string | "Modal Title" |
| confirmText | Text displayed on the Confirm button | string | "OK" |
| cancelText | Text displayed on the Cancel button | string | "Cancel" |
| overlay | Option to display an overlay between the modal and the rest of the page | bool | true |
| overlayDismiss | Determines whether or not clicking on the overlay should dismiss the modal | bool | true |
| keyboard | Enables or disables keyboard shortcuts for modals | bool | true |
| animSpeed | The speed in miliseconds for fading in and out the modal | int | 500 |
| confirmClass | Classes to be added to the confirm button for styling | string | "btn btn-primary" |
| cancelClass | Classes to be added to the cancel button for styling | string | "btn btn-default" |
| inputClass | Classes to be added to the text input for styling | string | "form-control" |
| afterShow | Hook for functions to fire after the modal is displayed | function | return |
| afterHide | Hook for functions to fire after the modal is removed | function | return |
| useDefaultCSS | Determines whether or not the default CSS should be applied to the modal; disable if you plan to style the modal yourself through CSS | bool | true |

### CSS Options

| Name | Description | Type | Default |
|------|-------------|------|---------|
| css.fontFamily | The font family to use for the modal. Accepts any valid CSS string. | string | "sans-serif" |
| css.zIndex | Used to calculate the z-index for placing modals above other page content. Only necessary if you find you have other content with high z-index values. | int | 1000 |
| css.overlayBackground | The background color for the optional overlay. Accepts any valid CSS color string. | string | "black" |
| css.overlayOpacity | The opacity of the overlay, between 0 and 1, where 1 is completely opaque. | int | 0.5 |
| css.modalPadding | The base padding for the modal window in pixels. | int | 10 |
| css.modalBackground | The background color for the modal window. Accepts any valid CSS color string. | string | "white" |
| css.modalCornerRadius | Who doesn't love round recs? Set the border radius for all corners on the modal in pixels. | int | 3 |

## Bootstrap

Affirm is designed for standalone use, but we're also big fans of Bootstrap for getting projects off the ground as quickly as possible. For this reason, Affirm's default classes are an exact match for Bootstrap 3's Modal classes, allowing you to use Affirm in place of -- or alongside -- Bootstrap's native `Modal.js`. To completely integrate Affirm's appearance with Bootstrap 3 or above, simply set the default value for `useDefaultCSS` to false, like so:

```js
$.fn.affirm.defaults.useDefaultCSS = false;
```

Any further use of Affirm will blend seemlessly with the rest of your bootstrap site.

## Changelog

### Version 1.0beta

* Initial release and testing