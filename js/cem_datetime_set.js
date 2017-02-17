define(["utils", "cem_element_set", "config"], function(utils, CEMElementSet, config){
	function CEMDatetimeSet(opt){
		this.init(opt);
	}

	CEMDatetimeSet.prototype = utils.inherit(CEMElementSet.prototype);

	$.extend(CEMDatetimeSet.prototype, {
		constructor: CEMDatetimeSet,
		
		name: "datetime_set",

		init_event: function(){
			var _this = this;
			var prefix = _this.prefix;

			// 是否必填
			this._bind_requied_event();

			// 数据源绑定
			this._init_data_resource("text_resource");

			// 前缀，后缀
			this._bind_text_blur_event("prefix", "span:first");
			this._bind_text_blur_event("suffix", "span:last");

			// placeholder
			$(prefix + "placeholder").blur(function(){
				$("input", _this.target.dom).attr("placeholder", $.trim($(this).val()));
			});

			// 宽度
			$(prefix + "width").blur(function(){
				var value = $.trim($(this).val());
				if(!value) return;
				value = value / 100 || 0.1;
				var target = $(_this.target.dom);
				var parent = target.closest(".custom-mob");
				var flex = target.css("flex");
				var cur_flex = parseInt(flex.substring(0, flex.indexOf(" "))) || 0;
				var sum_flex = 0;
				var blocks = $(".block", parent);

				if(blocks.length == 1) return;

				blocks.each(function(){
					var cur_flex = $(this).css("flex");

					sum_flex += parseInt(cur_flex.substring(0, cur_flex.indexOf(" "))) || 0;
					//sum_percent += paseFloat($(this).attr("data-width"));
				});

				if(value >= 1){
					console.log("请输入小于100%的值");
					return;
				}

				var last_flex = (sum_flex * value - cur_flex) / (1 - value);


				$(_this.target.dom).attr("data-percent", $.trim($(this).val())).css("flex", (last_flex + cur_flex) + " 1 0%");
			});
			this.common_input_init("width");

			$(prefix + "dft_day").blur(function(){
				$("input", _this.target.dom).attr("data-daterange", this.value);
			});
		},

		init_values: function(){
			var _this = this;
			var prefix = _this.prefix;
			var context = _this.target.dom;
			var _elem = $("input", context);

			// 必填
			$(prefix + "required")[0].checked = _elem.attr("required");

			// 数据源
			this.write_datasrouce();
			this._set_data_resource("text_resource");
			
			// 前缀
			$(prefix + "prefix").val($("span:first", context).html());
			
			// 后缀
			$(prefix + "suffix").val($("span:last", context).html());

			$(prefix + "placeholder").val(_elem.attr("placeholder"));

			$(prefix + "width").val($(context).attr("data-percent"));
		}
	});

	return CEMDatetimeSet;
});