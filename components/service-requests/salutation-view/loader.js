  define(["module", "text!./salutation-view.html", "./salutation-view", "text!./salutation-view.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });