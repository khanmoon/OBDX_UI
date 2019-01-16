define([
    "ojs/ojcore",
    "knockout",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset",
    "ojs/ojlistview",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function (oj, ko) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.stageIndex = params.index;
        self.datasourceForContracts(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.contractsList, { idAttribute: "condition" })));
        self.allContractsSelected = ko.observable(["false"]);
        self.continueFunc = function () {
            var contractSelected = 0;
            for (var i = 0; i < self.contractsList().length; i++) {
                if(self.contractsList()[i].contractSelected()[0] === "true"){
                  contractSelected++;
                }
            }
            var contractsTracker = document.getElementById("contractsTracker");
            if (contractsTracker.valid === "valid") {
              self.stages[self.stageIndex()].expanded(false);
              self.stages[self.stageIndex()].validated(true);
              self.stages[self.stageIndex() + 1].expanded(true);
            }else {
                self.stages[self.stageIndex()].validated(false);
                contractsTracker.showMessages();
                contractsTracker.focusOn("@firstInvalidShown");
            }
            if(contractSelected === 0){
              self.stages[self.stageIndex()].validated(false);
              params.baseModel.showMessages(null, [self.resourceBundle.contractsDetails.errors.selectAdvicesError], "ERROR");

            }
        };
        self.selectAllContractsListener = function(event){
          var allContractsSelected = "false";
          if(event.detail.value.length > 0 && event.detail.value[0] === "true"){
            allContractsSelected = "true";
          }
          for (var i = 0; i < self.contractsList().length; i++) {
              self.contractsList()[i].contractSelected([allContractsSelected]);
          }
        };
    };
});
