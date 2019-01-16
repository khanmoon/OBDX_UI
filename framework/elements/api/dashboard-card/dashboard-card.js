define([], function () {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.cardData = rootParams.data;
        self.clickHandler = rootParams.data.clickHandler;
    };
});