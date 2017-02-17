define(["utils", "cem_element", "config"], function(utils, CEMElement, config){
	function CEMTitle(opt){
		if(this === window) return;
		this.init(opt);
	}

	CEMTitle.prototype = utils.inherit(CEMElement.prototype);

	$.extend(CEMTitle.prototype, {
		constructor: CEMTitle,
		
		name: "cem_title",

		init: function(opt){
			$.extend(true, this, config[this.name]);

			for(var i in opt){
				if(this[i] !== undefined){
					this[i] = opt[i];
				}
			}

			if(this.is_preview){
				this.preview_init();
				return;
			}
			
			this.dom = document.querySelector("#" + this.name);

			// 初始化样式
			this.init_style();

			// 初始化事件
			this.init_event();

			// 绑定对象
			$(this.dom).data("target", this);
			
		},

		init_event: function(){
			CEMElement.prototype.init_event.call(this);
		}
			
	});

	return CEMTitle;
});