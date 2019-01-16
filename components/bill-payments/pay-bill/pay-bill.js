define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/register-biller",
    "text!./pay-bill.json",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout",
    "ojs/ojlabel",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, PayBillModel, locale, PayBillJSON) {
    "use strict";
    var self,vm = function (params) {
        self = this;
        self.dropdownLabels = {
          currentAccountType: ko.observable()
        };
        var getNewKoModel = function () {
            var billerPaymentDetails = ko.mapping.fromJS(PayBillModel.getNewModel());
            return billerPaymentDetails;
        };
        self.supportedAccounts = ko.observableArray();
        self.supportedAccountsLocale = ko.observableArray();
        self.currentAccountType = ko.observable();
        self.customURL = ko.observable();
        self.accountsLoaded = ko.observable("false");
        self.additionalDetails = ko.observable("");
        self.currentDate = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.currentDateLoaded = ko.observable(false);
        self.isLaterDateRequired = ko.observable(true);
        self.currenyConverter = ko.observable();
        self.relationshipDetails = ko.observableArray();
        self.excessPayment = ko.observable();
        self.partPayment = ko.observable();
        self.dueDate = ko.observable();
        self.groupValid = ko.observable();
        self.invalidTracker = ko.observable();
        self.tracker = ko.observable();
        self.expiryMonth = ko.observable("01");
        self.expiryYear = ko.observable();
        self.frequencyList = ko.observableArray();
        self.mode = ko.observable("CREATE");
        self.presentmentPayment=ko.observable(false);
        params.baseModel.registerComponent("modify-biller", "bill-payments");
        params.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        var payBillJSON = JSON.parse(PayBillJSON);
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.creditAccounts = ko.observable();
        self.billerDetails=self.params.registerBillerDetails;
        params.dashboard.headerName(self.resourceBundle.heading.payBills);
        if (self.params.mode) {
            self.mode(self.params.mode);
        }

        self.getBillerValues = function(){
          PayBillModel.fetchBillerDetails(self.billerDetails.billerId).done(function(response){
            self.billerPaymentDetails.billerName(response.biller.name);
            self.billerPaymentDetails.billerId(response.biller.id);
            self.excessPayment(response.biller.paymentOptions.excessPayment);
            self.partPayment(response.biller.paymentOptions.partPayment);
            self.supportedAccounts.removeAll();
            self.supportedAccountsLocale.removeAll();
            if(self.billerDetails.billerType === "RECHARGE"){
              self.billerPaymentDetails.billAmount.currency(self.billerDetails.autopayInstructions.limitAmount.currency);
              self.currenyConverter({"type": "number",
                "options": {
                "style":"currency",
                "currency":self.billerDetails.autopayInstructions.limitAmount.currency,
                "currencyDisplay":"symbol"
              }});
            }
            self.relationshipDetails.removeAll();
            var i, specsArray = [];
            for(i = 0; i < response.biller.paymentMethodsList.length; i++){
              self.supportedAccounts.push(response.biller.paymentMethodsList[i].paymentType);
              self.supportedAccountsLocale.push(self.resourceBundle.labels[response.biller.paymentMethodsList[i].paymentType]);
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

            for (i = 0; i < self.billerDetails.relationshipDetails.length; i++) {
              self.relationshipDetails.push({
                label: specsArray[self.billerDetails.relationshipDetails[i].labelId],
                value: self.billerDetails.relationshipDetails[i].value
              });
            }
          });
        };

        if(self.mode()==="EDIT") {
            self.billerPaymentDetails = self.params.billerPaymentDetails;
            self.billerDetails = self.params.billerDetails;
        }else{
            //for CREATE mode
            self.billerPaymentDetails = getNewKoModel().BillerPaymentDetails;
            self.getBillerValues();
            self.billerPaymentDetails.isPayLater("false");
            self.billerPaymentDetails.isRecurring("false");
            if(self.billerDetails.billerType === "PRESENTMENT_PAYMENT")
            {
              if(self.billerDetails.ebill)
              {
                self.presentmentPayment(true);
              }
              else {
                self.presentmentPayment(false);
              }
            }
              if(self.billerDetails.isSchedule)
            {
              self.schedulePayFlag = ko.observable(self.billerDetails.isSchedule);
            }
            else if(self.billerDetails.autopay === false)
              {
                self.schedulePayFlag=ko.observable(false);
              }
              else {
                self.schedulePayFlag=ko.observable(true);
              }
        }
        self.billerPaymentDetails.billerRegistrationId(self.billerDetails.id);
        self.billerPaymentDetails.customerName(self.billerDetails.customerName);
        self.billerPaymentDetails.billerRegistration.billerNickName(self.billerDetails.billerNickName);
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

        if(self.billerDetails.ebill)
        {
          self.dueDate(self.billerDetails.ebill.dueDate);
          self.billerPaymentDetails.billId(self.billerDetails.ebill.id);
          if(self.billerDetails.ebill.status === "PARTIALPAID")
          {
            self.billerPaymentDetails.billAmount.amount(self.billerDetails.ebill.totalAmount.amount-self.billerDetails.ebill.amountPaid.amount);
          }
          else{
            self.billerPaymentDetails.billAmount.amount(self.billerDetails.ebill.totalAmount.amount);
          }
        }
        for (var i = 0; i < payBillJSON.frequencyList.length; i++) {
          self.frequencyList.push({
            label: self.resourceBundle.labels[payBillJSON.frequencyList[i]],
            value: payBillJSON.frequencyList[i]
          });
        }

        params.baseModel.registerComponent("review-bill-payment", "bill-payments");

        PayBillModel.fetchLocationDetails(self.billerDetails.location.id).done(function(response){
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
            self.billerPaymentDetails.location(location);
          });

          self.accountTypeChanged = function(data){
            self.dropdownLabels.currentAccountType(data.detail.value);
            self.accountsLoaded("false");
            self.billerPaymentDetails.debitAccount.displayValue(null);
            self.billerPaymentDetails.debitAccount.value(null);
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
              if(newValue.account){
                self.billerPaymentDetails.debitAccount.displayValue(newValue.account.label);
                if(self.billerDetails.billerType !== "RECHARGE"){
                  self.billerPaymentDetails.billAmount.currency(newValue.account.currencyCode);
                  self.currenyConverter({"type": "number",
                    "options": {
                    "style":"currency",
                    "currency":newValue.account.currencyCode,
                    "currencyDisplay":"symbol"
                  }});
                }
              }
              else {
                self.billerPaymentDetails.debitAccount.displayValue(newValue.label);
                if(self.billerDetails.billerType !== "RECHARGE"){
                  self.billerPaymentDetails.billAmount.currency(newValue.currencyCode);
                  self.currenyConverter({"type": "number",
                    "options": {
                    "style":"currency",
                    "currency":newValue.currencyCode,
                    "currencyDisplay":"symbol"
                  }});
                }}
            }
          else{
              self.billerPaymentDetails.debitAccount.displayValue(null);
              self.billerPaymentDetails.billAmount.currency(null);
              self.currenyConverter(null);
            }
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
          self.submit = function(){

            if(self.currentAccountType() === "CREDITCARD")
            {
              var date = params.baseModel.getDate();
              date.setMonth(self.expiryMonth()-1);
              date.setYear(self.expiryYear());
              var y = date.getFullYear();
              var m = date.getMonth();
              var lastDay = new Date(y, m + 1, 0);
              self.billerPaymentDetails.cardExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(lastDay)));
            }

            if(self.billerPaymentDetails.isPayLater() === "false")
            {
              self.billerPaymentDetails.paymentDate(self.payNowDate());
            }

            if(self.billerPaymentDetails.isPayLater() === "true")
            {
              if(self.billerPaymentDetails.paymentDate())
              {
                self.billerPaymentDetails.paymentDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.billerPaymentDetails.paymentDate())));
              }
              if(self.billerPaymentDetails.billerRegistration.autopayInstructions.endDate())
              {
                self.billerPaymentDetails.billerRegistration.autopayInstructions.endDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.billerPaymentDetails.billerRegistration.autopayInstructions.endDate())));
              }

            }
            self.billerPaymentDetails.billPaymentRelDetails.removeAll();
           if(self.relationshipDetails().length > 0)
             {
                for (i = 0; i < self.billerDetails.relationshipDetails.length; i++) {
                  self.billerPaymentDetails.billPaymentRelDetails.push({
                  labelId: self.billerDetails.relationshipDetails[i].labelId,
                  value: self.billerDetails.relationshipDetails[i].value
                });
                }
             }

             self.billerPaymentDetails.paymentType(self.currentAccountType());
             self.billerPaymentDetails.billerType(self.billerDetails.billerType);


            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid") {
              var parameters = {
                  mode: "REVIEW",
                  billerPaymentDetails: ko.mapping.toJS(self.billerPaymentDetails)
              };
              params.dashboard.loadComponent("review-bill-payment", parameters, self);
            }
            else {
               tracker.showMessages();
               tracker.focusOn("@firstInvalidShown");
           }
        };
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

                      if(self.billerDetails.ebill)
                      {
                        if(self.partPayment() ===true && self.excessPayment() ===false)
                        {
                          if(value > self.billerDetails.ebill.totalAmount.amount)
                          throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidpartPaymentErrorMessage);
                        }

                        if(self.excessPayment() ===true && self.partPayment() ===false)
                        {
                          if(value < self.billerDetails.ebill.totalAmount.amount)
                          throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidexcessPaymentErrorMessage);
                        }
                      }

                  }
                  return true;
            }
          }];

          self.setAutoPay= function() {
                params.dashboard.loadComponent("manage-accounts", {
                    applicationType: "billPayments",
                    defaultTab: "modify-biller"
                });
          };

          self.viewLimitsFlag = ko.observable(false);
          self.loadAccessPointList = ko.observable(false);
          self.selectedChannelTypeName = ko.observable();
          self.selectedChannelType = ko.observable();
          self.selectedChannelIndex = ko.observable();
          self.selectedChannel = ko.observable(false);
          self.channelList = ko.observableArray();
          PayBillModel.listAccessPoint().done(function(data) {
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

          self.planIdSubscribe = self.billerPaymentDetails.planId.subscribe(function (newValue) {
            if (newValue) {
              var planId = newValue;
              self.rechargeFlag(true);
              for (var i = 0; i < self.planArray().length; i++) {
                if(self.planArray()[i].value === planId){
                self.billerPaymentDetails.planId(self.planArray()[i].value);
                self.billerPaymentDetails.billAmount.amount(self.planArray()[i].value);
                }
              }
            }else{
              self.billerPaymentDetails.billAmount.amount(null);
              self.rechargeFlag(false);
            }
          });
    };
    return vm;
});
