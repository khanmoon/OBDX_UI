define(["module", "text!./rd-amend.html", "./rd-amend", "text!./rd-amend.css","baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";
     var baseModel = BaseModel.getInstance();
    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});
