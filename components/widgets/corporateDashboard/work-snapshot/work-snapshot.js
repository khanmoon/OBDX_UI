define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/maker-work-box",
    "ojs/ojchart",
    "ojs/ojanimation",
    "ojs/ojbutton"
], function (oj, ko, $, Model, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.countList = ko.observableArray([]);
        self.resource = resourceBundle;
        self.barSeriesValue = ko.observableArray();
        self.pieSeriesValue = ko.observableArray();
        var countPieSeries = [];
        self.statusState = ko.observableArray([]);
        self.defineStatus = ko.observable(false);
            Model.fetchAccounts().then(function (dataToBePassed) {
                self.defineStatus(false);
                var totalProcessCount = 0,
                    totalProgressCount = 0,
                    totalRejectedCount = 0,
                 countSet = [];
                if (dataToBePassed && dataToBePassed.countDTOList && dataToBePassed.countDTOList.length) {
                    for (var i = 0; i < dataToBePassed.countDTOList.length; i++) {
                        var j = 0,
                         name = "",
                         record = dataToBePassed.countDTOList[i];
                        record.status = [];
                        record.status.push({
                            count: record.approved || 0,
                            status: self.resource.processed,
                            statusCode: "PROCESSED",
                            icon: "icon icon-check"
                        });
                        record.status.push({
                            count: record.initiated || 0,
                            status: self.resource.progress,
                            statusCode: "PROGRESS",
                            icon: "icon icon-alert"
                        });
                        record.status.push({
                            count: record.rejected || 0,
                            status: self.resource.rejected,
                            statusCode: "REJECTED",
                            icon: "icon icon-close"
                        });
                        countSet = record.status;
                        var statusArray = countSet.length;
                        while (j < statusArray) {
                            if (countSet[j].statusCode === "PROCESSED") {
                                totalProcessCount += countSet[j].count;
                                name = countSet[j].status;
                                if (i === dataToBePassed.countDTOList.length - 1) {
                                    self.statusState.push({
                                        totalCount: totalProcessCount,
                                        name: name,
                                        type: "processed"
                                    });
                                }
                            }
                            if (countSet[j].statusCode === "PROGRESS") {
                                totalProgressCount += countSet[j].count;
                                name = countSet[j].status;
                                if (i === dataToBePassed.countDTOList.length - 1) {
                                    self.statusState.push({
                                        totalCount: totalProgressCount,
                                        name: name,
                                        type: "progress"
                                    });
                                }
                            }
                            if (countSet[j].statusCode === "REJECTED") {
                                totalRejectedCount += countSet[j].count;
                                name = countSet[j].status;
                                if (i === dataToBePassed.countDTOList.length - 1) {
                                    self.statusState.push({
                                        totalCount: totalRejectedCount,
                                        name: name,
                                        type: "rejected"
                                    });
                                }
                            }
                            j++;
                        }
                    }
                }
                for (var index = 0; index < self.statusState().length; index++) {
                    var colorVal;
                    if (index === 0) {
                        colorVal = "#2E7D32";
                    } else if (index === 1) {
                        colorVal = "#F3A50C";
                    } else if (index === 2) {
                        colorVal = "#B71C1C";
                    }
                    countPieSeries[index] = {
                        name: "",
                        items: [self.statusState()[index].totalCount],
                        color: colorVal
                    };
                }
                var totalCount = totalProcessCount + totalProgressCount + totalRejectedCount;
                if (totalCount > 0) {
                    self.pieSeriesValue(countPieSeries);
                    self.defineStatus(true);
                } else {
                    self.defineStatus(false);
                }
            });
    };
});
