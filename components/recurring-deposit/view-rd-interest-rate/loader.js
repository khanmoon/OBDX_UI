define(["module", "text!./view-rd-interest-rate.html",
        "./view-rd-interest-rate",
        "text!./view-rd-interest-rate.css", "baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });