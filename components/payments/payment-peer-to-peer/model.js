define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var PeerToPeerModel = function() {
    var Model = function() {
        this.P2PPaymentModel = {
          amount: {
            currency: "",
            amount: ""
          },
          transferMode: "",
          transferValue: "",
          remarks: "",
          purpose: "",
          debitAccountId: {
            displayValue: null,
            value: ""
          }
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      initiateP2PDeferred, initiateP2P = function(payload, deferred) {
        var options = {
          url: "payments/transfers/peerToPeer",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      verifyP2PDeferred, verifyP2P = function(paymentId, deferred) {
        var options = {
            url: "payments/transfers/peerToPeer/{paymentId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            paymentId: paymentId
          };
        baseService.patch(options, params);
      },
      /*If OTP required this function will fire from otp section*/
      confirmP2PDeferred, confirmP2P = function(paymentId, uuid, deferred) {
        var options = {
            url: "payments/transfers/peerToPeer/{paymentId}/authentication",
            headers: {
              "TOKEN_ID": uuid
            },
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            paymentId: paymentId
          };
        baseService.update(options, params);
      },
      listAccessPointDeferred, listAccessPoint = function(deferred) {
        var options = {
          url: "accessPoints",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      readP2PDeferred, readP2P = function(paymentId, deferred) {
        var options = {
            url: "payments/transfers/peerToPeer/{paymentId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            paymentId: paymentId
          };
        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      initiateP2P: function(payload) {
        objectInitializedCheck();
        initiateP2PDeferred = $.Deferred();
        initiateP2P(payload, initiateP2PDeferred);
        return initiateP2PDeferred;
      },
      verifyP2P: function(paymentId) {
        objectInitializedCheck();
        verifyP2PDeferred = $.Deferred();
        verifyP2P(paymentId, verifyP2PDeferred);
        return verifyP2PDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);
        return listAccessPointDeferred;
      },
      confirmP2P: function(paymentId, uuid) {
        objectInitializedCheck();
        confirmP2PDeferred = $.Deferred();
        confirmP2P(paymentId, uuid, confirmP2PDeferred);
        return confirmP2PDeferred;
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      readP2P: function(paymentId) {
        objectInitializedCheck();
        readP2PDeferred = $.Deferred();
        readP2P(paymentId, readP2PDeferred);
        return readP2PDeferred;
      }
    };
  };
  return new PeerToPeerModel();
});
