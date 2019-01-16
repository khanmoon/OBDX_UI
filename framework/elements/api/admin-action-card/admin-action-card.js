define([], function () {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.actionCardClick = rootParams.clickHandler;
        self.cardData = rootParams.data;
    };
});