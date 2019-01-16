define(["module", "text!./policy-search.html", "./policy-search","text!./policy-search.css", "baseModel", "text!./policy-search.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
