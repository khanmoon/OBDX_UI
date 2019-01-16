define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/product",
  "baseService",
  "framework/js/constants/service-url",
  "ojs/ojknockout-validation"
], function(oj, ko, $, ProductService, BaseLogger, constants, resourceBundle, BaseService) {
  "use strict";
  return function(rootParams) {
    var self = this,
      requirements;
    ko.utils.extend(self, rootParams.rootModel);
    var baseService = BaseService.getInstance();
    self.resource = resourceBundle;
    self.accordionNames = resourceBundle;
    self.dataLoaded = ko.observable(false);
    self.previousPluginComponent = ko.observable();
    self.productComponentName = ko.observable();
    self.productHeadingName = ko.observable();
    self.purposeDetail = ko.observable();
    self.hideBackButton = ko.observable(false);
    self.relations = ko.observableArray([]);
    self.coApplicantsRelation = ko.observableArray();
    self.displayModal = ko.observable(false);
    self.securityCodeModel = ko.observable(false);
    self.showFinancialDetails = ko.observable(true);
    self.productGroupSerialNumber = ko.observable();
    self.userType = "primary";
    self.submissionIdExists = ko.observable(false);
    self.accountId = ko.observable();
    self.appRefNo = ko.observable();
    self.applicationStatus = ko.observable();
    self.submissionErrorMessage = ko.observable("");
    self.isRequirementRequired = ko.observable(false);
    self.registrationCompulsory = ko.observable(false);
    self.isApplicationCancelled = ko.observable(false);
    self.ownerList = ko.observable(true);
    self.pageTitle = self.resource.pageTitle;
    self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
    self.applicantDetails = ko.observable([{
      applicantId: ko.observable({
        displayValue: "",
        value: ""
      }),
      applicantRelationshipType: "APPLICANT"
    }]);
    constants.module = "ORIGINATION";
    self.constants = constants;
    self.todayIsoDate = oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate());
    self.backAllowed = ko.observable(false);
    self.homePage = ko.observable(false);
    self.userProfile = ko.observable();
    self.userRoles = ko.observableArray();
    self.label = ko.observable();
    self.userLoggedIn = ko.observable();
    self.socialMediaResponse = ko.observable();
    self.applicationStartedFromDraft = false;
    self.componentName = ko.observable("product");
    rootParams.baseModel.registerComponent("tooltip", "home");
    self.dollar = String.fromCharCode(self.resource.generic.common.dollarAscii);
    self.productDetails = ko.observable({
      applicantList: ko.observableArray([]),
      baseCurrency: rootParams.baseModel.getLocaleValue("localCurrency"),
      applicantDetailsFetched: ko.observable(false),
      sectionBeingEdited: ko.observable(),
      collabData: ko.observable({}),
      isUserAssociated: false,
      isRegistered: false,
      repaymentAmount: ko.observable()
    });
    self.wrongStateModalClose = function() {
      rootParams.dashboard.switchModule("home", true);
    };
    self.isStatesLoaded = ko.observable(false);
    self.stateOptions = ko.observableArray();
    self.selectedState = ko.observable("");
    self.isStateSelected = ko.observable(false);
    self.selectedStateText = ko.observable("");
    self.isStateChangeAllowed = ko.observable(true);
    self.stateValidationDeferred = $.Deferred();
    self.productHeaderImage = ko.observable();
    self.tenure = ko.observable();
    self.loanAmount = ko.observable();
    self.productflowComponent = ko.observable(true);
    self.pluginCompName = ko.observable("row");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("cancel-application", "origination");
    rootParams.baseModel.registerComponent("user-creation", "origination");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerComponent("submission-confirmation", "origination");
    rootParams.baseModel.dateConverter.getOptions().pattern = rootParams.baseModel.getLocaleValue("dateFormat");
    self.label = self.productHeadingName;
    var sessionTransactionRefNumber;
    var sessionStorageData;
    var loanRequirementPayload = {
      requestedAmount: {
        currency: rootParams.baseModel.getLocaleValue("localCurrency"),
        amount: ""
      },
      requestedTenure: {
        days: 0,
        months: 0,
        years: 0
      },
      isIPA: false,
      isCapitalizeFeesOpted: false,
      isSettlementRequired: false,
      purpose: {
        code: ""
      },
      facilityId: "",
      purposeType: "",
      frequency: "MONTHLY",
      noOfCoApplicants: "0",
      productGroupCode: null,
      productGroupName: null,
      productGroupSerialNumber: "",
      productClass: null,
      productSubClass: null,
      productId: null,
      vehicleDetails: {
        collateralId: "",
        isAddedAsCollateral: true,
        vehicleIdentificationNum: null,
        vehicleMakeType: null,
        vehicleModel: null,
        vehicleSubType: "CAR",
        vehicleType: "PASSENGER_VEHICLE",
        vehicleYear: null,
        isVehicleNew: true,
        registrationState: null,
        distanceTravelled: null
      }
    };
    self.initQueryMap = function(root) {
      self.queryMap = root.queryMap;
      self.applicationArguments = root.applicationArguments;
      if (self.applicationArguments) {
        sessionStorageData = self.applicationArguments;
      } else {
        sessionStorageData = self.sessionStorageData;
      }
      if (sessionStorageData.transactionRefNumber) {
        sessionTransactionRefNumber = sessionStorageData.transactionRefNumber;
      }
      if (sessionStorageData.productCode) {
        if (sessionStorageData.productCodeTD) {
          self.productDetails().productCodeTD = sessionStorageData.productCodeTD;
        }
        if (sessionStorageData.productCodeCASA) {
          self.productDetails().productCodeCASA = sessionStorageData.productCodeCASA;
        }
        self.productDetails().productCode = sessionStorageData.productCode;
        self.productDetails().productDescription = sessionStorageData.productDescription;
        if (sessionStorageData.offers) {
          self.productDetails().selectedOfferId = sessionStorageData.selectedOfferId;
          self.productDetails().offers = JSON.parse(sessionStorageData.offers);
          if (sessionStorageData.offerCurrencies) {
            self.productDetails().offerCurrencies = JSON.parse(sessionStorageData.offerCurrencies);
          }
        }
        if (sessionStorageData.minimumCreditLimit) {
          self.productDetails().minimumCreditLimit = JSON.parse(sessionStorageData.minimumCreditLimit);
        }
        if (sessionStorageData.productGroupMaxTerm) {
          self.productDetails().maxTerm = JSON.parse(sessionStorageData.productGroupMaxTerm);
        }
        if (sessionStorageData.productClassNames === "LOANS") {
          self.productDetails().isCollateralRequired = sessionStorageData.isCollateralRequired;
          self.productDetails().productClassName = sessionStorageData.productClassName;
        } else {
          self.productDetails().productClassName = sessionStorageData.productClassName;
        }
        if (sessionStorageData.productType) {
          self.productDetails().productType = sessionStorageData.productType;
          if (self.productDetails().productType === "PAYDAY") {
            rootParams.baseModel.registerComponent("payday-review", "origination");
          } else if (self.productDetails().productType === "AUTOLOANFLL") {
            rootParams.baseModel.registerComponent("review", "origination");
          }
        }
        var productType = self.productDetails().productClassName;
        if (self.productDetails().productType) {
          productType = self.productDetails().productType;
        }
        self.productHeaderImage = ko.observable(productType + "-product-bg");
        document.body.style.backgroundImage = "url(" + self.constants.imageResourcePath + "/origination/BG/" + (rootParams.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";
      }
      if (sessionStorageData.selectedState) {
        self.productDetails().selectedState = sessionStorageData.selectedState;
        self.productDetails().selectedState = self.productDetails().selectedState;
      }
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.userProfile(rootParams.dashboard.userData.userProfile);
        self.userLoggedIn(true);
        self.productDetails().isRegistered = true;
        self.applicantDetails()[0].applicantId().value = self.userProfile().partyId.value;
        if (self.queryMap && self.queryMap.regRefNo) {
          self.productHeaderImage("my-applications");
          self.productComponentName("row");
          self.showPluginComponent("user-creation");
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
          ProductService.fetchProductSummary(self.productDetails().submissionId.value).done(function(data) {
            self.productSummarySuccessHandler(data);
          });
        } else {
          var isnewApplicant = true;
          var state;
          if (self.productDetails().selectedState) {
            state = self.productDetails().selectedState;
          }
          var payloadSubmission = {
              "productGroupCode": self.productDetails().productCode,
              "productClass": self.productDetails().productClassName,
              "productSubClass": self.productDetails().productType,
              "state": state
            },
            applicantPayload = {
              applicantRelationshipType: "APPLICANT",
              newApplicant: isnewApplicant,
              applicantId: {
                value: self.userProfile().partyId.value
              }
            };
          ProductService.fetchSubmissionList().done(function(data) {
            if (data.submissions) {
              for (var i = 0; i < data.submissions.length; i++) {
                if (data.submissions[i].isSubmitted && JSON.parse(data.submissions[i].isSubmitted)) {
                  applicantPayload.newApplicant = false;
                  break;
                }
              }
            }
            self.stateValidationDeferred.done(function() {
              ProductService.createSubmission(payloadSubmission).done(function(data) {
                self.productDetails().submissionId = data.submissionId;
                self.productGroupSerialNumber(data.products[0].productGroupSerialNumber);
                self.productDetails().facilityId = data.products[0].facilityId;
                loanRequirementPayload.productGroupCode = self.productDetails().productCode;
                loanRequirementPayload.productGroupName = self.productDetails().productDescription;
                loanRequirementPayload.productClass = self.productDetails().productClassName;
                loanRequirementPayload.productSubClass = self.productDetails().productType;
                loanRequirementPayload.productId = self.productDetails().productCode;
                loanRequirementPayload.facilityId = self.productDetails().facilityId;
                loanRequirementPayload.state = self.productDetails().selectedState;
                loanRequirementPayload.productGroupSerialNumber = self.productGroupSerialNumber();
                if ((self.queryMap && self.queryMap.TransactionRefNumber) || sessionTransactionRefNumber) {
                  var transactionRefNumber = self.queryMap.TransactionRefNumber ? self.queryMap.TransactionRefNumber : sessionTransactionRefNumber;
                  self.postDealerDetails(transactionRefNumber);
                }
                ProductService.createApplicant(self.productDetails().submissionId.value, applicantPayload).done(function(data) {
                  self.applicantDetails()[0].applicantId().displayValue = data.applicantId.displayValue;
                  self.applicantDetails()[0].applicantId().value = data.applicantId.value;
                  ProductService.fetchApplicants(self.productDetails().submissionId.value).done(function(data) {
                    self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                    self.createFlow();
                  });
                });
              }).fail(function(data) {
                if (data.responseJSON.message && data.responseJSON.message.validationError && data.responseJSON.message.validationError[0]) {
                  self.submissionErrorMessage(data.responseJSON.message.validationError[0].errorMessage);
                  $("#createSubmissionError").trigger("openModal");
                }
              });
            });
          });
        }
      } else if (self.queryMap && self.queryMap.regRefNo) {
        self.productHeaderImage("my-applications");
        self.productComponentName("row");
        self.showPluginComponent("user-creation");
        self.dataLoaded(true);
      } else {
        var stateSelected;
        if (self.productDetails().selectedState) {
          stateSelected = self.productDetails().selectedState;
        }
        var payload = {
            "productGroupCode": self.productDetails().productCode,
            "productClass": self.productDetails().productClassName,
            "productSubClass": self.productDetails().productType,
            "state": stateSelected
          },
          createApplicantPayload = {
            applicantRelationshipType: "APPLICANT",
            newApplicant: true
          };
        self.stateValidationDeferred.done(function() {
          ProductService.createSubmission(payload).done(function(data) {
            self.productDetails().submissionId = data.submissionId;
            self.productGroupSerialNumber(data.products[0].productGroupSerialNumber);
            self.productDetails().facilityId = data.products[0].facilityId;
            loanRequirementPayload.productGroupCode = self.productDetails().productCode;
            loanRequirementPayload.productGroupName = self.productDetails().productDescription;
            loanRequirementPayload.productClass = self.productDetails().productClassName;
            loanRequirementPayload.productSubClass = self.productDetails().productType;
            loanRequirementPayload.productId = self.productDetails().productCode;
            loanRequirementPayload.facilityId = self.productDetails().facilityId;
            loanRequirementPayload.state = self.productDetails().selectedState;
            loanRequirementPayload.productGroupSerialNumber = self.productGroupSerialNumber();
            ProductService.validateLoan(self.productDetails().submissionId.value, loanRequirementPayload).done(function() {
              if (self.queryMap && self.queryMap.TransactionRefNumber) {
                var transactionRefNumber = self.queryMap.TransactionRefNumber;
                self.postDealerDetails(transactionRefNumber);
              }
              ProductService.createApplicant(self.productDetails().submissionId.value, createApplicantPayload).done(function(data) {
                self.applicantDetails()[0].applicantId().displayValue = data.applicantId.displayValue;
                self.applicantDetails()[0].applicantId().value = data.applicantId.value;
                ProductService.fetchApplicants(self.productDetails().submissionId.value).done(function(data) {
                  self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
                  self.createFlow();
                });
              });
            });
          });
        });
      }
    };

    self.toCleanJson = function(input) {
      return ko.toJSON(input, function(key, value) {
        if (value === null || value === undefined) {
          return false;
        } else if (key && typeof key === "string") {
          if (!key.replace(/^temp_.*/g, "") || key === "selectedValues") {
            return false;
          }
          return value;

        }
        return value;

      });
    };
    self.setCurrentStage = function(direction) {
      self.productDetails().currentStage = self.productDetails().productStages[self.productDetails().currentStage.sequenceNumber + direction - 1];
      var currentStage = self.productDetails().currentStage;
      if (self.productDetails().productType === "PAYDAY") {
        rootParams.baseModel.registerComponent("payday-" + currentStage.id, "origination");
        self.productComponentName("payday-" + currentStage.id);
      } else {
        rootParams.baseModel.registerComponent(currentStage.id, "origination");
        self.productComponentName(currentStage.id);
      }
      self.productHeadingName(currentStage.name);
      self.hideBackButton(currentStage.previousStage === null);
      if (self.productDetails().submissionId) {
        self.submissionIdExists(true);
      }
    };
    self.getNextStage = function() {
      self.productDetails().currentStage.isComplete = true;
      if (self.productDetails().sectionBeingEdited() === self.productDetails().currentStage.id) {
        self.productComponentName("review");
      } else {
        self.setCurrentStage(1);
      }
    };
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
    self.createFlow = function() {
      ProductService.fetchRequiredFlowPages().done(function(data) {
        self.flowPages = ko.observable(data);
        ProductService.fetchRequiredFlowcontent().done(function(data) {
          self.flowContent = ko.observable(data);
          ProductService.fetchRequiredFlowTemplate().done(function(data) {
            self.flowTemplate = ko.observable(data);
            self.productDetails().productStages = self.flowTemplate().productDetails.productStages;
            ProductService.fetchRequiredWorkflow(self.productDetails().productClassName, self.productDetails().productType).done(function(data) {
              self.requiredFlow = ko.observable(data);
              var SearchStage = function(key, array) {
                for (var i = 0; i < array.length; i++) {
                  if (array[i].workflowId === key) {
                    return array[i];
                  }
                }
              };
              var SearchStageIndex = function(key, array) {
                for (var i = 0; i < array.length; i++) {
                  if (array[i].workflowId === key) {
                    return i;
                  }
                }
              };
              var sortWorkflow = function(workflowStages) {
                var applicationStages = ko.utils.arrayFilter(workflowStages, function(stage) {
                  if (stage.stepCategory === "APPLICATION") {
                    return stage;
                  }
                });
                var applicantStages = ko.utils.arrayFilter(workflowStages, function(stage) {
                  if (stage.stepCategory === "APPLICANT") {
                    return stage;
                  }
                });
                for (var a = 0; a < applicationStages.length; a++) {
                  workflowStages[a] = JSON.parse(JSON.stringify(applicationStages[a]));
                }
                for (var b = 0; b < applicantStages.length; b++) {
                  workflowStages[applicationStages.length + b] = JSON.parse(JSON.stringify(applicantStages[b]));
                }
                return workflowStages;
              };
              var insertPoint, applicationFormInsertPoint, stagesLength;
              for (var m = 0; m < data.workflows[0].head.steps.length; m++) {
                var object1 = SearchStage(data.workflows[0].head.steps[m].id, self.flowPages().productStages);
                if (self.flowTemplate().productDetails.productStages.length === 0) {
                  object1.sequenceNumber = 1;
                  self.flowTemplate().productDetails.productStages.push(object1);
                } else {
                  self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages, object1.id, object1.name, data.workflows[0].head.steps[m - 1].id, object1);
                }
                applicationFormInsertPoint = m;
              }
              self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages, self.flowPages().productStages[2].id, self.flowPages().productStages[2].name, self.flowTemplate().productDetails.productStages[self.flowTemplate().productDetails.productStages.length - 1].id, self.flowPages().productStages[2]);
              self.flowTemplate().productDetails.productStages[self.flowTemplate().productDetails.productStages.length - 1].sequenceNumber = self.flowTemplate().productDetails.productStages.length;
              var applicationFormIndex = SearchStageIndex("application-form", self.flowTemplate().productDetails.productStages);
              for (var k = 0; k < data.workflows[0].body.steps.length; k++) {
                var formKey = (data.workflows[0].body.steps[k].id === "FLLAF") ? "AF" : data.workflows[0].body.steps[k].id;
                insertPoint = SearchStageIndex(formKey, self.flowTemplate().productDetails.productStages[applicationFormIndex].stages);
                if (!self.applicantDetails()[0].newApplicant) {
                  sortWorkflow(data.workflows[0].body.steps[k].steps);
                }
                for (var j = 0; j < data.workflows[0].body.steps[k].steps.length; j++) {
                  var object = SearchStage(data.workflows[0].body.steps[k].steps[j].id, self.flowContent().stages);
                  object.stepCategory = data.workflows[0].body.steps[k].steps[j].stepCategory;
                  if (self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages.length === 0) {
                    object.sequenceNumber = 1;
                    self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages.push(object);
                  } else {
                    object.sequenceNumber = j + 1;
                    stagesLength = self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages.length;
                    self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages, object.id, object.name, self.flowTemplate().productDetails.productStages[applicationFormIndex].stages[insertPoint].stages[stagesLength - 1].id, object);
                  }
                }
              }
              for (var n = 0; n < data.workflows[0].tail.steps.length; n++) {
                var object2 = SearchStage(data.workflows[0].tail.steps[n].id, self.flowPages().productStages);
                object2.sequenceNumber = n + applicationFormInsertPoint + 2;
                self.modifyFlowStages(0, self.flowTemplate().productDetails.productStages, object2.id, object2.name, self.flowTemplate().productDetails.productStages[self.flowTemplate().productDetails.productStages.length - 1].id, object2);
              }
              self.productFlowSuccessHandler(self.flowTemplate());
            });
          });
        });
      });
    };

    self.productFlowSuccessHandler = function(data) {
      self.productDetails().productName = data.productDetails.productName;
      self.productDetails().productStages = data.productDetails.productStages;
      self.productDetails().currentStage = self.productDetails().productStages[0];
      if (self.productDetails().productType === "PAYDAY") {
        self.productComponentName("payday-" + self.productDetails().productStages[0].id);
      } else {
        self.productComponentName(self.productDetails().productStages[0].id);
      }
      self.productHeadingName(self.productDetails().productName);
      if (self.productDetails().productType === "PAYDAY") {
        rootParams.baseModel.registerComponent("payday-" + self.productDetails().productStages[0].id, "origination");
      } else {
        rootParams.baseModel.registerComponent(self.productDetails().productStages[0].id, "origination");
      }

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
      self.dataLoaded(true);
    };
    self.productSummarySuccessHandler = function(data) {
      self.productDetails().selectedState = data.state;
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
      if (data.tenure && !self.productDetails().requirements.requestedTenure) {
        self.productDetails().requirements.requestedTenure = data.tenure;
        self.productDetails().requirements.requestedTenure.years = ko.observable(self.productDetails().requirements.requestedTenure.years);
        self.productDetails().requirements.requestedTenure.months = ko.observable(self.productDetails().requirements.requestedTenure.months);
      }
      self.productDetails().requirements.nextPayDate = data.nextPayDate;
      self.productDetails().requirements.secondPayDate = data.secondPayDate;
      self.productDetails().requirements.alternatePayDay = data.alternatePayDay;
      if (data.loanApplicationAmount) {
        self.productDetails().requirements.requestedAmount = data.loanApplicationAmount;
        self.productDetails().requirements.requestedAmount.amount = ko.observable(self.productDetails().requirements.requestedAmount.amount);
      }
      if (data.productSubClass) {
        self.productHeaderImage(data.productSubClass + "-product-bg");
        document.body.style.backgroundImage = "url(" + self.constants.imageResourcePath + "/origination/BG/" + (rootParams.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";
        self.productDetails().productType = data.productSubClass;
      }
      ProductService.fetchApplicants(self.productDetails().submissionId.value).done(function(data) {
        self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
        self.createFlow();
      });
      self.applicationStartedFromDraft = true;
    };
    self.getPreviousStage = function() {
      if (self.productDetails().sectionBeingEdited() === self.productDetails().currentStage.id) {
        self.productComponentName("review");
      } else {
        history.back();
        self.setCurrentStage(-1);
      }
    };

    var options = {
      showMessage: false,
      url: "enumerations/country/US/state",
      success: function(data) {
        self.fetchStatesHandler(data);
      }
    };
    baseService.fetch(options);
    var applicantId;
    self.fetchStatesHandler = function(data) {
      self.stateOptions(data.enumRepresentations[0].data);
      self.isStatesLoaded(true);

      if (sessionStorageData && sessionStorageData.selectedState) {
        self.isStateSelected(true);
        self.isStateChangeAllowed(false);
        self.selectedState(sessionStorageData.selectedState);
        self.selectedStateText(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.selectedState()));
      }
      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.isStateChangeAllowed(false);
        applicantId = rootParams.dashboard.userData.userProfile.partyId.value;
        self.fetchSubmissions();
        if (rootParams && rootParams.baseModel && self.productDetails()) {
          self.productDetails().currency = rootParams.baseModel.getLocaleValue("localCurrency");
        }
      } else {
        self.stateValidationDeferred.resolve();
      }
    };
    self.fetchSubmissionsHandler = function(data) {
      if (data.submissions) {
        for (var i = 0; i < data.submissions.length; i++) {
          if (!(data.submissions[i].isSubmitted && JSON.parse(data.submissions[i].isSubmitted))) {
            self.isToBeSynched = false;
            break;
          }
        }
        var isToBeSynchedWithoutProductDetails = self.isToBeSynched && !self.productDetails();
        var isToBeSynchedAfterLoginRedirection = self.isToBeSynched && sessionStorageData && sessionStorageData.loginRedirection && JSON.parse(sessionStorageData.loginRedirection);
        if ((isToBeSynchedWithoutProductDetails || isToBeSynchedAfterLoginRedirection)) {
          self.synchWithHost("123", applicantId);
        } else {
          self.findStateFromContact(applicantId);
        }
      } else {
        self.findStateFromContact(applicantId);
      }
    };
    self.fetchSubmissions = function() {
      var options = {
        url: "submissions",
        success: function(data) {
          self.fetchSubmissionsHandler(data);
        }
      };
      baseService.fetch(options);
    };
    self.synchWithHostHandler = function(data, applicantId) {
      self.findStateFromContact(applicantId);
    };
    self.synchWithHost = function(submissionId, applicantId) {
      var params = {
        "submissionId": submissionId,
        "partyId": applicantId
      };
      var options = {
        url: "submissions/{submissionId}/applicants/{partyId}/sync",
        success: function(data) {
          self.synchWithHostHandler(data, applicantId);
        }
      };
      baseService.update(options, params);
    };
    self.findStateFromContact = function(applicantId) {
      var params = {
        "applicantId": applicantId,
        submissionId: "123"
      };
      var options = {
        showMessage: false,
        url: "parties/{applicantId}/addresses?type=PST",
        success: function(data) {
          self.findStateFromContactHandler(data);
        }
      };
      options.url = "submissions/{submissionId}/applicants/{applicantId}/addresses?type=PST";
      baseService.fetch(options, params);
    };
    self.findStateFromContactHandler = function(data) {
      var state = null;
      var i;
      if (data.partyAddressDTO) {
        for (i = 0; i < data.partyAddressDTO.length; i++) {
          if (data.partyAddressDTO[i].type === "RES" && data.partyAddressDTO[i].status === "CURRENT") {
            state = data.partyAddressDTO[i].postalAddress.state;
            break;
          }
        }
        self.verifyState(state);
      } else if (data.applicantAddressDTO) {
        for (i = 0; i < data.applicantAddressDTO.length; i++) {
          if (data.applicantAddressDTO[i].type === "RES" && data.applicantAddressDTO[i].status === "CURRENT") {
            state = data.applicantAddressDTO[i].postalAddress.state;
            break;
          }
        }
        self.verifyState(state);
      } else {
        self.findStateFromSubmissions();
      }
    };
    self.getSubmission = function() {
      var options = {
        showMessage: false,
        url: "submissions",
        success: function(data) {
          if (data.submissions && data.submissions[0]) {
            self.getSubmissionHandler(data);
          }
        }
      };
      baseService.fetch(options);
    };
    self.getSubmissionHandler = function(data) {
      var params = {
        "submissionId": data.submissions[0].submissionId.value
      };
      var options = {
        showMessage: false,
        url: "submissions/{submissionId}/summary",
        success: function(data) {
          self.findStateFromSubmissionsHandler(data);
        }
      };

      baseService.fetch(options, params);
    };
    self.findStateFromSubmissions = function() {
      self.getSubmission();

    };
    self.findStateFromSubmissionsHandler = function(data) {
      self.verifyState(data.state);
    };
    self.verifyState = function(state) {
      if (self.isStateSelected() && self.productDetails()) {
        if (self.selectedState() !== state) {
          $("#wrongStateSelection").trigger("openModal");
          self.stateValidationDeferred.reject();
        } else {
          self.stateValidationDeferred.resolve();
        }
      }
    };

    self.postDealerDetails = function(transactionRefNumber) {
      ProductService.getDealerVehicleDetails(transactionRefNumber).done(function(data) {
        loanRequirementPayload.purchasePrice = {};
        loanRequirementPayload.purchasePrice.amount = data.vehicleDetails.purchasePrice.amount;
        loanRequirementPayload.purchasePrice.currency = data.vehicleDetails.purchasePrice.currency;
        loanRequirementPayload.downpaymentAmount = {};
        loanRequirementPayload.downpaymentAmount.amount = data.vehicleDetails.downpaymentAmount.amount;
        loanRequirementPayload.downpaymentAmount.currency = data.vehicleDetails.downpaymentAmount.currency;
        loanRequirementPayload.requestedAmount.amount = parseInt(data.vehicleDetails.purchasePrice.amount) - parseInt(data.vehicleDetails.downpaymentAmount.amount);
        loanRequirementPayload.requestedAmount.currency = data.vehicleDetails.purchasePrice.currency;
        loanRequirementPayload.requestedTenure.years = data.vehicleDetails.loanTenure.years;
        loanRequirementPayload.requestedTenure.months = data.vehicleDetails.loanTenure.months;
        loanRequirementPayload.requestedTenure.days = data.vehicleDetails.loanTenure.days;
        loanRequirementPayload.vehicleDetails.vehicleModel = data.vehicleDetails.model;
        loanRequirementPayload.vehicleDetails.vehicleMakeType = data.vehicleDetails.make;
        loanRequirementPayload.vehicleDetails.vehicleYear = data.vehicleDetails.year;
        ProductService.submitRequirements(self.productDetails().submissionId.value, self.toCleanJson(loanRequirementPayload));
      });
    };
  };
});
