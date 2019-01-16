define(["module", "text!./loan-schedule-chart.html", "./loan-schedule-chart", "text!./loan-schedule-chart.json"], function (module, template, viewModel) {
    "use strict";
    return {
      viewModel: viewModel,
      template: template
    };
  });