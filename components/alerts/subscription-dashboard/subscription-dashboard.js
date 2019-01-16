define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model"
], function (oj, ko, $, CustomerSubscriptionHomeModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.modules = ko.observableArray();
        rootParams.baseModel.registerElement("action-card");
        self.moduleInfoHandler = function (data) {
            ko.utils.arrayPushAll(self.modules, data.modules);
        };
        CustomerSubscriptionHomeModel.fetchModules(self.moduleInfoHandler);
    };
});