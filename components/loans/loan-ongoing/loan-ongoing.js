define([
    "knockout"
], function (ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.count = ko.observable(23);
        rootParams.baseModel.registerElement("object-card");
    };
});