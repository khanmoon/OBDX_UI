define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!lzn/gamma/resources/nls/loan-tenure",
    "ojs/ojinputtext"
], function (oj, ko, $, TenureSinceModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this, i;
        ko.utils.extend(self, params);
        self.resource = resourceBundle;
        self.monthsLoaded = ko.observable(false);
        self.disableInputs = ko.observable(params.disableInputs);
        self.optionYears = ko.observableArray([]);
        self.optionMonths = ko.observableArray([]);
        TenureSinceModel.getMonths().done(function (data) {
            self.optionMonths(data.enumRepresentations[0].data);
            self.monthsLoaded(true);
        });
        var index = params.index ? params.index : 0;
        self.yearChange = function (event, data) {
            if (data.option === "value") {
                if (data.previousValue) {
                    if (params.yearChangeHandler && data.previousValue[0] !== data.value[0]) {
                        params.yearChangeHandler(event, data, index);
                    }
                } else {
                    params.yearChangeHandler(event, data, index);
                }
            }
        };
        self.monthChange = function (event, data) {
            if (data.option === "value") {
                if (data.previousValue) {
                    if (params.monthChangeHandler && data.previousValue[0] !== data.value[0]) {
                        params.monthChangeHandler(event, data, index);
                    }
                } else {
                    params.monthChangeHandler(event, data, index);
                }
            }
        };
        var today = params.baseModel.getDate();
        var yyyy = today.getFullYear();
        for (i = yyyy; i >= yyyy - self.maxVal; i--) {
            self.optionYears.push({
                label: i,
                value: i.toString()
            });
        }
        self.validateTenure = {
            validate: function () {
                var parseYear = parseInt(self.tenureYears(), 10), years = isNaN(parseYear) ? 0 : parseYear, parseMonths = parseInt(self.tenureMonths(), 10), months = isNaN(parseMonths) ? 0 : parseMonths, validateMe = years + months;
                self.tenureMonths(months.toString());
                self.tenureYears(years.toString());
                if (isNaN(validateMe) || validateMe === 0) {
                    throw new Error(self.resource.messages.loanTenure);
                }
            }
        };
    };
});
