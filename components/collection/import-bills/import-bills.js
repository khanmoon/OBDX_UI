define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/view-bills",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, ImportBillModel, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(ImportBillModel.getNewModel());
                return KoModel;
            };
        self.model = getNewKoModel().model;
        self.draweeNameArray = ko.observableArray();
        self.validationTracker = ko.observable();
        self.moreSearchOptions = ko.observable(false);
        self.dataSourceCreated = ko.observable(false);
        self.listImportBills = ko.observableArray();
        self.dataSource = ko.observableArray();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.importBillsValidGroup = ko.observable();
        self.importBillsTracker = ko.observable();
        params.dashboard.headerName(self.resourceBundle.heading.importBills);
        params.baseModel.registerComponent("view-bills", "collection");
        self.billStatusArray = ko.observable([
            {
                label: self.resourceBundle.common.labels.active,
                value: "ACTIVE"
            },
            {
                label: self.resourceBundle.common.labels.hold,
                value: "HOLD"
            },
            {
                label: self.resourceBundle.common.labels.cancelled,
                value: "CANCELLED"
            },
            {
                label: self.resourceBundle.labels.liquidated,
                value: "LIQUIDATED"
            },
            {
                label: self.resourceBundle.common.labels.closed,
                value: "CLOSED"
            },
            {
                label: self.resourceBundle.common.labels.reversed,
                value: "REVERSED"
            }
        ]);
        self.showMoreSearchOptions = function () {
            self.moreSearchOptions(!self.moreSearchOptions());
        };
        self.hyphen = "-";
        var d = params.baseModel.getDate();
        var today = d.getFullYear() + self.hyphen + (d.getMonth() + 1) + self.hyphen + d.getDate();
        self.maxToIssueDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(d));
        self.maxFromIssueDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(d));

        /**
        * This is a function which capitalizes a string which is given as a parameter
        * @function capitalize
		* @returns {string} with first letter as capital
		* @param {string} string - the string to be capitalized
        */
        function capitalize(string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            }
        }
        var issueDateSubscribe = self.model.issueDateto.subscribe(function (newValue) {
            if (newValue !== "" && newValue < today) {
                self.maxFromIssueDate(newValue);
            }
        });
        self.reset = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    if (key !== "billType") {
                        self.model[key]("");
                    }
                    self.model.draweeName([]);
                    self.model.status([]);
                }
            }
            self.dataSourceCreated(false);
        };
        self.validateFromAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
                }
                if (self.model.toAmount()) {
                    var from;
                    if (params.baseModel.small()) {
                        from = oj.Components.getWidgetConstructor($("#toAmountOfModal"));
                    } else {
                        from = oj.Components.getWidgetConstructor($("#toAmount"));
                    }
                    if (typeof from === "function") {
                        from("validate");
                    }
                }
            }
        };
        self.validateToAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
                }
                if (self.model.fromAmount()) {
                    if (Number(value) < Number(self.model.fromAmount())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.fromToAmountMsg));
                    }
                }
            }
        };

        /**
        * This is a function which feteches the list of import bills searched on basis of parameters
        * @function getListImportBills
		* @returns {list} of import bills
        */
        function getListImportBills() {
            self.dataSourceCreated(false);
            self.listImportBills.removeAll();
            for (var key in self.model) {
                if (self.model[key]) {
                    if (self.model[key]() === null)
                        self.model[key]("");
                }
            }
            var payload = ko.mapping.toJS(self.model);
            ImportBillModel.getListImportBills(payload).done(function (data) {
                for (var i = 0; i < data.billDTOs.length; i++) {
                    self.listImportBills.push({
                        billNumber: data.billDTOs[i].id,
                        releaseAgainst: data.billDTOs[i].productName,
                        transactionDate: params.baseModel.formatDate(data.billDTOs[i].transactionDate),
                        billAmount: params.baseModel.formatCurrency(data.billDTOs[i].amount.amount, data.billDTOs[i].amount.currency),
                        status: capitalize(data.billDTOs[i].contractStatus),
                        drawer: data.billDTOs[i].counterPartyName,
                        billType: data.billDTOs[i].billType
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listImportBills(), { idAttribute: ["billNumber"] })));
                self.dataSourceCreated(true);
            });
        }
        if (self.draweeNameArray().length === 0) {
            ImportBillModel.fetchPartyDetails().done(function (data) {
                self.draweeNameArray.push({
                    label: data.party.personalDetails.fullName,
                    value: data.party.id.value
                });
                ImportBillModel.fetchPartyRelations().done(function (partyData) {
                    for (var i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                        self.draweeNameArray.push({
                            label: partyData.partyToPartyRelationship[i].relatedPartyName,
                            value: partyData.partyToPartyRelationship[i].relatedParty.value
                        });
                    }
                    if (params.baseModel.small()) {
                        self.model.draweeName(self.draweeNameArray()[0].value);
                        getListImportBills();
                    }
                });
            });
        }
        self.searchImportBills = function () {
            var tracker = document.getElementById("importBillsTracker");
            if (tracker.valid === "valid") {
                  getListImportBills();
            }else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
        self.download = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    if (self.model[key]() === null)
                        self.model[key]("");
                }
            }
            var payload = ko.mapping.toJS(self.model);
            ImportBillModel.fetchPDF(payload);
        };
        self.onBillSelected = function (data) {
            ImportBillModel.getBillDetails(data.billNumber).done(function (response) {
                if (response.bill) {
                    response.bill.contractStatus = capitalize(response.bill.contractStatus);
                    var parameters = {
                        mode: "VIEW",
                        billDetails: response.bill
                    };
                    params.dashboard.loadComponent("view-bills", parameters, self);
                } else {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.messages.noRecordFound], "ERROR");
                }
            });
        };
        self.openFilterModal = function () {
            $("#searchModal").trigger("openModal");
        };
        self.hideSearchModal = function(){
          $("#searchModal").hide();
        };
        self.resetFilterModel = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    if (key !== "billType") {
                        self.model[key]("");
                    }
                    self.model.draweeName([]);
                    self.model.status([]);
                }
            }
            self.model.draweeName(self.draweeNameArray()[0].value);
        };
        self.filterList = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            $("#searchModal").hide();
            getListImportBills();
        };
        self.dispose = function () {
            issueDateSubscribe.dispose();
        };
    };

    return vm;
});
