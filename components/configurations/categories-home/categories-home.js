define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerComponent("categories", "configurations");
        self.configComponentName = ko.observable("categories");
        self.categoryValue = ko.observable();
        self.categoryFilterData = ko.observable();
        self.categoryType = ko.observable();
        self.baseCategoryValue = ko.observable();
    };
});