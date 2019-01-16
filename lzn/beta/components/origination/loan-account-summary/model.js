define([

], function() {
  "use strict";
  return function FundingTableModel() {
    var Model = function() {
        this.loanAccountSummary = {
          stageDetails: [{
            stageCode: "",
            stageName: "",
            frequencies: "",
            installmentAmount: {
              currency: "",
              amount: 0
            },
            rateType: "",
            tenure: {
              months: 0,
              years: 0
            }
          }, {
            stageCode: "",
            stageName: "",
            frequencies: "",
            installmentAmount: {
              currency: "",
              amount: 0
            },
            rateType: "",
            tenure: {
              months: 0,
              years: 0
            }
          }, {
            stageCode: "",
            stageName: "",
            frequencies: "",
            installmentAmount: {
              currency: "",
              amount: 0
            },
            rateType: "",
            tenure: {
              months: 0,
              years: 0
            }
          }, {
            stageCode: "",
            stageName: "",
            frequencies: "",
            installmentAmount: {
              currency: "",
              amount: 0
            },
            rateType: "",
            tenure: {
              months: 0,
              years: 0
            }
          }]
        };
      },
      modelInitialized = false;

    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/

    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      }
    };
  };
});