define(["jquery", "config", "utils"], function($, config, utils){
	/**
	 * 页面元素对应设置对象的父类: new editor element set
	 */
	function CEMElementSet(){}

	CEMElementSet.prototype = {
		constructor: CEMElementSet,

		dom: null,				// 与设置对象绑定的DOM对象

		target: null,			// 当前正在设置的对象

		name: "",

		prefix: "",

		data_resource: null,		// 数据源

		/**
		 * 初始化方法
		 */
		init: function(opt){
			for(var i in opt){
				if(this[i] !== undefined){
					this[i] = opt[i];
				}
			}

			this.dom = $("#" + this.name);
			this.prefix = "#" + this.name + "_";

			// 样式初始化
			this.init_style();

			// 事件初始化
			this.init_event();

			// 绑定对象
			$(this.dom).data("target", this);
		},

		/**
		 * 初始化事件
		 */
		init_event: function(){},

		/**
		 * 初始化样式
		 */
		init_style: function(){},
		
		/**
		 * 显示设置对象
		 */
		set: function(target){
			this.target = target;

			var target = $(this.target.dom);
			var name = target.closest(".custom-mob").attr("name") || "";
			
			if(target.hasClass("block") && !name){
				utils.cem_alert("请先选择模块类型");
				$("#set_area").addClass("hideset");
				$("#edit_area").removeClass("showset");
				return;
			}

			this.init_style();
			this.init_values();
			// 控制面板
			$("#edit_area").addClass("showset");
			$("#set_area").removeClass("hideset");
			$("#set_area > div").hide();
			this.dom.show();
		},

		/**
		 * 初始化当前设置的对象的值
		 */
		init_values: function(){},

		/**
		 * 销毁设置对象
		 */
		destroy: function(){
			$(this.dom).removeData().remove();
			this.dom = null;
			this.target = null;
		},

		/**
		 * 通用必填click事件
		 */
		_bind_requied_event: function(){
			var _this = this;
			var chk = $(this.prefix + "required");
			chk.parent().click(function(){
				var _input = $("input", _this.target.dom);
				if(chk[0].checked){
					_input.attr("required", "required");
				}else{
					_input.removeAttr("required");
				}
			});
		},
		
		/**
		 * 绑定文本框 blur 事件
		 * @params name 文本框id后缀
		 * @params selector 需要操作的DOM对象的选择器
		 */
		_bind_text_blur_event: function(name, selector){
			var _this = this;
			$(_this.prefix + name).on("blur", function(){
				if(selector){
					$(selector, _this.target.dom).html(this.value);
				}else{
					$(_this.target.dom).html(this.value);
				}
			});
		},
		
		/**
		 * 绑定文本框 blur 事件 +radio click 事件
		 */
		_bind_text_radio_event: function(text_name, radio_name, selector){
			var _this = this;
			_this._bind_text_blur_event(radio_name, selector);

			$(_this.prefix + text_name).click(function(){
				var text_dom = $(selector, _this.target.dom);
				var radio_dom = $(_this.prefix + radio_name);
				$(this).toggleClass("actived");
				if($(this).hasClass("actived")){
					text_dom.hide();
					radio_dom.attr("disabled", "disabled");
				}else{
					text_dom.show();
					radio_dom.removeAttr("disabled");
				}
			});
		},

		/**
		 * 设置文本框的值
		 * @params name 文本框id后缀
		 * @params selector 需要操作的DOM对象的选择器
		 */
		_set_text_value: function(name, selector){
			if(selector){
				$(this.prefix + name).val($.trim($(selector, this.target.dom).html()));
			}else{
				$(this.prefix + name).val($.trim($(this.target.dom).html()));
			}
		},

		_init_data_resource: function(name){
			var _this = this;
			var context = $(_this.prefix + name);
			var input_show = $("input:first", context);
			var input_search = $("input:last", context);
			var drop = $(".searchlist-dropdown", context);

			context.click(function(){
				input_search.val("");
				$("li", drop).show();
				drop.show();
			}).mouseleave(function(){
				drop.hide();
			});

			input_search[0].oninput = function(){
				var search_value = $.trim(this.value);
				var drop_list = $("li", drop);
				
				if(!search_value){
					drop_list.show();
					return;
				}

				drop_list.each(function(){
					var value = $(this).html();

					if(value.indexOf(search_value) < 0){
						$(this).hide();
					}else{
						$(this).show();
					}
				});
			};

			drop.on("click", "li", function(){
				if($(this).hasClass("disabled")) return;
				var value = $(this).attr("data-value");
				var url = $(this).attr("data-url") || "";
				var show_value = $(this).html();
				var target = $(_this.target.dom);
				
				input_show.val(show_value);

				$(this).addClass("current").siblings("li").removeClass("current");
				
				if(!value){
					target.removeAttr("data-resource").removeAttr("name").removeAttr("data-url");
				}else{
					if(target.hasClass("custom-mob")){
						target.attr({
							"data-resource": value,
							"name": value
						});
					}else if($("input", target).hasClass("custom-section")){
						$("input", target).attr({
							"data-url": url,
							"data-resource": value,
							"name": value
						});
					}else{
						$("input", target).attr({
							"data-resource": value,
							"name": value
						});
					}
				}

				drop.hide();
				return false;
			});
		},

		/**
		 * 设置数据源的值
		 */
		_set_data_resource: function(name){
			var _this = this;
			var context = $(_this.prefix + name);
			var input_show = $("input:first", context);
			var input_search = $("input:last", context);
			var drop = $(".searchlist-dropdown", context);
			var target = $(_this.target.dom);
			var value = "";

			if(target.hasClass("custom-mob")){
				value = target.attr("name");
			}else{
				value = $("input", target).attr("name");
			}

			var selected_li = $("li[data-value='"+value+"']", drop);

			input_show.val(selected_li.html());
			selected_li.removeClass("disabled").addClass("current").siblings("li").removeClass("current");
		},

		write_datasrouce: function(){
			var _this = this;
			var prefix = _this.prefix;
			var context = $(prefix + "text_resource");
			var parent = $(this.target.dom).closest(".custom-mob");
			var name = parent.attr("name") || "";
			var name_list = [];

			$(".block", parent).each(function(){
				var value = $("input", this).attr("name");
				if(value) name_list.push(value);
			});

			var data = window._database[name];
			var str = '<li data-value="" class="current">请选择</li>';
			for(var i=0; i<data.length; i++){
				if(name_list.indexOf(data[i].key) >= 0){
					str += '<li class="disabled" data-value="'+data[i].key+'" data-url="'+data[i].url+'">'+data[i].value+'</li>';
				}else{
					str += '<li data-value="'+data[i].key+'" data-url="'+data[i].url+'">'+data[i].value+'</li>';
				}
			}
			$("ul", context).html(str);
		},
		
		/**
		 * 通用设置验证事件
		 */
		_bind_valid_event: function(suffix, valid_name){
			var _this = this;
			var chk = $(this.prefix + suffix);
			chk.parent().click(function(){
				var _input = $("input", _this.target.dom);
				if(chk[0].checked){
					_input.attr(valid_name, "true");
				}else{
					_input.removeAttr(valid_name);
				}
			});
		},
		
		/**
		 * 通用input事件处理
		 */
		common_input_init: function(suffix){
			$(this.prefix + suffix)[0].addEventListener("textInput", function(e){
				if(!/^\d$/.test(e.data)) e.preventDefault();
			}, false);
		}
	};

	return CEMElementSet;
});