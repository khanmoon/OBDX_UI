define([
    "knockout",
    "jquery",
    "framework/js/constants/constants"
], function (ko, $, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.constants = Constants;
        self.label = rootParams.label;
        self.value = rootParams.value;
        self.dataId = rootParams.dataId;
        self.dataClass = rootParams.dataClass;
        self.computeStyles = function () {
            return self.dataClass + (self.constants.userSegment === "ADMIN" || self.constants.userSegment === "CORPADMIN" ? " oj-md-8 oj-lg-9" : "");
        };
    };
});
