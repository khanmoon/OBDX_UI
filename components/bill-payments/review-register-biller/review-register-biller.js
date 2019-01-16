define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/register-biller",
    "ojs/ojbutton",
    "ojs/ojknockout"
], function(oj, ko, $, ReviewBillerRegistrationModel,resourceBundle) {
    "use strict";
    return function (params) {
      var self = this;
      self.mode = ko.observable();
      self.updateBiller = ko.observable(false);
      ko.utils.extend(self, params.rootModel);
      self.resourceBundle = resourceBundle;

      params.baseModel.registerElement("help");

      if (params.mode) {
        self.mode(params.mode);
      }else if(self.params.mode){
        self.mode(self.params.mode);
      }

      if(params.registerBillerDetails){
        self.registerBillerDetails = params.registerBillerDetails;
        if(params.modifiedBillerDetails){
          ko.utils.extend(self.registerBillerDetails, params.modifiedBillerDetails);
          self.updateBiller(true);
        }
      }else if(self.params && self.params.registerBillerDetails){
        self.registerBillerDetails = self.params.registerBillerDetails;
      }

      if(self.mode() !== "REVIEW"){
        self.updateBiller(true);
        self.relationshipDetails = ko.observableArray([]);
        self.dropdownLabels = {
            category: ko.observable(),
            location: ko.observable(),
            biller: ko.observable(),
            currentAccountType: ko.observable()
        };
        if(self.registerBillerDetails.autopay){
          if(self.registerBillerDetails.autopayInstructions.limitAmount && self.registerBillerDetails.autopayInstructions.limitAmount.amount > 0){
            self.autoPayLimit = ko.observable("limitAmount");
          }else{
            self.autoPayLimit = ko.observable("billAmount");
          }
        }
        ReviewBillerRegistrationModel.fetchCategory(self.registerBillerDetails.category.id).done(function(data){
          self.dropdownLabels.category(data.category.name);
        });
        ReviewBillerRegistrationModel.fetchLocationDetails(self.registerBillerDetails.location.id).done(function(response){
          var location = null;
          var data = response.operationalArea;
          if(!data.areaName){
            location = data.city;
            if(data.state){
              if(location.length > 0){
                location = location + ", ";
              }
              location = location + data.state;
            }
            if(data.country){
              if(location.length > 0){
                location = location + ", ";
              }
              location = location + data.country;
            }
          }else{
            location = data.areaName;
          }
          self.dropdownLabels.location(location);
        });
        ReviewBillerRegistrationModel.fetchBillerDetails(self.registerBillerDetails.billerId).done(function(response){
          self.dropdownLabels.biller(response.biller.name);
          var i, specsArray = [];
          for (i = 0; i < response.biller.specifications.length; i++) {
              specsArray[response.biller.specifications[i].id] = response.biller.specifications[i];
          }
          for (i = 0; i < self.registerBillerDetails.relationshipDetails.length; i++) {
            self.relationshipDetails.push({
              label: specsArray[self.registerBillerDetails.relationshipDetails[i].labelId].label,
              dataType: specsArray[self.registerBillerDetails.relationshipDetails[i].labelId].dataType,
              value: self.registerBillerDetails.relationshipDetails[i].value
            });
          }
        });

        params.dashboard.headerName(self.resourceBundle.heading.billerDetails);

      }else{
        if(self.updateBiller()){
          params.dashboard.headerName(self.resourceBundle.heading.manageBillers);
        }else{
          params.dashboard.headerName(self.resourceBundle.heading.addBiller);
        }
        params.baseModel.registerElement("confirm-screen");
      }

      /**
       * This function redirects to the confirmation screen
       *
       * @function loadConfirmationScreen
       * @param {Object} jqXhr - response object
       * @param {String} transactionName - name of the transaction
       * @param {Object} taskCode - task code of the current transaction
       * @param {Object} successMessage - success message to be displayed
       * @param {arrayList} statusMessages - transaction status messages
       * @param {arrayList} confirmScreenDetailsArray - additional details to be displayed on confirm screen
       * @returns {void}
       */
      function loadConfirmationScreen(jqXhr, transactionName, taskCode, successMessage, statusMessages, confirmScreenDetailsArray){
        params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: transactionName,
            confirmScreenExtensions: {
                successMessage: successMessage,
                statusMessages: statusMessages,
                taskCode: taskCode,
                isSet: true,
                confirmScreenDetails: confirmScreenDetailsArray,
                template: "confirm-screen/bill-payments"
            }
        }, self);
      }

      self.confirm = function () {
        var successMessage, statusMessages, transactionName;
        var confirmScreenDetailsArray = [
                [{
                    label: self.resourceBundle.labels.billerName,
                    value: self.dropdownLabels.biller()
                },
                {
                    label: self.resourceBundle.labels.billerNickname,
                    value: self.registerBillerDetails.billerNickName
                }]
        ];
        if(self.registerBillerDetails.autopay === "true"){
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.labels.billerCategory,
            value: self.dropdownLabels.category()
          },
          {
            label: self.resourceBundle.labels.autoPay,
            value: self.resourceBundle.labels.yes
          }]);
        }else if(self.registerBillerDetails.isSchedule === "true"){
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.labels.billerCategory,
            value: self.dropdownLabels.category()
          },
          {
            label: self.resourceBundle.labels.scheduledPay,
            value: self.resourceBundle.labels.yes
          }]);
        }else{
          confirmScreenDetailsArray.push([{
            label: self.resourceBundle.labels.billerCategory,
            value: self.dropdownLabels.category()
          }]);
        }
        if(params.modifiedBillerDetails){
          ReviewBillerRegistrationModel.updateBiller(params.modifiedBillerDetails.billerRegistrationId, ko.mapping.toJSON(params.modifiedBillerDetails)).done(function(data, status, jqXhr){
            if (self.userSegment === "CORP" && jqXhr.status && jqXhr.status === 202) {
                successMessage = self.resourceBundle.messages.corpMaker;
                statusMessages = self.resourceBundle.messages.pendingApproval;
            } else {
                successMessage = self.resourceBundle.messages.updateSuccessMessage;
                statusMessages = self.resourceBundle.messages.sucessfull;
            }
            transactionName = self.resourceBundle.heading.updteBiller;
            loadConfirmationScreen(jqXhr, transactionName, "EB_F_UBR", successMessage, statusMessages, confirmScreenDetailsArray);
          });
        }else{
          ReviewBillerRegistrationModel.registerBiller(ko.mapping.toJSON(params.registerBillerDetails)).done(function(data, status, jqXhr){
            if (self.userSegment === "CORP" && jqXhr.status && jqXhr.status === 202) {
                successMessage = self.resourceBundle.messages.corpMaker;
                statusMessages = self.resourceBundle.messages.pendingApproval;
            } else {
                successMessage = self.resourceBundle.messages.addSuccessMessage;
                statusMessages = self.resourceBundle.messages.sucessfull;
            }
            transactionName = self.resourceBundle.heading.addBiller;
            loadConfirmationScreen(jqXhr, transactionName, "EB_F_CBR", successMessage, statusMessages, confirmScreenDetailsArray);
          });
        }
      };

      self.goBack = function(){
        params.dashboard.headerName(self.resourceBundle.heading.bills);
        self.currentStage("LIST");
      };

      self.editBiller = function(){
        self.currentStage("CREATE");
      };

    };
});
