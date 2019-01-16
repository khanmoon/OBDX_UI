define(["module",
    "text!./scheduled-payments.html",
    "text!./scheduled-payments-corporate.html",
    "./scheduled-payments",
    "text!./scheduled-payments.css",
    "baseModel",
    "framework/js/constants/constants"
], function(module, retailTemplate, corporateTemplate, viewModel, css, BaseModel, Constants) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(Constants.userSegment === "CORP" ? corporateTemplate : retailTemplate, css, baseModel.getComponentName(module))
    };
});