define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/requirements",
  "ojs/ojselectcombobox",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, RequirementsModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i = 0,
      j = 0,
      currData, pairs, rId, loanAmountCalculated = false,
      payLoad = {
        batchDetailRequestList: []
      },
      url, draftObj, getNewKoModel = function() {
        var KoModel = RequirementsModel.getNewModel(self.productDetails().currency);
        return KoModel;
      },
      setPurposeType = function(purpose) {
        for (i = 0; i < self.purposeData().length; i++) {
          for (j = 0; j < self.purposeData()[i].purposeList.length; j++) {
            if (self.purposeData()[i].purposeList[j].code === purpose) {
              self.productDetails().requirements.purposeType = self.purposeData()[i].type;
              self.productDetails().requirements.purpose.description = self.purposeData()[i].purposeList[j].name;
              self.purposeDetail(self.purposeData()[i].purposeList[j].name);
            }
          }
        }
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerElement("amount-input");
    self.minimumAmount = 5000;
    rootParams.baseModel.registerComponent("loan-tenure", "origination");
    self.isYourFirstHome = ko.observable("OPTION_NO");
    self.coApplicantExistingUser = ko.observable("OPTION_NO");
    self.coApplicantExists = ko.observable(false);
    self.loginNeeded = ko.observable(false);
    self.isTokenValid = ko.observable(false);
    self.disableCoAppPartyId = ko.observable(false);
    self.groupValid = ko.observable();
    self.validationEmailTracker = ko.observable();
    self.userId = ko.observable("");
    self.baseUrl = ko.observable();
    self.optionYears = ko.observableArray([]);
    self.optionMonths = ko.observableArray([]);
    self.years = self.productDetails().maxTerm ? self.productDetails().maxTerm / 12 : 20;
    self.preferenceMode = ko.observableArray([]);
    self.loadVerifyEmail = ko.observable(false);


    for (i = 0; i <= self.years; i++) {
      self.optionYears.push({
        label: i,
        value: i
      });
    }
    for (i = 0; i <= 11; i++) {
      self.optionMonths.push({
        label: i,
        value: i
      });
    }
    self.disableVerifyButton = ko.computed(function() {
      if (self.preferenceMode().length > 0) {
        return false;
      }
      return true;

    }, self);
    self.getRequirementModel = function(type) {
      if (!self.productDetails().requirements) {
        self.productDetails().requirements = getNewKoModel()[type];
        if (self.productDetails().productClassName !== "CREDIT_CARD") {
          self.productDetails().requirements.noOfCoApplicants = "0";
        }
        if (self.productDetails().requirements.requestedAmount) {
          self.productDetails().requirements.requestedAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedAmount.amount));
        }
        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years));
          self.productDetails().requirements.requestedTenure.months = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months));
          self.productDetails().requirements.frequency = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.frequency));
        }
      }
    };
    url = "submissions/{submissionId}";
    var productType;
    self.requirementsPartial = ko.observable();
    var className = self.productDetails().productClassName;
    self.requirementsPartial(className.toLowerCase().replace(/#|_/g, "-"));
    switch (self.productDetails().productClassName) {
      case "CREDIT_CARD":
        productType = "CC";
        url = url + "/creditCardApplications";
        self.getRequirementModel("cardRequirement");
        break;
      case "CASA":
        productType = "CASA";
        url = url + "/demandDepositApplications";
        self.getRequirementModel("savingsRequirement");
        break;
      case "TERM_DEPOSITS":
        productType = "TD";
        url = url + "/depositApplications/validation";
        self.getRequirementModel("termRequirement");
        break;
      default:
        url = url + "/loanApplications/validation";
        if (self.productDetails().productType === "LOANS") {
          self.getRequirementModel("homeLoanRequirement");
        } else if (self.productDetails().productType === "AUTOMOBILE") {
          self.getRequirementModel("autoloanRequirement");
        } else {
          self.getRequirementModel("loanRequirement");
        }
        self.requirementsPartial(self.requirementsPartial() + "-" + self.productDetails().productType.toLowerCase().replace(/#|_/g, "-"));
        break;
    }
    self.productDetails().coappPreference = getNewKoModel().coappPreference;
    self.loanPurposeLoaded = ko.observable(false);
    self.currencyLoaded = ko.observable(false);
    self.currenciesLoaded = ko.observable(false);
    self.frequencyOptionsLoaded = ko.observable(false);
    self.purposeData = ko.observableArray([]);
    self.repaymentFrequencyData = ko.observableArray([]);
    self.productDetails().repaymentAmount = ko.observable();
    self.validationTracker = ko.observable();
    self.transferCurrency = ko.observable();
    self.transferCurrency("");
    self.coAppConsent = ko.observable(false);
    self.coApplicantData = ko.observableArray([{
        "holdingPattern": self.resource.individual,
        "value": 0
      },
      {
        "holdingPattern": self.resource.joint,
        "value": 1
      }
    ]);
    self.checkEmpty = function(obj) {
      if (obj !== "" && obj && obj !== null) {
        return true;
      }
      return false;
    };
    RequirementsModel.getAllowedCurrencies(self.productDetails().productCode).done(function(data) {
      currData = data;
      self.currenciesLoaded(true);
    });
    self.currencyParser = function() {
      if (self.productDetails().productClassName === "LOANS" || self.productDetails().productClassName === "CREDIT_CARD") {
        self.currencyLoaded(true);
        return {
          currencies: currData.currencyList
        };
      } else if (self.productDetails().offerCurrencies) {
        self.currencyLoaded(true);
        return {
          currencies: self.productDetails().offerCurrencies
        };
      }
    };
    self.exitApplication = function() {
      $("#EXITAPPLICATION").trigger("openModal");
    };
    self.calculateLoanAmount = ko.computed(function() {
      if (loanAmountCalculated || (self.productDetails().productClassName !== "LOANS" && self.productDetails().productClassName !== "TERM_DEPOSITS")) {
        return;
      }
      if (self.productDetails().productClassName === "TERM_DEPOSITS") {
        if (self.checkEmpty(self.productDetails().requirements.requestedAmount.amount()) && self.checkEmpty(self.productDetails().requirements.requestedTenure.years()) && self.checkEmpty(self.productDetails().requirements.requestedTenure.months()) && self.productDetails().requirements.requestedAmount.amount() !== 0) {
          self.changeFrqLoaded();
        }
      }
    });
    self.coapplicantsSelected = function(event) {
      var i;
      if (event.detail.value) {
        if (event.detail.value === "0") {
          self.coApplicantExists(false);
          self.loginNeeded(false);
          self.coApplicantExistingUser("OPTION_NO");
          self.userId("");
          self.coAppConsent(false);
        }
        if (event.detail.value === "1") {
          self.coApplicantExists(true);
          self.coAppConsentMessage = self.resource.coAppConsent;
          self.coAppConsent(true);
        }
        self.coApplicantsRelation([]);
        for (i = 0; i < parseInt(self.productDetails().requirements.noOfCoApplicants, 10); i++) {
          self.coApplicantsRelation.push("");
        }
      }
    };
    self.coApplicantLogin = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.loginNeeded(false);
        self.isTokenValid(false);
        self.userId("");
        self.disableCoAppPartyId(false);
      }
      if (event.detail.value === "OPTION_YES") {
        self.loginNeeded(true);
        self.userId("");
      }
    };
    self.changeCoApplicantRelation = function(event) {
      if (event.detail.value) {
        rId = event.target.attributes.id.value.split("-")[1];
        self.coApplicantsRelation()[rId - 1] = event.detail.value;
      }
    };
    var coApplicantId;
    self.otpDevice = ko.observable("");
    rootParams.baseModel.registerComponent("otp-verification", "base-components");
    self.verifyEmail = function(data) {
      self.baseUrl("submissions/" + self.productDetails().submissionId.value + "/coApplicants/" + self.userId() + "/verificationCode");
      if ($("#otpGeneration").css("display") === "none") {
        if (self.preferenceMode().indexOf("email") > -1) {
          self.productDetails().coappPreference.isEmailOpted = true;
        } else {
          self.productDetails().coappPreference.isEmailOpted = false;
        }
        if (self.preferenceMode().indexOf("sms") > -1) {
          self.productDetails().coappPreference.isMobileOpted = true;
        } else {
          self.productDetails().coappPreference.isMobileOpted = false;
        }
        if (self.productDetails().coappPreference.isEmailOpted && self.productDetails().coappPreference.isMobileOpted) {
          self.otpDevice("otpDevice1");
        } else if (self.productDetails().coappPreference.isEmailOpted && !self.productDetails().coappPreference.isMobileOpted) {
          self.otpDevice("otpDevice2");
        } else if (!self.productDetails().coappPreference.isEmailOpted && self.productDetails().coappPreference.isMobileOpted) {
          self.otpDevice("otpDevice3");
        }
        RequirementsModel.getApplicantId(self.productDetails().submissionId.value, self.userId(), ko.toJSON(self.productDetails().coappPreference)).done(function() {
          self.loadVerifyEmail(true);
          ko.tasks.runEarly();
          $("#otpGeneration").trigger("openModal");
        });
      } else {
        if (data.tokenValid) {
          self.isTokenValid(data.tokenValid);
          coApplicantId = data.party.id.value;
          self.disableCoAppPartyId(true);
        }
        $("#otpGeneration").trigger("closeModal");
        self.loadVerifyEmail(false);
        ko.tasks.runEarly();
      }
    };
    var loanURL = {
        value: "/productGroups/{productCode}/purposes",
        params: {
          "productCode": self.productDetails().productCode
        }
      },
      frequencyListURL = {
        value: "/enumerations/frequency?for={type}",
        params: {
          type: self.productDetails().productClassName === "TERM_DEPOSITS" ? "depositRepayment" : "loanRepayment"
        }
      },
      relationListURL = {
        value: "/enumerations/relation?type={personal}",
        params: {
          "personal": "personal"
        }
      };
    self.batchURL = [
      loanURL,
      frequencyListURL,
      relationListURL
    ];
    for (i = 0; i < self.batchURL.length; i++) {
      draftObj = {
        methodType: "GET",
        uri: self.batchURL[i],
        sequenceId: i + 1,
        headers: {
          "Content-Id": i + 1,
          "Content-Type": "application/json"
        }
      };
      payLoad.batchDetailRequestList.push(draftObj);
    }
    RequirementsModel.fireBatch(payLoad).done(function(data) {
      var purposePayLoadResponse, frequencyPayLoadResponse;
      for (var k = 0; k < 3; k++) {
        if (data.batchDetailResponseDTOList[k].sequenceId.trim() === "1") {
          purposePayLoadResponse = JSON.parse(data.batchDetailResponseDTOList[k].responseText);
        }
        if (data.batchDetailResponseDTOList[k].sequenceId.trim() === "2") {
          frequencyPayLoadResponse = JSON.parse(data.batchDetailResponseDTOList[k].responseText);
        }
      }
      self.purposeData(purposePayLoadResponse.purposeTypeList);
      if (self.purposeData() && self.purposeData().length > 0) {
        for (i = 0; i < self.purposeData().length; i++) {
          pairs = self.purposeData()[i].name.split("_");
          for (j = 0; j < pairs.length; j++) {
            pairs[j] = pairs[j].substring(0, 1).toUpperCase() + pairs[j].substring(1).toLowerCase();
            self.purposeData()[i].name = pairs.join(" ");
          }
        }
      }
      self.loanPurposeLoaded(true);
      if (self.productDetails().productClassName !== "TERM_DEPOSITS") {
        self.repaymentFrequencyData(frequencyPayLoadResponse.enumRepresentations[0].data);
        self.frequencyOptionsLoaded(true);
      }
    });
    self.changeFrqLoaded = function() {
      self.frequencyOptionsLoaded(false);
      if (!isNaN(self.productDetails().requirements.requestedTenure.years()) && !isNaN(self.productDetails().requirements.requestedTenure.months()) && !isNaN(self.productDetails().requirements.requestedAmount.amount())) {
        RequirementsModel.fetchFrequencyList(self.productDetails().submissionId.value, self.productDetails()).done(function(data) {
          if (data.frequencies) {
            self.repaymentFrequencyData(data.frequencies);
            self.frequencyOptionsLoaded(true);
          }
        });
      }
    };
    self.firstHomeStatus = function(event, data) {
      if (data.value === "OPTION_NO") {
        self.productDetails().requirements.isYourFirstHome = false;
        self.isYourFirstHome("OPTION_NO");
      }
      if (data.value === "OPTION_YES") {
        self.productDetails().requirements.isYourFirstHome = true;
        self.isYourFirstHome("OPTION_YES");
      }
    };
    self.submitRequirements = function() {
      var requirementsTracker = document.getElementById("requirementsTracker");
      if (!requirementsTracker || requirementsTracker.valid === "valid") {
        loanAmountCalculated = true;
        self.productDetails().requirements.state = self.productDetails().selectedState;
        if (self.productDetails().productClassName === "CREDIT_CARD") {
          self.productDetails().requirements.currency = currData.currencyList[0].code;
          self.productDetails().currency = currData.currencyList[0].code;
          self.productDetails().requirements.requestedAmount.amount = self.productDetails().maximumCreditLimit;
          self.productDetails().requirements.requestedAmount.currency = self.productDetails().requirements.currency;
        } else if (self.productDetails().requirements.currency) {

          self.productDetails().currency = self.productDetails().requirements.currency;
        }
        if (self.transferCurrency()) {
          self.productDetails().requirements.requestedAmount.currency = self.transferCurrency();
          self.productDetails().currency = self.transferCurrency();
          if (!self.productDetails().requirements.currency && self.productDetails().productClassName !== "LOANS") {
            self.productDetails().requirements.currency = self.transferCurrency();
          }
        }
        if (self.productDetails().requirements.purpose) {
          setPurposeType(self.productDetails().requirements.purpose.code);
        }
        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.days = "0";
          self.productDetails().requirements.requestedTenure.years(self.productDetails().requirements.requestedTenure.years());
          self.productDetails().requirements.requestedTenure.months(self.productDetails().requirements.requestedTenure.months());
          self.productDetails().requirements.frequency(self.productDetails().requirements.frequency());
        }
        if (self.productDetails().productClassName !== "CREDIT_CARD") {
          self.productDetails().requirements.noOfCoApplicants = parseInt(self.productDetails().requirements.noOfCoApplicants);
        }
        self.productDetails().requirements.productGroupCode = self.productDetails().productCode;
        self.productDetails().requirements.productGroupName = self.productDetails().productDescription;
        var productId = self.productDetails().productCode;
        if (self.productDetails().productClassName === "TERM_DEPOSITS") {
          productId = self.productDetails().productCodeTD;
        }
        if (self.productDetails().productClassName === "CASA") {
          productId = self.productDetails().productCodeCASA;
        }
        if (self.productDetails().productType) {
          self.productDetails().requirements.productSubClass = self.productDetails().productType;
        }
        self.productDetails().requirements.productClass = self.productDetails().productClassName;
        self.productDetails().requirements.offerId = self.productDetails().offerId;
        self.productDetails().requirements.productId = productId;
        self.productDetails().requirements.isIPA = self.productDetails().isInPrincipleApproval;
        if (self.productDetails().productClassName === "LOANS" || self.productDetails().productClassName === "TERM_DEPOSITS") {
          RequirementsModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(self.productDetails().requirements, {
            "ignore": ["facilityId", "productGroupLinkageType", "name", "displayValue", "value", "selectedValues"]
          })).done(function() {
            if (parseInt(self.productDetails().requirements.noOfCoApplicants)) {
              if (self.isTokenValid()) {
                var sendData = {
                  productGroupSerialNumber: self.productGroupSerialNumber().toString(),
                  applicantRelationshipType: "CO_APPLICANT"
                };
                sendData.applicantId = coApplicantId;
                RequirementsModel.updateApplicant(self.productDetails().submissionId.value, ko.toJSON(sendData)).done(function() {
                  self.isRequirementRequired(true);
                  self.fetchAdditionalFlow().done(function() {
                    self.applicantDetails()[1].applicantId().value = coApplicantId;
                    self.getNextStage();
                  });
                });
              } else {
                self.fetchAdditionalFlow().done(function() {
                  self.getNextStage();
                });
              }
            } else {
              self.getNextStage();
            }
          });
        } else if (parseInt(self.productDetails().requirements.noOfCoApplicants)) {
          if (self.isTokenValid()) {
            var sendData = {
              productGroupSerialNumber: self.productGroupSerialNumber().toString(),
              applicantRelationshipType: "CO_APPLICANT"
            };
            sendData.applicantId = coApplicantId;
            RequirementsModel.updateApplicant(self.productDetails().submissionId.value, ko.toJSON(sendData)).done(function() {
              self.isRequirementRequired(true);
              self.fetchAdditionalFlow().done(function() {
                self.applicantDetails()[1].applicantId().value = coApplicantId;
                self.getNextStage();
              });
            });
          } else {
            self.fetchAdditionalFlow().done(function() {
              self.getNextStage();
            });
          }
        } else {
          self.getNextStage();
        }
      } else {
        requirementsTracker.showMessages();
        requirementsTracker.focusOn("@firstInvalidShown");
      }
    };
    var payload = {
      "productGroupCode": self.productDetails().productCode,
      "productGroupName": self.productDetails().productDescription,
      "inPrincipleApproval": self.productDetails().isInPrincipleApproval
    };
    RequirementsModel.createSubmission(payload).done(function(data) {
      self.productDetails().submissionId = data.submissionId;
      if (data.productGroupSerialNumber) {
        self.productGroupSerialNumber(data.productGroupSerialNumber);
        self.productDetails().requirements.productGroupSerialNumber = data.productGroupSerialNumber;
        if (self.applicantDetails()[0].applicantId().value) {
          var sendData = {
            productGroupSerialNumber: self.productGroupSerialNumber().toString(),
            applicantRelationshipType: "APPLICANT"
          };
          sendData.applicantId = self.applicantDetails()[0].applicantId().value;
          RequirementsModel.updateApplicant(self.productDetails().submissionId.value, ko.toJSON(sendData)).done(function() {
            if (self.productDetails().productClassName !== "LOANS") {
              RequirementsModel.associateOffer(self.productDetails().submissionId.value, self.productGroupSerialNumber(), self.productDetails().offerId);
            }
            self.isRequirementRequired(true);
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.submitRequirements();
            }
          });
        } else if (self.productDetails().productClassName === "CREDIT_CARD") {
          self.submitRequirements();
        }
        if (self.productDetails().productClassName !== "LOANS") {
          if (!self.applicantDetails()[0].applicantId().value) {
            RequirementsModel.associateOffer(self.productDetails().submissionId.value, self.productGroupSerialNumber(), self.productDetails().offerId);
          }
          RequirementsModel.fetchOfferDetails(self.productDetails().offerId, productType).done(function(data) {
            if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails) {
              self.productDetails().offers = {
                offerName: data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.name,
                offerId: data.offerDetails[0].offerId,
                offerAdditionalDetails: data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails
              };
            }
            if (data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails) {
              self.productDetails().offers = {
                offerName: data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.name,
                offerId: data.offerDetails[0].offerId,
                offerAdditionalDetails: data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails
              };
            }
            if (data.offerDetails[0].offerAdditionalDetails.cardOfferDetails) {
              self.productDetails().offers = {
                offerName: data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.name,
                offerId: data.offerDetails[0].offerId,
                offerAdditionalDetails: data.offerDetails[0].offerAdditionalDetails.cardOfferDetails
              };
            }
          });
        }
      }
    });
    self.dispose = function() {
      self.disableVerifyButton.dispose();
      self.calculateLoanAmount.dispose();
    };
  };
});
