define(["module", "text!./comment-box.html", "./comment-box", "text!./comment-box.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });