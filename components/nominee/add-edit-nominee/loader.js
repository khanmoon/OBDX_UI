define(["module", "text!./add-edit-nominee.html",
        "./add-edit-nominee",
        "text!./add-edit-nominee.css","baseModel"
    ],
    function(module, template, viewModel, css, BaseModel) {
        "use strict";
          var baseModel = BaseModel.getInstance();
        return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
        };
    });
