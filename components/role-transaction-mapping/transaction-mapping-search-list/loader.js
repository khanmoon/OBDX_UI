define(["module", "text!./transaction-mapping-search-list.html", "./transaction-mapping-search-list","text!./transaction-mapping-search-list.css", "baseModel", "text!./transaction-mapping-search-list.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";
  var baseModel = BaseModel.getInstance();
  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});