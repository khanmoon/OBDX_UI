define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/register-biller",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout",
    "ojs/ojlabel",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojavatar",
    "ojs/ojknockout-validation"
], function(oj, ko, $, RegisterBillerModel, locale) {
    "use strict";
    var self,vm = function (params) {

        self = this;

        var getNewKoModel = function () {
            var registerBillerModel = ko.mapping.fromJS(RegisterBillerModel.getNewModel());
            return registerBillerModel;
        };

        var payLoad = { batchDetailRequestList: [] };

        self.invalidTracker = ko.observable();
        self.categoryList = ko.observableArray();
        self.locationList = ko.observableArray();
        self.billerList = ko.observableArray();
        self.relationshipDetails = ko.observableArray();
        self.currenyConverter = ko.observable();
        self.dropdownListLoaded = {
            categories: ko.observable(false)
        };
        self.dropdownLabels = {
            category: ko.observable(),
            location: ko.observable(),
            biller: ko.observable(),
            currentAccountType: ko.observable()
        };
        self.frequency = ko.observable("ONE_TIME");
        self.autoPayLimit = ko.observable("billAmount");

        if(params.baseModel.small()){
          self.showCategoryAvatars = ko.observable(true);
        }else{
          self.showCategoryAvatars = ko.observable(false);
        }

        self.customURL = ko.observable();
        self.currentAccountType = ko.observable();
        self.accountsLoaded = ko.observable("false");
        self.additionalDetails = ko.observable("");
        self.mode = ko.observable("CREATE");

        self.supportedAccounts = ko.observableArray();
        self.supportedAccountsLocale = ko.observableArray();

        self.previewSampleBill = ko.observable();
        self.sampleBillExist = ko.observable(false);

        self.registerBillerDetails = getNewKoModel().RegisterBillerDetails;

        self.currentStage = ko.observable("CREATE");

        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.addBiller);

        self.billerValid = ko.observable();

        params.baseModel.registerElement("account-input");
        params.baseModel.registerElement("help");
        params.baseModel.registerComponent("review-register-biller", "bill-payments");
        params.baseModel.registerComponent("payment-history", "bill-payments");
        params.baseModel.registerComponent("manage-bill-paymnets", "bill-payments");

        /**
         * This function sets the locations to be displayed on screen
         *
         * @function populateLocationDropdown
         * @param {arrayList} locationList - locations to be populated in the dropdown
         * @returns {void}
         */
        function populateLocationDropdown(locationList){
          self.locationList.removeAll();
          var location = null;
          for (var i = 0; i < locationList.length; i++) {
            location = null;
            if(!locationList[i].areaName){
              location = locationList[i].city;
              if(locationList[i].state){
                if(location.length > 0){
                  location = location + ", ";
                }
                location = location + locationList[i].state;
              }
              if(locationList[i].country){
                if(location.length > 0){
                  location = location + ", ";
                }
                location = location + locationList[i].country;
              }
            }else{
              location = locationList[i].areaName;
            }
            self.locationList.push({
              label: location,
              value: locationList[i].id
            });
          }
        }

        /**
         * This function fetches the list of billers from the service
         *
         * @function fetchBillers
         * @returns {void}
         */
        function fetchBillers(){
          RegisterBillerModel.fetchBillers(self.registerBillerDetails.category.id(), self.registerBillerDetails.location.id()).done(function (data) {
            var billerResponse = data.billerDTOs;
            var id;
            var billerList = [];
            payLoad.batchDetailRequestList = [];
            for (var i = 0; i < billerResponse.length; i++) {
              if(billerResponse[i].status === "ACTIVE"){
                billerList.push({
                  initials: oj.IntlConverterUtils.getInitials(billerResponse[i].name),
                  logo: billerResponse[i].logo,
                  billerLogo: null,
                  label: billerResponse[i].name,
                  value: billerResponse[i].id,
                  billerType: billerResponse[i].type,
                  currency: billerResponse[i].currency,
                  sampleBill: billerResponse[i].sampleBill,
                  paymentMethodsList: billerResponse[i].paymentMethodsList,
                  specifications: billerResponse[i].specifications
                });
                if(billerResponse[i].logo && billerResponse[i].logo.value){
                    id = billerResponse[i].logo.value;
                    var contentURL = {
                      value: "/contents/{id}",
                      params: { "id": id }
                    };
                    var obj = {
                      methodType: "GET",
                      uri: contentURL,
                      headers: {
                        "Content-Id": i + 1,
                        "Content-Type": "application/json"
                      }
                    };
                    payLoad.batchDetailRequestList.push(obj);
                }
              }
            }
            if(payLoad.batchDetailRequestList.length > 0){
              RegisterBillerModel.fireBatch(payLoad).done(function (batchData) {
                var contentMap = [];
                  if (batchData && batchData.batchDetailResponseDTOList) {
                      for (var j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                          var batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);
                          if (batchResponse.contentDTOList) {
                              if(batchResponse.contentDTOList[0].contentId)
                                contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content;
                          }
                      }
                  }
                  for (var i = 0; i < billerList.length; i++) {
                    if(billerList[i].logo && billerList[i].logo.value){
                      billerList[i].billerLogo = contentMap[billerList[i].logo.value];
                    }
                  }
                  self.billerList(billerList);
              });
            }else{
              self.billerList(billerList);
            }
          });
        }

        /**
         * This function populate category logos
         *
         * @function fetchLogos
         * @returns {void}
         */
        function fetchLogos(){
          RegisterBillerModel.fireBatch(payLoad).done(function (batchData) {
            var contentMap = [];
              if (batchData && batchData.batchDetailResponseDTOList) {
                  for (var j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                      var batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);
                      if (batchResponse.contentDTOList) {
                          if(batchResponse.contentDTOList[0].contentId)
                            contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content;
                      }
                  }
              }
              for (var i = 0; i < self.categoryList().length; i++) {
                if(self.categoryList()[i].logo){
                  self.categoryList()[i].logoImg(contentMap[self.categoryList()[i].logo.value]);
                }
              }
          });
        }

        self.fetchCategories = function() {
            RegisterBillerModel.fetchCategory().done(function (data) {
                self.categoryList(data.categoryDTOs);
                payLoad.batchDetailRequestList = [];
                var id, i = 0;
                self.categoryList().forEach(function(category){
                  category.initials = oj.IntlConverterUtils.getInitials(category.name);
                  category.logoImg = ko.observable();
                  if(params.baseModel.small() && category.logo){
                    id = category.logo.value;
                    var contentURL = {
                      value: "/contents/{id}",
                      params: { "id": id }
                    };
                    var obj = {
                      methodType: "GET",
                      uri: contentURL,
                      headers: {
                        "Content-Id": ++i,
                        "Content-Type": "application/json"
                      }
                    };
                    payLoad.batchDetailRequestList.push(obj);
                  }
                });
                if(payLoad.batchDetailRequestList.length > 0){
                  fetchLogos();
                }
                self.categoryList().sort(function (left, right) {
                    return left.priority === right.priority ? 0 : left.priority < right.priority ? -1 : 1;
                });
                self.dropdownListLoaded.categories(true);
            });
        };
        self.fetchCategories();

        self.fetchLocations = function(){
          RegisterBillerModel.fetchLocation(self.registerBillerDetails.category.id()).done(function (data) {
            if(data.operationalAreaDTOs.length > 0){
              populateLocationDropdown(data.operationalAreaDTOs);
              self.showCategoryAvatars(false);
            }else{
              params.baseModel.showMessages(null, [self.resourceBundle.messages.noBillersMapped], "ERROR");
            }
          });
        };

        self.setCategory = function(data){
          if(self.registerBillerDetails.category.id() !== data.id){
              self.registerBillerDetails.category.id(data.id);
          }else{
            self.showCategoryAvatars(false);
          }
        };

        self.editCategory = function(){
          self.showCategoryAvatars(true);
        };

        self.categorySubscribe = self.registerBillerDetails.category.id.subscribe(function(newValue){
          var category = self.categoryList().filter(function (data) {
              return data.id === newValue;
          });
          if (category && category.length > 0) {
              self.dropdownLabels.category(category[0].name);
          }
          self.locationList.removeAll();
          self.registerBillerDetails.location.id(null);
          self.billerList.removeAll();
          self.registerBillerDetails.billerId(null);
          self.fetchLocations();
        });

        self.locationSubscribe = self.registerBillerDetails.location.id.subscribe(function(newValue){
          if(newValue !== null){
            var location = self.locationList().filter(function (data) {
              return data.value === newValue;
            });
            if (location && location.length > 0) {
              self.dropdownLabels.location(location[0].label);
            }
            self.billerList.removeAll();
            self.registerBillerDetails.billerId(null);
            fetchBillers();
          }
        });

        /**
         * This function returns appropriate data validator for the field
         *
         * @function getValidator
         * @param {String} datatype datatype against which validator need to be returned
         * @param {boolean} required whether field is mandatory or not
         * @param {int} maxlength maxlength of the field
         * @returns {Object} oj validator object
         */
        function getValidator(datatype, required, maxlength){
          var validaton, errorMessage, minlength = 0;

          if(required){
            minlength = 1;
          }

          var extension = {
             type:"length",
             options:{
                 min:minlength,
                 max:maxlength
               }
          };

          switch (datatype) {
            case "ALPHANUMERIC":
              validaton = "ALPHANUMERIC";
              errorMessage = self.resourceBundle.registerBillerError.validationErrors.ALPHANUMERIC;
              break;
            case "NUMERIC":
              validaton = "NUMBERS";
              errorMessage = self.resourceBundle.registerBillerError.validationErrors.NUMERIC;
              break;
            case "TEXT":
              validaton = "ALPHABETS";
              errorMessage = self.resourceBundle.registerBillerError.validationErrors.TEXT;
              break;
            default:
              validaton = "ALPHANUMERIC_WITH_ALL_SPECIAL";
              errorMessage = self.resourceBundle.registerBillerError.validationErrors.OTHERS;
          }
          return params.baseModel.getValidator(validaton, errorMessage, extension);
        }

        /**
         * This function retrieves sample bill image for a biller
         *
         * @function fetchSampleBill
         * @param {String} sampleBillId content id to be fetched
         * @returns {void}
         */
        function fetchSampleBill(sampleBillId){
          RegisterBillerModel.retrieveImage(sampleBillId).done(function (data) {
              if (data && data.contentDTOList[0]) {
                  self.previewSampleBill("data:image/gif;base64," + data.contentDTOList[0].content);
                  self.sampleBillExist(true);
              }
          });
        }

        self.billerSubscribe = self.registerBillerDetails.billerId.subscribe(function (newValue) {
          var i;
          self.sampleBillExist(false);
          self.previewSampleBill(null);
          self.registerBillerDetails.billerNickName(null);
          self.registerBillerDetails.customerName(null);
          self.registerBillerDetails.autopay("false");
          self.supportedAccounts.removeAll();
          self.supportedAccountsLocale.removeAll();
          self.relationshipDetails.removeAll();
          if (newValue) {
            var billerId = newValue;
            var biller = self.billerList().filter(function (data) {
                return data.value === billerId;
            });
            if (biller && biller.length > 0) {
              self.currenyConverter({"type": "number",
                "options": {
                "style":"currency",
                "currency":biller[0].currency,
                "currencyDisplay":"symbol"
              }});
              self.dropdownLabels.biller(biller[0].label);
              self.registerBillerDetails.billerType(biller[0].billerType);
              self.registerBillerDetails.autopayInstructions.limitAmount.currency(biller[0].currency);
              for(i = 0; i < biller[0].paymentMethodsList.length; i++){
                self.supportedAccounts.push(biller[0].paymentMethodsList[i].paymentType);
                self.supportedAccountsLocale.push(self.resourceBundle.labels[biller[0].paymentMethodsList[i].paymentType]);
              }
              if(self.supportedAccounts().length > 0){
                self.currentAccountType(self.supportedAccounts()[0]);
                if(self.currentAccountType() === "CASA"){
                  self.customURL("demandDeposit");
                }else if(self.currentAccountType() === "CREDITCARD"){
                  self.customURL("cards/credit?expand=ALL");
                }else if(self.currentAccountType() === "DEBITCARD"){
                  self.customURL("demandDeposit?expand=DEBITCARDS");
                }
                self.dropdownLabels.currentAccountType(self.currentAccountType());
                self.accountsLoaded("true");
              }
              for(i = 0; i < biller[0].specifications.length; i++){
                if(biller[0].specifications[i].label){
                  self.relationshipDetails.push({
                    compId: "billerLabel_"+i,
                    id: biller[0].specifications[i].id,
                    label:biller[0].specifications[i].label,
                    required: biller[0].specifications[i].required,
                    datatype: biller[0].specifications[i].datatype,
                    maxLength: biller[0].specifications[i].maxLength,
                    validator: getValidator(biller[0].specifications[i].datatype, biller[0].specifications[i].required, biller[0].specifications[i].maxLength),
                    value:ko.observable()
                  });
                }
              }
              if(biller[0].billerType === "PRESENTMENT" || biller[0].billerType === "PRESENTMENT_PAYMENT"){
                if(biller[0].sampleBill && biller[0].sampleBill.value !== null){
                  fetchSampleBill(biller[0].sampleBill.value);
                }
              }
            }
          }
        });

        self.additionalDetailsSubscribe = self.additionalDetails.subscribe(function(newValue){
          if(newValue){
            self.registerBillerDetails.autopayInstructions.debitAccount.displayValue(newValue.label);
          }else{
            self.registerBillerDetails.autopayInstructions.debitAccount.displayValue(null);
            self.registerBillerDetails.autopayInstructions.debitAccount.value(null);
          }
        });

        self.autopaySubscribe = self.registerBillerDetails.autopay.subscribe(function(){
          self.registerBillerDetails.autopayInstructions.debitAccount.displayValue(null);
          self.registerBillerDetails.autopayInstructions.debitAccount.value(null);
          self.registerBillerDetails.autopayInstructions.limitAmount.amount(null);
          self.registerBillerDetails.autopayInstructions.frequency(null);
          self.registerBillerDetails.autopayInstructions.startDate(null);
          self.autoPayLimit("billAmount");
        });

        self.autoPayLimitSubscribe = self.autoPayLimit.subscribe(function(){
          self.registerBillerDetails.autopayInstructions.limitAmount.amount(null);
        });

        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.categories();
        });

        self.save = function () {
          var i;
          var tracker = document.getElementById("tracker");
          if (tracker.valid === "valid") {
            RegisterBillerModel.fetchNicknames().done(function(response){

              for (i = 0; i < response.billerRegistrationDTOs.length; i++) {
                if(self.registerBillerDetails.billerNickName() === response.billerRegistrationDTOs[i].billerNickName){
                  var message = params.baseModel.format(self.resourceBundle.registerBillerError.validationErrors.uniqueNickname, {"nickname": self.registerBillerDetails.billerNickName()});
                  params.baseModel.showMessages(null, [message], "ERROR");
                  return;
                }
              }

              if(self.frequency() === "ONE_TIME"){
                self.registerBillerDetails.autopayInstructions.frequency(self.frequency());
              }
              self.registerBillerDetails.autopayInstructions.paymentType(self.currentAccountType());
              self.registerBillerDetails.relationshipDetails.removeAll();
              if(self.relationshipDetails().length > 0){
                for (i = 0; i < self.relationshipDetails().length; i++) {
                  if(self.relationshipDetails()[i].value()){
                    self.registerBillerDetails.relationshipDetails.push({
                      "value": self.relationshipDetails()[i].value(),
                      "labelId": self.relationshipDetails()[i].id
                    });
                  }
                }
              }
              self.currentStage("REVIEW");
            });
          } else {
            tracker.showMessages();
            tracker.focusOn("@firstInvalidShown");
          }
        };

        self.validateAmount = [{
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidAmountErrorMessage);
                    }
                    var numberfractional1 = value.toString().split(".");
                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.amountError);
                    }
                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.amountError);
                        }
                    }
                }
                return true;
            }
        }];

        self.viewBills= function() {

              params.dashboard.loadComponent("manage-accounts", {
                  applicationType: "billPayments",
                  defaultTab: "manage-bill-payments"
              });
        };

        self.paymentHistory= function() {

              params.dashboard.loadComponent("manage-accounts", {
                  applicationType: "billPayments",
                  defaultTab: "payment-history"
              });
        };

        self.accountTypeChanged = function(data){
          self.dropdownLabels.currentAccountType(data.detail.value);
          self.accountsLoaded("false");
          self.registerBillerDetails.autopayInstructions.debitAccount.displayValue(null);
          self.registerBillerDetails.autopayInstructions.debitAccount.value(null);
          if(data.detail.value === "CASA"){
            self.customURL("demandDeposit");
          }else if(data.detail.value === "CREDITCARD"){
            self.customURL("cards/credit?expand=ALL");
          }else if(data.detail.value === "DEBITCARD"){
            self.customURL("demandDeposit?expand=DEBITCARDS");
          }
          self.accountsLoaded("true");
        };

        self.creditCardParser = function (data) {
            var creditCardList = [];
            if(data.creditcards){
              data.creditcards.forEach(function (item) {
                if (item.cardStatus === "ACT")
                creditCardList.push(item);
              });
            }
            data.accounts = creditCardList;
            data.accounts.map(function (creditCard) {
                creditCard.id = creditCard.creditCard;
                creditCard.partyName = creditCard.ownerName;
                creditCard.partyId = data.associatedParty;
                creditCard.accountNickname = creditCard.cardNickname ? creditCard.cardNickname : "";
                creditCard.associatedParty = data.associatedParty;
                creditCard.currencyCode = creditCard.cardCurrency;
                return creditCard;
            });
            return data;
        };

        self.debitCardParser = function (data) {
            var debitCardList = [];
            if(data.accounts){
              data.accounts.forEach(function (account) {
                if(account.debitCards){
                  account.debitCards.forEach(function (item) {
                    if (item.cardStatus === "ISSUED")
                    debitCardList.push(item);
                  });
                }
              });
            }
            data.accounts = debitCardList;
            data.accounts.map(function (debitCard) {
                debitCard.id = debitCard.cardNo;
                debitCard.partyName = debitCard.cardHolderName;
                debitCard.accountNickname = debitCard.cardNickname ? debitCard.cardNickname : "";
                debitCard.associatedParty = data.partyId;
                return debitCard;
            });
            return data;
        };

        self.viewSampleBill = function(){
          $("#sampleBillWindow").trigger("openModal");
        };

        self.back = function () {
            history.back();
        };

    };
    vm.prototype.dispose = function () {
        self.dataLoaded.dispose();
        self.billerSubscribe.dispose();
        self.categorySubscribe.dispose();
        self.locationSubscribe.dispose();
        self.autopaySubscribe.dispose();
        self.autoPayLimitSubscribe.dispose();
        self.additionalDetailsSubscribe.dispose();
    };
    return vm;
});
