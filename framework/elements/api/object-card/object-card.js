define([
    "knockout"
], function (ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.cardData = rootParams.data;
        self.numberCount = ko.observable(rootParams.count);
        self.imageSrc = ko.observable(rootParams.image);
        self.clickHandler = rootParams.clickHandler || function () {
            return false;
        };
    };
});