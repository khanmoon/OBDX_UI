define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/report-user-map",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpagingcontrol",

    "ojs/ojradioset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, ReportUserMapModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.reportUserMap;
        self.parameters = ko.mapping.toJS(self.params.data);
        rootParams.baseModel.registerElement("action-header");
        rootParams.dashboard.headerName(self.Nls.reportUserMap);
        self.reportList = ko.observableArray();
        self.datasource = ko.observable();
        self.userType = ko.observable();
        self.isUserTypeFetched = ko.observable(false);
        self.userDetails = ko.observableArray();
        self.isReportListLoaded = ko.observable(false);
        var user = {
            "corporateuser": "U",
            "Administrator": "A",
            "CorporateAdmin": "C"
        };
        var mappedReports = self.parameters.reportIdentifers;
        self.getAllReports = function (userType) {
            var url = "reports/reportDefinition/reportType/" + user[userType] + "/definitions";
            ReportUserMapModel.listAllReports(url).done(function (data) {
                self.reportList(data.listResponseDTO);
                for (var i = 0; i < self.reportList().length; i++) {
                    var reportData = self.reportList()[i];
                    reportData.isMapped = ko.observable(false);
                    for (var j = 0; j < mappedReports.length; j++)
                        if (mappedReports[j] === reportData.reportId) {
                            reportData.isMapped = ko.observable(true);
                            break;
                        } else
                            reportData.isMapped = ko.observable(false);
                    self.reportList[i] = reportData;
                }
                self.isReportListLoaded(true);
            });
        };
        ReportUserMapModel.fetchUserDetails(self.parameters.userId).done(function (data) {
            self.userDetails(data.userDTO);
            self.userType(data.userDTO.userType);
            self.isUserTypeFetched(true);
            self.getMappedReports(self.selectedUser().username);
            var userType;

        var regex = new RegExp( self.selectedUser().userGroups.join( "|" ), "i");

        if(regex.test("CorporateAdminMaker") || regex.test("CorporateAdminChecker")){
              userType = "CorporateAdmin";
        }
        else if(regex.test("corporateuser")){
              userType = "corporateuser";
        }
        else if (regex.test("Administrator")) {
            userType = "Administrator";
        }

            self.getAllReports(userType);
        });
        self.datasource(new oj.ArrayTableDataSource(self.reportList, { idAttribute: "reportId" }));
        self.back = function () {
            history.go(-1);
        };
        self.renderCheckBox = function (context) {
            var checkBoxRv = $(document.createElement("input"));
            var labelRv = $(document.createElement("label"));
            checkBoxRv.attr("type", "checkbox");
            checkBoxRv.attr("value", context.row.reportId);
            checkBoxRv.attr("name", "selectionRv");
            labelRv.attr("class", "oj-checkbox-label hide-label");
            checkBoxRv.attr("id", context.row.reportId + "_labelIDRv");
            labelRv.attr("for", context.row.reportId + "_labelIDRv");
            labelRv.text(self.Nls.childCheckBox);
            checkBoxRv.prop("disabled", true);
            if (context.row.isMapped()) {
                checkBoxRv.prop("checked", true);
            }
            $(context.cellContext.parentElement).append(checkBoxRv);
            $(context.cellContext.parentElement).append(labelRv);
        };
        self.renderHeaderCheckBox = function (context) {
            var checkBoxRv = $(document.createElement("input"));
            var labelRv = $(document.createElement("label"));
            checkBoxRv.attr("type", "checkbox");
            checkBoxRv.attr("value", "selectAllRv");
            checkBoxRv.attr("name", "selectionParentRv");
            checkBoxRv.attr("id", "headerbox_labelIDRv");
            labelRv.attr("class", "oj-checkbox-label hide-label");
            labelRv.attr("for", "headerbox_labelIDRv");
            labelRv.text(self.Nls.headerCheckBox);
            checkBoxRv.prop("disabled", true);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBoxRv);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(labelRv);
        };
        $(document).on("ojready", function () {
            $("input[name=selectionParentRv]").prop("checked", $("input[name=selectionRv]:checked").length === $("input[name=selectionRv]").length);
        });
    };
});