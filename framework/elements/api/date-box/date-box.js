define([
    "knockout",
    "ojs/ojcore"

], function (ko, oj) {
    "use strict";
    return function (params) {
        var self = this;
        var myDate = new Date(params.date);
        self.day = ("0" + myDate.getDate()).slice(-2);
        self.month = oj.LocaleData.getMonthNames("abbreviated")[myDate.getMonth()];
        self.year = myDate.getFullYear();
    };
});