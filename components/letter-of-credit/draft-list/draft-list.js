define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/letter-of-credit-search",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable"
], function (oj, ko, $, DraftModel, resourceBundle) {
    "use strict";
    return function (params) {
        var i, self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.dataSourceCreated = ko.observable(false);
        self.updateDraft = ko.observable(false);
        self.dataSource = ko.observableArray();
        self.draftList = ko.observableArray();
        params.baseModel.registerElement("search-box");
        params.baseModel.registerComponent("lc-nav-bar", "letter-of-credit");
        self.mode = ko.observable("DRAFT");
        params.dashboard.headerName(self.resourceBundle.heading.initiateLC);
        self.getDrafts = function () {
            DraftModel.getDrafts().done(function (data) {
                self.draftList.removeAll();
                data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["lastUpdatedDate"], ["desc"]);
                for (var i = 0; i < data.letterOfCreditDTOs.length; i++) {
                    self.draftList.push({
                        draft_name: data.letterOfCreditDTOs[i].name,
                        created_on: params.baseModel.formatDate(data.letterOfCreditDTOs[i].lastUpdatedDate),
                        draftId: data.letterOfCreditDTOs[i].id
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.draftList(), { idAttribute: ["draft_name"] })));
                self.dataSourceCreated(true);
            });
        };
        self.getDrafts();
        self.onDraftSelected = function (selectedData) {
            DraftModel.getDraft(selectedData.draftId).done(function (data) {
                var dataToBePassed = data.letterOfCredit;
                if (dataToBePassed.draftsRequired) {
                    for (i = 0; i < dataToBePassed.billingDrafts.length; i++) {
                        if (!dataToBePassed.billingDrafts[i].otherInformation)
                            dataToBePassed.billingDrafts[i].otherInformation = null;
                    }
                }
                self.updateDraft(true);
                var parameters = {
                    mode: "EDIT",
                    letterOfCreditDetails: dataToBePassed
                };
                params.dashboard.loadComponent("initiate-lc", parameters, self);
            });
        };
    };
});