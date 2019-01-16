define([], function () {
    "use strict";
    return function (params) {
        var self = this;
        self.date = params.baseModel.formatDate(params.date, "dateMonthFormat");
        self.time = params.baseModel.formatDate(params.date, "timeFormat");
        self.timeStamp = params.baseModel.formatDate(params.date, "dateTimeStampFormat");
    };
});