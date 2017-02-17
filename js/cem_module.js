define(["utils", "cem_element", "config"], function(utils, CEMElement, config){
	function CEMModule(opt){
		if(this === window) return;
		this.init(opt);
	}

	CEMModule.prototype = utils.inherit(CEMElement.prototype);

	$.extend(CEMModule.prototype, {
		constructor: CEMModule,
		
		name: "cem_module",

		html: '<div class="custom-mob"><h4>标题</h4><div class="custom-mob-body"><div class="prompt"><span class="glyphicon glyphicon-plus"></span>左侧控件拖放至此处添加</div></div></div>',

		init_event: function(){
			CEMElement.prototype.init_event.call(this);
		},

		mark: function(){
			$("#edit_area .current").removeClass("current");
			$("h4", this.dom).addClass("current");
		}
	});

	return CEMModule;
});