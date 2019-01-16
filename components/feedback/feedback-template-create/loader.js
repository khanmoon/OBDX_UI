define(["module", "text!././feedback-template-create.html", "././feedback-template-create", "text!././feedback-template-create.css","baseModel", "text!././feedback-template-create.json"],
  function (module, template, viewModel, css,BaseModel) {
      "use strict";
      var baseModel = BaseModel.getInstance();
      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
      };
    });
