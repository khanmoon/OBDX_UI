define(["module", "text!./entitlements-details.html", "./entitlements-details", "text!./entitlements-details.json"], function(module, template, viewModel) {
    "use strict";
    return {
        viewModel: viewModel,
        template: template
    };
});
