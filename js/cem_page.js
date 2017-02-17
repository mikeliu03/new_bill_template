define(function(require){
	var $ = require("jquery");		// 引入jquery
	

	/************************ 模块和模块定义类引入 ***********************************/
	var CEMTitle = require("cem_title");
	var CEMTitleSet = require("cem_title_set");
	var CEMModule = require("cem_module");
	var CEMModuleSet = require("cem_module_set");
	var CEMText = require("cem_text");
	var CEMTextSet = require("cem_text_set");
	var CEMSelect = require("cem_select");
	var CEMSelectSet = require("cem_select_set"); 
	var CEMDatetime = require("cem_datetime");
	var CEMDatetimeSet = require("cem_datetime_set"); 
	var utils = require("utils");
	/************************ 模块和模块定义类引入 end ***********************************/

	var title_set = module_set = text_set = select_set = datetime_set = null;

	var data_resource = null;

	/**
	 * 自定义表单页面对象
	 * 功能：加载页面；初始化各个功能模块；保存页面；预览页面
	 */
	function CEMPage(opt){
		if(this === window) return;

		this.init(opt);
	}

	CEMPage.prototype = {
		/**
		 * 加载页面
		 * 1：根据ajax请求的返回值判断是添加还是跟新操作
		 * 2：初始化各个模块功能
		 */
		init: function(opt){
			// 页面loading
			$("#loading").modal("show");

			// 初始化各个功能模块
			this.init_model();
			this.init_main();
			this.init_set();
			this.init_func_btns();

			// 初始化bootstrap popover
			$('[data-toggle="popover"]').popover();

			$.ajax({
				url: opt.url, 
				type: "get",
				data: opt.data,
				dataType: "json",
				success: function(data){
					// 加载数据源
					$.ajax({
						url: data["data-resource"], 
						type: "get",
						dataType: "json",
						success: function(data){
							window._database = data;
						}
					});

					if(data._html){		// update
						$("#edit_area").html(data._html);
						// 绑定对象
						new CEMTitle({set: title_set});
						$("#edit_area .custom-mob").each(function(index){
							if(index !== 0){
								new CEMModule({
									dom: this,
									set: module_set
								});
							}

							$(".block", this).each(function(){
								var _elem = $("input", this);
								_elem.attr("disabled", "disabled");

								switch(_elem[0].className){
									case "":
										new CEMText({dom: this, set: text_set});
										break;
									case "custom-section":
										new CEMSelect({dom: this, set: select_set});
										break;
									case "custom-time":
										new CEMDatetime({dom: this, set: select_set});
										break;
								}
							});
						});
					}else{	// add
						// 加载页面数据
						new CEMTitle({set: title_set});
					}
					
				},
				error: function(){
					console.log("error...........");
				}
			});
		},

		/**
		 * 初始化表单元素添加区域
		 */
		init_model: function(){
			var edit_area = $("#edit_area");
			var drag = $("#add_area li");
			var parent = $(document.body);
			var drag_box = $(".drag-block");
			var empty_box = $(".empty");
			var empty_mob = $(".fee-addmob");
			var star_x = star_y = box_x = box_y = 0;
			var that = cloneBox = cur_mob = null;
			var _current = this;

			drag.on("mousedown touchstart", _down);

			function _down(e){
				e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
				that = $(this);
				cloneBox = that.html();
				star_x = e.pageX;
				star_y = e.pageY;
				box_x = that.offset().left;
				box_y = that.offset().top;
				
				drag_box.html(cloneBox);
				parent.on("mousemove touchmove", _move).on("mouseup touchend", _up);
			}

			function _move(e){
				e.preventDefault();   //取消默认动作
				e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
				var move_x = box_x + e.pageX - star_x;
				var move_y = box_y + e.pageY - star_y;
				var area_x = edit_area.offset().left + 165, area_y = edit_area.offset().top, area_w = edit_area.width(), area_h = edit_area.height();
				var mobs = $(".custom-mob", edit_area);
				var index = that.index();

				drag_box.removeClass('hide').css({
					'left':move_x,
					'top':move_y
				});

				// 不在编辑范围内
				if(e.pageX < area_x || e.pageX > area_x + area_w || e.pageY < area_y || e.pageY > area_y + area_h){
					if(index === 0){
						empty_mob.addClass("hide");
					}else{
						empty_box.addClass("hide");
					}
					return;
				}

				// 页面上没有模块时
				if(index !== 0 && mobs.length <= 0) return;

				if(index === 0){		// 如果是模块
					edit_area.append(empty_mob.removeClass("hide"));
				}else{		// 如果是其他元素
					//控件容器坐标对比
					mobs.each(function(_index, element) {
						var _this = $(this), m_x = _this.offset().left, m_y = _this.offset().top, m_w = _this.outerWidth(), m_h = _this.outerHeight();
						//是否移动到容器坐标内	
						if(move_x>=m_x && move_x<=m_x+m_w && move_y>=m_y && move_y<= m_y + m_h ){
							cur_mob = $(".custom-mob-body:first", _this);
							$(".prompt", cur_mob).hide();
							$(".custom-mob-body:first", _this).append(empty_box.removeClass('hide'));

							$(".block", _this).each(function(_index, element) { 
								var _this = $(this), s_x = _this.offset().left, s_w = _this.outerWidth(true); 
								
								//容器内子节点坐标判断	
								if(move_x >= s_x && move_x<= s_x+s_w/2){
									  _this.before(empty_box);
								}else if(move_x>=s_x+s_w/2 && move_x<= s_x+s_w){
									  _this.after(empty_box);
								}				
							});
						}						
					});
				}
			}

			function _up(e){
				var cur_mob_parent = null;
				drag_box.addClass('hide');
				drag_box[0].removeAttribute("style");     //取消行内样式

				if(that.index() === 0){
					if($(".custom-mob", edit_area).length >= 8){
						utils.cem_alert("每个表单最多添加6个模块");
					}else{
						if(!empty_mob.hasClass('hide')){
							new CEMModule({set: module_set});
						}
					}
					parent.append(empty_mob.addClass("hide"));
				}else{
					if(!empty_box.hasClass('hide')){
						cur_mob_parent = cur_mob.closest(".custom-mob");
						// 判断要添加的元素类型
						switch(that.index()){
							case 1:
								if($(".block", cur_mob).length >= 10){
									utils.cem_alert("每个模块最多添加10个表单元素");
								}else{
									new CEMText({set: text_set, parent: cur_mob});
								}
								break;
							case 2:
								if($(".block", cur_mob).length >= 10){
									utils.cem_alert("每个模块最多添加10个表单元素");
								}else{
									new CEMSelect({set: select_set, parent: cur_mob});
								}
								break;
							case 3:
								if($(".block", cur_mob).length >= 10){
									utils.cem_alert("每个模块最多添加10个表单元素");
								}else{
									new CEMDatetime({set: datetime_set, parent: cur_mob});
								}
								break;
						}
						$("#edit_area .custom-mob").each(function(){
							if(this !== cur_mob_parent[0] && $(".block", this).length <= 0){
								$(".prompt", this).show();
							}
						});
					}else{
						if($(".block", cur_mob_parent).length <= 0){
							$(".prompt", cur_mob_parent).show();
						}
						if($(".custom-mob", edit_area).length <= 0){
							utils.cem_alert("<font style='color:red'>请先添加自定义模块<span class='glyphicon glyphicon-paste' style='font-size:26px;'></span></font><br />文本框、下拉菜单、文本域都必须在自定义模块中添加");
						}
					}
					parent.append(empty_box.addClass("hide"));
				}

				parent.off("mousemove touchmove", _move).off("mouseup touchend", _up);
			}

			// 点击自定义模块，执行添加动作
			drag.eq(0).click(function(){
				if($(".custom-mob", edit_area).length >= 8){
					utils.cem_alert("每个表单最多添加8个模块");
					return;
				}
				new CEMModule({set: module_set});
			});
		},
		
		/**
		 * 初始化表单元素编辑区域
		 */
		init_main: function(){
			var edit_area = $("#edit_area .custom-mob");
			var empty_mob = $(".fee-addmob");

			// 模块内拖拽
			edit_area.on("mousedown touchstart", ".block", function(e){
				e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
				var star_x = e.pageX;
				var star_y = e.pageY;
				var that = $(this);
				var box_x = that.position().left;
				var box_y = that.position().top;
				var parent = that.parent();
				var drag_parent = $(document.body);
				var empty_box = $(".empty");

				drag_parent.on("mousemove touchmove", function(e){
					e.preventDefault();   //取消默认动作
					e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;

					move_x = box_x + e.pageX - star_x,
					move_y = box_y + e.pageY - star_y;
						
					that.css({
						'left':move_x,
						'top':move_y,
						'position':'absolute',
						'width':that.outerWidth(),
						'height':that.outerHeight(),
						'z-index':'999',
						'cursor':'-webkit-grabbing'
					});
					that.after(empty_box.removeClass('hide'));
						
					$(".block",parent).each(function(index, element) {
						var m_x = $(this).position().left;
						var m_y = $(this).position().top;
						var m_w = $(this).outerWidth();
						var m_h = $(this).outerHeight();
						
						if(that[0] != element){
							//是否移动到容器坐标内	
							if(move_x>=m_x && move_x<=m_x+m_w && move_y>=m_y && move_y<= m_y + m_h ){
									
									//容器内子节点坐标判断	
									if(move_x >= m_x && move_x<= m_x+m_w/2){
										  $(this).before(empty_box);
									}else if(move_x>=m_x+m_w/2 && move_x<= m_x+m_w){
										  $(this).after(empty_box);
									}		
							}
						}
						
					});
				});
				
				drag_parent.on("mouseup touchend", function(e){
					if(!empty_box.hasClass('hide')){
						empty_box.after(that).addClass('hide');
						that[0].removeAttribute("style"); 
					}
					
					drag_parent.append(empty_box);
					drag_parent.off('mousemove touchmove').off('mouseup touchend');
				});
			});

			// 模块拖拽
			edit_area.on("mousedown touchstart", ".custom-mob-title", function(e){
				e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
				var star_y = e.pageY;
				var that = $(this).parent();
				var box_y = that.position().top;
				var parent = that.parent().parent();
				var _this = $(this);
				
				$(document.body).on("mousemove touchmove", function(e){
					e.preventDefault();   //取消默认动作
					e = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
					var Scroll_y = $(".fee-editor-m")[0].scrollTop;
					var motion_y = e.pageY - star_y;  
					var move_y = box_y + motion_y + Scroll_y;
						
					that.css({
						'top':move_y,
						'position':'absolute',
						'width':that.outerWidth(),
						'height':that.outerHeight(),
						'z-index':'999'
					});
					
					_this.css({
						'cursor':'-webkit-grabbing'
					});
					
					that.after(empty_mob.removeClass('hide'));
					
					$(".custom-mob",parent).each(function(index, element) {
						var m_y = $(this).position().top;
						var m_h = $(this).outerHeight();
						if(that[0] != element){
							//是否移动到容器坐标内	
							if(move_y >= m_y &&  move_y <= m_y + m_h ){
								//容器内子节点坐标判断	
								if(move_y >= m_y && move_y<= m_y+m_h/2){ 
									  $(this).before(empty_mob);
								}else if(move_y>=m_y+m_h/2 && move_y<= m_y+m_h){
									  $(this).after(empty_mob);
								}
							}
						}
					});
				});
					
				$(document.body).on("mouseup touchend", function(e){
					_this[0].removeAttribute("style"); 
								
					if(!empty_mob.hasClass('hide')){
						empty_mob.after(that).addClass('hide');
						that[0].removeAttribute("style"); 
					}

					$(document.body).append(empty_mob);
					$(document.body).off('mousemove touchmove').off('mouseup touchend');
				});
			});
		},

		/**
		 * 初始化表单元素设置区域
		 */
		init_set: function(){
			title_set = new CEMTitleSet();
			module_set = new CEMModuleSet();
			text_set = new CEMTextSet();
			select_set = new CEMSelectSet();
			datetime_set = new CEMDatetimeSet();
		},

		/**
		 * 初始化数据源插件和功能按钮区：保存、预览、帮助、退出等等。。
		 */
		init_func_btns: function(){
			var _this = this;
			$("#save").click(function(){
				// 保存编辑区域的所有html
				var _html = $("#edit_area").html();
				console.log(_html);
			});

			$(document).on("keydown", function(e){
				var _mark = $("#edit_area .current");
				var active_elem = document.activeElement;
				if(_mark.length <= 0 || active_elem.tagName.toLowerCase() === "input") return;
				switch(e.keyCode){
					case 46:		// delete
						if(_mark.hasClass("custom-mob-header")){
							utils.cem_alert("不能删除表单的标题");
							return;
						}
						if(_mark.hasClass("custom-mob-title")){
							_mark.parent().data("target").destroy();
						}else{
							if(_mark.siblings(".block").length <= 0){
								_mark.siblings(".prompt").show();
							}
							_mark.data("target").destroy();
						}
						$("#edit_area").removeClass("showset");
						$("#set_area").addClass("hideset");
						break;
				}
			});

			$("#boot_alert").on("show.bs.modal", function(){
				var _this = $(this);
				$(".modal-body", _this).html(_this.data("message") || "");
				setTimeout(function(){
					_this.modal("hide");
				}, 3000);
			});

			var step = -1;
			$(".fee-prompt button").click(function(){
				step++;
				if(step >=1){
					step = 1;
				}
				$(".fee-prompt > div").removeClass("block");
				switch (step){
					case 0:
						$(".fee-prompt > div:last").addClass("block");
					break;
					case 1:
						$(".fee-prompt").addClass("hide");
						step = -1;
					break;
				}
			});
			
			$("#help").click(function(){
				$(".fee-prompt").removeClass("hide");
				$(".fee-prompt > div:nth-child(2)").addClass("block");
			});
		},

		show_error: function(message){
			$("#boot_alert").data("message", message).modal("show");
		},

		load_data_names: function(){},

		load_data_source: function(){},

		update: function(){},

		preview: function(){},
		
		contextmenu: function(){}
	};

	return CEMPage ;
});