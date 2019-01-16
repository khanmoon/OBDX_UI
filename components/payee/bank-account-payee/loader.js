define([
    "module",
    "text!./bank-account-payee.html",
    "./bank-account-payee",
    "text!./bank-account-payee.css",
    "baseModel",
    "text!./bank-account-payee.json"
], function(module, template, viewModel, css, BaseModel) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
});