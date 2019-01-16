define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/dummy-merchant",
    "framework/js/constants/constants",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.dummyMerchant = ResourceBundle.dummyMerchant;
        self.merchantCode = ko.observable("534");
        self.successStaticFlag = ko.observable("yes");
        self.failureStaticFlag = ko.observable("yes");
        self.merchantAccountNumber = ko.observable();
        self.merchantRefNumber = ko.observable("ref123");
        self.transactionAmt = ko.observable("10");
        self.serviceCharges = ko.observable("0");
        self.checksumValue = ko.observable(0);
        self.txnCurrency = ko.observable("GBP");
        self.adInfoName1 = ko.observable();
        self.adInfoValue1 = ko.observable();
        self.adInfoName2 = ko.observable();
        self.adInfoValue2 = ko.observable();
        self.adInfoName3 = ko.observable();
        self.adInfoValue3 = ko.observable();
        self.nameList = ko.observable({
            adInfoName1: ko.observable("DEBAJO1"),
            adInfoName2: ko.observable("DEBAJO2"),
            adInfoName3: ko.observable("DEBAJO3")
        });
        self.valueList = ko.observable({
            adInfoValue1: ko.observable("VALUEONE"),
            adInfoValue2: ko.observable("VALUETWO"),
            adInfoValue3: ko.observable("VALUETHREE")
        });
        rootParams.baseModel.registerElement("page-section");
        self.isLoaded = ko.observable(false);
        self.submitMerchantData = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("dummyMerchantTracker")))
                return;
            self.nameList = ko.observable({
                adInfoName1: ko.observable(self.adInfoName1()),
                adInfoName2: ko.observable(self.adInfoName2()),
                adInfoName3: ko.observable(self.adInfoName3())
            });
            self.valueList = ko.observable({
                adInfoValue1: ko.observable(self.adInfoValue1()),
                adInfoValue2: ko.observable(self.adInfoValue2()),
                adInfoValue3: ko.observable(self.adInfoValue3())
            });

            var request = "";

            function append(key, value) {
                request += ("&" + key + "=" + value);
            }
            append("merchantCode", self.merchantCode());
            append("failureStaticFlag", self.failureStaticFlag());
            if (self.merchantAccountNumber()) {
                append("userAccountNumber", self.merchantAccountNumber());
            }
            append("successStaticFlag", self.successStaticFlag());
            append("transactionAmt", self.transactionAmt());
            append("merchantRefNumber", self.merchantRefNumber());
            append("serviceCharges", self.serviceCharges());
            append("checksumValue", self.checksumValue());
            append("txnCurrency", self.txnCurrency());
            var nameListKeys = Object.keys(self.nameList());
            var valueListKeys = Object.keys(self.valueList());
            for (var i = 0; i < nameListKeys.length; i++) {
                if (self.nameList()[nameListKeys[i]]()) {
                    append("nameList", self.nameList()[nameListKeys[i]]());
                }
            }
            for (var j = 0; j < valueListKeys.length; j++) {
                if (self.valueList()[valueListKeys[j]]()) {
                    append("valueList", self.valueList()[valueListKeys[j]]());
                }
            }
            var http = new XMLHttpRequest();
            var url = Constants.appBaseURL + "/" + Constants.appDefaultVersion + "/payments/transfers/merchantTransferData";
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.setRequestHeader("X-Target-Unit", Constants.currentEntity);
            http.onreadystatechange = function() {
            if (http.status === 200) {
              if (http.responseURL !== url) {
                  window.location = http.responseURL;
                    }
                }
            };
            http.send(request.substring(1));
        };
    };
});