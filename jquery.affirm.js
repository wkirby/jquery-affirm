/*!
 * jQuery Affirm - v1.0beta - 2013-10-16             *
 * Author: Wyatt Kirby <kirby,wa@gmail.com>          *
 * Licensed under the MIT license                    */

;(function ($, window, document, undefined) {

	// Set up jQuery Affirm
	// ----------------------------------------------------

	$.fn.affirm = function (options, callback) {
		return this.each(function () {
			$(this).on('click', function (event) {
				// Don't Trigger Click Event
				event.preventDefault();

				// Fetch inline content
				var content = $($(this).data('modalcontent') || this.hash);

				// Do we have content?
				if (!content.length) {
					content = $.fn.affirm.defaults.modalText;
				}

				// Sanity Check on Params
				if (options instanceof Function) {
					callback = options;
					options = {
						action: "confirm"
					};
				}

				// Create Modal
				$.affirm(content, options, callback, this);
			});
		});
	};

	// Set up standalone function
	// ----------------------------------------------------

	$.affirm = function (content, options, callback, modalTrigger) {

		// Sanity Check on Params
		if (content instanceof Function) {
			callback = content;
			content = $.fn.affirm.defaults.modalText;
			options = {
				action: "confirm"
			};
		} else if (options instanceof Function) {
			callback = options;
			options = {
				action: "confirm"
			};
		}

		// Create the Modal
		var modal = new Affirm(content, options, callback, modalTrigger);

		// Create Modal; if a modal is open, enqueue the new modal
		if ($(document.body).data("modal") === "open") {
			$.fn.affirm.modalQueue.push(modal);
		} else {
			modal.showModal();
		}
	};

	// Affirm Init
	// ----------------------------------------------------

	function Affirm(content, options, callback, modalTrigger) {

		// If the content alaready exists on the page, don't
		// move it. Instead we'll clone it.

		if ($(content).parent().length) {
			content = $(content).clone(true).show();
		}

		// Set up modal variables
		this.content = content;
		this.options = $.extend(true, {}, $.fn.affirm.defaults, options);
		this.callback = callback;
		this.modalTrigger = modalTrigger;
		this.buttons = {};

		// Set up the CSS
		this.setupCSS();

		// Call modal action
		this[this.options.action]();
	}


	// Default Modal Action
	// ---------------------------

	Affirm.prototype.modal = function () {
		this.createModal();

		if (this.options.overlay) {
			this.createOverlay();
		}
	};

	// Alert Action
	// ---------------------------

	Affirm.prototype.alert = function () {

		// Set up primary button
		this.buttons.$primaryButton = $('<button/>', {
			text: this.options.confirmText,
			autoFocus: true,
			class: this.options.confirmClass
		});

		// Handle Primary Button Click
		this.buttons.$primaryButton.on('click.hideModal', $.proxy(function (event) {
			event.preventDefault();
			this.hideModal();

			// Check for Callback, and that it's a Function
			if (this.callback instanceof Function) {
				if (this.$promptInput) {
					this.callback(this.$promptInput.val());
				} else {
					this.callback();
				}
			}

		}, this));

		// Pass Alert to Modal for construction
		this.modal();
	};

	// Confirm Action
	// ---------------------------

	Affirm.prototype.confirm = function () {

		// Set up a secondary button
		this.buttons.$cancelButton = $('<button/>', {
			'text': this.options.cancelText,
			'class': this.options.cancelClass
		});

		// Handle secondary button click event
		this.buttons.$cancelButton.on('click.hideModal', $.proxy(function (event) {
			event.preventDefault();
			this.hideModal();
		}, this));

		// Pass to Alert for construction
		this.alert();
	};

	// Prompt Action
	// ---------------------------

	Affirm.prototype.prompt = function () {

		// Set up user input
		this.$promptInput = $('<input/>', {
			type: 'text',
			class: this.options.inputClass
		});

		// Pass to Confirm for construction
		this.confirm();
	};

	// Create Modal
	// ---------------------------

	Affirm.prototype.createModal = function () {

		// Gather all the parts
		var $title = $('<h4/>', {
				class: 'modal-title',
				text: this.options.title
			}),
			$close = $('<button/>', {
				class: 'close',
				html: '&times;',
				type: 'button'
			}),
			$header = $('<div/>', {
				class: 'modal-header'
			}),
			$body = $('<div/>', {
				class: 'modal-body',
				html: this.content
			}),
			$footer = $('<div/>', {
				class: 'modal-footer'
			}),
			$content = $('<div/>', {
				class: 'modal-content'
			}),
			$wrapper = $('<div/>', {
				class: 'modal-dialog'
			}),
			$modal = $('<div/>', {
				class: 'modal'
			});

		// Apply default CSS if necessary
		if (this.options.useDefaultCSS) {
			$title.css(this.defaultCSS.title);
			$close.css(this.defaultCSS.close);
			$header.css(this.defaultCSS.header);
			$body.css(this.defaultCSS.body);
			$footer.css(this.defaultCSS.footer);
			$content.css(this.defaultCSS.content);
			$wrapper.css(this.defaultCSS.wrapper);
			$modal.css(this.defaultCSS.modal);
		}

		// Assemble the Modal
		$header.append($title).prepend($close);

		if (!$.isEmptyObject(this.buttons)) {
			$.each(this.buttons, function () {
				$footer.append(this);
			});
		}

		if (this.$promptInput) {
			$body.append($('<br/>'));
			$body.append(this.$promptInput);
		}

		$content.append($header).append($body).append($footer).appendTo($wrapper);

		// Check for close elements
		if (this.options.overlayDismiss) {
			$modal.on('click', $.proxy(function (event) {
				if (event.target === event.currentTarget) {
					event.preventDefault();
					this.hideModal();
				}
			}, this));
		}

		$close.on('click', $.proxy(function (event) {
			event.preventDefault();
			this.hideModal();
		}, this));

		// Assign to class
		this.$modal = $modal.append($wrapper);
	};

	// Create Overlay
	// ---------------------------

	Affirm.prototype.createOverlay = function () {
		var $overlay = $('<div/>', {
			'id': 'modal-overlay'
		});

		// The overlay always gets default CSS
		$overlay.css(this.defaultCSS.overlay);
		this.$overlay = $overlay;
	};

	// Show Modal
	// ---------------------------

	Affirm.prototype.showModal = function () {
		var that = this;

		// Make sure we don't already have a modal open
		if (this.$modal && !$(document.body).data("modal")) {

			// Is there an overlay? Make sure we add it to the DOM
			if (this.options.overlay) {
				this.$overlay.hide().appendTo(document.body).fadeTo(this.options.animSpeed, this.options.css.overlayOpacity);
			}

			// Let's prevent awkward scrolling
			$(document.body).css("overflow", "hidden").data("modal", "open");

			// Fade in the Modal at speed and trigger callback
			this.$modal.appendTo(document.body).fadeIn(this.options.animSpeed, function () {
				that.options.afterShow(that.$modal, that.modalTrigger);
			});

			// Do we need keyboard controls?
			if ( this.options.keyboard ) {
				this.keyboardInit();
			}
		}
	};

	// Hide Modal
	// ---------------------------

	Affirm.prototype.hideModal = function () {
		var that = this;

		// Make sure there's a modal to close
		if (this.$modal && $(document.body).data("modal")) {

			// Do we need to get rid of an overlay?
			if (this.options.overlay) {
				this.$overlay.fadeOut(this.options.animSpeed, function () {
					this.remove();
				});
			}

			// Hide the modal at speed and trigger callback
			this.$modal.fadeOut(this.options.animSpeed, function () {
				this.remove();
				that.options.afterHide(that.$modal, that.modalTrigger);
			});

			// Resume scrolling
			$(document.body).css("overflow", "").removeData("modal").off("keyup");

			// Is there a queue? Proceed!
			if ($.fn.affirm.modalQueue.length > 0) {
				$.fn.affirm.modalQueue.shift().showModal();
			}
		}
	};

	// Create Keyboard Shortcuts
	// ---------------------------

	Affirm.prototype.keyboardInit = function () {
		$(document.body).on('keyup.affirm', $.proxy(function (event) {
			if (this.$modal) {
				if (event.which === 27) { // Escape key
					event.preventDefault();
					this.hideModal();
				} else if (event.which === 13 && this.buttons.$primaryButton) { // Enter Key
					event.preventDefault();
					this.buttons.$primaryButton.trigger("click");
				}
			}
		}, this));
	};

	// Default CSS
	// ----------------------------------------------------
	// This is a function so we can access the defaults and
	// user defaults when setting up our CSS.

	Affirm.prototype.setupCSS = function () {
		this.defaultCSS = {
			header: {
				overflow: "hidden",
				padding: this.options.css.modalPadding
			},
			title: {
				margin: 0,
				float: "left"
			},
			close: {
				float: "right",
				background: "transparent",
				fontSize: 14,
				color: "#ccc",
				fontWeight: "bold",
				border: 0,
				padding: 0,
				marginTop: -2,
				cursor: "pointer"
			},
			body: {
				padding: this.options.css.modalPadding
			},
			footer: {
				padding: this.options.css.modalPadding
			},
			content: {
				backgroundColor: this.options.css.modalBackground,
				borderRadius: this.options.css.modalCornerRadius,
			},
			wrapper: {
				margin: "0 auto",
				paddingTop: this.options.css.modalPadding * 2,
				width: 600,
				maxWidth: "90%",
				fontFamily: this.options.css.fontFamily
			},
			modal: {
				zIndex: this.options.css.zindex + 10,
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflow: "auto",
				overflowY: "scroll"
			},
			overlay: {
				zIndex: this.options.css.zindex,
				position: "fixed",
				backgroundColor: this.options.css.overlayBackground,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0
			}
		};
	};

	// User Accessible Defaults
	// ----------------------------------------------------

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

	// Modal Queue
	// ----------------------------------------------------

	$.fn.affirm.modalQueue = [];

}(window.jQuery, window, document));