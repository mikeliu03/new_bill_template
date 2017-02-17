define(["jquery"], function($){
	/**
	 * 对象属性合并方法，将第二个以后的所有参数（对象）的属性合并到第一个参数（对象）中
	 */
	function extend(){
		var extend_obj = arguments[0];
		var obj = null

		for(var i=1; i<arguments.length; i++){
			obj = arguments[i];
			for(var key in obj){
				if(!extend_obj[key]){
					extend_obj[key] = obj[key];
				}
			}
		}

		return extend_obj;
	}

	var alert_html = '<div class="modal fade" id="cem_alert" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span>&times;</span></button><h4 class="modal-title">提示</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-primary">确定</button></div></div></div></div>';
	/**
	 * 模拟alert
	 */
	function cem_alert(message, callback, cancel_callback){
		var _alert = $("#cem_alert");
		
		if(_alert.length <=0){
			_alert = $(alert_html);
			$(document.body).append(_alert);
		}
		
		$(".modal-footer button:last", _alert).off("click").click(_alert_btn_func);
		$(".modal-footer button:first", _alert).off("click").click(_alert_btn_func);

		$(".modal-body", _alert).html(message);
		_alert.modal("show");

		var flag_ok = false;

		_alert.on("hidden.bs.modal", function (e) {
			if(cancel_callback && !flag_ok){
				cancel_callback();
			}

			_alert.off("hidden.bs.modal");
		});

		function _alert_btn_func(e){
			var target = $(e.target);
			if(target.hasClass("btn-primary")) flag_ok = true;
			_alert.modal("hide");
            _alert.on("hidden.bs.modal", function () {
                if (callback) {
                    callback();
                }

				_alert.off("hidden.bs.modal");
				flag_ok = false;
            });
		}
	}

	/**
	 * 继承通用函数
	 */
	function inherit(proto){
		function f(){}
		f.prototype = proto;
		return new f();
	}

	return {
		extend: extend,
		inherit: inherit,
		cem_alert:cem_alert
	};
});