define(["module","text!./edit-forex-deal-settings.html", "./edit-forex-deal-settings","text!./edit-forex-deal-settings.css","baseModel"], function(module, template, viewModel,css, BaseModel) {
    "use strict";
	var baseModel = BaseModel.getInstance();
    return {
        viewModel: viewModel,
        template:  baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});