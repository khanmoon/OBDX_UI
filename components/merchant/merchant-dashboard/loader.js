define(["module", "text!./merchant-dashboard.html",
        "./merchant-dashboard",
        "text!./merchant-dashboard.css","baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
        };
    });
