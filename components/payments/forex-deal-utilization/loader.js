define(["module", "text!./forex-deal-utilization.html",
        "./forex-deal-utilization",
        "text!./forex-deal-utilization.json"
    ],
    function(module, template, viewModel) {
        "use strict";
        return {
            viewModel: viewModel,
            template: template
        };
    });