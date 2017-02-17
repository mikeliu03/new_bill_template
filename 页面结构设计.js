// 自定义表单页面对象
var CEMPage = {
	init: function(){},			// 初始化页面
	init_model: function(){},		// 初始化表单元素添加区域			2天
	init_main: function(){},		// 初始化表单元素显示区域			2天
	init_set: function(){},			// 初始化表单元素设置区域			2天
	init_data_source: function(){},		// 初始化数据源插件		1天
	load: function(){},			// 加载要编辑的页面					
	load_data_names: function(){},			// 加载数据库字段		
	load_data_source: function(){},			// 加载各类数据源
	update: function(){},		// 更新编辑好的页面						.5天
	preview: function(){},		// 预览当前编辑的页面					.5天
}

// 表单元素类			2天
var CEMElement = {
	name: "",		// 别名
	dom: null,		// 与表单元素对象绑定的DOM
	set: null,		// 表单元素对象的设置类
	parent: null,	// DOM对象的父节点
	html: "",		// 生成DOM的html
	is_preview: false,				// 是否处于预览模式
	preview_parent: null,		// 预览模式下与对象绑定的DOM对象的父节点
	preview_html: "",				// 预览模式下生成对象的HTML
	init: function(){},			// 初始化
	init_style: function(){},	// 样式初始化
	init_event: function(){},	// 事件初始化
	preview_init: function(){},			// 预览初始化
	preview_init_style: function(){},	// 预览样式初始化
	preview_init_event: function(){},	// 预览事件初始化
	attr: function(){},		// 属性设置/获取方法，设置属性的同时也会设置dom元素的样式：传递0个参数时，获取对象属性的集合；传递1个参数时，分2种情况：字符串直接返回属性值；对象则设置多个属性；传递2个参数时，设置该属性的值
	mark: function(){},		// 标记选中元素，只有一个元素处于编辑状态
	destroy: function(){},	// 销毁表单元素对象
	validate: function(){},	// 验证
	click: function(){},	// click event
	drag: function(){},	// drag event
	contextmenu: fucntion(){}		// contextmenu event
};

/****************************** 表单元素类子类 ************************************/
var CEMText = {};				// .5天
var CEMRadio = {};			// .5天
var CEMCheckbox = {};		// .5天
var CEMButton = {};			// .5天
var CEMSelect = {};			// 1天
var CEMTextArea = {};		// .5天
var CEMCustomModule = {};		// 2天
/****************************** 表单元素类子类 ************************************/

// 表单元素设置类			2天
var CEMElementSet = {
	dom: null,				// 与设置对象绑定的DOM对象
	target: null,			// 当前正在设置的对象
	name: "",				// 别名
	prefix: "",				// 统一前缀，详细设置DOM对象命名规则：别名+功能名，如 text_set_range
	init: function(){},			// 初始化
	init_style: function(){},	// 样式初始化
	init_event: function(){},	// 事件初始化
	set: function(){},			// 设置，当点击表单元素时，显示对应的设置对象
	destroy: function(){},		// 销毁对象
	// 可以提取N多公告设置方法：必填/固定/前缀后缀/隐藏/宽度
};
/****************************** 表单元素设置类子类 ************************************/
var CEMTextSet = {
	// 属性设置：maxlength/placeholder/验证（range/number/ID/URL/Email）
};
var CEMTextSet = {};		// .5天
var CEMRadioSet = {};		// .5天
var CEMCheckboxSet = {};		// .5天
var CEMButtonSet = {};		// .5天
var CEMSelectSet = {};		// 1天
var CEMTextAreaSet = {};		// .5天
var CEMCustomModuleSet = {};		// 1天
/****************************** 表单元素设置类子类 ************************************/