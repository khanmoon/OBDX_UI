define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/quick-payments",
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
], function(oj, ko, $, QuickRechargeModel, locale) {
    "use strict";
    var self,vm = function (params) {
      self = this;
      self.mode = ko.observable();
      var getNewKoModel = function () {
          var quickRechargeModel = ko.mapping.fromJS(QuickRechargeModel.getNewModel());
          return quickRechargeModel;
      };
      self.dropdownListLoaded = {
            categories: ko.observable(false)
      };
      self.dropdownLabels = {
            category: ko.observable(),
            location: ko.observable(),
            biller: ko.observable(),
            currentAccountType : ko.observable()
      };
      self.currenyConverter = ko.observable();
      var payLoad = { batchDetailRequestList: [] };
      self.categoryList = ko.observableArray();
      self.locationList = ko.observableArray();
      self.billerList = ko.observableArray();
      self.supportedAccounts = ko.observableArray();
      self.supportedAccountsLocale = ko.observableArray();
      self.relationshipDetails = ko.observableArray();
      self.accountsLoaded = ko.observable("false");
      self.additionalDetails = ko.observable("");
      self.currentAccountType = ko.observable();
      self.customURL = ko.observable();
      self.categoryId = ko.observable();
      self.locationId = ko.observable();
      self.categoryName = ko.observable();
      self.isLaterDateRequired = ko.observable(true);
      self.currentDate = ko.observable();
      self.currentDateLoaded = ko.observable(false);
      self.formattedTomorrow = ko.observable();
      self.billerValid = ko.observable();
      self.invalidTracker = ko.observable();
      self.tracker = ko.observable();
      self.expiryMonth = ko.observable("01");
      self.expiryYear = ko.observable();
      self.creditAccounts = ko.observable();
      self.viewLimitsFlag = ko.observable(false);
      self.loadAccessPointList = ko.observable(false);
      self.selectedChannelTypeName = ko.observable();
      self.selectedChannelType = ko.observable();
      self.selectedChannelIndex = ko.observable();
      self.selectedChannel = ko.observable(false);
      self.channelList = ko.observableArray();
      params.baseModel.registerComponent("register-biller", "bill-payments");
      params.baseModel.registerComponent("transfer-view-limits", "financial-limits");
      params.baseModel.registerComponent("payment-history", "bill-payments");

      if(params.baseModel.small()){
        self.showCategoryAvatars = ko.observable(true);
      }else{
        self.showCategoryAvatars = ko.observable(false);
      }

      var today_date = params.baseModel.getDate();
      var currentYear = today_date.getFullYear();

      self.monthEnumList = ko.observableArray([
          {
              "code": "01",
              "description": "01"
          },
          {
              "code": "02",
              "description": "02"
          },
          {
              "code": "03",
              "description": "03"
          },
          {
              "code": "04",
              "description": "04"
          },
          {
              "code": "05",
              "description": "05"
          },
          {
              "code": "06",
              "description": "06"
          },
          {
              "code": "07",
              "description": "07"
          },
          {
              "code": "08",
              "description": "08"
          },
          {
              "code": "09",
              "description": "09"
          },
          {
              "code": "10",
              "description": "10"
          },
          {
              "code": "11",
              "description": "11"
          },
          {
              "code": "12",
              "description": "12"
          }
      ]);
      self.yearEnumList = ko.observableArray([
          {
              "code": currentYear,
              "description": currentYear
          },
          {
              "code": currentYear + 1,
              "description": currentYear + 1
          },
          {
              "code": currentYear + 2,
              "description": currentYear + 2
          },
          {
              "code": currentYear + 3,
              "description": currentYear + 3
          },
          {
              "code": currentYear + 4,
              "description": currentYear + 4
          },
          {
              "code": currentYear + 5,
              "description": currentYear + 5
          },
          {
              "code": currentYear + 6,
              "description": currentYear + 6
          },
          {
              "code": currentYear + 7,
              "description": currentYear + 7
          },
          {
              "code": currentYear + 8,
              "description": currentYear + 8
          }, {
                "code": currentYear + 9,
                "description": currentYear + 9
            }
      ]);
      self.currentStage = ko.observable("CREATE");
      self.quickRechargeDetails = getNewKoModel().QuickRechargeDetails;

      self.planArray = ko.observableArray([
                      {value: "10",
              label: "Plan A"},
                      {value: "20",
              label: "Plan B"},
                      {value: "30",
              label: "Plan C"},
                      {value: "40",
              label: "Plan D"},
                      {value: "50",
              label: "Plan E"}
                    ]);

      self.rechargeFlag = ko.observable(false);

      ko.utils.extend(self, params.rootModel);
      self.resourceBundle = locale;
      params.dashboard.headerName(self.resourceBundle.heading.quickRecharge);
      params.baseModel.registerElement("account-input");
      params.baseModel.registerComponent("review-quick-recharge", "bill-payments");

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
         * This function populate category logos
         *
         * @function fetchLogos
         * @returns {void}
         */
        function fetchLogos(){
          QuickRechargeModel.fireBatch(payLoad).done(function (batchData) {
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
            QuickRechargeModel.fetchCategory().done(function (data) {
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

        /**
         * This function fetches the list of billers from the service
         *
         * @function fetchBillers
         * @returns {void}
         */
        function fetchBillers(){
          QuickRechargeModel.fetchBillers(self.categoryId(), self.locationId()).done(function (data) {
            var billers = data.billerDTOs;
            for (var i = 0; i < billers.length; i++) {
              if(billers[i].status === "ACTIVE" && billers[i].paymentOptions.quickRecharge === true){
                self.billerList.push({
                  label: billers[i].name,
                  value: billers[i].id,
                  billerType: billers[i].type,
                  currency: billers[i].currency,
                  sampleBill: billers[i].sampleBill,
                  paymentMethodsList: billers[i].paymentMethodsList,
                  specifications: billers[i].specifications
                });
              }
            }
            if(self.billerList().length === 0){
              params.baseModel.showMessages(null, [self.resourceBundle.messages.noBillersMapped], "ERROR");
            }
          });
        }

        self.fetchLocations = function(){
          QuickRechargeModel.fetchLocation(self.categoryId()).done(function (data) {
            if(data.operationalAreaDTOs.length > 0){
              populateLocationDropdown(data.operationalAreaDTOs);
              self.showCategoryAvatars(false);
            }else{
              params.baseModel.showMessages(null, [self.resourceBundle.registerBiller.messages.noBillersMapped], "ERROR");
            }
          });
        };

        self.setCategory = function(data){
          if(self.categoryId() !== data.id){
              self.categoryId(data.id);
          }else{
            self.showCategoryAvatars(false);
          }
        };

        self.editCategory = function(){
          self.showCategoryAvatars(true);
        };

        self.categorySubscribe = self.categoryId.subscribe(function(newValue){
          var category = self.categoryList().filter(function (data) {
              return data.id === newValue;
          });
          if (category && category.length > 0) {
              self.dropdownLabels.category(category[0].name);
          }
          self.quickRechargeDetails.category(self.dropdownLabels.category());
          self.quickRechargeDetails.categoryId(self.categoryId());
          self.locationList.removeAll();
          self.locationId(null);
          self.billerList.removeAll();
          self.quickRechargeDetails.billerId(null);
          self.fetchLocations();
        });

        self.locationSubscribe = self.locationId.subscribe(function(newValue){
          if(newValue !== null){
            var location = self.locationList().filter(function (data) {
              return data.value === newValue;
            });
            if (location && location.length > 0) {
              self.dropdownLabels.location(location[0].label);
            }
            self.quickRechargeDetails.location(self.dropdownLabels.location());
            self.billerList.removeAll();
            self.quickRechargeDetails.billerId(null);
            fetchBillers();
          }
        });

        self.billerSubscribe = self.quickRechargeDetails.billerId.subscribe(function (newValue) {
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
          self.quickRechargeDetails.billerId(biller[0].value);
          self.quickRechargeDetails.billAmount.currency(biller[0].currency);
          self.getBillerValues();
        }
       }
      });

      self.planIdSubscribe = self.quickRechargeDetails.planId.subscribe(function (newValue) {
        if (newValue) {
          var planId = newValue;
          self.rechargeFlag(true);
          for (var i = 0; i < self.planArray().length; i++) {
            if(self.planArray()[i].value === planId){
            self.quickRechargeDetails.planId(self.planArray()[i].value);
            self.quickRechargeDetails.billAmount.amount(self.planArray()[i].value);
            }
          }
        }else{
          self.quickRechargeDetails.billAmount.amount(null);
          self.rechargeFlag(false);
        }
      });

        self.getBillerValues = function(){
          QuickRechargeModel.fetchBillerDetails(self.quickRechargeDetails.billerId()).done(function(response){
            self.quickRechargeDetails.billerName(response.biller.name);
            self.supportedAccounts.removeAll();
            self.supportedAccountsLocale.removeAll();
            self.relationshipDetails.removeAll();
            var i, specsArray = [];
            for(i = 0; i < response.biller.paymentMethodsList.length; i++){
              self.supportedAccounts.push(response.biller.paymentMethodsList[i].paymentType);
              self.supportedAccountsLocale.push(self.resourceBundle.registerBiller.labels[response.biller.paymentMethodsList[i].paymentType]);
            }
              if(self.supportedAccounts().length > 0){
                if(self.supportedAccounts()[0] === "CASA" || self.supportedAccounts()[1] === "CASA" || self.supportedAccounts()[2] === "CASA")
                {
                  self.currentAccountType("CASA");
                }
                else {
                  self.currentAccountType(self.supportedAccounts()[0]);
                }
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

            for (i = 0; i < response.biller.specifications.length; i++) {
                specsArray[response.biller.specifications[i].id] = response.biller.specifications[i].label;
            }

            for(i = 0; i < response.biller.specifications.length; i++){
              if(response.biller.specifications[i].label){
                self.relationshipDetails.push({
                  compId: "billerLabel_"+i,
                  id: response.biller.specifications[i].id,
                  label:response.biller.specifications[i].label,
                  required: response.biller.specifications[i].required,
                  datatype: response.biller.specifications[i].datatype,
                  maxLength: response.biller.specifications[i].maxLength,
                  validator: getValidator(response.biller.specifications[i].datatype, response.biller.specifications[i].required, response.biller.specifications[i].maxLength),
                  value:ko.observable()
                });
              }
            }
          });
        };

        self.accountTypeChanged = function(data){
          self.dropdownLabels.currentAccountType(data.detail.value);
          self.accountsLoaded("false");
          self.quickRechargeDetails.debitAccount.displayValue(null);
          self.quickRechargeDetails.debitAccount.value(null);
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
            data.creditcards.forEach(function (item) {
              if (item.cardType === "PRIMARY" && item.cardStatus === "ACT")
                  creditCardList.push(item);
            });
            data.accounts = creditCardList;
            self.creditAccounts(creditCardList);
            data.accounts.map(function (creditCard) {
                creditCard.id = creditCard.creditCard;
                creditCard.partyName = creditCard.ownerName;
                creditCard.module = "CON";
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
                debitCard.associatedParty = debitCard.partyId.displayValue;
                return debitCard;
            });
            return data;
        };

        self.additionalDetailsSubscribe = self.additionalDetails.subscribe(function(newValue){
          if(newValue){
            self.quickRechargeDetails.debitAccount.displayValue(newValue.label);
            self.currenyConverter({"type": "number",
              "options": {
              "style":"currency",
              "currency":self.quickRechargeDetails.billAmount.currency(),
              "currencyDisplay":"symbol"
            }});
          }else{
            self.quickRechargeDetails.debitAccount.displayValue(null);
            self.currenyConverter(null);
          }
        });

        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.categories();
        });

        self.goBack = function(){
          history.back();
        };

        if (self.currentDate() === undefined) {
            self.currentDateLoaded(false);
                var today = params.baseModel.getDate();
                self.payNowDate=ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(params.baseModel.getDate())));
                self.currentDate(params.baseModel.formatDate(today));
                today.setDate(today.getDate() + 1);
                self.formattedTomorrow(today);
                self.currentDateLoaded(true);
        }

        self.validateAmount = [{
            validate: function (value) {
              if (value <= 0) {
                  throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidAmountErrorMessage);
              }
                if (value) {
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

        self.paymentTypeFunction = function(){

              if(self.supportedAccountsLocale().length === 1)
              {
                return self.supportedAccountsLocale();
              }
              else if(self.supportedAccountsLocale().length === 2)
              {
                return self.supportedAccountsLocale().join(" and ");
              }
              else if(self.supportedAccountsLocale().length > 2)
              {
                return self.supportedAccountsLocale().join(", ").replace(/, ([^,]*)$/, " and $1");
              }
          };

        self.paymentHistory= function() {
              params.dashboard.loadComponent("manage-accounts", {
                  applicationType: "billPayments",
                  defaultTab: "payment-history"
              });
        };
        QuickRechargeModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);
            self.loadAccessPointList(true);
        });
        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };
        self.viewLimits = function () {
          $("#viewlimits-bill-payment" + self.incrementId).trigger("openModal");
          self.viewLimitsFlag(true);
        };
        self.closeLimitsModal = function () {
          $("#viewlimits-bill-payment" + self.incrementId).trigger("closeModal");
        };
        self.channelPopup = function() {
        var popup1 = document.querySelector("#channel-popup");

        if (popup1.isOpen()) {
            popup1.close();
        } else {
            popup1.open("channel-disclaimer");
        }
        };
        self.submit = function(){

          if(self.currentAccountType() === "CREDITCARD")
          {
            var date = params.baseModel.getDate();
            date.setMonth(self.expiryMonth()-1);
            date.setYear(self.expiryYear());
            var y = date.getFullYear();
            var m = date.getMonth();
            var lastDay = new Date(y, m + 1, 0);
            self.quickRechargeDetails.cardExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(lastDay)));
          }

          if(self.quickRechargeDetails.isPayLater() === "false")
          {
            self.quickRechargeDetails.paymentDate(self.payNowDate());
          }

          if(self.quickRechargeDetails.isPayLater() === "true")
          {
            if(self.quickRechargeDetails.paymentDate()){
              self.quickRechargeDetails.paymentDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.quickRechargeDetails.paymentDate())));
            }
          }
          self.quickRechargeDetails.billPaymentRelDetails.removeAll();
            if(self.relationshipDetails().length > 0){
              for (var i = 0; i < self.relationshipDetails().length; i++) {
                self.quickRechargeDetails.billPaymentRelDetails.push({
                labelId: self.relationshipDetails()[i].id,
                value: self.relationshipDetails()[i].value()
              });
              }
           }
           self.quickRechargeDetails.billerType("QUICK_RECHARGE");
           self.quickRechargeDetails.paymentType(self.currentAccountType());
           var tracker = document.getElementById("tracker");
           if (tracker.valid === "valid") {

               self.currentStage("REVIEW");
          }
          else {
             tracker.showMessages();
             tracker.focusOn("@firstInvalidShown");
         }
      };
    };
      vm.prototype.dispose = function () {
          self.dataLoaded.dispose();
          self.categorySubscribe.dispose();
          self.locationSubscribe.dispose();
          self.billerSubscribe.dispose();
          self.additionalDetailsSubscribe.dispose();
          self.planIdSubscribe.dispose();
        };
    return vm;
  });
