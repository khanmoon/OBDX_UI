define(["module", "text!./view-forex-deal.html", "./view-forex-deal", "text!./view-forex-deal.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
        viewModel: viewModel,
        template:  baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});