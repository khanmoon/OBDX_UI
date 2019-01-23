define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/review",
    "ojL10n!resources/nls/review-accessibility",
    "framework/js/constants/constants",
    "ojs/ojcheckboxset",
    "ojs/ojbutton"
], function (oj, ko, $, ReviewService, resourceBundle, accessibilityResource, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this, i;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.accessibilityResource = accessibilityResource;
        self.host = Constants.host;
        self.orderDataLoaded = ko.observable(false);
        self.reviewDataLoaded = ko.observable(false);
        self.reviewTransactionName = {
          header: self.resource.review,
          reviewHeader: self.resource.beforesubmit
        };
        require([
            "ojL10n!resources/nls/requirements",
            "ojL10n!resources/nls/primary-registration",
            "ojL10n!resources/nls/identity-info",
            "ojL10n!resources/nls/contact-info",
            "ojL10n!resources/nls/occupation-info",
            "ojL10n!resources/nls/income-info",
            "ojL10n!resources/nls/expense-info",
            "ojL10n!resources/nls/assets-info",
            "ojL10n!resources/nls/liabilities-info",
            "ojL10n!resources/nls/card-account",
            "ojL10n!resources/nls/collateral-info",
            "ojL10n!resources/nls/account-funding",
            "ojL10n!resources/nls/account-holder",
            "ojL10n!resources/nls/card-balance-transfer",
            "ojL10n!resources/nls/funding-table",
            "ojL10n!resources/nls/origination/vehicle-info",
            "ojL10n!resources/nls/card-addon",
            "ojL10n!resources/nls/account-details",
            "ojL10n!resources/nls/application-documents",
            "ojL10n!resources/nls/product-offers"
        ], function (Requirements, PrimaryRegistration, IdentityInfo, ContactInfo, OccupationInfo, IncomeInfo, ExpenseInfo, AssetsInfo, LiabilitiesInfo, CardAccount, CollateralInfo, AccountFunding, AccountHolder, CardBalanceTransfer, FundingTable, VehicleInfo, CardAddOn, AccountDetails, DocumentUpload, ProductOffers) {
            self.resource.requirements = Requirements;
            self.resource.primaryInfo = PrimaryRegistration;
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
            self.resource.cardBalanceTransfer = CardBalanceTransfer;
            self.resource.fundingTable = FundingTable;
            self.resource.vehicleInfo = VehicleInfo;
            self.resource.addOnCard = CardAddOn;
            self.resource.accountDetails = AccountDetails;
            self.resource.documentUpload = DocumentUpload;
            self.resource.offers = ProductOffers;
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
        self.validationTracker = ko.observable();
        self.isCoApp = ko.observable(false);
        self.productDetails().applicationId = {
            value: "",
            displayValue: ""
        };
        self.sectionOrder = ko.observableArray();
        self.documentsLoaded = ko.observable();
        self.applicantObject = rootParams.applicantObject;
        self.isElementPresent = function (arr, value, key) {
            var i;
            if (key === "contentId") {
                for (i = 0; i < arr.length; i++) {
                    if (value === arr[i][key].value) {
                        return i;
                    }
                }
                return -1;
            }
                for (i = 0; i < arr.length; i++) {
                    if (value === arr[i][key]) {
                        return i;
                    }
                }
                return -1;

        };
        self.distinct = ko.observableArray([]);
        var fetchUploadedDocumentsDeferred = $.Deferred();
        ReviewService.fetchUploadedDocuments(self.productDetails().submissionId.value, fetchUploadedDocumentsDeferred).done(function (data) {
            self.documentsUploaded(data.submissionDocument);
            if (data.submissionDocument.length > 0) {
                self.initializeDocumentReview(data.submissionDocument);
                self.documentsLoaded(true);
            }
        });
        self.initializeDocumentReview = function (documentData) {
            var distinctObject = {
                categoryId: "",
                documentTypes: [{
                        documentType: "",
                        contentList: [{
                                contentId: "",
                                documentName: "",
                                remarks: ""
                            }]
                    }]
            };
            var categoryIndex;
            for (var i = 0; i < documentData.length; i++) {
                if ((categoryIndex = self.isElementPresent(self.distinct(), documentData[i].categoryId, "categoryId")) === -1) {
                    distinctObject.categoryId = documentData[i].categoryId;
                    distinctObject.documentTypes[0].documentType = documentData[i].documentType;
                    distinctObject.documentTypes[0].contentList[0].contentId = documentData[i].contentId;
                    distinctObject.documentTypes[0].contentList[0].documentName = documentData[i].documentName;
                    distinctObject.documentTypes[0].contentList[0].remarks = documentData[i].remarks;
                    self.distinct.push(JSON.parse(JSON.stringify(distinctObject)));
                } else {
                    var distinctDocumentTypeObject = {
                        documentType: "",
                        contentList: [{
                                contentId: "",
                                documentName: "",
                                remarks: ""
                            }]
                    };
                    var documentIndex;
                    for (var j = 0; j < self.distinct()[categoryIndex].documentTypes.length; j++) {
                        if ((documentIndex = self.isElementPresent(self.distinct()[categoryIndex].documentTypes, documentData[i].documentType, "documentType")) === -1) {
                            distinctDocumentTypeObject.documentType = documentData[i].documentType;
                            distinctDocumentTypeObject.contentList[0].contentId = documentData[i].contentId;
                            distinctDocumentTypeObject.contentList[0].documentName = documentData[i].documentName;
                            distinctDocumentTypeObject.contentList[0].remarks = documentData[i].remarks;
                            self.distinct()[categoryIndex].documentTypes.push(JSON.parse(JSON.stringify(distinctDocumentTypeObject)));
                        } else {
                            var distinctContentObject = {
                                contentId: "",
                                documentName: "",
                                remarks: ""
                            };
                            for (var k = 0; k < self.distinct()[categoryIndex].documentTypes[documentIndex].contentList.length; k++) {
                                if (self.isElementPresent(self.distinct()[categoryIndex].documentTypes[documentIndex].contentList, documentData[i].contentId.value, "contentId") === -1) {
                                    distinctContentObject.contentId = documentData[i].contentId;
                                    distinctContentObject.documentName = documentData[i].documentName;
                                    distinctContentObject.remarks = documentData[i].remarks;
                                    self.distinct()[categoryIndex].documentTypes[documentIndex].contentList.push(JSON.parse(JSON.stringify(distinctContentObject)));
                                }
                            }
                        }
                    }
                }
            }
        };
        self.documentsSubscription = self.documentsUploaded.subscribe(function () {
            if (self.documentsUploaded().length > 0) {
                self.initializeDocumentReview(self.documentsUploaded());
                self.documentsLoaded(true);
            }
        });
        self.downloadDocument = function (contentId) {
            ReviewService.downloadDocument(contentId.value, self.applicantDetails()[0].applicantId().value);
        };
        self.editRequirementDetails = function () {
            self.productDetails().sectionBeingEdited("requirements");
            self.setCurrentStage("requirements");
        };
        self.getIndex = function (obj, key, searchKey) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][searchKey] === key) {
                    return i;
                }
            }
        };
        var index = self.getIndex(self.productDetails().productStages, "application-form", "id");
        var editableForCustomerArray = [
            "occupation-info",
            "income-info",
            "assets-info",
            "liabilities-info",
            "expense-info"
        ];
        for (i = 0; i < self.productDetails().productStages[index].stages[0].stages.length; i++) {
            if (self.productDetails().productStages[index].stages[0].stages[i].id !== "requirements" && self.productDetails().productStages[index].stages[0].stages[i].id !== "vehicle-info") {
                if (self.productDetails().productStages[index].stages[0].stages[i].stepCategory === "APPLICATION" || $.inArray(self.productDetails().productStages[index].stages[0].stages[i].id, editableForCustomerArray) > -1) {
                    self.productDetails().productStages[index].stages[0].stages[i].isEditableForCustomer = ko.observable(true);
                }
            } else {
                self.productDetails().productStages[index].stages[0].stages[i].isEditableForCustomer = ko.observable(true);
            }
        }
        self.getSectionOrder = function () {
            for (var i = 0; i < self.productDetails().productStages[index].stages[0].stages.length; i++) {
                self.sectionOrder.push(self.productDetails().productStages[index].stages[0].stages[i]);
            }
        };
        self.getSectionOrder();
        self.orderDataLoaded(true);
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
        self.submitApplicationSuccessHandler = function (data) {
            self.disableFinalSubmitButton(false);
            self.productDetails().sectionBeingEdited("");

            if (data.submissionOutputDTO.applications[0].applicationId && data.submissionOutputDTO.applications[0].applicationId.value) {
                self.productDetails().applicationId.value = data.submissionOutputDTO.applications[0].applicationId.value;
                self.productDetails().applicationId.displayValue = data.submissionOutputDTO.applications[0].applicationId.displayValue;
                self.appRefNo(data.submissionOutputDTO.applications[0].applicationId.displayValue);
            }

            self.getNextStage();
        };
        self.submitApplicationErrorHandler = function () {
            self.disableFinalSubmitButton(false);
        };
        self.submitApplication = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.disableFinalSubmitButton(true);
            if (self.userType === "primary") {
                $(".se-pre-con").show();
                var fetchRegistrationRequiredDeferred = $.Deferred();
                ReviewService.fetchRegistrationRequired(self.productDetails().submissionId.value, fetchRegistrationRequiredDeferred).done(function (data) {
                    self.registrationCompulsory(data.registrationRequired);
                    if (self.registrationCompulsory()) {
                        self.showPluginComponent("user-creation");
                    } else {
                        ReviewService.submitApplication(self.productDetails().submissionId.value, self.submitApplicationSuccessHandler, self.submitApplicationErrorHandler);
                    }
                });
            } else {
                self.getNextStage();
            }
        };
        self.dispose = function () {
            self.documentsSubscription.dispose();
        };
    };
});
