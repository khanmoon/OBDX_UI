
  define(["module", "text!./cooling-period-limit.html", "./cooling-period-limit", "text!./cooling-period-limit.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
      "use strict";
      var baseModel = BaseModel.getInstance();
      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
      };
    });
