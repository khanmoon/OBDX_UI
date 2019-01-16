define(["module", "text!./goal-category-view.html",
        "./goal-category-view",
        "text!./goal-category-view.css", "baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });