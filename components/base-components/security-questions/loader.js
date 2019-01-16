define(["module", "text!./security-questions.html", "./security-questions", "text!./security-questions.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });