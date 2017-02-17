define(["utils", "cem_element", "config"], function(utils, CEMElement, config){
	function CEMDatetime(opt){
		if(this === window) return;
		this.init(opt);
	}

	CEMDatetime.prototype = utils.inherit(CEMElement.prototype);

	$.extend(CEMDatetime.prototype, {
		constructor: CEMDatetime,
		
		name: "cem_text",

		html: '<div class="block"><span>前缀</span><span><input type="text" disabled="disabled" class="custom-time"><i class="custom-date glyphicon glyphicon-calendar"></i></span><span></span></div>',

		init_event: function(){
			CEMElement.prototype.init_event.call(this);
		}
	});

	return CEMDatetime;
});