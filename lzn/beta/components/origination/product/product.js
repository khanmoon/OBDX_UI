define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!lzn/beta/resources/nls/product",
  "ojs/ojknockout-validation"
], function(oj, ko, $, ProductService, BaseLogger, constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      requirements;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.accordionNames = resourceBundle;
    self.dataLoaded = ko.observable(false);
    self.purposeDetail = ko.observable();
    self.previousPluginComponent = ko.observable();
    self.relations = ko.observableArray([]);
    self.coApplicantsRelation = ko.observableArray();
    self.displayModal = ko.observable(false);
    self.securityCodeModel = ko.observable(false);
    self.productGroupSerialNumber = ko.observable();
    self.showFinancialDetails = ko.observable(true);
    self.userType = "primary";
    self.submissionIdExists = ko.observable(false);
    self.accountId = ko.observable();
    self.appRefNo = ko.observable();
    self.applicationStatus = ko.observable();
    self.enableESignDoc = ko.observable(false);
    self.displayDisclosure = ko.observable(false);
    self.enableTaxDoc = ko.observable(false);
    self.enablePrivacyDoc = ko.observable(false);
    self.isRequirementRequired = ko.observable(false);
    self.isApplicationCancelled = ko.observable(false);
    self.ownerList = ko.observable(true);
    self.offerAdditionalDetails = {};
    self.pageTitle = self.resource.pageTitle;
    self.registrationCompulsory = ko.observable(false);
    self.isSubmitSubmissionRequested = ko.observable(false);
    self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
    self.applicantDetails = ko.observable([{
      applicantId: ko.observable({
        displayValue: "",
        value: ""
      }),
      applicantRelationshipType: "APPLICANT"
    }]);
    constants.module = "ORIGINATION";
    self.todayIsoDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
    self.constants = constants;
    self.backAllowed = ko.observable(false);
    self.homePage = ko.observable(false);
    self.userProfile = ko.observable();
    self.userRoles = ko.observableArray();
    self.label = ko.observable();
    self.userLoggedIn = ko.observable();
    self.componentName = ko.observable("product");
    rootParams.baseModel.registerComponent("tooltip", "home");
    self.productHeaderImage = ko.observable();
    self.tenure = ko.observable();
    self.loanAmount = ko.observable();
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("offers-carousal", "origination");
    rootParams.baseModel.registerComponent("cancel-application", "origination");
    rootParams.baseModel.registerComponent("user-creation", "origination");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("review", "origination");
    self.label = self.productHeadingName;
    rootParams.baseModel.dateConverter.getOptions().pattern = rootParams.baseModel.getLocaleValue("dateFormat");
    var productType;

    var sessionStorageData;
    if (!(self.queryMap && self.queryMap.regRefNo)) {
      // eslint-disable-next-line no-storage/no-browser-storage
      var sessionStorageDataTemp = sessionStorage.sessionStorageData;
      // eslint-disable-next-line no-storage/no-browser-storage
      sessionStorage.removeItem("sessionStorageData");
      if (sessionStorageDataTemp) {
        sessionStorageData = JSON.parse(sessionStorageDataTemp);
      } else {
        sessionStorageData = self.applicationArguments;
      }
      if (sessionStorageData.entity) {
        constants.currentEntity = sessionStorageData.entity;
        // eslint-disable-next-line no-storage/no-browser-storage
        sessionStorage.setItem("entity", sessionStorageData.entity);
      }
    }

    if (sessionStorageData && sessionStorageData.productCode) {
      self.productDetails().productCode = sessionStorageData.productCode;
      self.productDetails().productDescription = sessionStorageData.productDescription;
      self.productDetails().isInPrincipleApproval = sessionStorageData.isInPrincipleApproval && JSON.parse(sessionStorageData.isInPrincipleApproval);
      if (sessionStorageData.productGroupMaxTerm) {
        self.productDetails().maxTerm = JSON.parse(sessionStorageData.productGroupMaxTerm);
      }
      if (sessionStorageData.productClassName === "LOANS") {
        self.productDetails().isCollateralRequired = sessionStorageData.isCollateralRequired;
        self.productDetails().productClassName = sessionStorageData.productClassName;
      } else {
        self.productDetails().productClassName = sessionStorageData.productClassName;
        self.productDetails().offerId = sessionStorageData.selectedOfferId;
      }
      if (sessionStorageData.productType) {
        self.productDetails().productType = sessionStorageData.productType;
      }

      if (self.productDetails().productType) {
        productType = self.productDetails().productType;
      }
      self.productHeaderImage = ko.observable(productType + "-product-bg");
    }

    var productTypeName;
    switch (self.productDetails().productClassName) {
      case "CREDIT_CARD":
        productTypeName = "CC";
        break;
      case "CASA":
        productTypeName = "CASA";
        break;
      case "TERM_DEPOSITS":
        productTypeName = "TD";
        break;
      case "LOANS":
        productTypeName = "LOAN";
        break;
      default:
        break;
    }
    if (!self.queryMap.regRefNo) {
      if (self.productDetails().productClassName !== "LOANS" && sessionStorageData.selectedOfferId) {
        ProductService.fetchAdditionalOfferDetails(sessionStorageData.selectedOfferId, productTypeName).then(function(data) {
          self.offerAdditionalDetails[sessionStorageData.selectedOfferId] = data;
          if (data.offerDetails && data.offerDetails.length > 0 && data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails && data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.productCode) {
            self.productDetails().productCodeTD = data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.productCode;
          }
          if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails && data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.productCode) {
            self.productDetails().productCodeCASA = data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.productCode;
          }
          if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails) {
            if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies) {
              self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies;
            } else {
              self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.demandDepositOfferCurrencyParameterResponseDTOs;
            }
          }
          if (data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails) {
            if (data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies) {
              self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies;
            } else {
              self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.termDepositOfferCurrencyParameterResponseDTOs;
            }
          }
          if (data.offerDetails[0].offerAdditionalDetails.cardOfferDetails) {
            sessionStorageData.minimumCreditLimit = data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.creditCardLimitDetail[0].minimumCreditLimit;
          }
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
          if (self.productDetails().requirements && parseInt(self.productDetails().requirements.noOfCoApplicants)) {
            self.fetchAdditionalFlow();
          }

        });
      }

    }
    self.fetchProductFlow = function() {
      var flowJson = self.productDetails().productClassName;
      self.applicantDetails()[0].applicantRelationshipType = "APPLICANT";
      if (self.productDetails().productClassName === "LOANS") {
        if (self.productDetails().isInPrincipleApproval) {
          flowJson = flowJson + "-" + self.productDetails().productType + "-ipa";
        } else {
          flowJson = flowJson + "-" + self.productDetails().productType.split("_").join("-");
        }
      }
      if (self.productDetails().productClassName === "TERM_DEPOSITS" || self.productDetails().productClassName === "CREDIT_CARD") {
        flowJson = self.productDetails().productClassName.split("_").join("-");
      }
      ProductService.fetchProductFlow(flowJson.toLowerCase(), self.productFlowSuccessHandler);
    };
    self.wrongStateModalClose = function() {
      rootParams.dashboard.switchModule("home", true);
    };
    self.fetchOfferNameHandler = function(data) {
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
      if (self.productDetails().requirements && parseInt(self.productDetails().requirements.noOfCoApplicants)) {
        self.fetchAdditionalFlow();
      }
      self.dataLoaded(true);
    };
    self.productFlowSuccessHandler = function(data) {
      self.productDetails().productName = data.productDetails.productName;
      self.productDetails().productStages = data.productDetails.productStages;
      self.productDetails().currentStage = self.productDetails().productStages[0];
      self.productComponentName(self.productDetails().productStages[0].id);
      self.productHeadingName(self.productDetails().productName);
      rootParams.baseModel.registerComponent(self.productDetails().productStages[0].id, "origination");
      if (sessionStorageData.submissionId) {
        var len = self.productDetails().productStages.length;
        for (var i = 0; i < len; i++) {
          if (self.productDetails().productStages[i].id === "application-form") {
            self.productDetails().currentStage = self.productDetails().productStages[i];
            self.setCurrentStage(0);
            break;
          }
        }
      }
      if (sessionStorageData.selectedState) {
        self.productDetails().selectedState = sessionStorageData.selectedState;
      }
      if (!self.productDetails().offers && self.productDetails().submissionId) {
        self.dataLoaded(true);
      } else {
        if (self.productDetails().requirements && parseInt(self.productDetails().requirements.noOfCoApplicants)) {
          self.fetchAdditionalFlow();
        }
        self.dataLoaded(true);
      }
    };
    self.productSummarySuccessHandler = function(data) {
      if (!self.productDetails().requirements) {
        self.productDetails().requirements = {};
      }
      if (data.noOfCoapplicants || data.noOfCoapplicants === 0) {
        self.productDetails().requirements.noOfCoApplicants = data.noOfCoapplicants;
      }
      if (data.repaymentFrequency) {
        self.productDetails().requirements.frequency = ko.observable(data.repaymentFrequency);
      } else {
        self.productDetails().requirements.frequency = ko.observable();
      }
      if (data.tenure) {
        if (!self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure = data.tenure;
          self.productDetails().requirements.requestedTenure.years = ko.observable(self.productDetails().requirements.requestedTenure.years);
          self.productDetails().requirements.requestedTenure.months = ko.observable(self.productDetails().requirements.requestedTenure.months);
        }
      }
      if (data.currency) {
        self.productDetails().currency = data.currency;
      }
      if (data.loanApplicationAmount) {
        self.productDetails().currency = data.loanApplicationAmount.currency;
        self.productDetails().requirements.requestedAmount = data.loanApplicationAmount;
        self.productDetails().requirements.requestedAmount.amount = ko.observable(self.productDetails().requirements.requestedAmount.amount);
      }
      if (data.productSubClass) {
        self.productHeaderImage(data.productSubClass + "-product-bg");
        self.productDetails().productType = data.productSubClass;
      }
      self.fetchProductFlow();
    };
    self.fetchAdditionalFlow = function() {
      var coappJSON = "co-app";
      var flowDeferred = $.Deferred();
      ProductService.fetchAdditionalFlow(coappJSON).done(function(data) {
        var SearchObject = function(key, array) {
          for (var i = 0; i < array.length; i++) {
            if (array[i].id === key) {
              return array;
            } else if (array[i].stages) {
              var x = SearchObject(key, array[i].stages);
              if (x) {
                return x;
              }
            }
          }
        };
        for (var i = 0; i < parseInt(self.productDetails().requirements.noOfCoApplicants); i++) {
          self.applicantDetails()[i + 1] = ko.mapping.toJS(ko.mapping.fromJS(self.applicantDetails()[0]));
          self.applicantDetails()[i + 1].applicantId = ko.observable(self.applicantDetails()[i + 1].applicantId);
          self.applicantDetails()[i + 1].applicantId().displayValue = "";
          self.applicantDetails()[i + 1].applicantId().value = "";
          self.applicantDetails()[i + 1].applicantRelationshipType = "CO_APPLICANT";
          for (var j = 0; j < data.coApp.length; j++) {
            var stages = SearchObject(data.coApp[j].id, self.productDetails().productStages);
            if (stages) {
              self.modifyFlowStages(0, stages, data.coApp[j].id, data.coApp[j].name, data.coApp[j].id, {
                coappNumber: i + 1
              });
            }
          }
        }
        flowDeferred.resolve();
      });
      return flowDeferred;
    };
    self.getPreviousStage = function() {
      if (self.productDetails().sectionBeingEdited() === self.productDetails().currentStage.id) {
        self.productComponentName("review");
      } else {
        history.back();
        self.setCurrentStage(-1);
      }
    };
    if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
      self.userProfile(rootParams.dashboard.userData.userProfile);
      self.userLoggedIn(true);
      self.productDetails().isRegistered = true;
      self.applicantDetails()[0].applicantId().value = self.userProfile().partyId.value;
      if (self.queryMap && self.queryMap.regRefNo) {
        self.productComponentName("row");
        rootParams.dashboard.loadComponent("user-creation", {}, self);
        self.dataLoaded(true);
        return;
      }
      if (sessionStorageData.submissionId) {
        self.productDetails().submissionId = JSON.parse(sessionStorageData.submissionId);
        if (sessionStorageData.requirements) {
          requirements = JSON.parse(sessionStorageData.requirements);
          self.productDetails().facilityId = requirements.facilityId;
          self.productDetails().isUserAssociated = true;
          self.productGroupSerialNumber(requirements.productGroupSerialNumber);
          if (requirements.requestedAmount) {
            requirements.requestedAmount.amount = ko.observable(requirements.requestedAmount.amount);
          }
          if (requirements.requestedTenure) {
            requirements.requestedTenure.years = ko.observable(requirements.requestedTenure.years);
            requirements.requestedTenure.months = ko.observable(requirements.requestedTenure.months);
          }
        }
        self.productDetails().requirements = requirements;
        self.productDetails().typeApplication = sessionStorageData.typeApplication;
        self.submissionIdExists(true);
        ProductService.fetchProductSummary(self.productDetails().submissionId.value).done(function(dataSummary) {
          if (self.productDetails().productClassName !== "LOANS") {
            ProductService.fetchAdditionalOfferDetails(dataSummary.offerId, productTypeName).then(function(data) {
              self.offerAdditionalDetails[sessionStorageData.selectedOfferId] = data;
              self.productDetails().offerId = sessionStorageData.selectedOfferId;
              if (data.offerDetails && data.offerDetails.length > 0 && data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails && data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.productCode) {
                self.productDetails().productCodeTD = data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.productCode;
              }
              if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails && data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.productCode) {
                self.productDetails().productCodeCASA = data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.productCode;
              }
              if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails) {
                if (data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies) {
                  self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies;
                } else {
                  self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.demandDepositOfferCurrencyParameterResponseDTOs;
                }
              }
              if (data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails) {
                if (data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies) {
                  self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies;
                } else {
                  self.productDetails().offerCurrencies = data.offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.termDepositOfferCurrencyParameterResponseDTOs;
                }
                self.productDetails().currency = self.productDetails().offerCurrencies[0].code;
              }
              if (data.offerDetails[0].offerAdditionalDetails.cardOfferDetails) {
                sessionStorageData.minimumCreditLimit = data.offerDetails[0].offerAdditionalDetails.cardOfferDetails.creditCardLimitDetail[0].minimumCreditLimit;
              }
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
          self.productSummarySuccessHandler(dataSummary);
          if (self.productDetails().requirements && parseInt(self.productDetails().requirements.noOfCoApplicants)) {
            self.fetchAdditionalFlow();
          }
        });
      } else {
        self.fetchProductFlow();
      }
    } else if (self.queryMap && self.queryMap.regRefNo) {
      self.productComponentName("row");
      rootParams.dashboard.loadComponent("user-creation", {}, self);
      self.dataLoaded(true);
    } else {
      self.fetchProductFlow();
    }

    self.modifyFlowStages = function(deleteCount, stages, stageId, stageName, insertStageId, obj) {
      var index, prvsIndex = 0;
      var stageLocation = deleteCount ? stageId : insertStageId;
      index = ko.utils.arrayFilter(stages, function(stage) {
        if (stage.id === stageLocation) {
          return stage.sequenceNumber;
        }
      });
      index = index[0].sequenceNumber;
      if (deleteCount > 0) {
        stages.splice((index - 1), deleteCount);
        index--;
      } else {
        stages.splice(index, 0, ko.mapping.toJS(ko.mapping.fromJS(stages[index - 1])));
        $.extend(stages[index], obj);
        ko.utils.arrayForEach(stages, function(stage) {
          if (prvsIndex === stage.sequenceNumber) {
            stage.sequenceNumber++;
            prvsIndex = stage.sequenceNumber;
          } else if (index === stage.sequenceNumber) {
            prvsIndex = index;
          }
        });
        stages[index].id = stageId;
        stages[index].name = stageName;
        stages[index].nextStagename = stages[index - 1].nextStagename;
        if (stages[index].nextStagename) {
          stages[index + 1].previousStage = stages[index].id;
        }
      }
      stages[index].previousStage = stages[index - 1].id;
      stages[index - 1].nextStagename = stages[index].id;
    };

    /**
     * This function is used to set the current stage of the product application.
     * It takes as an input the ID of the stage to be set as the current stage.
     *
     * @function setCurrentStage
     * @memberOf ProductViewModel
     * @param {string} id - The ID of the stage to set as the current stage
     * @example ProductViewModel.getNextStage()
     */
    self.setCurrentStage = function(direction) {
      self.productDetails().currentStage = self.productDetails().productStages[self.productDetails().currentStage.sequenceNumber + direction - 1];
      var currentStage = self.productDetails().currentStage;
      if (currentStage.module) {
        rootParams.baseModel.registerComponent(currentStage.id, currentStage.module);
      } else {
        var hostModule = "origination";
        rootParams.baseModel.registerComponent(currentStage.id, hostModule);
      }
      self.productComponentName(currentStage.id);
      self.productHeadingName(currentStage.name);
      self.hideBackButton(currentStage.previousStage === null);
      if (self.productDetails().submissionId) {
        self.submissionIdExists(true);
      }
    };

    /**
     * This function is used to advance to the next product application stage.
     * It finds out the next stage of the current stage, and sets it as the current stage.
     *
     * @function getNextStage
     * @memberOf ProductViewModel
     * @example ProductViewModel.getNextStage()
     */
    self.getNextStage = function() {
      self.productDetails().currentStage.isComplete = true;
      if (self.productDetails().sectionBeingEdited() === self.productDetails().currentStage.id) {
        self.productComponentName("review");
      } else {
        self.setCurrentStage(1);
      }
    };

    self.showPluginComponent = function(compName) {
      self.pluginCompName("row");
      ko.tasks.runEarly();
      self.pluginCompName(compName);
      self.productflowComponent(false);
    };

    self.showToolTip = function(id, holder) {
      var p = $("#" + holder),
        toolTipHeight;
      var position = p.position();
      var headerHeight = 54;
      toolTipHeight = $("#" + id).outerHeight();
      var viewableOffset = $("#" + holder).offset().top - $(window).scrollTop();
      var positionTop = viewableOffset - headerHeight > toolTipHeight ? position.top - toolTipHeight : position.top + 20;
      if (rootParams.baseModel.large()) {
        $("#" + id).css("position", "absolute");
        $("#" + id).css("top", positionTop);
        $("#" + id).css("left", position.left);
        $("#" + id).css("display", "block");
      }
    };

    self.hideToolTip = function(id) {

      $("#" + id).css("display", "none");
    };

    self.applyPattern = function(input, pattern, position) {
      var x = input;
      var output = "";
      if (x.length > pattern[position] && position < pattern.length) {
        x = x.substr(pattern[position]);
        output = self.applyPattern(x, pattern, position + 1);
        output = input.substr(0, pattern[position]) + "-" + output;
        return output;
      }
      output += x;
      return output;

    };

    self.maskValue = function(val, len) {
      var a = val.substring(0, len);
      return a.replace(/\d/g, "x") + val.substring(len);
    };
    self.maskValueAll = function(val, len) {
      var a = val.substring(0, len);
      return a.replace(/[\d\D]/g, "x") + val.substring(len);
    };
    document.body.style.backgroundImage = "url(" + self.constants.imageResourcePath + "/origination/BG/" + (rootParams.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";
  };

});
