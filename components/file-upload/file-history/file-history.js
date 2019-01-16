define([
    "knockout",
    "jquery",
    "ojs/ojcore",

    "./model",
    "ojL10n!resources/nls/file-history",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojlistview",
    "ojs/ojpopup",
    "ojs/ojtable",
    "ojs/ojtrain",
    "ojs/ojarraytabledatasource"
], function(ko, $, oj, fileHistoryModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.fileHistory;
        self.historyMap = {};
        self.selectedFile = rootParams.data[0];
        self.fileWorkFlowStagesList = ko.observableArray();
        self.fileWorkFlowStagesListMap = {};
        self.downloadFile = ko.observable();
        self.statusList = rootParams.data[1];
        self.allowAccess = rootParams.data[2];
        self.statusArray = ko.observableArray();
        self.currentStepValue = ko.observable();
        self.fileWorkFlowStagesListLoaded = ko.observable(false);
        self.history = ko.observableArray(self.selectedFile().fileHistory);
        self.renderRecordLabelMap = {};
        self.recErrorStatusDTOMap = {};
        self.recSuccessStatusDTOMap = {};
        self.recordLabelRendered = ko.observable(false);
        self.renderRecordLabelList = ko.observableArray();
        if (self.selectedFile().totalRecords === 0) {
            self.selectedFile().totalRecords = "NA";
        }
        if (self.history().length > 0) {
            for (var i = 0; i < self.history().length; i++) {
                if (self.history()[i].endDate) {
                    self.history()[i].date = self.history()[i].endDate;
                } else if ((self.history()[i].stepId === "UPLOADED" || self.history()[i].stepId === "PROCESSED") && self.history()[i].startDate) {
                    self.history()[i].date = self.history()[i].startDate;
                } else {
                    self.history()[i].date = "-";
                }
                self.historyMap[self.history()[i].stepId] = self.history()[i].date;
            }
        }
        if (self.selectedFile().fileStatus === "ERROR") {
            if (self.historyMap.PROCESSED)
                self.currentStepValue("PROCESSED");
            else if (self.historyMap.PROCESSING_IN_PROGRESS)
                self.currentStepValue("PROCESSING_IN_PROGRESS");
            else if (self.historyMap.APPROVED)
                self.currentStepValue("APPROVED");
            else if (self.historyMap.VERIFIED)
                self.currentStepValue("VERIFIED");
        } else if (self.selectedFile().fileStatus === "REJECTED" || self.selectedFile().fileStatus === "EXPIRED") {
            self.currentStepValue("APPROVED");
        } else if (self.selectedFile().fileStatus === "PROCESSEXCP" || self.selectedFile().fileStatus === "DELETED") {
            self.currentStepValue("PROCESSED");
        } else {
            self.currentStepValue(self.selectedFile().fileStatus);
        }
        fileHistoryModel.getRecordCountWithStatus(self.selectedFile().fileId).done(function(data) {
            for (var i = 0; i < data.recErrorStatusDTO.length; i++)
                self.recErrorStatusDTOMap[data.recErrorStatusDTO[i].stepId] = data.recErrorStatusDTO[i].count;
            for (var j = 0; j < data.recSuccessStatusDTO.length; j++)
                self.recSuccessStatusDTOMap[data.recSuccessStatusDTO[j].stepId] = data.recSuccessStatusDTO[j].count;
            var success = self.recSuccessStatusDTOMap.COMPLETED ? self.recSuccessStatusDTOMap.COMPLETED : 0;
            var fail = self.recErrorStatusDTOMap.COMPLETE ? self.recErrorStatusDTOMap.COMPLETE : 0;
            var remove = self.recSuccessStatusDTOMap.DELETED ? self.recSuccessStatusDTOMap.DELETED : 0;
            var total = success + fail + remove;
            if (total !== 0)
                self.renderRecordLabelMap.PROCESSED = rootParams.baseModel.format(self.Nls.complete, { success: success }) + "<br/>" + rootParams.baseModel.format(self.Nls.deleted, { remove: remove }) + "<br/>" + rootParams.baseModel.format(self.Nls.failed, { fail: fail });
            success = total + (self.recSuccessStatusDTOMap.PROCESSING_IN_PROGRESS ? self.recSuccessStatusDTOMap.PROCESSING_IN_PROGRESS : 0);
            fail = self.recErrorStatusDTOMap.PROCESS ? self.recErrorStatusDTOMap.PROCESS : 0;
            total = success + fail;
            if (total !== 0)
                self.renderRecordLabelMap.PROCESSING_IN_PROGRESS = rootParams.baseModel.format(self.Nls.process, { success: success }) + "<br/>" + rootParams.baseModel.format(self.Nls.error, { fail: fail });
            success = total + (self.recSuccessStatusDTOMap.APPROVED ? self.recSuccessStatusDTOMap.APPROVED : 0);
            if (self.recErrorStatusDTOMap.APPROVAL !== -1)
                fail = self.recErrorStatusDTOMap.APPROVAL ? self.recErrorStatusDTOMap.APPROVAL : 0;
            var pending = self.recSuccessStatusDTOMap.VERIFIED ? self.recSuccessStatusDTOMap.VERIFIED : 0;
            var rejected = self.recSuccessStatusDTOMap.REJECTED ? self.recSuccessStatusDTOMap.REJECTED : 0;
            var expired = self.recSuccessStatusDTOMap.EXPIRED ? self.recSuccessStatusDTOMap.EXPIRED : 0;
            total = success + fail + pending + rejected + expired;
            if (total !== 0 && self.recErrorStatusDTOMap.APPROVAL !== -1 && self.currentStepValue() !== "VERIFIED")
                self.renderRecordLabelMap.APPROVED = rootParams.baseModel.format(self.Nls.pending, { pending: pending }) + "<br/>" + rootParams.baseModel.format(self.Nls.approved, { success: success }) + "<br/>" + rootParams.baseModel.format(self.Nls.rejected, { rejected: rejected }) + "<br/>" + rootParams.baseModel.format(self.Nls.expired, { expired: expired }) + "<br/>" + rootParams.baseModel.format(self.Nls.error, { fail: fail });
            success = total;
            if (total !== 0)
                self.renderRecordLabelMap.VERIFIED = rootParams.baseModel.format(self.Nls.verified, { success: success }) + "<br/>" + rootParams.baseModel.format(self.Nls.inError, { fail: self.selectedFile().failedRecords });
            self.renderRecordLabelMap.UPLOADED = "";
            self.recordLabelRendered(true);
        });
        fileHistoryModel.getFileWorkFlowStages().done(function(data) {
            self.fileWorkFlowStagesList(data.enumRepresentations[0].data);
            for (var j = 0; j < self.fileWorkFlowStagesList().length; j++) {
                self.fileWorkFlowStagesListMap[self.fileWorkFlowStagesList()[j].code] = self.fileWorkFlowStagesList()[j].description;
                var trainProperty = {};
                trainProperty.label = self.fileWorkFlowStagesList()[j].code;
                trainProperty.disabled = true;
                trainProperty.id = self.fileWorkFlowStagesList()[j].code;
                if (self.fileWorkFlowStagesList()[j].code === self.currentStepValue())
                    if (self.selectedFile().fileStatus === "ERROR" || self.selectedFile().fileStatus === "REJECTED" || self.selectedFile().fileStatus === "DELETED" || self.selectedFile().fileStatus === "EXPIRED")
                        trainProperty.messageType = "error";
                    else if (self.selectedFile().fileStatus === "PROCESSEXCP")
                    trainProperty.messageType = "warning";
                self.statusArray.push(trainProperty);
            }
            self.fileWorkFlowStagesListLoaded(true);
        });
        self.downloadFile = function() {
            fileHistoryModel.getFile(self.selectedFile().fileId);
        };
        self.downloadErrorFile = function() {
            fileHistoryModel.getErrorFile(self.selectedFile().fileId);
        };
        self.downloadResponseFile = function() {
            fileHistoryModel.getResponseFile(self.selectedFile().fileId);
        };

        self.renderLabels = function() {
            oj.Context.getContext(document.querySelector("#train2")).getBusyContext().whenReady().then(function() {
                $(".oj-train-label").each(function() {
                    var status = "";
                    if ($(this).text().indexOf("current") !== -1)
                        $(this).text($(this).text().substring(0, $(this).text().indexOf("current")));
                    status = $(this).text().trim();
                    if (self.historyMap[status] && self.historyMap[status] !== "-" && self.renderRecordLabelMap[status]) {
                        $(this).html("<span class='workflow-label'>" + self.fileWorkFlowStagesListMap[status] + "</span><br/><span class='workflow-date'>" + rootParams.baseModel.formatDate(self.historyMap[status], "dateMonthFormat") + "<br/>" + rootParams.baseModel.formatDate(self.historyMap[status], "timeStampFormat") + "<br/>" + self.renderRecordLabelMap[status] + "</span>");
                    } else if (self.historyMap.ERROR && self.renderRecordLabelMap[status]) {
                        $(this).html("<span class='workflow-label'>" + self.fileWorkFlowStagesListMap[status] + "</span><br/><span class='workflow-date'>" + rootParams.baseModel.formatDate(self.historyMap.ERROR, "dateMonthFormat") + "<br/>" + rootParams.baseModel.formatDate(self.historyMap.ERROR, "timeStampFormat") + "<br/>" + self.renderRecordLabelMap[status] + "</span>");
                    } else if (self.renderRecordLabelMap[status]) {
                        $(this).html("<span class='workflow-label'>" + self.fileWorkFlowStagesListMap[status] + "</span><br/>&nbsp<br/>&nbsp<br/><span class='workflow-date'>" + self.renderRecordLabelMap[status] + "</span>");
                    } else {
                        $(this).html("<span class='workflow-label'>" + self.fileWorkFlowStagesListMap[status] + "</span><br/>&nbsp<br/>&nbsp");
                    }
                });
                var keys = Object.keys(self.fileWorkFlowStagesListMap);
                var width = keys.indexOf(self.currentStepValue()) * (100 / (keys.length - 1));
                $(".oj-train-connector-fill").css("width", width + "%");
                if (!rootParams.baseModel.large()) {
                    $(".workflow-label").css("font-size", "0.6rem");
                    $(".workflow-date").css("font-size", "0.6rem");
                    $(".oj-train-label-wrapper").css("overflow", "visible");
                } else {
                    $(".workflow-label").css("font-size", "0.9rem");
                    $(".workflow-date").css("font-size", "0.9rem");
                }
                self.renderTrainClasses();
            });
        };
        self.renderTrainClasses = function() {
            var list = $(".oj-train-button-connector");
            var flag = true;
            for (var i = 0; i < list.length; i++) {
                var element = list[i];
                if (i === list.length - 1)
                    element.classList.add("success");
                if (element.children[0].classList.contains("oj-selected")) {
                    element.classList.add("current");
                    flag = false;
                } else if (flag) {
                    element.classList.add("completed");
                } else {
                    element.classList.add("pending");
                }
            }
        };
        self.datasource = new oj.ArrayTableDataSource(self.selectedFile().fileHistory, {
            idAttribute: self.selectedFile().date
        });
    };
});