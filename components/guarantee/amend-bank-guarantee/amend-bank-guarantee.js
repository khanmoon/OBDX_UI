define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/view-guarantee",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojtable",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojdatetimepicker",
    "ojs/ojconveyorbelt",
    "ojs/ojpagingcontrol",
    "ojs/ojcheckboxset",
    "ojs/ojknockout-validation"
], function (oj, ko, $, AmendBGModel, resourceBundle) {
    "use strict";
    var vm = function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.mode = ko.observable(self.params.mode);
        self.minClosureDate = ko.observable();
        self.tncValue = ko.observable([]);
        self.sectionHeading = ko.observable();
        self.contractList = ko.observableArray();
        self.datasourceForContractReview = ko.observableArray();
        self.commitmentValidationTracker = ko.observable();
        self.tncValidationTracker = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.reviewDataLoaded = ko.observable(false);
        self.checkIfBGDetailsLoaded = ko.observable(false);
        params.dashboard.headerName(self.resourceBundle.heading.initiateBGAmendment);
        self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, { bgNumber: self.guaranteeDetails.bgId }));
        self.currencyListOptions = ko.observableArray();
        self.isExpiryDateChanged = ko.observable(false);
        self.isClosureDateChanged = ko.observable(false);
        self.expiryDateMinusOne = ko.observable();
        self.closureDateMinusOne = ko.observable();
        self.minEffectiveDate = ko.observable();
        self.effectiveDate1 = ko.observable();
        self.effectiveDate2 = ko.observable();
        self.minExpiryDate = ko.observable();
        self.claimDays = ko.observable();
        self.tncGroupValid = ko.observable();
        self.amendCommitmentTracker = ko.observable();
        if (self.guaranteeDetails.effectiveDate !== null) {
            var date = new Date(self.guaranteeDetails.effectiveDate);
            date.setDate(date.getDate() + 1);
            self.effectiveDate1(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
            date.setDate(date.getDate() + 1);
            self.effectiveDate2(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
        }
        AmendBGModel.fetchBranchDate(self.guaranteeDetails.branchId).done(function (res) {
            var date = new Date(res.branchDate);
            date.setDate(date.getDate() + 1);
            self.minEffectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
            date.setDate(date.getDate() + 1);
            self.minExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
        });
        var getNewKoModel = function () {
            var KoModel = AmendBGModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        params.baseModel.registerComponent("review-amendment", "guarantee");
        self.amendStages = [
            {
                stageName: self.resourceBundle.heading.guaranteeDetails,
                expanded: ko.observable(true),
                templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-parties"),
                editable: false,
                validated: ko.observable()
            },
            {
                stageName: self.resourceBundle.heading.commitmentDetails,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/view-guarantees/amend-commitment-details"),
                editable: true,
                validated: ko.observable()
            },
            {
                stageName: self.resourceBundle.heading.bankInstructions,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-instructions"),
                editable: false,
                validated: ko.observable()
            },
            {
                stageName: self.resourceBundle.heading.guarantee,
                expanded: ko.observable(false),
                templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-contracts"),
                editable: false,
                validated: ko.observable()
            }
        ];
        self.contractList(self.guaranteeDetails.bankGuaranteeContract);
        if (self.contractList()) {
            self.datasourceForContractReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractList(), { idAttribute: "contractId" })));
        }
        function loadDataIntoModel() {
            self.bgAmendmentDetails.bgId(self.guaranteeDetails.bgId);
            self.bgAmendmentDetails.issueDate(self.guaranteeDetails.issueDate);
            self.bgAmendmentDetails.partyId.displayValue(self.guaranteeDetails.partyId.displayValue);
            self.bgAmendmentDetails.partyId.value(self.guaranteeDetails.partyId.value);
            self.bgAmendmentDetails.newAmount.amount(self.guaranteeDetails.contractAmount.amount);
            self.bgAmendmentDetails.newAmount.currency(self.guaranteeDetails.contractAmount.currency);
            self.bgAmendmentDetails.newExpiryDate(self.guaranteeDetails.expiryDate);
            self.bgAmendmentDetails.newClosureDate(self.guaranteeDetails.closureDate);
            self.dataLoaded(true);
        }
        if (self.mode() === "CREATE") {
            self.rootModelInstance = ko.observable(getNewKoModel());
            self.bgAmendmentDetails = self.rootModelInstance().AmendedBGDetails;
            loadDataIntoModel();
        } else {
            self.dataLoaded(true);
        }
        self.validateGuaranteeAmount = {
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.invalidAmountErrorMessage);
                    }
                    var numberfractional1 = value.toString().split(".");
                    if (numberfractional1[0]) {
                        if (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0])) {
                            throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.bgAmountError);
                        }
                    }
                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.commitmentDetails.errors.bgAmountError);
                        }
                    }
                }
                return true;
            }
        };
        self.newExpiryDateSubscribe = self.bgAmendmentDetails.newExpiryDate.subscribe(function (newValue) {
            AmendBGModel.fetchProductDetails(self.guaranteeDetails.productId).done(function (productData) {
                var date = new Date(newValue);
                self.claimDays(productData.bankGuaranteeProductDTO.claimDays);
                if (self.claimDays()) {
                    date.setDate(date.getDate() + self.claimDays());
                } else {
                    date.setDate(date.getDate() + 1);
                }
                var date2 = new Date(newValue);
                date2.setDate(date2.getDate() - 1);
                self.minClosureDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date.setHours(0, 0, 0, 0))));
                self.expiryDateMinusOne(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
            });
        });
        self.newClosureDateSubscribe = self.bgAmendmentDetails.newClosureDate.subscribe(function (newValue) {
            var date2 = new Date(newValue);
            date2.setDate(date2.getDate() - 1);
            self.closureDateMinusOne(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
        });
        self.termsAndConditions = function () {
            $("#tncDialog").trigger("openModal");
        };
        self.goBack = function () {
            var parameters = {
                mode: "VIEW",
                guaranteeDetails: self.guaranteeDetails
            };
            params.dashboard.loadComponent("view-bank-guarantee", parameters, self);
        };
        function validate() {
            var validationFlag = true;
            var amendCommitmentTracker = document.getElementById("amendCommitmentTracker");
            if (amendCommitmentTracker.valid === "valid") {
              self.amendStages[1].validated(true);
            }else {
                self.amendStages[1].validated(false);
                validationFlag = false;
                amendCommitmentTracker.showMessages();
                amendCommitmentTracker.focusOn("@firstInvalidShown");
            }

            var tncTracker = document.getElementById("tncTracker");
            if (tncTracker.valid !== "valid") {
                validationFlag = false;
                tncTracker.showMessages();
                tncTracker.focusOn("@firstInvalidShown");
            }
            return validationFlag;
        }
        self.amendBG = function () {
            if (validate()) {
                var parameters = {
                    mode: "REVIEW",
                    data: self.bgAmendmentDetails
                };
                self.checkIfBGDetailsLoaded(true);
                params.dashboard.loadComponent("review-amendment", parameters, self);
            }
        };
    };
    vm.prototype.dispose = function () {
        this.newExpiryDateSubscribe.dispose();
        this.newClosureDateSubscribe.dispose();
    };
    return vm;
});
