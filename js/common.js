head.ready(function() {

	// click
	$(document).on('click', function(){
		$('.js-info').removeClass('is-active');
		$('.js-order-in').removeClass('is-active');
	});

	// order text
	function order_info(){
		var text_length = $('.js-order-text').text().length;
		var parent = $('.js-order-in');
		var more = $('.js-order-more');

		if (text_length > 50){
			more.show();
		}
		else {
			more.hide();
		}

		more.on('click', function(){
			parent.addClass('is-active');
			return false;
		});

		$('.js-order-close').on('click', function(){
			parent.removeClass('is-active');
			return false;
		});
		parent.click(function( event ) {
			event.stopPropagation();
		});
	}
	order_info();

	// tabs
	function tabsLoad() {
		var hash = window.location.hash,
			tabText = $('.js-tabs').find("li:first a").text();
		$('.js-opted-sel').text(tabText);

		if (hash) {
			$('[href="'+hash+'"]').parents(".js-tabs-group").find(".js-tabs-content").removeClass("is-active");
			$('[data-id="'+hash+'"]').addClass("is-active");
			$('[href="'+hash+'"]').parents(".js-tabs").find("li").removeClass("is-active");
			$('[href="'+hash+'"]').parent().addClass("is-active");

			var tabText = $('.js-tabs').find("li.is-active a").text();
			$('.js-opted-sel').text(tabText);

			alfa_click();
		}
		else {
			$('.js-tabs').each(function(){
				$(".js-tabs").find("li").removeClass("is-active");
				$(".js-tabs-group").find(".js-tabs-content").removeClass("is-active");

				$(this).find('li:first').addClass("is-active");
				$(this).next().addClass("is-active");
			});
		}
		$(".js-tabs").find("li a").on('click', function(){
			$('body').removeClass('is-open-menu');
		});
	}
	tabsLoad();
	$(window).bind("hashchange", function() {
		var first = $(this).find('li:first');
		tabsLoad();
		if (first.hasClass('is-active')) {
			first.next().removeClass('is-active');
			$(this).next().next().removeClass('is-active');
		}
	});


	// info
	$('.js-info-btn').on('click', function(){
		$('.js-order-in').removeClass('is-active');
		var parent = $(this).parent();

		if (parent.hasClass('is-active')) {
			parent.removeClass('is-active');
		}
		else if ($('.js-info').hasClass('is-active')) {
			$('.js-info').removeClass('is-active');
			parent.addClass('is-active');
		}
		else {
			parent.toggleClass('is-active');
		}
		// return false;

	});
	$( ".js-info-btn" ).click(function( event ) {
		event.stopPropagation();
	});

	// my e-mail
	function myemail(){
		$('.js-open-myemail').on('change', function(event){
			event.preventDefault();
			var email = $('.js-myemail');

			if ($(this).is(':checked')) {
				email.show();
				$('.js-open-myemail').attr('checked', 'checked');
			}
			else{
				email.hide();
				$('.js-open-myemail').removeAttr('checked');
			}

		});
		$('.js-text-myemail').on('input', function(){
			$('.js-text-myemail').val( $(this).val() );
		})
	}
	myemail();

	// payment
	function payment_method(){
		$('.js-payment').find('.js-payment-item:first').addClass("is-active");
		$('.js-payment-item').on('click', function(){
			var payment_item = $('.js-tabs-content.is-active .js-payment-item');
			if(payment_item.hasClass('is-active')) {
				payment_item.removeClass('is-active');
				$(this).addClass('is-active');

				if ($(this).hasClass('is-disable')) {
					$(this).removeClass('is-active');
				}
				alfa_click();
			}
		});
	}
	payment_method();

	// alfa click
	function alfa_click() {
		var input_alfa = $('.js-alfa-input');

		if ($('.js-alfa').hasClass('is-active')) {
			input_alfa.addClass('is-active');
		}
		else{
			input_alfa.removeClass('is-active');
		}

	};

	// popup
	function popup(){
		$('.js-open-popup').on('click', function(){
			$('body').addClass('is-open-popup');
		});
		$('.js-popup, .js-popup-close').on('click', function(){
			$('body').removeClass('is-open-popup');
			return false;
		});
		$( ".js-popup-in" ).click(function( event ) {
			event.stopPropagation();
		});
	}popup();

	// timer
	$('body').each(function(){
		if ($(this).find('#countbox').length) {
			$('#countbox').countDown({
				targetOffset: {
					'day':		1,
					'month':	0,
					'year':		0,
					'hour':		12,
					'min':		54,
					'sec':		42
				},
				omitWeeks: true
			});
		};
		// tabs();
	});
	
	// phone number
	$('.js-phone-number').on('input', function(){
		$('.js-phone-number').val( $(this).val() );
	});

	// validation
	$("#form").validate({
		rules: {
			number: "required",
			month: "required",
			year: "required",
			cvv: "required",
			name: "required",
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});
	$.validator.setDefaults({ 
	  onkeyup: function(element) { 
	      if (element.name == 'phone') { 
	          return false; 
	      }
	  }
	});

	$("#form1").validate({
		rules: {
			number: "required",
			month: "required",
			year: "required",
			cvv: "required",
			name: "required",
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});
	$("#form2").validate({
		rules: {
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});
	$("#form3").validate({
		rules: {
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});
	$("#form4").validate({
		rules: {
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});
	$("#form5").validate({
		rules: {
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});
	$("#form6").validate({
		rules: {
			phone: {
				required: true,
				minlength: 7
			}
		},
		messages: {
			phone: {
				required: "Необходимо указать номер телефона",
				minlength: "Поле заполнено неверно"
			}
		}
	});

	// card number
	$('input[name="number"]').inputmask({
		mask: '9999 9999 9999 9999999',
		showMaskOnHover: false,
		showMaskOnFocus: false,
		placeholder: ''
	});

 	$('input[name="number"]').on('change', function() {
		var value = $(this).val();
		if (value.length < 19) {
			value = value.replace('');
			$(this).val('', value);
		}
		
	});

    // symbol month, year, cvv 
    $('input[name="month"], input[name="year"], input[name="cvv"]').on('keyup', function(){
		var value = $(this).val();
		var re = /[^0-9,]/;
		if (re.test(value)) {
			value = value.replace(re, '');
			$(this).val('', value);
		}
	});

	// symbol month, year
	$('input[name="month"], input[name="year"]').on('change', function(){
		var value = $(this).val();
		if (value < 2) {
			value = value.replace('');
			$(this).val('', value);
		}
	});

    // month
	$('input[name="month"]').on('input', function(){
		var value = $(this).val();
		var firstChar = value.substring(0, 1);
		var twoChar = value.substring(0, 2);
		if (firstChar > 1) {
			value = value.replace('');
			$(this).val('', value);
		}
		if (value > 12) {
			twoChar = '1';
			value = value.replace('');
			$(this).val(twoChar, value);
		}
	});


	// CVV
	$('input[name="cvv"]').on('change', function(){
		var value = $(this).val();
		if ($(this).val() < 100) {
			value = value.replace('');
			$(this).val('', value);
		}
	});

	// name
    $('input[name="name"]').on('keyup', function(){
    	var value = $(this).val();
	    var reg = /[^\sa-zA-Zа-яА-Я]$/i;
	    var regFinal = /([a-zA-Zа-яА-Я]{2,})$/i;
	    if (reg.test(value)) {
	        value = value.replace(reg, '');
	        $(this).val(value);
	    }
	    // if (regFinal.test(value)) {
	    // 	$(this).removeClass('error');
	    // } else {
    	//     $(this).addClass('error');
	    // }
    });
    $('input[name="name"]').liTranslit();

    // Email
	function valid_email() {
		var form = $('.js-tabs-cont.is-active').find('#form');
		form.each(function(){
			var input = $(this).find('input[name="email"]');
			var button = $(this).find('button[type="submit"]');
			var regMail = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/;
			var regMailC = /[-0-9А-Яа-я.+_]+@[-0-9А-Яа-я.+_]+\.[0-9А-Яа-я]{2,4}$/;
			button.on('click', function() {
				var value = input.val();

				if (value < 1) {
					$(this).addClass('error');
					$('.js-error-text1').show();
					$('.js-error-text2').hide();
				} else {
					$(this).removeClass('error');
					$('.js-error-text1').hide();
				}

				if (regMail.test(value) || regMailC.test(value)) {
					input.removeClass('error');
					$('.js-error-text2').hide();
					$('.js-error-text1').hide();
				} else {
					input.addClass('error');
					$('.js-error-text2').show();
					$('.js-error-text1').hide();
				}
			    
			});
			// input.on('keyup', function(){
			// 	var value = input.val();

			// 	if (value > 0) {
			// 		$(this).removeClass('is-error');
			// 		$('.js-error-text1').hide();
			// 	}
			// 	if (regMail.test(value) || regMailC.test(value)) {
			// 		input.removeClass('is-error');
			// 		$('.js-error-text2').hide();
			// 		$('.js-error-text1').hide();
			// 	} else {
			// 		input.addClass('is-error');
			// 		$('.js-error-text2').show();
			// 		$('.js-error-text1').hide();
			// 	}
				
			// 	if (value.length == 0) {
			// 		$(this).removeClass('is-error');
			// 		$('.js-error-text2').hide();
			// 	}
			// });
			input.on('change', function() {
				var value = input.val();

				if (value < 1) {
					$(this).addClass('is-error');
					$('.js-error-text1').show();
					$('.js-error-text2').hide();
				} else {
					$(this).removeClass('is-error');
					$('.js-error-text1').hide();
				}

				if (regMail.test(value) || regMailC.test(value)) {
					input.removeClass('is-error');
					$('.js-error-text2').hide();
					$('.js-error-text1').hide();
				} else {
					input.addClass('is-error');
					$('.js-error-text2').show();
					$('.js-error-text1').hide();
				}

				if (value.length == 0) {
					$(this).removeClass('is-error');
					$('.js-error-text2').hide();
				}
			});
		});
	}
	valid_email();
	

	// phone
	function val_phone() {
		$('input[name="phone"]').on('blur', function(){
			var value = $(this).val();
			if (value == '+7') {
				value = value.replace('');
				$(this).val('', value);
				$(this).removeClass('error');
			}
		});
		var form = $('.js-tabs-cont.is-active').find('#form');
		$('input[name="phone"]').on('focus', function(){
			if ($(this).val() < 1) {
				$(this).val('+7');
			}
			// $(this).setCursorPosition(input.val().length);
		});
			
		$('input[name="phone"]').on('keyup', function(){
			var value = $(this).val();
			var re = /[^0-9,+_ ""()-]/;
			if (re.test(value)) {
				value = value.replace(re, '');
				$(this).val(value);
			}
		});
	}
	val_phone();

	// menu mob
	$('.js-menu, .js-opted-sel').on('click', function(){
		$('body').toggleClass('is-open-menu');
	});
	$('.js-overlay').on('click', function(){
		$('body').removeClass('is-open-menu');
	});

});