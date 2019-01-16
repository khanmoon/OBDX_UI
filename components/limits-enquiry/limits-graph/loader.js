define(["module", "text!./limits-graph.html", "./limits-graph", "text!./limits-graph.css", "baseModel", "text!./limits-graph.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
