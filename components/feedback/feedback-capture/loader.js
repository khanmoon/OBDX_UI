define(["module", "text!./feedback-capture.html", "./feedback-capture", "text!./feedback-capture.css","baseModel", "text!./feedback-capture.json"],
    function (module, template, viewModel, css,BaseModel) {
        "use strict";
        var baseModel = BaseModel.getInstance();
        return {
          viewModel: viewModel,
          template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
        };
      });
