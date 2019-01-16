define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var updateDeletePayeeModel = function() {
    var Model = function() {
        this.payeeLimitModel = {
            "name": "",
            "description": "",
            "currency": "",
            "owner": {
              "key": {
                "value": "",
                "type": ""
              }
            },
            "targetLimitLinkages": [{
              "target": {
                "value": null,
                "type": {
                  "id": "PAYEE",
                  "name": "PAYEE",
                  "mandatory": true
                }
              },
              "limits": [{
                "limitType": "PER",
                "maxAmount": {
                  "currency": null,
                  "amount": null
                },
                "maxCount": null,
                "periodicity": "DAILY"
              }],
              "effectiveDate": ""
            }],
            "assignableToList": [{
              "key": {
                "type": "",
                "value": ""
              }
            }]
          };
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
        this.editPayeeModel = {
          isShared: false
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      payeeId, groupId, getPayeeDeferred, getPayee = function(type, deferred) {

        var options = {
            url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "payeeType": type,
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.fetch(options, params);
      },
      getBranchAddressDeferred, getBranchAddress = function(branchCode, deferred) {

        var options = {
            url: "locations/branches?branchCode={branchCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "branchCode": branchCode
          };
        baseService.fetch(options, params);
      },
      deletePayeeDeferred, deletePayee = function(type, deferred) {

        var options = {
            url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "payeeType": type,
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.remove(options, params);
      },
      fetchCourierAddressDeferred, fetchCourierAddress = function(addressType, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAddressTypeDeferred, fetchAddressType = function(deferred) {
        var options = {
          url: "enumerations/addressType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPayeeLimitDeferred, getPayeeLimit = function(deferred) {
        var options = {
            url: "me/customLimitPackage",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.fetch(options, params);
      },
      postPayeeLimitDeferred, postPayeeLimit = function(payload, deferred) {
        var options = {
            url: "me/customLimitPackage",
            data: payload,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.add(options, params);
      },
      putPayeeLimitDeferred, putPayeeLimit = function(payload, deferred) {
        var options = {
            url: "me/customLimitPackage",
            data: payload,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.update(options, params);
      },
      editPayeeDeferred, editPayee = function(payload, deferred) {
        var options = {
            url: "payments/payeeGroup/{groupId}/payees/{payeeId}",
            data: payload,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.update(options, params);
      },
      bancConfigurationDeffered, fetchBankConfiguration = function(deferred) {
        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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
      /**
       * Method to initialize the described model
       */
      init: function(id, gid) {
        groupId = gid || undefined;
        payeeId = id || undefined;
        modelInitialized = true;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getPayee: function(type) {
        objectInitializedCheck();
        getPayeeDeferred = $.Deferred();
        getPayee(type, getPayeeDeferred);
        return getPayeeDeferred;
      },
      deletePayee: function(type) {
        objectInitializedCheck();
        deletePayeeDeferred = $.Deferred();
        deletePayee(type, deletePayeeDeferred);
        return deletePayeeDeferred;
      },
      getBranchAddress: function(branchCode) {
        objectInitializedCheck();
        getBranchAddressDeferred = $.Deferred();
        getBranchAddress(branchCode, getBranchAddressDeferred);
        return getBranchAddressDeferred;
      },
      fetchCourierAddress: function(addressType) {
        fetchCourierAddressDeferred = $.Deferred();
        fetchCourierAddress(addressType, fetchCourierAddressDeferred);
        return fetchCourierAddressDeferred;
      },
      fetchAddressType: function() {
        fetchAddressTypeDeferred = $.Deferred();
        fetchAddressType(fetchAddressTypeDeferred);
        return fetchAddressTypeDeferred;
      },
      editPayee: function(payload) {
        editPayeeDeferred = $.Deferred();
        editPayee(payload, editPayeeDeferred);
        return editPayeeDeferred;
      },
      getPayeeLimit: function() {
        getPayeeLimitDeferred = $.Deferred();
        getPayeeLimit(getPayeeLimitDeferred);
        return getPayeeLimitDeferred;
      },
      postPayeeLimit: function(payload) {
        postPayeeLimitDeferred = $.Deferred();
        postPayeeLimit(payload, postPayeeLimitDeferred);
        return postPayeeLimitDeferred;
      },
      putPayeeLimit: function(payload) {
        putPayeeLimitDeferred = $.Deferred();
        putPayeeLimit(payload, putPayeeLimitDeferred);
        return putPayeeLimitDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);
        return bancConfigurationDeffered;
      }
    };
  };
  return new updateDeletePayeeModel();
});