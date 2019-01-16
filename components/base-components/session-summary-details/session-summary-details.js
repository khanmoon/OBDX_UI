define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",

    "ojL10n!resources/nls/session-summary",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, SessionSummaryDetailsModel, Constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.txnDataLoaded = ko.observable(false);
        SessionSummaryDetailsModel.getDetails(rootParams.data.sessionId).done(function (data) {
            var list = $.map(ko.utils.unwrapObservable(data.auditList), function (val) {
                val.startTime = rootParams.baseModel.formatDate(val.startTime, "dateTimeStampFormat");
                return val;
            });
            self.datasource = new oj.ArrayTableDataSource(list, { idAttribute: "id" });
            self.paginationDataSource = new oj.PagingTableDataSource(new oj.FlattenedTreeTableDataSource(new oj.FlattenedTreeDataSource(new oj.JsonTreeDataSource(list))));
            self.txnDataLoaded(true);
        });
    };
});