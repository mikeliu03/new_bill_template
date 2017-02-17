define(["jquery", "config"], function($, config){
	/**
	 * 页面节点: new editor node
	 */
	function CEMElement(){}

	CEMElement.prototype = {
		constructor: CEMElement,
		
		name: "",		// 别名
		
		dom: null,							// 与对象绑定的DOM对象
		
		parent: $("#edit_area"),					// 父节点

		set: null,						// 对象对应的设置对象

		html: "",							// 生成对象的HTML

		is_preview: false,				// 是否处于预览模式

		preview_parent: null,		// 预览模式下与对象绑定的DOM对象的父节点

		preview_html: "",				// 预览模式下生成对象的HTML

		/**
		 * 初始化方法
		 */
		init: function(opt){
			var empty_box = $(".empty");
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
			
			if(!this.dom){
				var d = document.createElement("div");
				// 初始化dom
				d.innerHTML = this.html;
				this.dom = d.children[0];
				if(this.dom.className === "block"){
					$(this.dom).insertBefore(empty_box);
				}else{
					this.parent.append(this.dom);
				}
			}

			// 初始化样式
			this.init_style();

			// 初始化事件
			this.init_event();

			// 绑定对象
			$(this.dom).data("target", this);
		},

		/**
		 * 初始化事件
		 */
		init_event: function(){
			this.click();
		},

		/**
		 * 初始化样式
		 */
		init_style: function(){
			var dom = this.dom;
			var attr = config[this.name];
			var value;
			for(var key in attr){
				if(typeof attr[key] === "object" || $(dom).css(key) === undefined){
					continue;
				}
				value = this[key];
				if($.isNumeric(value) && key !== "z-index" && key !== "opacity"){
					value += "px";
				}
				dom.style[key] = value;
			}
		},

		/**
		 * 预览初始化
		 */
		preview_init: function(){},

		/**
		 * 预览初始化事件
		 */
		preview_init_event: function(){},

		/**
		 * 预览初始化样式
		 */
		preview_init_style: function(){},

		/**
		 * 属性设置/获取方法，设置属性的同时也会设置dom元素的样式
		 * 传递0个参数时，获取对象属性的集合
		 * 传递1个参数时，分2种情况：字符串直接返回属性值；对象则设置多个属性
		 * 传递2个参数时，设置该属性的值
		 */
		attr: function(){
			var len = arguments.length;

			switch(len){
				case 0:
					return this._attrs();
				case 1:
					if(typeof arguments[0] === "string"){
						return this[arguments[0]];
					}else{
						this._set_attrs(arguments[0]);
					}
					break;
				case 2:
					this._set_attr(arguments[0], arguments[1]);
					break;
			}
		},

		/**
		 * 设置多个属性的值
		 */
		_set_attrs: function(hash){
			for(var i in hash){
				if(this[i] !== undefined){
					this._set_attr(i, hash[i]);
				}
			}
		},

		/**
		 * 设置单个属性的值
		 */
		_set_attr: function(key, value){
			this[key] = value;
			if(this[key] !== undefined){
				if($.isNumeric(value) && key !== "z-index" && key !== "opacity"){
					value += "px";
				}
				this.dom.style[key] = value;
			}
		},

		/**
		 * 返回对象属性值的集合
		 */
		_attrs: function(){
			var obj = {};
			var attr = config[this.name];
			for(var key in attr){
				if($.isArray(this[key]) && this[key].length > 0 && Object.prototype.toString.call(this[key][0]) === "[object Object]"){
					obj[key] = [];
					for(var i=0; i< this[key].length; i++){
						if(!this[key][i].dom) continue;
						obj[key].push(this[key][i].attr());
					}
				}else{
					obj[key] = this[key];
				}
			}
			obj.name = this.name;
			return obj;
		},

		/**
		 * 标记选中对象
		 */
		mark: function(){
			$("#edit_area .current").removeClass("current");
			$(this.dom).addClass("current");
		},

		/**
		 * 销毁对象
		 */
		destroy: function(){
			$(this.dom).removeData().remove();
			this.parent = null;
			this.dom = null;
			this.target = null;
		},

		/**
		 * 验证当前对象的值
		 */
		validation: function(){},

		/**
		 * 选取操作
		 */
		select: function(){},

		/**
		 * 对象click事件
		 */
		click: function(){
			var _this = this;
			$(_this.dom).click(function(){
				_this.mark();
				_this.set.set(_this);
				return false;
			});
			
		},

		/**
		 * 对象contextmenu事件
		 */
		contextmenu: function(){},

		/**
		 * 对象drag和resize事件
		 */
		drag: function(){}
	};

	return CEMElement;
});