require.config({
	paths: {
		jquery: "jquery-2.1.4.min",
		bootstrap: "bootstrap.min",
	},
	shim: {
		bootstrap: ["jquery"]
	}
});

require(["bootstrap", "cem_page"], function(boot, CEMPage){
	// Ìí¼Ó
	new CEMPage({
		url: "preview.json"
	});
	// ¸üÐÂ
	/*
	new CEMPage({
		url: "preview.json"
	});*/
});