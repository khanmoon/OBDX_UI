define(["module", "text!./generic-settings.html", "./generic-settings", "text!./generic-settings.json"], function(module, template, viewModel) {
  "use strict";
  return {
    viewModel: viewModel,
    template: template
  };
});
