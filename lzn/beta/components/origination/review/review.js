define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!lzn/beta/resources/nls/review",
    "ojs/ojcheckboxset",
    "ojs/ojbutton"
], function (oj, ko, $, ReviewServiceObject, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, ReviewService = new ReviewServiceObject();
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.reviewDataLoaded = ko.observable(false);
        require([
            "ojL10n!lzn/beta/resources/nls/requirements",
            "ojL10n!lzn/beta/resources/nls/primary-registration",
            "ojL10n!lzn/beta/resources/nls/identity-info",
            "ojL10n!lzn/beta/resources/nls/contact-info",
            "ojL10n!lzn/beta/resources/nls/occupation-info",
            "ojL10n!lzn/beta/resources/nls/income-info",
            "ojL10n!lzn/beta/resources/nls/expense-info",
            "ojL10n!lzn/beta/resources/nls/assets-info",
            "ojL10n!lzn/beta/resources/nls/liabilities-info",
            "ojL10n!lzn/beta/resources/nls/card-account",
            "ojL10n!lzn/beta/resources/nls/collateral-info",
            "ojL10n!lzn/beta/resources/nls/account-funding",
            "ojL10n!lzn/beta/resources/nls/account-holder",
            "ojL10n!lzn/beta/resources/nls/disclosures",
            "ojL10n!lzn/beta/resources/nls/card-balance-transfer",
            "ojL10n!lzn/beta/resources/nls/certifications",
            "ojL10n!lzn/beta/resources/nls/terms-and-conditions",
            "ojL10n!lzn/beta/resources/nls/funding-table",
            "ojL10n!lzn/beta/resources/nls/vehicle-info",
            "ojL10n!lzn/beta/resources/nls/additional-disclosures",
            "ojL10n!lzn/beta/resources/nls/card-addon"
        ], function (Requirements, PrimaryRegistration, IdentityInfo, ContactInfo, OccupationInfo, IncomeInfo, ExpenseInfo, AssetsInfo, LiabilitiesInfo, CardAccount, CollateralInfo, AccountFunding, AccountHolder, Disclosures, CardBalanceTransfer, Certifications, TermsAndConditions, FundingTable, VehicleInfo, AdditionalDisclosures, CardAddOn) {
            self.resource.requirements = Requirements;
            self.resource.primaryRegistration = PrimaryRegistration;
            self.resource.identityInfo = IdentityInfo;
            self.resource.contactInfo = ContactInfo;
            self.resource.occupationInfo = OccupationInfo;
            self.resource.incomeInfo = IncomeInfo;
            self.resource.assetsInfo = AssetsInfo;
            self.resource.expenseInfo = ExpenseInfo;
            self.resource.liabilitiesInfo = LiabilitiesInfo;
            self.resource.cardAccount = CardAccount;
            self.resource.collateralInfo = CollateralInfo;
            self.resource.accountFunding = AccountFunding;
            self.resource.accountHolder = AccountHolder;
            self.resource.disclosures = Disclosures;
            self.resource.cardBalanceTransfer = CardBalanceTransfer;
            self.resource.certification = Certifications;
            self.resource.termsAndCond = TermsAndConditions;
            self.resource.fundingTable = FundingTable;
            self.resource.vehicleInfo = VehicleInfo;
            self.resource.addlnDisclosures = AdditionalDisclosures;
            self.resource.addOnCard = CardAddOn;
            self.reviewTransactionName = {
              header: self.resource.review,
              reviewHeader: self.resource.beforesubmit
            };
            self.reviewDataLoaded(true);
        });
        self.getFilmstripLabel = function (index, applicantIndex) {
            if (self.applicantDetails().length > 1) {
                return rootParams.baseModel.format(self.accordionNames.accordionNames.financialDetailsReview, {
                    index: self.applicantDetails()[applicantIndex].financialProfile.length > 1 ? index + 1 : "",
                    applicantName: rootParams.baseModel.format(self.resource.generic.common.name, {
                        firstName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.firstName(),
                        lastName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.lastName()
                    })
                });
            }
                return rootParams.baseModel.format(self.accordionNames.accordionNames.financialTemplate.name, {
                    index: self.applicantDetails()[applicantIndex].financialProfile.length > 1 ? index + 1 : "",
                    applicantName: ""
                });

        };
        self.getAccordionLabel = function (key, applicantIndex) {
            if (self.applicantDetails().length > 1) {
                return rootParams.baseModel.format(self.accordionNames.accordionNames[key], {
                    applicant: rootParams.baseModel.format(self.accordionNames.accordionNames.applicantName, {
                        name: rootParams.baseModel.format(self.resource.generic.common.name, {
                            firstName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.firstName(),
                            lastName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.lastName()
                        })
                    })
                });
            }
                return rootParams.baseModel.format(self.accordionNames.accordionNames[key], { applicant: "" });

        };
        self.productHeadingName(self.resource.review);
        self.offersLoadedInReview = ko.observable(false);
        self.validationTracker = ko.observable();
        self.accountDocRefId = ko.observable();
        self.eSignDocRefId = ko.observable();
        self.isCoApp = ko.observable(false);
        self.productDetails().applicationId = {
            value: "",
            displayValue: ""
        };
        if (self.productDetails().requirements.noOfCoApplicants > 0) {
            self.isCoApp(true);
        }
        self.privacyDocRefId = ko.observable();
        self.disableSubmit = ko.observable(true);
        self.eSignValue = ko.observable();
        self.taxValue = ko.observable();
        self.privacyValue = ko.observable();
        self.enableDisclosure = ko.observable(false);
        self.applicantObject = rootParams.applicantObject;
        self.editRequirementDetails = function () {
            self.productDetails().sectionBeingEdited("requirements");
            self.setCurrentStage("requirements");
        };
        self.editInsuranceDetails = function () {
            self.productDetails().sectionBeingEdited("application-insurance-input");
            self.setCurrentStage("application-insurance-input");
        };
        self.editPersonalDetails = function (data) {
            self.productDetails().sectionBeingEdited(data);
            for (var i = 0; i < self.productDetails().productStages.length; i++) {
                if (self.productDetails().productStages[i].id === "application-form") {
                    self.productDetails().currentStage = self.productDetails().productStages[i];
                    self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
                    self.productDetails().productApplicationComponentName(self.productDetails().application().currentApplicationStage.id);
                    self.setCurrentStage(0);
                    break;
                }
            }
        };
        self.editFinancialDetails = function (data) {
            self.productDetails().sectionBeingEdited(data);
            for (var i = 0; i < self.productDetails().productStages.length; i++) {
                if (self.productDetails().productStages[i].id === "application-form") {
                    self.productDetails().currentStage = self.productDetails().productStages[i];
                    self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[1].applicantStages[0];
                    self.productDetails().productApplicationComponentName(self.productDetails().application().stages()[1].id);
                    self.setCurrentStage(0);
                    break;
                }
            }
        };
        self.fetchOfferHandler = function (data) {
            var offers = {
                offerId: data.offerDetails[0].offerId,
                applicationFees: data.offerDetails[0].applicationFees,
                interestRate: data.offerDetails[0].interestRate
            };
            self.productDetails().offers = offers;
            self.offersLoadedInReview(true);
        };
        if (!self.productDetails().offers) {
            if (!self.productDetails().requirements.productGroupSerialNumber) {
                self.productDetails().requirements.productGroupSerialNumber = self.productGroupSerialNumber();
            }
            ReviewService.getSelectedOffer(self.productDetails().submissionId.value, self.productDetails().requirements.productGroupSerialNumber, self.fetchOfferHandler);
        } else {
            self.offersLoadedInReview(true);
        }
        self.getIndex = function (obj, key) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].fundingItemType === key) {
                    return i;
                }
            }
        };
        self.downloadDisclosure = function (data) {
            ReviewService.fetchDocumentsByteArray(data, self.applicantDetails()[0].applicantId().value);
        };
        if (!self.productDetails().disclosures || !self.productDetails().disclosures.documentsList || self.productDetails().disclosures.documentsList.length === 0) {
            self.disableSubmit(false);
        }
        self.checkDisclosureType = function (event) {
            if ((event.detail.value) || ((event.detail.value) && (event.detail.value.length === 0))) {
                if ($(".oj-messaging-inline-container").length > 1) {
                    self.disableSubmit(true);
                    return;
                }
                for (var i = 0; i < self.productDetails().disclosures.documentsList.length; i++) {
                    if (event.detail.value[0] === self.productDetails().disclosures.documentsList[i].disclosureCode) {
                        self.productDetails().disclosures.documentsList[i].checked = true;
                    }
                }
                for (i = 0; i < self.productDetails().disclosures.documentsList.length; i++) {
                    if (event.detail.value[0] === self.productDetails().disclosures.documentsList[i].disclosureCode + "coapp") {
                        self.productDetails().disclosures.documentsList[i].coappChecked = true;
                    }
                }
                self.disableSubmit(false);
                if (self.isCoApp()) {
                    for (i = 0; i < self.productDetails().disclosures.documentsList.length; i++) {
                        if (!(self.productDetails().disclosures.documentsList[i].checked && self.productDetails().disclosures.documentsList[i].coappChecked) && $.inArray(self.productDetails().disclosures.documentsList[i].disclosureCode, [
                                "ACCOUNTAGREEMENT",
                                "ESIGNACTDISCLOSURE",
                                "CONSUMERPRIVACYNOTICE"
                            ]) > -1) {
                            self.disableSubmit(true);
                        }
                    }
                } else {
                    for (i = 0; i < self.productDetails().disclosures.documentsList.length; i++) {
                        if (!self.productDetails().disclosures.documentsList[i].checked && $.inArray(self.productDetails().disclosures.documentsList[i].disclosureCode, [
                                "ACCOUNTAGREEMENT",
                                "ESIGNACTDISCLOSURE",
                                "CONSUMERPRIVACYNOTICE"
                            ]) > -1) {
                            self.disableSubmit(true);
                        }
                    }
                }
            } else if (event.detail.value === "messagesShown" && event.detail.value[0] && event.detail.value[0].severity && event.detail.value[0].severity === 4) {
                self.disableSubmit(true);
            }
        };
        self.submitApplicationSuccessHandler = function (data) {
          self.isSubmitSubmissionRequested(false);
            self.productDetails().sectionBeingEdited("");
            if (data.applicationDetailsDTO[0].applicationId && data.applicationDetailsDTO[0].applicationId.value) {
                self.productDetails().applicationId.value = data.applicationDetailsDTO[0].applicationId.value;
                self.productDetails().applicationId.displayValue = data.applicationDetailsDTO[0].applicationId.displayValue;
            }
            if (data.applicationDetailsDTO[0].accountId && data.applicationDetailsDTO[0].accountId.value !== null) {
                self.accountId(data.applicationDetailsDTO[0].accountId.displayValue);
                self.productflowComponent(true);
                self.getNextStage();
            } else {
                self.getApplications();
            }
        };
        self.editCardDetails = function (data) {
            self.productDetails().sectionBeingEdited(data);
            self.productDetails().currentStage.applicantAccordion().open(1);
            self.productflowComponent(true);
            self.productDetails().productApplicationComponentName(data);
            self.setCurrentStage(0);
        };
        self.editCollateralDetails = function (data) {
            self.productDetails().sectionBeingEdited(data);
            self.productDetails().productApplicationComponentName(data);
            self.setCurrentStage(-1);
        };
        self.getApplications = function () {
            ReviewService.getApplications(self.productDetails().submissionId.value, self.getApplicationsSuccessHandler);
        };
        self.getApplicationsSuccessHandler = function (data) {
            if (data.applications[0].applicationId) {
                self.appRefNo(data.applications[0].applicationId.displayValue);
                if (data.applications[0].applicationStatus) {
                    self.applicationStatus(data.applications[0].applicationStatus);
                } else {
                    self.applicationStatus(data.applications[0].submissionStatus);
                }
                self.productflowComponent(true);
                self.getNextStage();
            }
        };
        self.getAccountId = function (appId) {
            ReviewService.getAccountId(self.productDetails().submissionId.value, appId, self.getAccountIdSuccessHandler);
        };
        self.getAccountIdSuccessHandler = function (data) {
            self.accountId(data.demandDepositSummaryResponse.accountId);
            self.getNextStage();
        };
        self.fetchRegistrationRequiredSuccessHandler = function (data) {
            self.registrationCompulsory(data.registrationRequired);
            if (self.registrationCompulsory()) {
                self.showPluginComponent("user-creation");
            } else {
                ReviewService.submitApplication(self.productDetails().submissionId.value, self.submitApplicationSuccessHandler);
            }
        };
        self.submitApplication = function () {
          self.isSubmitSubmissionRequested(true);

            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            ReviewService.fetchRegistrationRequired(self.productDetails().submissionId.value, self.fetchRegistrationRequiredSuccessHandler);
        };
    };
});
