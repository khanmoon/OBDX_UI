define([
    "knockout"
], function (ko) {
    "use strict";
    var vm = function (params) {
        var self = this,i;
        ko.utils.extend(self, params.rootModel);
        self.descriptionDisabled = ko.observable(true);
        self.stageIndex = params.index;
        self.pricePerUnitDisabled = self.filterValues.lcLinked() === "true" ? ko.observable(false) : ko.observable(true);
        if (self.mode() === "EDIT") {
            self.goodsCode(self.collectionDetails.shipmentDetails.goodsCode());
            if (self.collectionDetails.shipmentDetails.goodsCode() !== null) {
                self.descriptionDisabled(false);
            } else {
                self.descriptionDisabled(true);
            }
        }
        self.goodsCodeSubscribe = self.goodsCode.subscribe(function (newValue) {
            if (self.goodsTypeOptions()) {
                var selectedgoodsId = newValue;
                if (selectedgoodsId) {
                    self.descriptionDisabled(false);
                    self.collectionDetails.shipmentDetails.goodsCode(selectedgoodsId);
                    var goodsLabel = self.goodsTypeOptions().filter(function (data) {
                        return data.value === selectedgoodsId;
                    });
                    if (goodsLabel && goodsLabel.length > 0) {
                        self.collectionDetails.shipmentDetails.description(goodsLabel[0].description);
                    }
                } else {
                    self.descriptionDisabled(true);
                    self.collectionDetails.shipmentDetails.goodsCode(null);
                    self.collectionDetails.shipmentDetails.description(null);
                }
            }
        });
        self.goodsTypeHandler = function (data,event) {
          var selectedgoodsValue;
          if(event.detail && event.detail.value){
            //This will handle case of entity 14
            selectedgoodsValue = event.detail.value;
            self.descriptionDisabled(false);
            var selectedgoodsCodeArray = self.goodsTypeOptions().filter(function (data) {
                return data.value === selectedgoodsValue;
            });
            if (selectedgoodsCodeArray && selectedgoodsCodeArray.length > 0) {
              if(self.multiGoodsSupported()){
                self.goodsArray()[data].description(selectedgoodsCodeArray[0].description);
                self.goodsArray()[data].goodsCode(selectedgoodsValue);
              }
            }
          }else{
            self.descriptionDisabled(true);
            self.collectionDetails.shipmentDetails.goodsCode(null);
            self.collectionDetails.shipmentDetails.description(null);
          }
        };

        self.addGoods = function () {
          //Maximum 5 goods rows can be added
          if((self.goodsArray().length+1) <= 5){
            self.goodsArray.push({
                id: ko.observable(self.goodsArray().length+1),
                goodsCode: ko.observable(""),
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
                if (ko.utils.unwrapObservable(data[i].id) === value) {
                    return i;
                }
            }
            return -1;
        }

        self.remove = function (data) {
            var index = findIndexInData(self.goodsArray(), "id", ko.utils.unwrapObservable(data.id));
            self.goodsArray.splice(index, 1);
        };
        self.continueFunc = function () {
          var tracker = document.getElementById("billsValidationTracker");
          if (tracker.valid === "valid") {
            self.stages[self.stageIndex()].expanded(false);
            self.stages[self.stageIndex()].validated(true);
            if (self.filterValues.docAttached() === "true") {
                self.stages[self.stageIndex() + 1].expanded(true);
            } else {
                self.stages[self.stageIndex() + 2].expanded(true);
            }
          }else {
              self.stages[self.stageIndex()].validated(false);
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
    };
    vm.prototype.dispose = function () {
        this.goodsCodeSubscribe.dispose();
    };
    return vm;
});
