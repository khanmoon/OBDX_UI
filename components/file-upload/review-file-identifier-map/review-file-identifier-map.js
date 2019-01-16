define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/user-map"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.Nls = resourceBundle.userMap;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(self.Nls.userfimap);
        var mappedUsers = rootParams.rootModel.FIMapModel.fileIdentifers();
        for (var i = 0; i < self.fileIdentifierList().length; i++) {
            var data = self.fileIdentifierList()[i];
            data.approvalDesc = self.approvalTypesMap[data.approvalType];
            if (data.fileTemplateDTO) {
                data.transactionDesc = self.transactionTypesMap[data.fileTemplateDTO.transaction];
            }
            data.description = data.fileIdentifier + " - " + data.description;
            for (var j = 0; j < mappedUsers.length; j++)
                if (mappedUsers[j].fileIdentifier === data.fileIdentifier) {
                    data.isMapped = ko.observable(true);
                    if (mappedUsers[j].sensitiveCheck)
                        data.sensitiveCheck = true;
                    break;
                } else
                    data.isMapped = ko.observable(false);
            self.fileIdentifierList[i] = data;
        }
        self.datasource(new oj.ArrayTableDataSource(self.fileIdentifierList, { idAttribute: "fileIdentifier" }));
        self.back = function () {
            history.go(-1);
        };
        self.renderCheckBox = function (context) {
            var checkBoxRv = $(document.createElement("input"));
            var labelRv = $(document.createElement("label"));
            checkBoxRv.attr("type", "checkbox");
            checkBoxRv.attr("value", context.row.fileIdentifier);
            checkBoxRv.attr("name", "selectionRv");
            labelRv.attr("class", "oj-checkbox-label hide-label");
            checkBoxRv.attr("id", context.row.fileIdentifier + "_labelIDRv");
            labelRv.attr("for", context.row.fileIdentifier + "_labelIDRv");
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
        self.renderSensitiveDataCheckBox = function (context) {
            var senstiveDataCheckBoxRv = $(document.createElement("input"));
            var labelRv = $(document.createElement("label"));
            senstiveDataCheckBoxRv.attr("type", "checkbox");
            senstiveDataCheckBoxRv.attr("value", context.row.sensitiveCheck);
            senstiveDataCheckBoxRv.attr("name", "sensitiveCheck");
            labelRv.attr("class", "oj-checkbox-label  hide-label");
            senstiveDataCheckBoxRv.attr("id", context.row.fileIdentifier + "_labelID2");
            labelRv.attr("for", context.row.fileIdentifier + "_labelID2");
            senstiveDataCheckBoxRv.prop("disabled", true);
            labelRv.text(self.Nls.childCheckBox);
            senstiveDataCheckBoxRv.prop("checked", context.row.sensitiveCheck);
            $(context.cellContext.parentElement).append(senstiveDataCheckBoxRv);
            $(context.cellContext.parentElement).append(labelRv);
        };
        $(document).on("ojready", function () {
            $("input[name=selectionParentRv]").prop("checked", $("input[name=selectionRv]:checked").length === $("input[name=selectionRv]").length);
        });
    };
});