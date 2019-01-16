define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/add-ext-bank",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojradioset",
    "ojs/ojswitch"
], function(oj, ko, $, ReviewExtBankModel,resourceBundle) {
    "use strict";
    return function (params) {
        var self = this,i;
        ko.utils.extend(self, params.rootModel);
        self.mode = ko.observable();
        self.validationType = ko.observable();
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.resourceBundle.heading.addBank);
        self.editFromView = self.editFromView || ko.observable(false);
        self.externalapiName = ko.observable();
        self.validationType = ko.observable();
        self.reviewLoaded = ko.observable(false);
        self.approvalFromCreate = ko.observable(false);
        self.disabledState = ko.observable(true);
        self.file = ko.observable();
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("add-ext-bank-create", "account-aggregation");
        params.baseModel.registerComponent("add-ext-bank", "account-aggregation");

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
          self.retrieveLogoImage = function () {
            ReviewExtBankModel.retrieveImage(self.bankDetails.logo.value).done(function (data) {
                    if (data && data.contentDTOList[0]) {
                        self.previewLogo("data:image/gif;base64," + data.contentDTOList[0].content);
                        setTimeout(self.loadLogoImage(), 1000);
                        self.isLogoExist(true);
                    }
                });
            };

            /**
            * This is a function which returns newly modified billerDetails depending upon modes
            * @function setBankDetails
            * @returns {void}
            */
            function setBankDetails() {
              if(self.bankDetails.logo.value !== null){
                self.retrieveLogoImage();
              }
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
            self.imageId2 = ko.observable(self.resourceBundle.labels.imageId2);
            self.fileId2 = ko.observable(self.resourceBundle.labels.fileId2);

            if(self.mode() !== "approval"){
            var tempArray = [];
              if (self.params.bankDetails) {
                self.bankDetails = ko.mapping.toJS(self.params.bankDetails);
                self.approvalFromCreate(false);
                setBankDetails();
                for(var k = 0; k < self.bankDetails.authorizationDetail.externalAPIs.length; k++) {
                  for(var j = 0; j < self.bankDetails.authorizationDetail.externalAPIs.length; j++) {
                    if(k+1 === parseInt(self.bankDetails.authorizationDetail.externalAPIs[j].priority)) {
                      tempArray.push(self.bankDetails.authorizationDetail.externalAPIs[j]);
                      break;
                    }
                  }
                }
                self.bankDetails.authorizationDetail.externalAPIs = tempArray;
                self.reviewLoaded(true);
              }
            }else{
              self.bankDetails = ko.mapping.toJS(self.params.data);
              setBankDetails();
              self.reviewLoaded(true);
            }
        }else{
            self.bankDetails = ko.mapping.toJS(self.params.bankDetails);
            self.reviewLoaded(true);
        }

          self.editAll = function(){
             var parameters = {
                mode: "EDIT",
                editFromView : false,
                bankDetails: self.bankDetails
            };
            params.dashboard.loadComponent("add-ext-bank-create", parameters, self);
          };

          self.updateAll = function(){

            var parameters = {
                mode: "EDIT",
                editFromView : true,
                bankDetails: self.bankDetails
            };

            params.dashboard.loadComponent("add-ext-bank-create", parameters, self);
          };

          self.confirmDeleteBank = function () {
              $("#deleteBank").trigger("openModal");
          };

          self.deleteBank = function(){
            ReviewExtBankModel.deleteBank(self.params.bankDetails.bankCode).done(function (data, status, jqXhr) {
                self.httpStatus = jqXhr.status;
                var deleteSuccessMessage, deleteStatusMessages;
                if (self.httpStatus && self.httpStatus === 200) {
                    deleteSuccessMessage = self.resourceBundle.confirmScreen.deleteSuccessMessage;
                    deleteStatusMessages = self.resourceBundle.confirmScreen.completed;
                }
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.addBank,
                    confirmScreenExtensions: {
                        successMessage: deleteSuccessMessage,
                        statusMessages: deleteStatusMessages
                        }
                }, self);
            }).fail(function () {
               $("#deleteBank").hide();
            });
          };

          self.backToSearch = function(){
            self.isLogoExist(false);
            self.isImageExist(false);
            params.dashboard.loadComponent("add-ext-bank", {}, self);
          };

          self.uploadImages = function () {
              if(self.isImageExist()) {
                  var form = new FormData();
                  form.append("file", self.fileLogo());
                  form.append("moduleIdentifier", "BILLER");
                      self.uploadImage2();
              } else {
                  self.uploadImage2();
              }
          };

          self.uploadImage2 = function () {
              if(self.isLogoExist() && (self.bankDetails.logo && self.bankDetails.logo.value === null)) {
                  var form2 = new FormData();
                  form2.append("file", self.fileLogo());
                  form2.append("moduleIdentifier", "BILLER");
                  ReviewExtBankModel.uploadImage(form2).done(function (data) {
                      if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                          self.bankDetails.logo.value = data.contentDTOList[0].contentId.value;
                      }
                    if(self.editFromView()){
                      self.updateBank();
                    }else{
                      self.confirm();
                    }

                  });
              }else if(self.editFromView()){
                  self.updateBank();
                }else{
                  self.confirm();
                }
          };

          self.confirm = function () {
            for(i = 0; i < self.bankDetails.authorizationDetail.externalAPIs.length; i++) {
                self.bankDetails.authorizationDetail.externalAPIs[i].priority = i+1;
             }
              ReviewExtBankModel.createBank(ko.mapping.toJSON(self.bankDetails)).done(function (data, status, jqXhr) {
                if (data.bank) {
                    jqXhr.responseJSON.referenceNumber = data.bank.bankCode;
                }
                self.mode("SUCCESS");
                location.hash = self.mode();
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
					transactionName: self.resourceBundle.heading.addBank
                }, self);
              });
          };

          self.updateBank = function() {
            for(var e = 0; e < self.bankDetails.authorizationDetail.externalAPIs.length; e++) {
                self.bankDetails.authorizationDetail.externalAPIs[e].priority = e+1;
                for(i = 0; i < self.banklist.externalBankDTOs.length; i++) {
                  if(self.banklist.externalBankDTOs[i].bankCode === self.params.bankDetails.bankCode){
                    for(var f = 0; f < self.banklist.externalBankDTOs[i].authorizationDetail.externalAPIs.length; f++) {
                      if(self.bankDetails.authorizationDetail.externalAPIs[e].api_name === self.banklist.externalBankDTOs[i].authorizationDetail.externalAPIs[f].api_name){
                        self.bankDetails.authorizationDetail.externalAPIs[e].id = self.banklist.externalBankDTOs[i].authorizationDetail.externalAPIs[f].id;
                      }
                    }
                  }
                }
              }
            self.updatedBankDetails = ReviewExtBankModel.getNewModel().UpdatedBankDetails;
            self.updatedBankDetails = mergeObject(self.updatedBankDetails,self.bankDetails);
            ReviewExtBankModel.updateBank(self.updatedBankDetails.bankCode,ko.mapping.toJSON(self.updatedBankDetails)).done(function (data, status, jqXhr) {
                if (data.bank) {
                    jqXhr.responseJSON.referenceNumber = data.bank.bankCode;
                }
                self.mode("SUCCESS");
                location.hash = self.mode();
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.bankUpdateTransaction
                }, self);
            });

          };
    };
});
