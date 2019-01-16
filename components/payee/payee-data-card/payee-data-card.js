define([
    "knockout",
    "jquery",

    "framework/js/constants/constants"
], function (ko, $, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userSegment = Constants.userSegment;
        self.cardData = rootParams.data;
        self.imageSrc = ko.observable(rootParams.image);
        self.clickHandler = rootParams.data.clickHandler;
    };
});