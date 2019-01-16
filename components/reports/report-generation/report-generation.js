define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/report-generation",
    "framework/js/constants/constants",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojbutton",
    "ojs/ojarraytabledatasource",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, reportGenerationModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        var getNewKoModel = function () {
            var KoModel = reportGenerationModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.Nls = resourceBundle.reportGeneration;
        rootParams.dashboard.headerName(self.Nls.reports);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("report-list", "reports");
        rootParams.baseModel.registerComponent("scheduled-reports", "reports");
        self.menuSelection = ko.observable();
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuOptions = ko.observableArray();
        self.validationTracker = ko.observable();
        self.selected = ko.observable(false);
        self.frequencySelected = ko.observable(false);
        self.reportTypesList = ko.observableArray();
        self.isReportTypesListLoaded = ko.observable(false);
        self.frequencyList = ko.observableArray();
        self.frequencyListMap = {};
        self.isReportFrequencyListLoaded = ko.observable(false);
        self.scheduledFrequencyList = ko.observableArray();
        self.scheduledfrequencyListMap = {};
        self.isScheduledFrequencyListLoaded = ko.observable(false);
        self.reportFormatList = ko.observableArray();
        self.reportFormatListFromEnum = ko.observableArray();
        self.reportFormatListMap = {};
        self.isFrequencyDisabled = ko.observable(false);
        self.response = ko.observable();
        self.adhocReportTypeList = ko.observableArray();
        self.scheduledReportTypeList = ko.observableArray();
        self.transactionStatus = ko.observable();
        self.userSegment = Constants.userSegment;
        self.reportMapForReportId = {};
        self.isReportFormatListLoaded = ko.observable(false);
        self.reportGenerationPayload = getNewKoModel().reportCreationModel;
        self.reportGenerationPayload.reportFreq("ADHOC");
        self.httpStatus = ko.observable();
        self.httpStatus1 = ko.observable();
        self.reportRequestId = ko.observable("");
        self.paramsComponent = ko.observable();
        self.reportsJSON = {};
        self.isReportsJSONLoaded = ko.observable(false);
        self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
        self.clear = function () {
            self.reportGenerationPayload.formatType([]);
            self.reportGenerationPayload.reportIdentifier([]);
            self.reportGenerationPayload.reportSchFreq([]);
            self.reportGenerationPayload.startTime(null);
            self.reportGenerationPayload.endTime(null);
            self.reportGenerationPayload.reportType(null);
            self.isReportFormatListLoaded(false);
            self.selected(false);
            $("form")[0].reset();
            $("form select").ojSelect("option", "value", []);
        };
        self.reportTypeValueChangeHandler = function (event) {
            if (event.detail.value && self.isReportsJSONLoaded()) {
                self.isReportFormatListLoaded(false);
                self.reportFormatList.removeAll();
                var reportData = self.reportMapForReportId[event.detail.value + ""];
                for (var i = 0; i < reportData.formats.length; i++) {
                    self.reportFormatList().push({
                        code: reportData.formats[i],
                        description: self.reportFormatListMap[reportData.formats[i]]
                    });
                }
                if (reportData.allowedReportFrequency !== "BOTH") {
                    self.reportGenerationPayload.reportFreq(reportData.allowedReportFrequency);
                    self.isFrequencyDisabled(true);
                } else
                    self.isFrequencyDisabled(false);
                self.reportGenerationPayload.formatType([]);
                var reportIdentifierData = self.reportsJSON[event.detail.value + ""];
                if (!reportIdentifierData)
                    reportIdentifierData = self.reportsJSON.DEFAULT;
                rootParams.baseModel.registerComponent(reportIdentifierData.component, reportIdentifierData.module);
                self.paramsComponent(reportIdentifierData.component);
                self.isReportFormatListLoaded(true);
                self.selected(true);
            }
        };
        self.frequencyValueChangeHandler = function (event) {
            if (event.detail.value) {
                self.reportGenerationPayload.startTime(null);
                self.reportGenerationPayload.endTime(null);
                self.reportGenerationPayload.reportSchFreq(null);
                self.frequencySelected(true);
            }
        };
        self.showReports = function () {
            rootParams.baseModel.registerComponent("report-list", "report-generation");
            rootParams.dashboard.loadComponent("report-list", self.reportRequestId(), self);
        };
        self.parseDate = function (localeDate) {
            var date = new Date(localeDate);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            var strTime = hours + ":" + minutes + ":" + seconds;
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + "T" + strTime;
        };
        reportGenerationModel.getReportTypes(Constants.userSegment).done(function (data) {
            for (var i = 0; i < data.listResponseDTO.length; i++) {
                self.reportTypesList.push(data.listResponseDTO[i]);
                self.reportMapForReportId[self.reportTypesList()[i].reportId] = self.reportTypesList()[i];
            }
            for (var j = 0; j < self.reportTypesList().length; j++) {
                if (self.reportTypesList()[j].allowedReportFrequency === "ADHOC" || self.reportTypesList()[j].allowedReportFrequency === "BOTH") {
                    self.adhocReportTypeList.push(self.reportTypesList()[j]);
                }
                if (self.reportTypesList()[j].allowedReportFrequency === "SCHEDULED" || self.reportTypesList()[j].allowedReportFrequency === "BOTH") {
                    self.scheduledReportTypeList.push(self.reportTypesList()[j]);
                }
            }
            self.isReportTypesListLoaded(true);
        });
        reportGenerationModel.getReportFormatTypes().done(function (data) {
            self.reportFormatListFromEnum(data.enumRepresentations[0].data);
            for (var i = 0; i < self.reportFormatListFromEnum().length; i++) {
                self.reportFormatListMap[self.reportFormatListFromEnum()[i].code] = self.reportFormatListFromEnum()[i].description;
            }
        });
        reportGenerationModel.getReportFrequencyTypes().done(function (data) {
            self.frequencyList(data.enumRepresentations[0].data.slice(0, 2));
            for (var i = 0; i < self.frequencyList().length; i++) {
                self.frequencyListMap[self.frequencyList()[i].code] = self.frequencyList()[i].description;
            }
            self.frequencyList()[1].description = "Schedule";

            self.loadMenu();
            self.isReportFrequencyListLoaded(true);
        });
        self.loadMenu = function () {
            for (var i = 0; i < self.frequencyList().length; i++) {
                self.menuOptions.push({
                    id: self.frequencyList()[i].code,
                    label: self.frequencyList()[i].description
                });
            }
            self.menuSelection(self.menuOptions()[0].id);
        };
        reportGenerationModel.getScheduledReportFrequencyTypes().done(function (data) {
            self.scheduledFrequencyList(data.enumRepresentations[0].data);
            for (var i = 0; i < self.scheduledFrequencyList().length; i++) {
                self.scheduledfrequencyListMap[self.scheduledFrequencyList()[i].code] = self.scheduledFrequencyList()[i].description;
            }
            self.isScheduledFrequencyListLoaded(true);
        });
        $.fn.serializeObject = function () {
            var obj = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (this.value) {
                    if (obj[this.name]) {
                        if (!obj[this.name].push) {
                            obj[this.name] = [obj[this.name]];
                        }
                        obj[this.name].push(this.value || "");
                    } else {
                        obj[this.name] = this.value || "";
                    }
                    if (this.name.indexOf("Date") !== -1 && Date.parse(obj[this.name]))
                        obj[this.name] = oj.IntlConverterUtils.dateToLocalIso(new Date(obj[this.name])).substring(0, 10);
                }
            });
            return obj;
        };
        self.createReport = function () {

          if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("reportTracker"))) {
                return;
            }
            var user = {
                "CORP": "U",
                "ADMIN": "A",
                "CORPADMIN": "C",
                "RETAIL": "U"
            };
            self.reportGenerationPayload.reportIdentifier(self.reportGenerationPayload.reportIdentifier() + "");
            self.reportGenerationPayload.reportFreq(self.reportGenerationPayload.reportFreq() + "");
            self.reportGenerationPayload.formatType(self.reportGenerationPayload.formatType() + "");
            self.reportGenerationPayload.reportType(user[Constants.userSegment]);
            if (self.reportGenerationPayload.reportFreq() !== "ADHOC") {
                self.reportGenerationPayload.reportSchFreq(self.reportGenerationPayload.reportSchFreq() + "");
                self.reportGenerationPayload.startTime(self.reportGenerationPayload.startTime() + "");
                if (self.reportGenerationPayload.reportSchFreq() + "" !== "ONCE") {
                    self.reportGenerationPayload.endTime(self.reportGenerationPayload.endTime() + "");
                } else {
                    self.reportGenerationPayload.endTime(null);
                }
            }
            var params = $("form").serializeObject();
            self.reportGenerationPayload.reportParams(params);
			if(self.reportGenerationPayload.reportIdentifier() === "A01" || self.reportGenerationPayload.reportIdentifier() === "A02" || self.reportGenerationPayload.reportIdentifier() === "A03") {
                if(!self.reportGenerationPayload.reportParams().billerId && !self.reportGenerationPayload.reportParams().billerAccountNo) {
                    rootParams.baseModel.showMessages(null, [self.Nls.validateBillerMessage], "ERROR");
                    return;
                }
            }

            var reportGenerationPayload = ko.toJSON(self.reportGenerationPayload);
            reportGenerationModel.registerReport(reportGenerationPayload).done(function (data, status, jqXhr) {
                self.reportRequestId(data.reportRequestId);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.transactionName,
                    template: "report/report-generation-confirm-screen"
                }, self);
            });
        };
        reportGenerationModel.fetchParamsComponent().done(function (data) {
            self.reportsJSON = data;
            self.isReportsJSONLoaded(true);
        });
        self.menuSelection.subscribe(function (newValue) {
            ko.utils.extend(self.params, { defaultTab: newValue });
            self.reportGenerationPayload.startTime(null);
            self.reportGenerationPayload.endTime(null);
            self.reportGenerationPayload.reportSchFreq(null);
            self.reportGenerationPayload.reportSchFreq(null);
            self.reportGenerationPayload.reportFreq(newValue);
            self.frequencySelected(true);
        });
        self.downloadReport = function () {
            reportGenerationModel.downloadReport(self.reportRequestId());
        };
        self.onSubmitByEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.createReport();
            }
        };
    };
});