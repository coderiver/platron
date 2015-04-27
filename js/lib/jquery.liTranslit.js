/*
 * jQuery liTranslit v 1.4
 * http://masscode.ru/index.php/k2/item/28-litranslit
 *
 * Copyright 2013, Linnik Yura
 * Free to use
 * 
 * Last Update 25.10.2014
 */

(function ($) {
    var methods = {
        init: function (options) {
			var o = {
				eventType:'keyup blur copy paste cut start',
				elAlias: $(this),				//Элемент, в который будет записываться результат транслитерации или false
				reg:'',							//'" "="-","ж"="zzzz"' or false or ''
				translated: function (el, text, eventType) {},   
				caseType: 'lower',				// lower(default), upper, inherit - регистр выходных данных
				status:true,
				string:''						//используется для транслита строковой переменной
			};
			if (options) {
				$.extend(o, options); 
			}
			var general = $(this);
			if(!general.length){
				general = $('<div>').text(o.string);
			}
			
			return general.each(function(){
				
				var 
				elName = $(this),
				elAlias = o.elAlias.length ? o.elAlias.css({wordWrap:'break-word'}) : general.css({wordWrap:'break-word'}),
				nameVal;
				
				elName.data({
					status:o.status	
				})

				var inser_trans = function(result,e) {

					if(o.caseType == 'upper'){
						result = result.toUpperCase();
					}
                    if(o.caseType == 'lower'){
						result = result.toLowerCase();
					}
					if(elName.data('status') && o.elAlias){
						if (elAlias.prop("value") !== undefined) {
							elAlias.val(result);
						}else{
							elAlias.html(result);
						}
						
					}
					if(result != ''){
						if (o.translated !== undefined) {
							var type;
							if(e == undefined){
								type = 'no event';
							}else{
								type = e.type;	
							}
							o.translated(elName, result, type);
						}
					}
				}
		
				var customReg = function(str){
					customArr = o.reg.split(',');
					for(var i=0;i<customArr.length; i++){
						var customItem = customArr[i].split('=');
						var regi = customItem[0].replace(/"/g,'');
						var newstr = customItem[1].replace(/"/g,'');
						var re = new RegExp(regi,"ig");
						str = str.replace(re,newstr)
					}
					return str	
				}
					
				var tr = function(el,e){
					if (el.prop("value") !== undefined) {
						nameVal = el.val();
					}else{
						nameVal = el.text();	
					}
					if(o.reg && o.reg != ''){
 
						nameVal = customReg(nameVal)

					}
					inser_trans(get_trans(nameVal),e);
				};
				elName.on(o.eventType,function (e) {
					var el = $(this);
					setTimeout(function(){
						tr(el,e);
					},50)
				});	
				tr(elName);
				function get_trans() {
					en_to_ru = {
						'а': 'f',
						'б': ',',
						'в': 'd',
						'г': 'u',
						'д': 'd',
						'е': 't',
						'ё': '|',
						'ж': ';',
						'з': 'p',
						'и': 'b',
						'й': 'q',
						'к': 'r',
						'л': 'k',
						'м': 'v',
						'н': 'y',
						'о': 'j',
						'п': 'g',
						'р': 'h',
						'с': 'c',
						'т': 'n',
						'у': 'e',
						'ф': 'a',
						'х': '[',
						'ц': 'w',
						'ч': 'x',
						'ш': 'i',
						'щ': 'o',
						'ъ': '',
						'ы': 's',
						'ь': 'm',
						'э': '',
						'ю': '.',
						'я': 'z',
						' ': ' ',
						'і': 'b',
						'ї': ']',
                        'є': '',
                        'А': 'F',
						'Б': ',',
						'В': 'D',
						'Г': 'U',
						'Д': 'L',
						'Е': 'T',
						'Ё': '|',
						'Ж': ';',
						'З': 'P',
						'И': 'S',
						'Й': 'Q',
						'К': 'R',
						'Л': 'K',
						'М': 'V',
						'Н': 'Y',
						'О': 'J',
						'П': 'G',
						'Р': 'H',
						'С': 'C',
						'Т': 'N',
						'У': 'E',
						'Ф': 'A',
						'Х': '[',
						'Ц': 'W',
						'Ч': 'X',
						'Ш': 'I',
						'Щ': 'O',
						'Ъ': '',
						'Ы': 'S',
						'Ь': '',
						'Э': '',
						'Ю': '.',
						'Я': 'Z',
						' ': ' ',
						'І': 'B',
						'Ї': ']',
                        'Є': ''
					};
					
  
					nameVal = trim(nameVal);
					nameVal = nameVal.split("");
                    
					var trans = new String();
                    
					for (i = 0; i < nameVal.length; i++) {
						for (key in en_to_ru) {
							val = en_to_ru[key];
                            console.log(key)
							if (key == nameVal[i]) {
								trans += val;
								break
							}else if (key == "Є") {
								trans += nameVal[i]
							};
						};
					};
                     console.log(trans)
					return trans;
				}
		
				function trim(string) {
					//Удаляем пробел в начале строки и ненужные символы
					string = string.replace(/(^\s+)|'|"|<|>|\!|\||@|#|$|%|^|\^|\$|\\|\/|&|\*|\(\)|\|\/|;|\+|№|,|\?|:|{|}|\[|\]/g, "");
					return string;
				}; 
			})
		},
		disable: function () {
			$(this).data({
				status:false	
			})
		},
		enable: function () {
			$(this).data({
				status:true	
			})
		}
	};
    $.fn.liTranslit = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод ' + method + ' в jQuery.liTranslit не существует');
        }
    };
})(jQuery); 