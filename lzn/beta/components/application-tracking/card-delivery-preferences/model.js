define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Balance Transfer for Credit Card product.
   */
  return function CardDeliveryPreferencesModel() {
    /**
     *Model for balance transfer object.
     */
    var Model = function(modelData) {
        var initializeProperty = function(modelData, prop, subProp) {
          if (!subProp) {
            return (modelData && modelData[prop]) ? modelData[prop] : "";
          }
            return (modelData && modelData[prop] && modelData[prop][subProp]) ? modelData[prop][subProp] : "";

        };
        this.cardDeliveryPreferences = {
          cardDeliveryMode: initializeProperty(modelData, "cardDeliveryMode"),
          cardDeliveryBranch: initializeProperty(modelData, "cardDeliveryBranch"),
          cardDeliveryAddress: {
            country: initializeProperty(modelData, "cardDeliveryAddress", "country"),
            state: initializeProperty(modelData, "cardDeliveryAddress", "state"),
            city: initializeProperty(modelData, "cardDeliveryAddress", "city"),
            postalCode: initializeProperty(modelData, "cardDeliveryAddress", "postalCode"),
            line1: initializeProperty(modelData, "cardDeliveryAddress", "line1"),
            line2: initializeProperty(modelData, "cardDeliveryAddress", "line2")
          },
          pinDeliveryMode: initializeProperty(modelData, "pinDeliveryMode"),
          pinDeliveryBranch: initializeProperty(modelData, "pinDeliveryMode"),
          pinDeliveryAddress: {
            country: initializeProperty(modelData, "pinDeliveryAddress", "country"),
            state: initializeProperty(modelData, "pinDeliveryAddress", "state"),
            city: initializeProperty(modelData, "pinDeliveryAddress", "city"),
            postalCode: initializeProperty(modelData, "pinDeliveryAddress", "postalCode"),
            line1: initializeProperty(modelData, "pinDeliveryAddress", "line1"),
            line2: initializeProperty(modelData, "pinDeliveryAddress", "line2")
          },
          statementDeliveryMode: initializeProperty(modelData, "statementDeliveryMode"),
          selectedValues: {
            cardDeliveryAddress: {},
            pinDeliveryAddress: {},
            statementDeliveryAddress: {}
          }
        };
      },
      baseService = BaseService.getInstance(),

      /**
       *Method to update balance details transfer for the credit card product.
       */
      updateCardDeliveryPreferencesDeferred,
      updateCardDeliveryPreferences = function(submissionId, applicationId, payload, deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/deliveryPreferences",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      },
      /**
       *Method to fetch balance transfer details for the credit card product.
       */
      fetchCardDeliveryPreferencesDeferred,
      fetchCardDeliveryPreferences = function(submissionId, applicationId, deferred) {
        var params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/deliveryPreferences",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      fetchAddressesDeferred,
      fetchAddresses = function(applicantId, deferred) {
        var params = {
          "applicantId": applicantId
        };
        var options = {
          showMessage: false,
          url: "parties/{applicantId}/addresses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchStatesDeferred,
      /**
       *Method to fetch states.
       */
      fetchStates = function(country, deferred) {
        var params = {
          "countryCode": country
        };
        var options = {
          url: "enumerations/country/{countryCode}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchBranchesDeferred,
      fetchBranches = function(submissionId, deferred) {
        var params = {
          submissionId: submissionId
        };
        var options = {
          url: "locations/branches",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      updateCardDeliveryPreferences: function(submissionId, applicationId, payload) {
        updateCardDeliveryPreferencesDeferred = $.Deferred();
        updateCardDeliveryPreferences(submissionId, applicationId, payload, updateCardDeliveryPreferencesDeferred);
        return updateCardDeliveryPreferencesDeferred;
      },
      fetchAddresses: function(applicantId) {
        fetchAddressesDeferred = $.Deferred();
        fetchAddresses(applicantId, fetchAddressesDeferred);
        return fetchAddressesDeferred;
      },
      fetchBranches: function(country) {
        fetchBranchesDeferred = $.Deferred();
        fetchBranches(country, fetchBranchesDeferred);
        return fetchBranchesDeferred;
      },
      fetchStates: function(country) {
        fetchStatesDeferred = $.Deferred();
        fetchStates(country, fetchStatesDeferred);
        return fetchStatesDeferred;
      },
      fetchCardDeliveryPreferences: function(submissionId, applicationId) {
        fetchCardDeliveryPreferencesDeferred = $.Deferred();
        fetchCardDeliveryPreferences(submissionId, applicationId, fetchCardDeliveryPreferencesDeferred);
        return fetchCardDeliveryPreferencesDeferred;
      }
    };
  };
});