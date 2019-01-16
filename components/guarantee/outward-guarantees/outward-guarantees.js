define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-guarantee",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, OutwardBGModel, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(OutwardBGModel.getNewModel());
                return KoModel;
            };
        self.model = getNewKoModel().model;
        self.resourceBundle = resourceBundle;
        self.beneNameArray = ko.observableArray();
        self.validationTracker = ko.observable();
        self.currencyListOptions = ko.observableArray();
        self.moreSearchOptions = ko.observable(false);
        self.dataSourceCreated = ko.observable(false);
        self.listBankGuarantees = ko.observableArray();
        self.dataSource = ko.observable();
        self.selectedBG = ko.observable();
        ko.utils.extend(self, params.rootModel);
        params.dashboard.headerName(self.resourceBundle.heading.outwardGuarantee);
        self.showSmallScreenAvailmentsData = ko.observable();
        self.totalAmountOfAvailment = ko.observable();
        self.showMoreSearchOptions = function () {
            self.moreSearchOptions(!self.moreSearchOptions());
        };
        self.outwardGuaranteeTracker = ko.observable();
        self.outwardGuaranteeValidGroup = ko.observable();
        params.baseModel.registerComponent("view-bank-guarantee", "guarantee");
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
                    self.model[key]("");
                    self.model.bgStatus([]);
                    self.model.applicantName([]);
                }
            }
            self.dataSourceCreated(false);
        };
        self.statusArray = ko.observable([
            {
                label: self.resourceBundle.common.labels.active,
                value: "ACTIVE"
            },
            {
                label: self.resourceBundle.common.labels.cancelled,
                value: "CANCELLED"
            },
            {
                label: self.resourceBundle.common.labels.hold,
                value: "HOLD"
            },
            {
                label: self.resourceBundle.common.labels.reversed,
                value: "REVERSED"
            },
            {
                label: self.resourceBundle.common.labels.closed,
                value: "CLOSED"
            }
        ]);
        function getBankGuarantees() {
            self.dataSourceCreated(false);
            self.listBankGuarantees.removeAll();
            for (var key in self.model) {
                if (self.model[key]) {
                    if (self.model[key]() === null)
                        self.model[key]("");
                }
            }
            var payload = ko.mapping.toJS(self.model);
            OutwardBGModel.getBankGuarantees(payload).done(function (data) {
                data.bankGuaranteeDTO = params.baseModel.sortLib(data.bankGuaranteeDTO, ["expiryDate"], ["desc"]);
                var availmentList = null;
                for (var i = 0; i < data.bankGuaranteeDTO.length; i++) {
                    availmentList = null;
                    if (data.bankGuaranteeDTO[i].claims && data.bankGuaranteeDTO[i].claims.length > 0) {
                        availmentList = new oj.ArrayTableDataSource(data.bankGuaranteeDTO[i].claims, { idAttribute: "availmentId" });
                    }
                    self.listBankGuarantees.push({
                        beneficiary: data.bankGuaranteeDTO[i].beneName,
                        issue_date: params.baseModel.formatDate(data.bankGuaranteeDTO[i].issueDate),
                        amount: params.baseModel.formatCurrency(data.bankGuaranteeDTO[i].contractAmount.amount, data.bankGuaranteeDTO[i].contractAmount.currency),
                        outstanding_amount: params.baseModel.formatCurrency(data.bankGuaranteeDTO[i].guaranteeAmount.amount, data.bankGuaranteeDTO[i].guaranteeAmount.currency),
                        expiry_date: params.baseModel.formatDate(data.bankGuaranteeDTO[i].expiryDate),
                        bg_status: data.bankGuaranteeDTO[i].guaranteeStatus,
                        bg_number: data.bankGuaranteeDTO[i].bgId,
                        totalAvailment: {
                            amount: data.bankGuaranteeDTO[i].totalClaims,
                            currency: data.bankGuaranteeDTO[i].guaranteeAmount.currency
                        },
                        availmentDataSource: availmentList
                    });
                }
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.listBankGuarantees())));
                self.dataSourceCreated(true);
            });
        }
        self.searchBankGuarantee = function () {
          var tracker = document.getElementById("outwardGuaranteeTracker");
          if (tracker.valid === "valid") {
                getBankGuarantees();
          }else {
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
        self.totalAvailmentLabel = function (context) {
            var parentElement = $(context.footerContext.parentElement);
            parentElement.append(self.resourceBundle.labels.total);
        };
        self.onBGSelected = function (data) {
            OutwardBGModel.getBGDetails(data.bg_number).done(function (data) {
                var parameters = {
                    mode: "VIEW",
                    guaranteeDetails: data.bankGuarantee
                };
                params.dashboard.loadComponent("view-bank-guarantee", parameters, self);
            });
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
        self.download = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    if (self.model[key]() === null)
                        self.model[key]("");
                }
            }
            var payload = ko.mapping.toJS(self.model);
            OutwardBGModel.fetchPDF(payload);
        };
        self.showAvailmentDetails = function (data) {
            if (self.selectedBG() === data.bg_number) {
                self.selectedBG("");
            } else {
                self.selectedBG(data.bg_number);
            }
        };
        if (self.beneNameArray().length === 0) {
            OutwardBGModel.fetchPartyDetails().done(function (data) {
                self.beneNameArray.push({
                    label: data.party.personalDetails.fullName,
                    value: data.party.id.value
                });
                OutwardBGModel.fetchPartyRelations().done(function (partyData) {
                    for (var i = 0; i < partyData.partyToPartyRelationship.length; i++) {
                        self.beneNameArray.push({
                            label: partyData.partyToPartyRelationship[i].relatedPartyName,
                            value: partyData.partyToPartyRelationship[i].relatedParty.value
                        });
                    }
                    if (params.baseModel.small()) {
                        self.model.applicantName(self.beneNameArray()[0].value);
                        getBankGuarantees();
                    }
                });
            });
        }
        self.showSmallScreenAvailments = function (data) {
            self.showSmallScreenAvailmentsData(data.availmentDataSource);
            self.totalAmountOfAvailment(params.baseModel.formatCurrency(data.totalAvailment.amount, data.totalAvailment.currency));
            $("#bgDetailsDialog").trigger("openModal");
        };
        self.close = function () {
            $("#bgDetailsDialog").hide();
        };
        self.validateFromAmount = {
            "validate": function (value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.common.invalidAmount));
                }
                if (self.model.toAmount()) {
                    var from;
                    if (params.baseModel.small()) {
                        from = oj.Components.getWidgetConstructor($("#modalToAmount"));
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
        self.openFilterModal = function () {
            $("#searchModal").trigger("openModal");
        };
        self.hideSearchModal =function(){
          $("#searchModal").hide();
        };
        self.resetFilterModel = function () {
            for (var key in self.model) {
                if (self.model[key]) {
                    self.model[key]("");
                    self.model.bgStatus([]);
                }
            }
            self.model.applicantName(self.beneNameArray()[0].value);
        };
        self.filterList = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            $("#searchModal").hide();
            getBankGuarantees();
        };
    };
    vm.prototype.dispose = function () {
        this.issueDateSubscribe.dispose();
    };
    return vm;
});
