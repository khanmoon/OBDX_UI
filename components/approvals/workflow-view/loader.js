define(["module", "text!./workflow-view.html", "./workflow-view", "text!./workflow-view.css", "baseModel", "text!./workflow-view.json"], function (module, template, viewModel, css, BaseModel) {
	"use strict";
	var baseModel = BaseModel.getInstance();
	return {
		viewModel: viewModel,
		template: baseModel.transformTemplate(
			template , css, baseModel.getComponentName(module))
	};
});
