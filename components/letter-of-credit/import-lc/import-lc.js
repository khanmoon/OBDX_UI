define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/view-letter-of-credit",
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
], function (oj, ko, $, ImportLCModel, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var i, self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(ImportLCModel.getNewModel());
                return KoModel;
            };
        self.model = getNewKoModel().model;
        self.validationTracker = ko.observable();
        self.selectedLC = ko.observable();
        self.applicantNameArray = ko.observableArray();
        self.letterOfCreditDetails = ko.observable();
        self.moreSearchOptions = ko.observable(false);
        self.dataSourceCreated = ko.observable(false);
        self.listImportLC = ko.observableArray();
        self.dataSource = ko.observableArray();
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.resourceBundle.heading.importLC);
        self.showSmallScreenAvailmentsData = ko.observable();
        self.totalAmountOfAvailment = ko.observable();
        self.importLcValidGroup = ko.observable();
        self.importLcTracker = ko.observable();
        params.baseModel.registerComponent("view-letter-of-credit", "letter-of-credit");
        self.lcStatusArray = ko.observable([
            {
                label: self.resourceBundle.common.labels.hold,
                value: "HOLD"
            },
            {
                label: self.resourceBundle.labels.reversed,
                value: "REVERSED"
            },
            {
                label: self.resourceBundle.common.labels.active,
                value: "ACTIVE"
            },
            {
                label: self.resourceBundle.common.labels.closed,
                value: "CLOSED"
            },
            {
                label: self.resourceBundle.common.labels.cancelled,
                value: "CANCELLED"
            }
        ]);
        self.drawingStatusArray = ko.observable([
            {
                label: self.resourceBundle.drawingStatusArray.Partial,
                value: "PARTIAL"
            },
            {
                label: self.resourceBundle.drawingStatusArray.Full,
                value: "FULL"
            },
            {
                label: self.resourceBundle.drawingStatusArray.Undrawn,
                value: "UNDRAWN"
            },
            {
                label: self.resourceBundle.drawingStatusArray.expired,
                value: "EXPIRED"
            }
        ]);
        self.expiryStatusArray = ko.observable([
            {
                label: self.resourceBundle.drawingStatusArray.expired,
                value: "EXPIRED"
            },
            {
                label: self.resourceBundle.expiryStatusArray.notexpired,
                value: "NOTEXPIRED"
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
        self.issueDateSubscribe = self.model.issueDateto.subscribe(function () {
            if (self.model.issueDateto() !== "" && self.model.issueDateto() < today) {
                self.maxFromIssueDate(self.model.issueDateto());
            }
        });
        self.reset = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    if (key !== "lcType") {
                        self.model[key]("");
                    }
                    self.model.applicantName([]);
                    self.model.lcStatus([]);
                    self.model.expiryStatus([]);
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
                        from = oj.Components.getWidgetConstructor($("#toAmountOfModel"));
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
        self.showSmallScreenAvailments = function (data) {
            self.showSmallScreenAvailmentsData(data.availmentDataSource);
            self.totalAmountOfAvailment(params.baseModel.formatCurrency(data.totalAvailment.amount, data.totalAvailment.currency));
            $("#importDetailsDialog").trigger("openModal");
        };
        self.close = function () {
            $("#importDetailsDialog").hide();
        };
        self.totalAvailmentLabel = function (context) {
            var parentElement = $(context.footerContext.parentElement);
            parentElement.append(self.resourceBundle.labels.total);
        };
        self.getTotalAvailmentAmount = function (context) {
            var datasource = context.footerContext.datasource;
            if (!datasource) {
                return;
            }
            var total = 0;
            var totalRowCount = datasource.totalSize();
            var currency;
            var addAmount = function (rowNum) {
                datasource.at(rowNum).then(function (row) {
                    currency = row.data.availmentAmount.currency;
                    total = total + parseFloat(row.data.availmentAmount.amount);
                    if (rowNum < totalRowCount - 1) {
                        addAmount(rowNum + 1);
                    } else {
                        var parentElement = $(context.footerContext.parentElement);
                        parentElement.append(params.baseModel.formatCurrency(total, currency));
                    }
                });
            };
            addAmount(0);
        };
        function getImportLCs() {
            self.dataSourceCreated(false);
            for (var key in self.model) {
                if (self.model[key]) {
                    if (self.model[key]() === null)
                        self.model[key]("");
                }
            }
            var payload = ko.mapping.toJS(self.model);
            ImportLCModel.getImportLCs(payload).done(function (data) {
                self.listImportLC.removeAll();
                data.letterOfCreditDTOs = params.baseModel.sortLib(data.letterOfCreditDTOs, ["expiryDate"], ["desc"]);
                var availmentList = null;
                for (i = 0; i < data.letterOfCreditDTOs.length; i++) {
                    availmentList = null;
                    if (data.letterOfCreditDTOs[i].availments && data.letterOfCreditDTOs[i].availments.length > 0) {
                        availmentList = new oj.ArrayTableDataSource(data.letterOfCreditDTOs[i].availments, { idAttribute: "availmentId" });
                    }
                    self.listImportLC.push({
                        beneficiary: data.letterOfCreditDTOs[i].counterPartyName,
                        created_on: params.baseModel.formatDate(data.letterOfCreditDTOs[i].applicationDate),
                        amount: params.baseModel.formatCurrency(data.letterOfCreditDTOs[i].amount.amount, data.letterOfCreditDTOs[i].amount.currency),
                        outstanding_amount: params.baseModel.formatCurrency(data.letterOfCreditDTOs[i].outstandingAmount.amount, data.letterOfCreditDTOs[i].outstandingAmount.currency),
                        expiry_date: params.baseModel.formatDate(data.letterOfCreditDTOs[i].expiryDate),
                        lc_status: data.letterOfCreditDTOs[i].status,
                        lc_number: data.letterOfCreditDTOs[i].id,
                        totalAvailment: {
                            amount: data.letterOfCreditDTOs[i].totalAvailments,
                            currency: data.letterOfCreditDTOs[i].outstandingAmount.currency
                        },
                        availmentDataSource: availmentList
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listImportLC(), { idAttribute: ["lc_number"] })));
                self.dataSourceCreated(true);
            });
        }
        if (self.applicantNameArray().length === 0) {
            ImportLCModel.fetchPartyDetails().done(function (data) {
                self.applicantNameArray.push({
                    label: data.party.personalDetails.fullName,
                    value: data.party.id.value
                });
                ImportLCModel.fetchPartyRelations().done(function (partyData) {
                    for (i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                        self.applicantNameArray.push({
                            label: partyData.partyToPartyRelationship[i].relatedPartyName,
                            value: partyData.partyToPartyRelationship[i].relatedParty.value
                        });
                    }
                    if (params.baseModel.small()) {
                        self.model.applicantName(self.applicantNameArray()[0].value);
                        getImportLCs();
                    }
                });
            });
        }
        self.searchImportLC = function () {
          var tracker = document.getElementById("importLcTracker");
          if (tracker.valid === "valid") {
              getImportLCs();
          }else {
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
        self.showAvailmentDetails = function (data) {
            if (self.selectedLC() === data.lc_number) {
                self.selectedLC("");
            } else {
                self.selectedLC(data.lc_number);
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
            ImportLCModel.fetchPDF(payload);
        };
        self.onLCSelected = function (data) {
            ImportLCModel.getImportLC(data.lc_number).done(function (data) {
                var parameters = {
                    mode: "VIEW",
                    letterOfCreditDetails: data.letterOfCredit
                };
                params.dashboard.loadComponent("view-letter-of-credit", parameters, self);
            });
        };
        self.getRowId = function (rowIndex) {
            return ++rowIndex;
        };
        self.templateCardSelected = function (event, ui) {
            if (ui.option === "selection") {
                var selectedIdsArray = $.map(ui.items, function (selectedListItem) {
                    return selectedListItem.id;
                });
                if (selectedIdsArray && selectedIdsArray.length > 0) {
                    var data = { templateId: selectedIdsArray[0] };
                    self.onTemplateNameSelected(data);
                }
            }
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
                    if (key !== "lcType") {
                        self.model[key]("");
                    }
                    self.model.lcStatus([]);
                    self.model.expiryStatus([]);
                    self.model.status([]);
                }
            }
            self.model.applicantName(self.applicantNameArray()[0].value);
        };
        self.filterList = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            $("#searchModal").hide();
            getImportLCs();
        };
    };
    vm.prototype.dispose = function () {
        this.issueDateSubscribe.dispose();
    };
    return vm;
});
