define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for CollateralModel section
   *
   * @returns {void}
   */
  var CollateralModel = function() {

    var baseService = BaseService.getInstance();

    /**
     * In case more than one instance of model is required, we are declaring model
     * as a function, of which new instances can be created and used when required.
     *
     * @class Model
     * @private
     * @memberOf SecurityCode~SecurityCodeModel
     */
    var Model = function() {
      this.available = true;
      this.collateralType = "AUTOMOBILE";
      this.collateralCategoryType = "";
      this.ownershipType = "SINGLE";
      this.vehicleModel = "";

      this.vehicleMake = "";
      this.vehicleYear = "";
      this.address = {
        country: "",
        state: "",
        city: "",
        zipCode: "",
        line1: "",
        line2: ""
      };
      this.ownerEstimatedValue = {
        amount: 0,
        currency: ""
      };
      this.ownership = [{
        applicantSerialNumber: "1",
        percentage: "100"
      }];
    };
    this.getNewModel = function() {
      return new Model();
    };
    this.fetchCollateralType = function(successHandler) {
      var options = {
        url: "enumerations/salutation?for=primary",
        success: function(data) {
          successHandler(data);
        }
      };
      baseService.fetch(options);
    };
    this.fetchCollateralCategory = function(successHandler, deferredObject) {
      var options = {
        url: "enumerations/collateralCategory?type=AUTOMOBILE",
        success: function(data) {
          successHandler(data, deferredObject);
        }
      };
      baseService.fetch(options);
    };
    this.fetchVehicleMake = function(collateralType, successHandler, deferredObject) {
      var options = {
        url: "enumerations/vehicleMake",
        success: function(data) {
          successHandler(data, deferredObject);
        }
      };
      baseService.fetch(options);
    };
    this.synchronizeRequests = function(syncVal) {
      baseService.setAsync(!syncVal);
    };
    this.createCollateral = function(submissionId, applicantId, sendData, successHandler) {
      var params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/collateral",
          data: "",
          success: function(data) {
            successHandler(data);
          }
        };
      options.data = JSON.stringify(sendData);
      baseService.add(options, params);
    };
    this.fetchCollateralInfo = function(submissionId, applicantId, successHandler, deferredObject) {
      var params = {
          submissionId: submissionId,
          applicantId: applicantId
        },
        options = {
          url: "submissions/{submissionId}/applicants/{applicantId}/collateral",
          success: function(data) {
            successHandler(data, deferredObject);
          }
        };
      baseService.fetch(options, params);
    };
  };

  return new CollateralModel();
});
