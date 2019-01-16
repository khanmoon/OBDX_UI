define([
    "knockout"

], function (ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.debitcardData = rootParams.data;
        self.clickHandler = rootParams.data.clickHandler;
    };
});