  define(["module", "text!./feedback-analysis.html", "./feedback-analysis", "text!./feedback-analysis.css","baseModel", "text!./feedback-analysis.json"],
      function (module, template, viewModel, css,BaseModel) {
          "use strict";
          var baseModel = BaseModel.getInstance();
          return {
            viewModel: viewModel,
            template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
          };
        });
