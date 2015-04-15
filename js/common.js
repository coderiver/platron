head.ready(function() {

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
			
			$('.js-tabs-group').find('li:first a').addClass("is-active");
		// смена таба
		function changeTab(){
			var	tabId = window.location.hash,
				result = false;

			if (!tabId) window.location.hash = tabs[0];
			$('.js-tab-link').on('click', function(){
				$('.js-tab-link').removeClass('is-active');
				$(this).addClass('is-active');
			});
		}changeTab();
	
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

					return false;
				};
			});

			if (result == false) changeTab();
		};
		checkHash();			
					
		// отслеживаем изменение хеша
		$(window).bind('hashchange', function() {
			checkHash();
		});
				
	}
	tabs();

});