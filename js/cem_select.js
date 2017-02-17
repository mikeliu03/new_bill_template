define(["utils", "cem_element", "config"], function(utils, CEMElement, config){
	function CEMSelect(opt){
		if(this === window) return;
		this.init(opt);
	}

	CEMSelect.prototype = utils.inherit(CEMElement.prototype);

	$.extend(CEMSelect.prototype, {
		constructor: CEMSelect,
		
		name: "cem_select",

		html: '<div class="block"><span></span><span><input type="text" class="custom-section" disabled="disabled"><i class="arrow icon-keyboard_arrow_down"></i></span><span></span></div>',

		init_event: function(){
			CEMElement.prototype.init_event.call(this);
		}
	});

	return CEMSelect;
});