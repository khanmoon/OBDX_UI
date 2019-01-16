define(["module", "text!./review-add-edit-nominee.html",
        "./review-add-edit-nominee",
        "text!./review-add-edit-nominee.css", "baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });