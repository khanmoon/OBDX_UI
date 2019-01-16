define(["module", "text!./footer.html", "./footer", "text!./footer.json"],function(module, template, viewModel) {
  "use strict";
  return {
    viewModel: viewModel,
    template: template
  };
});
