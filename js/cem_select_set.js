define(["utils", "cem_element_set", "config"], function(utils, CEMElementSet, config){
	function CEMSelectSet(opt){
		this.init(opt);
	}

	CEMSelectSet.prototype = utils.inherit(CEMElementSet.prototype);

	$.extend(CEMSelectSet.prototype, {
		constructor: CEMSelectSet,
		
		name: "select_set",

		init_event: function(){
			var _this = this;
			var prefix = _this.prefix;

			// 是否必填
			this._bind_requied_event();

			// 默认名称
			this._bind_text_blur_event("name");

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

			// 字段绑定
			this._init_data_resource("text_resource");
		},

		init_values: function(){
			var _this = this;
			var prefix = _this.prefix;
			var context = _this.target.dom;
			var _icon = $("span", context);

			// 必填
			if(_icon.css("display") === "none"){
				$(prefix + "required").addClass("actived");
			}else{
				$(prefix + "required").removeClass("actived");
			}

			// 默认名称
			$(prefix + "name").val($("option", context).html());

			// 字段绑定
			this.write_datasrouce();
			this._set_data_resource("text_resource");

			$(prefix + "width").val($(context).attr("data-percent"));
		},

		_bind_text_blur_event: function(name){
			var _this = this;
			$(_this.prefix + name).on("blur", function(){
				$("input", _this.target.dom).val(this.value);
			});
		}
	});

	return CEMSelectSet;
});