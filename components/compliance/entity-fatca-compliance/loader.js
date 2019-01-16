define(["module", "text!./entity-fatca-compliance.html", "./entity-fatca-compliance", "text!./entity-fatca-compliance.json", "text!./entity-fatca-compliance.css", "baseModel"], function(module, template, viewModel, json, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
