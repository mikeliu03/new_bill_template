define(["utils", "cem_element_set", "config"], function(utils, CEMElementSet, config){
	function CEMModuleSet(opt){
		this.init(opt);
	}

	CEMModuleSet.prototype = utils.inherit(CEMElementSet.prototype);

	$.extend(CEMModuleSet.prototype, {
		constructor: CEMModuleSet,
		
		name: "module_set",

		init_event: function(){
			var _this = this;
			var prefix = _this.prefix;

			// 标题
			this._bind_text_blur_event("title", "h4");

			// 模块类型
			this._init_data_resource("type_resource", ".fee-mob-username", "");
		},

		init_values: function(){
			var _this = this;
			var prefix = _this.prefix;
			var context = _this.target.dom;

			// 标题
			$(prefix + "title").val($.trim($("h4", context).text()));

			// 数据源
			this._set_data_resource("type_resource");

			var module_arr = [];
			var droplist = $("#module_set_type_resource li");
			$("#edit_area .custom-mob:not(:first)").each(function(){
				var name = $(this).attr("name");
				if(name) module_arr.push(name);
			});
			droplist.removeClass("disabled");
			if(module_arr.length > 0){
				droplist.each(function(){
					var value = $(this).attr("data-value");
					if(module_arr.indexOf(value) >= 0 && !$(this).hasClass("current")) $(this).addClass("disabled");
				});
			}
		}
	});

	return CEMModuleSet;
});