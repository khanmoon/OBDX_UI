define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/electronic-statement",
    "ojs/ojknockout",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojmodel",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, eStatementModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        ko.utils.extend(this, rootParams.rootModel);
        var self = this;
        self.validationTracker = ko.observable();
        self.resource = ResourceBundle;
        self.accountID = self.params.id.value || self.selectedAccountNo;
        var module =self.params.module;
        self.statementYears = ko.observableArray();
        self.statementMonths = ko.observableArray();
        self.isYearLimitFetched = ko.observable(false);
        self.yearLimitCount = ko.observable();
        self.datasource = ko.observable();
        var currentYear = rootParams.baseModel.getDate().getFullYear();
        var a;
        for (a = 0; a < 5; a++) {
            self.statementYears.push({
                text: (currentYear - a).toString(),
                value: currentYear - a
            });
        }
        self.statementMonths.push({
            text: self.resource.eStatement.allMonths,
            value: "all"
        });
        for (a = 0; a < 12; a++) {
            self.statementMonths.push({
                text: oj.LocaleData.getMonthNames("abbreviated")[a],
                value: a
            });
        }
        rootParams.baseModel.registerElement("confirm-screen");
        self.listEstatements = function () {
            self.statementsFetched(false);
            eStatementModel.getEstatementsList(self.type, self.accountID, self.selectedStatementYear(), self.selectedStatementMonth(),module).done(function (data) {
                self.statements = $.map(ko.utils.unwrapObservable(data.statementDetails), function (val) {

                    val.fromDate = rootParams.baseModel.formatDate(val.fromDate);
                    val.toDate = rootParams.baseModel.formatDate(val.toDate);
                    return val;
                });
                if(data.statementDetails === undefined)
                {
                  self.statements = $.map(ko.utils.unwrapObservable(data.loanStatementDetails), function (val) {

                      val.fromDate = rootParams.baseModel.formatDate(val.fromDate);
                      val.toDate = rootParams.baseModel.formatDate(val.toDate);
                      return val;
                  });
                }
                self.datasource(new oj.ArrayTableDataSource(self.statements, { idAttribute: "statementNo" } ||[]));
                self.statementsFetched(true);
            });
        };
        self.downLoadStatement = function (data) {
            eStatementModel.downLoadStatement(self.type, self.accountID, data.statementNo,module);
        };
    };
});
