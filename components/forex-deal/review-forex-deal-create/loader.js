define(["module", "text!./review-forex-deal-create.html",
        "./review-forex-deal-create",
        "text!./review-forex-deal-create.css",
        "baseModel"
    ],
    function(module, template, viewModel,css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });