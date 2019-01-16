
  define(["module", "text!./limit-package-search.html", "./limit-package-search", "text!./limit-package-search.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
      "use strict";
      var baseModel = BaseModel.getInstance();
      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
      };
    });
