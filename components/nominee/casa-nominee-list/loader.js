define(["module", "text!./casa-nominee-list.html",
        "./casa-nominee-list",
        "text!./casa-nominee-list.css","baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
        };
    });
