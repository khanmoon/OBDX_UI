define(["module", "text!./feedback-scale-configuration.html", "./feedback-scale-configuration", "text!./feedback-scale-configuration.css","baseModel", "text!./feedback-scale-configuration.json"],
    function (module, template, viewModel, css,BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
          viewModel: viewModel,
          template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
        };
      });
