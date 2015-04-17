head.ready(function() {

	// click
	$('body').on('click', function(){
		$('.js-info').removeClass('is-active');
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
	}
	order_info();

	// tabs
	function tabs(){

		var	tabs = ['#card', '#robox', '#purse', '#terminals', '#cashbox', '#from-your-balance', '#internet-banking'],
			tabList = $('.js-tabs');
			ltie9 = $.browser.msie && ($.browser.version <= 9);
			
		// смена таба
		function changeTab(tabId){

			tabList.find(".js-tab-link.is-active").removeClass("is-active");
			$('.js-tabs-cont').removeClass("is-active");
			$(tabId).addClass("is-active");
			tabList.find('.js-tab-link').each(function () {
				var attr = $(this).attr('href');
				if (attr == tabId) {
					$(this).addClass('is-active');
				};
			});

			if (!tabId) {
				tabList.find('.tabs__item:first .js-tab-link').addClass("is-active");
				window.location.hash = tabs[0];
				$('html, body').animate({
					scrollTop: 0
				});
			}
			payment_method();
			alfa_click();

		}

		// проверка хеша
		function checkHash(){
			var	tabId = window.location.hash,
				result = false;

			// для ИЕ6-8 эмуляция :target
			function setTarget(obj){
				$('.js-tabs-cont').removeClass('is-target');
				$(tabId).addClass('is-target');
			};

			// при загрузке страницы проверяем какую вкладку следует открыть	
			$.each(tabs, function(){

				if (tabId == this) 
				{
					changeTab(tabId);
					result = true;
					ltie9 ? setTarget(tabId) : false;

					return false;
				};
			});

			if (result == false) changeTab();
		};
		checkHash();			
					
		// $('.js-tab-link').on('click', function () {
		// 	$('html, body').animate({
		// 		scrollTop: 100
		// 	});
		// });				
		// // отслеживаем изменение хеша
		// $(window).bind('hashchange', function() {
		// 	checkHash();
		// });
		$('.js-tab-link').on('click', function () {
			var page = $(this).attr("href");
			var pageTop = $(page).offset().top;

			$('html, body').animate({
				scrollTop: 100
			}, 600, function () {
				window.location.hash = page;
				// отслеживаем изменение хеша
				$(window).bind('hashchange', function() {
					checkHash();
				});
			});
			return false;

		});		
	}
	tabs();

	// info
	$('.js-info-btn').on('click', function(){
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
		return false;

	});
	$( ".js-info-btn" ).click(function( event ) {
		event.stopPropagation();
	});

	// my e-mail
	function myemail(){
		$('.js-open-myemail').on('change', function(){
			var email = $(this).parents('.js-tabs-cont').find('.js-myemail');

			if ($(this).is(':checked')) {
				email.show();
			}
			else{
				email.hide();
			}

		});
	}
	myemail();

	// payment
	function payment_method(){
		var payment = $('.js-tabs-cont.is-active').find('.js-payment');
		payment.each(function(){
			var payment_item = $(this).find('.js-payment-item');

			if(payment_item.hasClass('is-active')) {
				$('.js-payment-item').on('click', function(){
					payment_item.removeClass('is-active');
					$(this).addClass('is-active');

					if ($(this).hasClass('is-disable')) {
						$(this).removeClass('is-active');
					}
					
					alfa_click();

					return false;
				});
			}
			else {
				payment.find('.js-payment-item:first').addClass("is-active");
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


});