define(["module", "text!./net-worth-graph.html", "./net-worth-graph", "text!./net-worth-graph.css","baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css,baseModel.getComponentName(module))
    };
  });
