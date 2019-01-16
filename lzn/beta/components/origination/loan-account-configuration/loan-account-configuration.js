define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/loan-account-configuration",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojinputnumber"
], function(oj, ko, $, LoanAccountConfigurationModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,j,
      LoanAccountConfigurationModel = new LoanAccountConfigurationModelObject(),
      getNewKoModel = function() {
        var KoModel = LoanAccountConfigurationModel.getNewModel();
        KoModel.loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years = ko.observable(KoModel.loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years);
        KoModel.loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months = ko.observable(KoModel.loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months);
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.validationTracker = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.accountConfigurationInfoLoaded = ko.observable(false);
    self.isFixedTerm = ko.observable("OPTION_YES");
    self.wantIOI = ko.observable("OPTION_YES");
    self.showFixedTermOption = ko.observable(false);
    self.totalLoanTermInMonths = ko.observable(0);
    self.showIOIOption = ko.observable(false);
    self.ioiFrequencyData = ko.observableArray();
    self.ioiFrequencyOptionsLoaded = ko.observable(false);
    self.eipiFrequencyData = ko.observableArray();
    self.eipifrequencyOptionsLoaded = ko.observable(false);
    self.productDetails().loanAccountConfigurationInfo = getNewKoModel().loanAccountConfigurationInfo;
    rootParams.baseModel.registerComponent("loan-tenure", "origination");
    self.frequencyLoaded = ko.observable(false);
    self.productDetails().loanAccountConfigurationInfo.interestStageDetails=ko.observable();
    self.preferenceFrequencies = ko.observable();
    self.redrawFacility = ko.observable("OPTION_YES");
    self.statementRequired = ko.observable("OPTION_YES");
    self.allowedFrequenciesPrincipal = ko.observableArray();
    self.allowedFrequenciesIOI = ko.observableArray();
    LoanAccountConfigurationModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value, self.productDetails().offers.offerId);
    LoanAccountConfigurationModel.fetchLoanApplnOfferDetails(self.productDetails().offers.offerId).done(function(data) {
      if (data.loanApplicationOfferDetails.allowedRateType === "BOTH") {
        self.showFixedTermOption(true);
      } else if (data.loanApplicationOfferDetails.allowedRateType === "VARIABLE") {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermPresent = false;
      } else if (data.loanApplicationOfferDetails.allowedRateType === "FIXED") {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermPresent = true;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years(self.productDetails().requirements.requestedTenure.years());
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months(self.productDetails().requirements.requestedTenure.months());
      }
      j=0;
      for (var i = 0; i < data.loanApplicationOfferDetails.stageDetails.length; i++) {
         if(data.loanApplicationOfferDetails.stageDetails[i].stageName==="INTEREST")
          {
          var interestStageIOI=getNewKoModel().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[0];
          interestStageIOI.stageCode = data.loanApplicationOfferDetails.stageDetails[i].stageCode;
          interestStageIOI.stageName = data.loanApplicationOfferDetails.stageDetails[i].stageName;
          self.productDetails().loanAccountConfigurationInfo.interestStageDetails(interestStageIOI);
          self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.years = ko.observable(self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.years);
          self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.months = ko.observable(self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.months);
          self.productDetails().loanAccountConfigurationInfo.interestStageDetails().frequencies = ko.observable(data.loanApplicationOfferDetails.stageDetails[i].defaultFrequency);
        self.allowedFrequenciesIOI(data.loanApplicationOfferDetails.stageDetails[i].frequencies);
      }
        else{
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j] = getNewKoModel().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[0];
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].stageCode = data.loanApplicationOfferDetails.stageDetails[i].stageCode;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].stageName = data.loanApplicationOfferDetails.stageDetails[i].stageName;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].tenure.years = ko.observable(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].tenure.years);
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].tenure.months = ko.observable(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].tenure.months);
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[j].frequencies = ko.observable(data.loanApplicationOfferDetails.stageDetails[i].defaultFrequency);
        self.allowedFrequenciesPrincipal(data.loanApplicationOfferDetails.stageDetails[i].frequencies);
        j++;

      }
      }
      LoanAccountConfigurationModel.fetchInstallmentRepaymentFrequency().done(function(data) {
       ko.utils.arrayForEach(data.enumRepresentations[0].data, function(frequency) {
          ko.utils.arrayForEach(self.allowedFrequenciesPrincipal(), function(allowedFrequency) {
            if (frequency.description === allowedFrequency) {
              self.eipiFrequencyData.push(frequency);
            }
          });
        });
        self.eipifrequencyOptionsLoaded(true);
      });
      if (JSON.parse(data.loanApplicationOfferDetails.intrestOnlyRepaymentAllowed)) {
        self.showIOIOption(true);
        LoanAccountConfigurationModel.fetchInterestRepaymentFrequency().done(function(data) {
        ko.utils.arrayForEach(data.enumRepresentations[0].data, function(frequency) {
            ko.utils.arrayForEach(self.allowedFrequenciesIOI(), function(allowedFrequency) {
              if (frequency.description === allowedFrequency) {
                self.ioiFrequencyData.push(frequency);
              }
            });
          });
          self.ioiFrequencyOptionsLoaded(true);
        });
      } else {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.interestOnlyPresent = false;
      }
      LoanAccountConfigurationModel.fetchEnum().done(function(data) {
        self.preferenceFrequencies(data.enumRepresentations[0].data);
        self.frequencyLoaded(true);
      });
      LoanAccountConfigurationModel.fetchAccountConfiguration(self.applicantObject().applicantId().value).done(function(data) {
        if (!$.isEmptyObject(data.loanAccountConfigurationDTO)) {
          self.totalLoanTermInMonths(0);
          for (var stageId = 0; stageId < data.loanAccountConfigurationDTO.loanAccountConfigStageDetails.length; stageId++) {
            self.totalLoanTermInMonths(self.totalLoanTermInMonths() + data.loanAccountConfigurationDTO.loanAccountConfigStageDetails[stageId].tenure.months + (data.loanAccountConfigurationDTO.loanAccountConfigStageDetails[stageId].tenure.years * 12));
          }
          if (data.loanAccountConfigurationDTO.interestOnlyPresent) {
            self.wantIOI("OPTION_YES");
            self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.interestOnlyPresent = true;
            self.productDetails().loanAccountConfigurationInfo.interestStageDetails().frequencies(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails[self.getIndex(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails, "INTEREST")].frequencies);
            self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.months(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails[self.getIndex(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails, "INTEREST")].tenure.months.toString());
            self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.years(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails[self.getIndex(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails, "INTEREST")].tenure.years.toString());
          } else {
            self.wantIOI("OPTION_NO");
            self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.interestOnlyPresent = false;
          }
          self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].frequencies(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails[self.getIndex(data.loanAccountConfigurationDTO.loanAccountConfigStageDetails, "PRINCIPAL")].frequencies);
          if (data.loanAccountConfigurationDTO.fixedTermPresent) {
            self.isFixedTerm("OPTION_YES");
            self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermPresent = true;
            self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years(data.loanAccountConfigurationDTO.fixedTermDuration.years.toString());
            self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months(data.loanAccountConfigurationDTO.fixedTermDuration.months.toString());
          } else {
            self.isFixedTerm("OPTION_NO");
            self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermPresent = false;
          }
        }
        if (data.loanAccountConfigurationDTO.isRedraw) {
          self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.isRedraw = data.loanAccountConfigurationDTO.isRedraw;
          if (self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.isRedraw) {
            self.redrawFacility("OPTION_YES");
          } else {
            self.redrawFacility("OPTION_NO");
          }
        }
        if (data.loanAccountConfigurationDTO.statementRequired) {
          self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementRequired = data.loanAccountConfigurationDTO.statementRequired;
          if (self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementRequired) {
            self.statementRequired("OPTION_YES");
          } else {
            self.statementRequired("OPTION_NO");
          }
        }
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementFrequncy = ko.observable(data.loanAccountConfigurationDTO.statementFrequncy);
        self.accountConfigurationInfoLoaded(true);
      });
    });
    self.redrawFacilitySelected = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.redrawFacility("OPTION_NO");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.isRedraw = false;
      }
      if (event.detail.value === "OPTION_YES") {
        self.redrawFacility("OPTION_YES");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.isRedraw = true;
      }
    };
    self.statementRequiredSelected = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.statementRequired("OPTION_NO");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementRequired = false;
      }
      if (event.detail.value === "OPTION_YES") {
        self.statementRequired("OPTION_YES");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementRequired = true;
      }
    };
    self.getIndex = function(obj, key) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].stageName === key) {
          return i;
        }
      }
    };
    self.fixedTermSelected = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.isFixedTerm("OPTION_NO");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermPresent = false;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years("");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months("");
      }
      if (event.detail.value === "OPTION_YES") {
        self.isFixedTerm("OPTION_YES");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermPresent = true;
      }
    };
    self.wantIOISelected = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.wantIOI("OPTION_NO");
        if (self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails.length>0 && self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")])
            {
              self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails.splice(self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST"), 1);
            }
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.interestOnlyPresent = false;
        self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.years("");
        self.productDetails().loanAccountConfigurationInfo.interestStageDetails().tenure.months("");
      }
      if (event.detail.value === "OPTION_YES") {
        self.wantIOI("OPTION_YES");
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.interestOnlyPresent = true;
      }
    };
    self.submitAccountConfiguration = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.interestOnlyPresent) {
              if (self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails.length>0 && self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")])
            {
              self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails.splice(self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST"), 1);
            }
       self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails.unshift(self.productDetails().loanAccountConfigurationInfo.interestStageDetails());
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].frequencies(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].frequencies());
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.months(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.months()!==""?self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.months():0);
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.years(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.years()!==""?self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.years():0); self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].tenure.months = (self.totalLoanTermInMonths() - (parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.years()) * 12) - parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.months())) % 12;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].tenure.years = (self.totalLoanTermInMonths() - ((parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.years()) * 12) + parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "INTEREST")].tenure.months())) - self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].tenure.months) / 12;

     } else {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].tenure.months = (self.totalLoanTermInMonths()) % 12;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].tenure.years = (self.totalLoanTermInMonths() - self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].tenure.months) / 12;
      }
      if (self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")]) {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].frequencies(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails[self.getIndex(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.loanAccountConfigStageDetails, "PRINCIPAL")].frequencies());
      }
      self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years()!==""?self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years():0);
      self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months()!==""?self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months():0);
       if (((parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years()) * 12) + (parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months()))) > 0) {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.variableTermDuration.months = (self.totalLoanTermInMonths() - ((parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years()) * 12) + (parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months())))) % 12;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.variableTermDuration.years = (self.totalLoanTermInMonths() - ((parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.years()) * 12) + (parseInt(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.fixedTermDuration.months()))) - self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.variableTermDuration.months) / 12;
      } else {
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.variableTermDuration.months = (self.totalLoanTermInMonths()) % 12;
        self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.variableTermDuration.years = (self.totalLoanTermInMonths() - self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.variableTermDuration.months) / 12;
      }
      self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementFrequncy(self.productDetails().loanAccountConfigurationInfo.loanAccountConfiguration.statementFrequncy());
      LoanAccountConfigurationModel.saveAccountConfiguration(ko.mapping.toJSON(self.productDetails().loanAccountConfigurationInfo, {
          "ignore": ["interestStageDetails"]
        }), self.applicantObject().applicantId().value).done(function() {
        LoanAccountConfigurationModel.fetchAccountConfiguration(self.applicantObject().applicantId().value).done(function(data) {
          self.accountSummaryData(data.loanAccountConfigurationDTO);
          self.uplTrackingDetails().additionalInfo.sections[rootParams.index].isComplete(false);
          ko.tasks.runEarly();
          self.uplTrackingDetails().additionalInfo.sections[rootParams.index].isComplete(true);
          self.showNextComponent(rootParams.index + 1);
        });
      });
    };
  };
});
