define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/view-guarantee",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojnavigationlist",
    "ojs/ojpagingcontrol",
    "ojs/ojcheckboxset",
    "ojs/ojknockout-validation"
], function (oj, ko, $, ReviewAmendBGModel, resourceBundle) {
    "use strict";
    var self, vm = function (params) {
        self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.mode = ko.observable(self.params.mode);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("amend-bank-guarantee", "guarantee");
        params.baseModel.registerComponent("attach-documents", "trade-finance");
        if (self.mode() === "approval" || self.mode() === "VIEW" || self.mode() === "REVIEW") {
            self.bgAmendmentDetails = self.params.data;
            self.checkIfBGDetailsLoaded = ko.observable(false);
            self.isExpiryDateChanged = ko.observable(false);
            self.amendStages = [
                {
                    stageName: self.resourceBundle.heading.guaranteeDetails,
                    templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-parties")
                },
                {
                    stageName: self.resourceBundle.heading.commitmentDetails,
                    templateName: ko.observable("trade-finance/view-guarantees/amend-commitment-details")
                },
                {
                    stageName: self.resourceBundle.heading.bankInstructions,
                    templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-instructions")
                },
                {
                    stageName: self.resourceBundle.heading.guarantee,
                    templateName: ko.observable("trade-finance/view-guarantees/bank-guarantee-contracts")
                }
            ];
            self.amendCommitmentTracker = ko.observable();
            if (self.mode() === "VIEW") {
                params.dashboard.headerName(self.resourceBundle.heading.OutwardBGAmendment);
            }
            self.sectionHeading = ko.observable();
            self.contractList = ko.observableArray();
            self.datasourceForContractReview = ko.observableArray();
            self.additionalBankDetails = ko.observable();
            self.datasourceForDocReview = ko.observable();
            self.documentsLoaded = ko.observable(false);
            self.reviewTransactionName = [];
            self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
            self.reviewTransactionName.reviewHeader = self.resourceBundle.heading.reviewMsg;
            self.attachedDocuments = ko.observableArray();
            self.applicantName = ko.observable();
            self.applicantAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };
            self.beneName = ko.observable();
            self.beneAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };
            self.dropdownLabels = {
                country: ko.observable(),
                product: ko.observable(),
                branch: ko.observable(),
                guaranteeType: ko.observable()
            };
            self.reviewDataLoaded = ko.observable(false);
            var version;
            if (self.bgAmendmentDetails.versionNo) {
                version = self.bgAmendmentDetails.versionNo();
            } else {
                version = self.bgAmendmentDetails.versionNo;
            }

            ReviewAmendBGModel.getOutwardBG(self.params.data.bgId(), version).done(function (data) {
                self.guaranteeDetails = data.bankGuarantee;
                if (self.mode() === "VIEW" || self.mode() === "approval") {
                    if (self.bgAmendmentDetails.amendmentNo) {
                        self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNoWithAmendNo, {
                            bgNumber: self.guaranteeDetails.bgId,
                            amendmentNumber: self.bgAmendmentDetails.amendmentNo()
                        }));
                    } else {
                        self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, { bgNumber: self.guaranteeDetails.bgId }));
                    }
                } else {
                    self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, { bgNumber: self.guaranteeDetails.bgId }));
                }
                self.reviewDataLoaded(true);
                self.dropdownLabels.product(self.guaranteeDetails.productName);
                self.contractList(self.guaranteeDetails.bankGuaranteeContract);
                if (self.contractList()) {
                    self.datasourceForContractReview(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractList(), { idAttribute: "contractId" })));
                }
                if (self.guaranteeDetails.attachedDocuments) {
                    self.attachedDocuments(self.guaranteeDetails.attachedDocuments);
                }
                ReviewAmendBGModel.fetchPartyDetails(self.guaranteeDetails.partyId.value).done(function (data) {
                    self.applicantName(data.party.personalDetails.fullName);
                    for (var i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === "PST") {
                            self.applicantAddress.line1(data.party.addresses[i].postalAddress.line1);
                            self.applicantAddress.line2(data.party.addresses[i].postalAddress.line2);
                            self.applicantAddress.line3(data.party.addresses[i].postalAddress.line3);
                            self.applicantAddress.country(data.party.addresses[i].postalAddress.country);
                        }
                    }
                });
                ReviewAmendBGModel.fetchBeniCountry().done(function (data) {
                    var beneCountry = data.enumRepresentations[0].data.filter(function (data) {
                        return data.code === self.guaranteeDetails.beneAddress.country;
                    });
                    self.dropdownLabels.country(beneCountry[0].description);
                });
                ReviewAmendBGModel.fetchBranch().done(function (data) {
                    var beneBranch = data.branchAddressDTO.filter(function (data) {
                        return data.id === self.guaranteeDetails.branchId;
                    });
                    self.dropdownLabels.branch(beneBranch[0].branchName);
                });
                ReviewAmendBGModel.fetchGuranteeType().done(function (typeData) {
                    var guaranteeType = typeData.bankGuaranteeTypeDTO.filter(function (typeData){
                        return typeData.id = self.guaranteeDetails.guaranteetype;
                    });
                     self.dropdownLabels.guaranteeType(guaranteeType[0].description);
                });
                if (self.guaranteeDetails.advisingBankCode && self.guaranteeDetails.advisingBankCode !== null) {
                    ReviewAmendBGModel.getBankDetailsBIC(self.guaranteeDetails.advisingBankCode).done(function (data) {
                        self.additionalBankDetails(data);
                    });
                }
                if (self.guaranteeDetails.attachedDocuments && self.guaranteeDetails.attachedDocuments.length > 0) {
                    self.datasourceForDocReview = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.guaranteeDetails.attachedDocuments, { idAttribute: "id" }));
                    self.documentsLoaded(true);
                }
                self.checkIfBGDetailsLoaded(true);
            });
        } else {
            self.reviewDataLoaded(true);
            params.dashboard.headerName(self.resourceBundle.heading.initiateBGAmendment);
        }
        if (self.mode() === "REVIEW") {
            params.dashboard.headerName(self.resourceBundle.heading.initiateBGAmendment);
        }
        self.isExpiryDateChanged = ko.computed(function () {
            if (self.reviewDataLoaded()) {
                if (self.guaranteeDetails && self.bgAmendmentDetails.newExpiryDate() && self.bgAmendmentDetails.newExpiryDate() !== null) {
                    var prevExpiryDate = new Date(self.guaranteeDetails.expiryDate);
                    var newExpiryDate = new Date(self.bgAmendmentDetails.newExpiryDate());
                    newExpiryDate.setHours(0, 0, 0, 0);
                    return prevExpiryDate.toISOString() !== newExpiryDate.toISOString();
                }
            }
        });
        self.isClosureDateChanged = ko.computed(function () {
            if (self.reviewDataLoaded()) {
                if (self.guaranteeDetails && self.bgAmendmentDetails.newClosureDate && self.bgAmendmentDetails.newClosureDate() !== null) {
                    var prevclosureDate = new Date(self.guaranteeDetails.closureDate);
                    var newClosureDate = new Date(self.bgAmendmentDetails.newClosureDate());
                    newClosureDate.setHours(0, 0, 0, 0);
                    return prevclosureDate.toISOString() !== newClosureDate.toISOString();
                }
            }
        });

        self.confirmAmendment = function () {
            var date1 = new Date(self.bgAmendmentDetails.newExpiryDate());
            self.bgAmendmentDetails.newExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date1.setHours(0, 0, 0, 0))));
            var date2 = new Date(self.bgAmendmentDetails.newClosureDate());
            self.bgAmendmentDetails.newClosureDate(oj.IntlConverterUtils.dateToLocalIso(new Date(date2.setHours(0, 0, 0, 0))));
            self.bgAmendmentDetails.versionNo(self.guaranteeDetails.versionNo);
            self.bgAmendmentDetails.beneName(self.guaranteeDetails.beneName);
            ReviewAmendBGModel.initiateAmendment(self.guaranteeDetails.bgId, ko.mapping.toJSON(self.bgAmendmentDetails)).done(function (data, status, jqXhr) {
              var confirmScreenDetailsArray = [
                     [{
                         label: self.resourceBundle.guaranteeDetails.labels.applicantName,
                         value: self.applicantName()
                     },
                     {
                         label: self.resourceBundle.guaranteeDetails.labels.beneficiaryName,
                         value: self.guaranteeDetails.beneName
                     }
                   ],
                   [ {
                         label: self.resourceBundle.guaranteeDetails.labels.product,
                         value: self.dropdownLabels.product()
                     },
                     {
                         label: self.resourceBundle.guaranteeDetails.labels.expiryDate,
                         value: params.baseModel.formatDate(self.bgAmendmentDetails.newExpiryDate())
                     }]
                 ];
             if(self.guaranteeDetails.advisingBankCode && self.guaranteeDetails.advisingBankCode !== null && self.guaranteeDetails.advisingBankCode !== ""){
               confirmScreenDetailsArray.push([{
                         label: self.resourceBundle.commitmentDetails.labels.guaranteeAmount,
                         value: params.baseModel.formatCurrency(self.bgAmendmentDetails.newAmount.amount(),self.bgAmendmentDetails.newAmount.currency())
                     },
                     {
                         label: self.resourceBundle.guaranteeDetails.labels.swiftCode,
                         value: self.guaranteeDetails.advisingBankCode
                     }]);
             }else{
               confirmScreenDetailsArray.push([{
                         label: self.resourceBundle.commitmentDetails.labels.guaranteeAmount,
                         value: params.baseModel.formatCurrency(self.bgAmendmentDetails.newAmount.amount(),self.bgAmendmentDetails.newAmount.currency())
                     }]);
             }
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.initiateBGAmendment,
                    confirmScreenExtensions: {
                        isSet: true,
                        taskCode: "TF_N_ABG",
                        confirmScreenDetails: confirmScreenDetailsArray,
                        template: "confirm-screen/trade-finance"
                      }
                }, self);
            });
        };
        self.editAll = function () {
            var parameters = { mode: "EDIT" };
            params.dashboard.headerName(self.resourceBundle.heading.OutwardBGAmendment);
            self.sectionHeading(params.baseModel.format(self.resourceBundle.labels.bgNumber, { bgNumber: self.guaranteeDetails.bgId }));
            params.dashboard.loadComponent("amend-bank-guarantee", parameters, self);
        };
        self.goBack = function () {
            history.back();
        };
    };
    vm.prototype.dispose = function () {
        self.isExpiryDateChanged.dispose();
        self.isClosureDateChanged.dispose();
    };
    return vm;
});
