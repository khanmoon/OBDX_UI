define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",

    "ojL10n!resources/nls/review-user-map",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpagingcontrol",

    "ojs/ojradioset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (ko, $, oj, UserFIMapModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        self.Nls = resourceBundle.reviewUserMap;
        self.fileIdentifierList = ko.observableArray();
        self.dataArray1 = [];
        self.dataArray2 = [];
        self.dataArray = [];
        self.fileIdentifierMap = {};
        self.flagOne = ko.observable(false);
        self.flagTwo = ko.observable(false);
        self.isListReady = ko.observable(false);
        self.datasource = ko.observable();
        self.userDetails = ko.observableArray();
        self.userDetailsFetched = ko.observable(false);
        self.approvalTypesMap = {};
        self.transactionTypesMap = {};
        self.sensitiveCheckMap = {};
        self.isApprovalTypesLoaded = ko.observable(false);
        self.isTransactionTypesLoaded = ko.observable(false);
        self.getMappedFIs = function (fileIdentifers) {
            for (var i = 0; i < fileIdentifers.length; i++) {
                self.fileIdentifierMap[fileIdentifers[i].fileIdentifier()] = fileIdentifers[i].fileIdentifier();
                self.sensitiveCheckMap[fileIdentifers[i].fileIdentifier()] = fileIdentifers[i].sensitiveCheck();
            }
            self.flagOne(true);
        };
        self.getAllFIs = function (partyId) {
            UserFIMapModel.listAllFI(partyId).done(function (data) {
                self.fileIdentifierList(data.fileIdentifierRegistrations);
                self.flagTwo(true);
            });
        };
        self.getMappedFIs(self.params.data.fileIdentifers());
        ko.computed(function () {
            if (self.flagOne() && self.flagTwo() && self.isApprovalTypesLoaded() && self.isTransactionTypesLoaded()) {
                var j = 0, k = 0;
                for (var i = 0; i < self.fileIdentifierList().length; i++) {
                    var data = self.fileIdentifierList()[i];
                    if (!self.fileIdentifierMap[data.fileIdentifier]) {
                        data.isMapped = ko.observable(false);
                        data.sensitiveCheck = ko.observable(false);
                        data.approvalDesc = self.approvalTypesMap[data.approvalType];
                        if (data.fileTemplateDTO) {
                            data.transactionDesc = self.transactionTypesMap[data.fileTemplateDTO.transaction];
                        }
                        data.description = data.fileIdentifier + " - " + data.description;
                        self.dataArray2[j++] = data;
                    } else {
                        data.isMapped = ko.observable(true);
                        data.sensitiveCheck = ko.observable(self.sensitiveCheckMap[data.fileIdentifier]);
                        data.approvalDesc = self.approvalTypesMap[data.approvalType];
                        if (data.fileTemplateDTO) {
                            data.transactionDesc = self.transactionTypesMap[data.fileTemplateDTO.transaction];
                        }
                        data.description = data.fileIdentifier + " - " + data.description;
                        self.dataArray1[k++] = data;
                    }
                }
                self.dataArray = self.dataArray1.concat(self.dataArray2);
                self.datasource(new oj.ArrayTableDataSource(self.dataArray, { idAttribute: "fileIdentifier" }));
                self.isListReady(true);
            }
        });
        UserFIMapModel.fetchUserDetails(self.params.data.userId()).done(function (data) {
            self.userDetails(data.userDTO);
            self.getAllFIs(self.userDetails().partyId.value);
            self.userDetailsFetched(true);
        });
        UserFIMapModel.getApprovalTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.approvalTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isApprovalTypesLoaded(true);
        });
        UserFIMapModel.getTransactionTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.isTransactionTypesLoaded(true);
        });
        self.home = function () {
            history.go(-2);
        };
        self.back = function () {
            history.go(-1);
        };
        self.renderCheckBox = function (context) {
            var checkBox = $(document.createElement("input"));
            var label = $(document.createElement("label"));
            checkBox.attr("type", "checkbox");
            checkBox.attr("value", context.row.fileIdentifier);
            checkBox.attr("name", "select");
            checkBox.attr("id", context.row.fileIdentifier + "_labelID");
            label.attr("class", "oj-checkbox-label hide-label");
            label.attr("for", context.row.fileIdentifier + "_labelID");
            checkBox.prop("checked", context.row.isMapped());
            checkBox.prop("disabled", true);
            label.text(self.Nls.childCheckBox);
            $(context.cellContext.parentElement).append(checkBox);
            $(context.cellContext.parentElement).append(label);
        };
        self.renderSensitiveDataCheckBox = function (context) {
            var senstiveDataCheckBox = $(document.createElement("input"));
            var label = $(document.createElement("label"));
            senstiveDataCheckBox.attr("type", "checkbox");
            senstiveDataCheckBox.attr("value", context.row.sensitiveCheck());
            senstiveDataCheckBox.attr("name", "sensitiveCheck");
            senstiveDataCheckBox.attr("disabled", true);
            label.attr("class", "oj-checkbox-label");
            label.attr("class", "oj-checkbox-label hide-label");
            label.text(self.Nls.childCheckBox);
            label.attr("for", context.row.fileIdentifier + "_labelID2");
            senstiveDataCheckBox.prop("checked", context.row.sensitiveCheck());
            $(context.cellContext.parentElement).append(senstiveDataCheckBox);
            $(context.cellContext.parentElement).append(label);
        };
        self.renderHeaderCheckBox = function (context) {
            var checkBox = $(document.createElement("input"));
            var label = $(document.createElement("label"));
            checkBox.attr("type", "checkbox");
            checkBox.attr("value", "selectAll");
            checkBox.attr("name", "selectParent");
            checkBox.prop("disabled", true);
            checkBox.attr("id", "headerbox_labelID");
            label.attr("class", "oj-checkbox-label hide-label");
            label.attr("for", "headerbox_labelID");
            label.text(self.Nls.headerCheckBox);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
        };
        $(document).on("ojready", function () {
            $("input[name=selectParent]").prop("checked", $("input[name=select]:checked").length === $("input[name=select]").length);
            $(document).on("change", "input[name=select]", function () {
                $("input[name=selectParent]").prop("checked", $("input[name=select]:checked").length === $("input[name=select]").length);
            });
            $("input[name=selectParent]").change(function () {
                $("input[name=select]").prop("checked", $("input[name=selectParent]").prop("checked"));
            });
        });
    };
});
