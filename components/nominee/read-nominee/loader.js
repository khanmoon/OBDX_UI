define(["module", "text!./read-nominee.html",
        "./read-nominee",
        "text!./read-nominee.json"
    ],
    function(module, template, viewModel) {
        "use strict";
        return {
            viewModel: viewModel,
            template: template
        };
    });