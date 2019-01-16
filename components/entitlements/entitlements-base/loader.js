define(["module", "text!./entitlements-base.html", "./entitlements-base", "text!./entitlements-base.json"], function(module, template, viewModel) {
    "use strict";
    return {
        viewModel: viewModel,
        template: template
    };
});
