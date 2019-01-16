define([
    "knockout",
    "jquery",

    "framework/js/constants/constants"
], function (ko, $, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.cardData = Params.data;
    };
});