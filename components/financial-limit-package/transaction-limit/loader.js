
    define(["module", "text!./transaction-limit.html", "./transaction-limit", "text!./transaction-limit.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
          viewModel: viewModel,
          template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
        };
      });
