define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/biller-onboarding",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojradioset"
], function(oj, ko, $, ReviewBillerModel,resourceBundle) {
    "use strict";
    return function (params) {
        var self = this,i,j;
        ko.utils.extend(self, params.rootModel);
        self.mode = ko.observable();
        self.countryName = ko.observable();
        var countryList = [];
        self.paymentMethodFlag = ko.observable(false);
        self.validationType = ko.observable();
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.resourceBundle.heading.billerOnboarding);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("biller-create", "biller-maintenance");
        params.baseModel.registerComponent("biller-search", "biller-maintenance");
        self.editFromView = self.editFromView || ko.observable(false);
        self.categoryName = ko.observable();
        self.reviewLoaded = ko.observable(false);
        self.approvalFromCreate = ko.observable(false);

        /**
        * This is a function which returns name of country taking country code as it's parameter
        * @function getCountryNameFromCode
		    * @param {string} countryCode - code of the country
		    * @returns {string} name of the country represented by the code
        */
        function getCountryNameFromCode(countryCode) {
            var countryName = countryList.filter(function (data) {
                return data.code === countryCode;
            });
            return countryName.length > 0 ? countryName[0].description : null;
        }

        /**
        * This is a function which returns merged modal for update biller
        * @function mergeObject
		    * @param {string} obj1 - Update Biller Model
        * @param {string} obj2 - Create Biller Model
		    * @returns {string} return Updated Biller Model
        */
        function mergeObject(obj1, obj2) {
            for (var element in obj2) {
              if(element !== "type" && element !== "determinantValue"){
                if (obj2[element]) {
                    if (obj2[element].constructor === Object) {
                        obj1[element] = mergeObject(obj1[element], obj2[element]);
                    } else {
                            obj1[element] = obj2[element];
                    }
                }
              }
            }
            return obj1;
        }

        self.loadLogoImage = function () {
            $().ready(function () {
                if (self.previewLogo()) {
                    $("#"+self.imageId2()).attr("src", self.previewLogo());
                }
            });
        };

        self.loadSampleImage = function () {
            $().ready(function () {
                if (self.preview()) {
                    $("#"+self.imageId1()).attr("src", self.preview());
                }
            });
        };
        self.retrieveLogoImage = function () {
            ReviewBillerModel.retrieveImage(self.billerDetails.logo.value).done(function (data) {
                if (data && data.contentDTOList[0]) {
                    self.previewLogo("data:image/gif;base64," + data.contentDTOList[0].content);
                    setTimeout(self.loadLogoImage(), 1000);
                    self.isLogoExist(true);
                }
            });
        };
        self.retrieveSampleImage = function () {
            ReviewBillerModel.retrieveImage(self.billerDetails.sampleBill.value).done(function (data) {
                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                    setTimeout(self.loadSampleImage(), 1000);
                    self.isImageExist(true);
                }
            });
        };
        self.setPaymentOptions = function(){
          if(self.billerDetails.type === "RECHARGE" || self.billerDetails.type === "PAYMENT") {
              if(self.billerDetails.type === "RECHARGE") {
                  self.paymentsAllowedValues.recharge(true);
              }
              if(self.billerDetails.type === "PAYMENT") {
                  self.paymentsAllowedValues.payment(true);
              }
              self.displaySampleImage(false);
              self.autoPayDisabled(true);

          } else if(self.billerDetails.type === "PRESENTMENT" || self.billerDetails.type === "PRESENTMENT_PAYMENT") {
              if(self.billerDetails.type === "PRESENTMENT") {
                  self.paymentsAllowedValues.presentment(true);
              }
              if(self.billerDetails.type === "PRESENTMENT_PAYMENT") {
                  self.paymentsAllowedValues.presentmentPayment(true);
              }
              self.displaySampleImage(true);
              self.autoPayDisabled(false);
          }
        };

        /**
        * This is a function which returns newly modified billerDetails depending upon modes
        * @function setBillerDetails
        * @returns {void}
        */
        function setBillerDetails() {
          if(self.billerDetails.logo.value !== null){
            self.retrieveLogoImage();
          }
          if(self.billerDetails.sampleBill.value !== null){
            self.retrieveSampleImage();
          }
          if(self.billerDetails.paymentOptions.partPayment === true){
            self.paymentsAllowed().push("PART");
          }
          if(self.billerDetails.paymentOptions.excessPayment === true){
            self.paymentsAllowed().push("EXCESS");
          }
          if(self.billerDetails.paymentOptions.latePayment === true){
            self.paymentsAllowed().push("LATE");
          }
          if(self.billerDetails.paymentOptions.quickBillPayment === true){
            self.paymentsAllowed().push("QUICK_PAY");
          }
          if(self.billerDetails.paymentOptions.quickRecharge === true){
            self.paymentsAllowed().push("QUICK_RECHARGE");
          }
          self.validationType(self.billerDetails.validationType);
          for(var l = 0; l < self.billerDetails.specifications.length; l++) {
              self.billerDetails.specifications[l].required = (self.billerDetails.specifications[l].required === true) ? "MANDATORY" : "OPTIONAL";
          }
          ReviewBillerModel.fetchPaymentMethods().done(function (data) {
              self.paymentMethodsList(data.enumRepresentations[0].data);
              if(self.approvalFromCreate()){
                for(i = 0; i < self.billerDetails.paymentMethodsList.length; i++) {
                  for(j = 0; j < self.paymentMethodsList().length; j++) {
                      if(self.paymentMethodsList()[j].value === self.billerDetails.paymentMethodsList[i].paymentType){
                          self.paymentMethods().push(self.paymentMethodsList()[j].value);
                      }
                  }
                }
              }else{
                for(i = 0; i < self.billerDetails.paymentMethodsList.length; i++) {
                  for(j = 0; j < self.paymentMethodsList().length; j++) {
                      if(self.paymentMethodsList()[j].description === self.billerDetails.paymentMethodsList[i].paymentType){
                          self.paymentMethods().push(self.paymentMethodsList()[j].value);
                      }
                  }
                }
              }
              self.paymentMethodFlag(true);
          });
          ReviewBillerModel.fetchCountry().done(function (data) {
              countryList = data.enumRepresentations[0].data;
              self.countryName(getCountryNameFromCode(self.billerDetails.address.country));
          });
          ReviewBillerModel.fetchCategoryDetails(self.billerDetails.areaCategoryDetails[0].categoryId).done(function (data) {
            self.categoryName(data.category.name);
          });
        }

        /*
        Get Mode from params
        */
        if (self.params.mode) {
            self.mode(self.params.mode);
        }

        /*
        This component will be used by following components with following modes
        REVIEW : From Biller Create screen
        VIEW : From Biller Search screen
        APPROVAL : From Activity Log
        */
        if(self.mode() !== "REVIEW"){
          /*Here mode can either be VIEW or APPROVAL*/
          self.isLogoExist = ko.observable(false);
          self.isImageExist = ko.observable(false);
          self.autoPayDisabled = ko.observable(false);
          self.displaySampleImage = ko.observable(false);
          self.file = ko.observable();
          self.preview = ko.observable();
          self.previewLogo = ko.observable();
          self.fileLogo = ko.observable();
          self.paymentMethodsList = ko.observableArray([]);
          self.paymentsAllowed = ko.observableArray([]);
          self.paymentMethods = ko.observableArray([]);
          self.imageId1 =ko.observable(self.resourceBundle.labels.imageId1);
          self.imageId2 = ko.observable(self.resourceBundle.labels.imageId2);
          self.fileId1 = ko.observable(self.resourceBundle.labels.fileId1);
          self.fileId2 = ko.observable(self.resourceBundle.labels.fileId2);
          self.paymentsAllowedValues = {
              presentment: ko.observable(false),
              payment: ko.observable(false),
              presentmentPayment: ko.observable(false),
              recharge: ko.observable(false)
          };

          if(self.mode() !== "approval"){
            if (self.params.billerDetails) {
              self.billerDetails = ko.mapping.toJS(self.params.billerDetails);
              self.billerDetails.validationUrl = (self.billerDetails.validationUrl && self.billerDetails.validationType === "ONLINE") ? self.billerDetails.validationUrl : null;
              self.approvalFromCreate(false);
              self.setPaymentOptions();
              setBillerDetails();
              self.reviewLoaded(true);
            }
          }else{
            self.billerDetails = ko.mapping.toJS(self.params.data);
            if(!self.billerDetails.type){
              ReviewBillerModel.getBillerDetails(self.billerDetails.id).done(function (data) {
                 if(self.billerDetails.name){
                   /*This condition is for approval of Update Biller.
                   As we need to set all those unedited fields*/
                   self.billerDetails.type = data.biller.type;
                   self.billerDetails.areaCategoryDetails[0].operationalAreaName = data.biller.areaCategoryDetails[0].operationalAreaName;
                 }else{
                   /*This condition is for approval of Delete Biller.
                   As response will contain only biller Id which is to be deleted*/
                   self.billerDetails = ko.mapping.toJS(data.biller);
                 }
                 self.approvalFromCreate(false);
                 setBillerDetails();
                 self.setPaymentOptions();
                 self.reviewLoaded(true);
              });
            }else{
              /*This condition is for approval of Create Biller*/
              self.approvalFromCreate(true);
              setBillerDetails();
              self.setPaymentOptions();
              self.reviewLoaded(true);
            }
          }
        }else{
          self.billerDetails = ko.mapping.toJS(self.params.billerDetails);
          self.validationType(self.billerDetails.validationType);
          ReviewBillerModel.fetchCountry().done(function (data) {
              countryList = data.enumRepresentations[0].data;
              self.countryName(getCountryNameFromCode(self.billerDetails.address.country));
          });
          ReviewBillerModel.fetchCategoryDetails(self.billerDetails.areaCategoryDetails[0].categoryId).done(function (data) {
            self.categoryName(data.category.name);
          });
          self.paymentMethodFlag(true);
          self.reviewLoaded(true);
        }


        self.editAll = function(){
          var parameters = {
              mode: "EDIT",
              editFromView : false,
              billerDetails: self.billerDetails
          };
          params.dashboard.loadComponent("biller-create", parameters, self);
        };

        self.updateAll = function(){
          var parameters = {
              mode: "EDIT",
              editFromView : true,
              billerDetails: self.billerDetails
          };
          params.dashboard.loadComponent("biller-create", parameters, self);
        };

        self.uploadImages = function () {
            if(self.isImageExist() && (self.billerDetails.sampleBill && self.billerDetails.sampleBill.value === null)) {
                var form = new FormData();
                form.append("file", self.file());
                form.append("moduleIdentifier", "BILLER");
                ReviewBillerModel.uploadImage(form).done(function (data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.billerDetails.sampleBill.value = data.contentDTOList[0].contentId.value;
                    }
                    self.uploadImage2();
                });
            } else {
                self.uploadImage2();
            }
        };

        self.uploadImage2 = function () {
            if(self.isLogoExist() && (self.billerDetails.logo && self.billerDetails.logo.value === null)) {
                var form2 = new FormData();
                form2.append("file", self.fileLogo());
                form2.append("moduleIdentifier", "BILLER");
                ReviewBillerModel.uploadImage(form2).done(function (data) {
                    if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                        self.billerDetails.logo.value = data.contentDTOList[0].contentId.value;
                    }
                    if(self.editFromView()){
                      self.updateBiller();
                    }else{
                      self.confirm();
                    }
                });
            } else if(self.editFromView()){
                self.updateBiller();
              }else{
                self.confirm();
              }
        };

        self.backToSearch = function(){
          self.isLogoExist(false);
          self.isImageExist(false);
          self.paymentsAllowed([]);
          self.paymentMethods([]);
          params.dashboard.loadComponent("biller-search", {}, self);
        };
        self.confirmDeleteBiller = function () {
            $("#deleteBiller").trigger("openModal");
        };

        self.deleteBiller = function(){
          for(j = 0; j < self.billerDetails.specifications.length; j++) {
              if(self.billerDetails.specifications[j].required === "MANDATORY") {
                  self.billerDetails.specifications[j].required = true;
              } else if(self.billerDetails.specifications[j].required === "OPTIONAL") {
                  self.billerDetails.specifications[j].required = false;
              }
          }

          ReviewBillerModel.deleteBiller(self.params.billerDetails.id).done(function (data, status, jqXhr) {
              self.httpStatus = jqXhr.status;
              var deleteSuccessMessage, deleteStatusMessages;
              if (self.httpStatus && self.httpStatus === 200) {
                  deleteSuccessMessage = self.resourceBundle.manageCategory.confirmScreen.deleteSuccessMessage;
                  deleteStatusMessages = self.resourceBundle.manageCategory.confirmScreen.completed;
              }
              params.dashboard.loadComponent("confirm-screen", {
                  jqXHR: jqXhr,
                  transactionName: self.resourceBundle.heading.transactionDeleteName,
                  confirmScreenExtensions: {
                      successMessage: deleteSuccessMessage,
                      statusMessages: deleteStatusMessages,
                      isSet: true,
                      template: "confirm-screen/trade-finance"
                  }
              }, self);
          }).fail(function () {
              $("#deleteBiller").hide();
          });
        };

        self.confirm = function () {
           for(i = 0; i < self.billerDetails.specifications.length; i++) {
                self.billerDetails.specifications[i].required = (self.billerDetails.specifications[i].required === "MANDATORY");
               self.billerDetails.specifications[i].priority = i+1;
               if(self.billerDetails.specifications[i].datatype === "DATE"){
                 self.billerDetails.specifications[i].maxLength = null;
               }
            }
            ReviewBillerModel.createBiller(ko.mapping.toJSON(self.billerDetails)).done(function (data, status, jqXhr) {
              if (data.biller) {
                  jqXhr.responseJSON.referenceNumber = data.biller.id;
              }
              self.mode("SUCCESS");
              location.hash = self.mode();
              params.dashboard.loadComponent("confirm-screen", {
                  jqXHR: jqXhr,
                  transactionName: self.resourceBundle.heading.billerCreateTransaction
              }, self);
            });
        };

        self.updateBiller = function() {
          for(i = 0; i < self.billerDetails.specifications.length; i++) {
               self.billerDetails.specifications[i].required = (self.billerDetails.specifications[i].required === "MANDATORY");
              self.billerDetails.specifications[i].priority = i+1;
           }
          self.updateBillerDetails = ReviewBillerModel.getNewModel().UpdatedBillerDetails;
          self.updateBillerDetails = mergeObject(self.updateBillerDetails,self.billerDetails);
          ReviewBillerModel.updateBiller(self.updateBillerDetails.id,ko.mapping.toJSON(self.updateBillerDetails)).done(function (data, status, jqXhr) {
              if (data.biller) {
                  jqXhr.responseJSON.referenceNumber = data.biller.id;
              }
              self.mode("SUCCESS");
              location.hash = self.mode();
              params.dashboard.loadComponent("confirm-screen", {
                  jqXHR: jqXhr,
                  transactionName: self.resourceBundle.heading.billerUpdateTransaction
              }, self);
          });
        };
    };
});
