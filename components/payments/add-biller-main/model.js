define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var newBillerModel = function() {
    var Model = function() {
        this.addBillerModel = {
          registrationDate: null,
          nickName: "",
          relationshipNumber: null,
          billerId: null,
          consumerNumber: null,
          categoryType: null,
          accountRelationshipNumber: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getCategoriesDeferred, getCategories = function(deferred) {
        var options = {
          url: "payments/billers?categoryType=ALL",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerNamesDeferred, getBillerNames = function(category, deferred) {
        var options = {
          url: "payments/billers?categoryType=" + category,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerDetailsDeferred, getBillerDetails = function(billerId, relationshipNumber, deferred) {
        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getHostDateDeferred, getHostDate = function(deferred) {
        var options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      deleteBillerDeferred, deleteBiller = function(billerId, relationshipNumber, deferred) {

        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.remove(options);
      },
      addNewBillerDeferred, addNewBiller = function(model, deferred) {

        var options = {
          url: "payments/registeredBillers",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      confirmNewBillerDeferred, confirmNewBiller = function(transactionId, trnsactionVersionId, billerId, relationshipNumber, deferred) {

        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        if (transactionId) {
          options.headers = {};
          options.headers.TRANSACTION_REFERENCE_NO = transactionId + "#" + trnsactionVersionId;
        }
        baseService.patch(options);
      },
      confirmBillerWithAuthDeferred, confirmBillerWithAuth = function(billerId, relationshipNumber, authKey, deferred) {

        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber + "/authentication",
          headers: {
            "TOKEN_ID": authKey
          },
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      /**
       * Method to initialize the described model
       */
      init: function() {
        modelInitialized = true;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCategories: function() {
        objectInitializedCheck();
        getCategoriesDeferred = $.Deferred();
        getCategories(getCategoriesDeferred);
        return getCategoriesDeferred;
      },
      getBillerNames: function(category) {
        objectInitializedCheck();
        getBillerNamesDeferred = $.Deferred();
        getBillerNames(category, getBillerNamesDeferred);
        return getBillerNamesDeferred;
      },
      addNewBiller: function(model) {
        objectInitializedCheck();
        addNewBillerDeferred = $.Deferred();
        addNewBiller(model, addNewBillerDeferred);
        return addNewBillerDeferred;
      },
      confirmNewBiller: function(transactionId, trnsactionVersionId, billerId, relationshipNumber) {
        objectInitializedCheck();
        confirmNewBillerDeferred = $.Deferred();
        confirmNewBiller(transactionId, trnsactionVersionId, billerId, relationshipNumber, confirmNewBillerDeferred);
        return confirmNewBillerDeferred;
      },
      deleteBiller: function(billerId, relationshipNumber) {
        objectInitializedCheck();
        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerId, relationshipNumber, deleteBillerDeferred);
        return deleteBillerDeferred;
      },
      getBillerDetails: function(billerId, relationshipNumber) {
        objectInitializedCheck();
        getBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, relationshipNumber, getBillerDetailsDeferred);
        return getBillerDetailsDeferred;
      },
      confirmBillerWithAuth: function(billerId, relationshipNumber, authKey) {
        objectInitializedCheck();
        confirmBillerWithAuthDeferred = $.Deferred();
        confirmBillerWithAuth(billerId, relationshipNumber, authKey, confirmBillerWithAuthDeferred);
        return confirmBillerWithAuthDeferred;
      },
      getHostDate: function() {
        objectInitializedCheck();
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      }
    };
  };
  return new newBillerModel();
});