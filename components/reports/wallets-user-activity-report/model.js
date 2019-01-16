define([

], function() {
  "use strict";
  var reportGenerationModel = function() {
    var Model = function() {
      this.reportParams = {
        emailId: null,
        mobileNo: null,
        startDate: null,
        endDate: null
      };
    };

    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      }

    };
  };
  return new reportGenerationModel();
});