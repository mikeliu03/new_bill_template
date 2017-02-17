define(["utils", "cem_element", "config"], function(utils, CEMElement, config){
	function CEMText(opt){
		if(this === window) return;
		this.init(opt);
	}

	CEMText.prototype = utils.inherit(CEMElement.prototype);

	$.extend(CEMText.prototype, {
		constructor: CEMText,
		
		name: "cem_text",

		html: '<div class="block"><span>前缀</span><span><input type="text" disabled="disabled"></span><span></span></div>',

		init_event: function(){
			CEMElement.prototype.init_event.call(this);
		}
	});

	return CEMText;
});