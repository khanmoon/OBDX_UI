define(["module", "text!./goal-category-create.html",
        "./goal-category-create",
        "text!./goal-category-create.css", "baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });