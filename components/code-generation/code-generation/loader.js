define(["module", "text!./code-generation.html", "./code-generation", "text!./code-generation.css", "baseModel", "text!./code-generation.json"], function(module, template, viewModel, css, BaseModel) {
	"use strict";
	var baseModel = BaseModel.getInstance();
	return {
		viewModel: viewModel,
		template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
	};
});
