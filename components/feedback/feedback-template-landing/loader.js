define(["module", "text!./feedback-template-landing.html", "./feedback-template-landing", "text!./feedback-template-landing.css","baseModel", "text!./feedback-template-landing.json"],
  function (module, template, viewModel, css,BaseModel) {
      "use strict";
      var baseModel = BaseModel.getInstance();
      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
      };
    });
