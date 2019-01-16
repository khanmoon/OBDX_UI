define([
    "ojs/ojcore",
    "knockout"
], function (oj,ko) {
    "use strict";
    var self, vm = function (params) {
        self = this;
        var i;
        ko.utils.extend(self, params.rootModel);
        self.stageIndex = params.index;
        self.goodsDescription = ko.observable();
        if (self.mode() === "EDIT") {
            if (self.letterOfCreditDetails.shipmentDetails.goodsCode() !== null) {
                self.goodsDescription(self.letterOfCreditDetails.shipmentDetails.goodsCode());
            }
            if (self.letterOfCreditDetails.shipmentDetails.date() && self.letterOfCreditDetails.shipmentDetails.date() !== null) {
                self.shipmentDatePeriodRadioSetValue("latestdateofShipment");
            } else if (self.letterOfCreditDetails.shipmentDetails.period() && self.letterOfCreditDetails.shipmentDetails.period() !== null) {
                self.shipmentDatePeriodRadioSetValue("latestperiodofShipment");
            }
        }
        self.continueFunc = function () {
          var tracker = document.getElementById("shipmentTracker");
          if (tracker.valid === "valid") {
            self.stages[self.stageIndex()].expanded(false);
            self.stages[self.stageIndex()].validated(true);
            self.stages[self.stageIndex() + 1].expanded(true);
          }else {
              self.stages[self.stageIndex()].validated(false);
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };

        self.addGoods = function () {
          //Maximum 5 goods rows can be added
          if((self.goodsArray().length+1) <= 5){
            self.goodsArray.push({
                id: ko.observable(self.goodsArray().length+1),
                code: ko.observable(""),
                description: ko.observable(""),
                units: ko.observable(""),
                pricePerUnit: ko.observable("")
              });
          }else{
              params.baseModel.showMessages(null, [self.resourceBundle.shipmentDetails.labels.maxGoodLimit], "ERROR");
          }

        };

        function findIndexInData(data, property, value) {
            for (i = 0; i < data.length; i++) {
                if (data[i].id() === value) {
                    return i;
                }
            }
            return -1;
        }

        self.remove = function (data) {
            var index = findIndexInData(self.goodsArray(), "id", data.id());
            self.goodsArray.splice(index, 1);
        };

        self.validateGoodsAmount = {
            validate: function (value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.invalidAmountErrorMessage);
                    }
                    var numberfractional1 = value.toString().split(".");
                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                    }
                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.tradeFinanceErrors.lcDetails.lcAmountError);
                        }
                    }
                  }
                return true;
              }
        };

        self.goodsTypeHandler = function (data,event) {
          var selectedgoodsValue;
          if(event.detail && event.detail.value){
            //This will handle case of entity 14
            selectedgoodsValue = event.detail.value;
          }else if(data.detail && data.detail.value){
            //This will handle case of entity 12.0
            selectedgoodsValue = data.detail.value;
          }
          var selectedgoodsCodeArray = self.goodsTypeOptions().filter(function (data) {
              return data.value === selectedgoodsValue;
          });
          if(self.multiGoodsSupported()){
            self.goodsArray()[data].description(selectedgoodsCodeArray[0].description);
            self.goodsArray()[data].code(selectedgoodsValue);
          }else if (self.letterOfCreditDetails.shipmentDetails.goodsCode() !== selectedgoodsCodeArray[0].value) {
                self.letterOfCreditDetails.shipmentDetails.goodsCode(selectedgoodsCodeArray[0].value);
                self.letterOfCreditDetails.shipmentDetails.description(selectedgoodsCodeArray[0].description);
            }
        };

        self.shipmentRasioBtnSubscribe = self.shipmentDatePeriodRadioSetValue.subscribe(function (newValue) {
            if (newValue === "latestdateofShipment") {
                self.letterOfCreditDetails.shipmentDetails.period(null);
            } else if (newValue === "latestperiodofShipment") {
                self.letterOfCreditDetails.shipmentDetails.date(null);
            }
        });
    };
    vm.prototype.dispose = function () {
        this.shipmentRasioBtnSubscribe.dispose();
    };
    return vm;
});
