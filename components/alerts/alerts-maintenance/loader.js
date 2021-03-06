
  define(["module", "text!./alerts-maintenance.html", "./alerts-maintenance", "text!./alerts-maintenance.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
      "use strict";
      var baseModel = BaseModel.getInstance();
      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
      };
    });
