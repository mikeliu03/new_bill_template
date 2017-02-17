define(["utils", "cem_element_set", "config"], function(utils, CEMElementSet, config){
	function CEMTextSet(opt){
		this.init(opt);
	}

	CEMTextSet.prototype = utils.inherit(CEMElementSet.prototype);

	$.extend(CEMTextSet.prototype, {
		constructor: CEMTextSet,
		
		name: "text_set",

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

			// placeholder
			$(prefix + "placeholder").blur(function(){
				$("input", _this.target.dom).attr("placeholder", $.trim($(this).val()));
			});

			// maxlength
			$(prefix + "maxlength").blur(function(){
				var value = $.trim($(this).val());
				value = parseInt(value) || "";
				$("input", _this.target.dom).attr("maxlength", value);
			});
			this.common_input_init("maxlength");

			// valid
			this._bind_valid_event("valid_number", "data-rule-number");
			this._bind_valid_event("valid_digit", "data-rule-digit");
			this._bind_valid_event("valid_url", "data-rule-url");
			this._bind_valid_event("valid_email", "data-rule-email");
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

			$(prefix + "width").val($(context).attr("data-percent"));

			$(prefix + "placeholder").val(_elem.attr("placeholder"));
			$(prefix + "maxlength").val(_elem.attr("maxlength"));

			$(prefix + "valid_number")[0].checked = _elem.attr("data-rule-number");
			$(prefix + "valid_digit")[0].checked = _elem.attr("data-rule-digit");
			$(prefix + "valid_url")[0].checked = _elem.attr("data-rule-url");
			$(prefix + "valid_email")[0].checked = _elem.attr("data-rule-email");
		}
	});

	return CEMTextSet;
});