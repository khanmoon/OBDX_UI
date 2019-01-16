define(["module", "text!./feedback-transaction-configuration.html", "./feedback-transaction-configuration", "text!./feedback-transaction-configuration.css","baseModel", "text!./feedback-transaction-configuration.json"],
    function (module, template, viewModel, css,BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
          viewModel: viewModel,
          template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
        };
      });
