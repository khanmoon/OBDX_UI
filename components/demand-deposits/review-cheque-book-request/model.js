define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewChequeBookRequestModel = function() {
    var params, baseService = BaseService.getInstance();
    /**
     * Method to fetch address based on address Type  information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var Model = function() {
        this.addressDetails = {
          modeofDelivery: null,
          addressType: null,
          addressTypeDescription: null,
          postalAddress: {
            line1: "",
            line2: "",
            line3: "",
            line4: "",
            line5: "",
            line6: "",
            line7: "",
            line8: "",
            line9: "",
            line10: "",
            line11: "",
            line12: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
            branch: "",
            branchName: ""
          }
        };
      },
      fetchCourierAddressDeferred, fetchCourierAddress = function(addressType, deferred) {
        var options = {
          url: "parties/me/addresses?type=" + addressType,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchAddressDeferred, fetchAddress = function(branchCode, deferred) {
      params = {
        "branchCode": branchCode
      };
      var options = {
        url: "locations/branches?branchCode={branchCode}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };
    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchCourierAddress: function(addressType) {
        fetchCourierAddressDeferred = $.Deferred();
        fetchCourierAddress(addressType, fetchCourierAddressDeferred);
        return fetchCourierAddressDeferred;
      },
      fetchAddress: function(branchCode) {
        fetchAddressDeferred = $.Deferred();
        fetchAddress(branchCode, fetchAddressDeferred);
        return fetchAddressDeferred;
      }
    };
  };
  return new reviewChequeBookRequestModel();
});