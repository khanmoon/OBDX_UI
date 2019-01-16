define(["module",
        "text!./standing-instructions-list.html",
        "text!./standing-instructions-list-corporate.html",
        "./standing-instructions-list",
        "text!./standing-instructions-list.css",
        "baseModel","framework/js/constants/constants"
    ],
    function(module, retailTemplate, corporateTemplate, viewModel, css, BaseModel, Constants) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(Constants.userSegment === "CORP" ? corporateTemplate : retailTemplate, css, baseModel.getComponentName(module))
        };
    });