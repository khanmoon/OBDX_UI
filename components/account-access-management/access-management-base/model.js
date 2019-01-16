define([], function() {
  "use strict";
  var AccountAccessModel = function() {
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    var Model = function() {
      this.partyDetails = {
        partyIdObject: {
          value: "",
          displayValue: ""
        },
        partyId: null,
        userType: "",
        partyName: null,
        partyDetailsFetched: false,

        additionalDetails: ""
      };
    };
    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new AccountAccessModel();
});