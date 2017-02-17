define(["utils", "cem_element_set", "config"], function(utils, CEMElementSet, config){
	function CEMTitleSet(opt){
		this.init(opt);
	}

	CEMTitleSet.prototype = utils.inherit(CEMElementSet.prototype);

	$.extend(CEMTitleSet.prototype, {
		constructor: CEMTitleSet,
		
		name: "title_set",

		init_event: function(){
			var _this = this;
			var prefix = _this.prefix;

			// 标题
			this._bind_text_blur_event("title");
		},

		init_values: function(){
			// 标题
			this._set_text_value("title");
		}
	});

	return CEMTitleSet;
});