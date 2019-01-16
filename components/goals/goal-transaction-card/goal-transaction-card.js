define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.cardData = ko.observable(Params.data);
    };
});