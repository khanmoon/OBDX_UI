define(["module", "text!./disclosures.html", "./disclosures", "text!./disclosures.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });