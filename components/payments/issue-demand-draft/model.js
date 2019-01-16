define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var DemandDraftModel = function() {
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
        this.demandDraftModel = {
          dictionaryArray: null,
          refLinks: null,
          amount: {
            currency: null,
            amount: null
          },
          valueDate: null,
          userReferenceNo: null,
          remarks: null,
          purpose: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          payeeId: null,
          inFavourOf: null
        };
        this.demandDraftInstructionModel = {
          dictionaryArray: null,
          refLinks: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          userReferenceNo: null,
          remarks: null,
          purpose: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          statusType: null,
          payeeId: null,
          inFavourOf: null
        };
        this.favoritesModel = {
          id: null,
          transctionType: null,
          payeeId: null,
          amount: {
            currency: null,
            amount: null
          },
          debitAccountId: {
            displayValue: null,
            value: null
          },
          remarks: null,
          payeeGroupId: null,
          valueDate: null,
          payeeNickName: null,
          payeeAccountName: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getPayeeListDeferred, getPayeeList = function(deferred) {
        var options = {
          url: "payments/payeeGroup?expand=ALL&types=DEMANDDRAFT",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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
      getPayeeSubListDeferred, getPayeeSubList = function(groupId, deferred) {
        var options = {
            url: "payments/payeeGroup/{groupId}/payees?types={type}&nickName={nickName}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "groupId": groupId,
            "type": "DEMANDDRAFT",
            "nickName": ""
          };
        baseService.fetch(options, params);
      },
      deleteFavouriteDeferred, deleteFavourite = function(paymentId, transactionType, deferred) {
        var options = {
          url: "payments/favorites?transactionId=" + paymentId + "&&type=" + transactionType,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.remove(options);
      },
      getAccountListDeferred, getAccountList = function(deferred) {
        var options = {
          url: "accounts/demandDeposit",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      initiateDomesticDDIssueDeferred, initiateDomesticDDIssue = function(model, deferred) {
        var options = {
          url: "payments/drafts/domestic",
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
      confirmDomesticDDIssueDeferred, confirmDomesticDDIssue = function(paymentId, deferred) {
        var options = {
            url: "payments/drafts/domestic/{paymentId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            "paymentId": paymentId
          };
        baseService.patch(options, params);
      },
      confirmDomesticDDIssueWithAuthDeferred, confirmDomesticDDIssueWithAuth = function(paymentId, authKey, deferred) {
        var options = {
            url: "payments/drafts/domestic/{paymentId}/authentication",
            headers: {
              "TOKEN_ID": authKey
            },
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "paymentId": paymentId
          };
        baseService.update(options, params);
      },
      initiateDomesticDDInstructionIssueDeferred, initiateDomesticDDInstructionIssue = function(model, deferred) {
        var options = {
          url: "payments/instructions/drafts/domestic",
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
      confirmDomesticDDInstructionIssueDeferred, confirmDomesticDDInstructionIssue = function(paymentId, deferred) {
        var options = {
            url: "payments/instructions/drafts/domestic/{instructionId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            "instructionId": paymentId
          };
        baseService.patch(options, params);
      },
      confirmDomesticDDInstructionIssueWithAuthDeferred, confirmDomesticDDInstructionIssueWithAuth = function(paymentId, authKey, deferred) {
        var options = {
            url: "payments/instructions/drafts/domestic/{instructionId}/authentication",
            headers: {
              "TOKEN_ID": authKey
            },
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "instructionId": paymentId
          };
        baseService.update(options, params);
      },
      initiateInternationalDDIssueDeferred, initiateInternationalDDIssue = function(model, deferred) {
        var options = {
          url: "payments/drafts/international",
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
      confirmInternationalDDIssueDeferred, confirmInternationalDDIssue = function(paymentId, deferred) {
        var options = {
            url: "payments/drafts/international/{paymentId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            "paymentId": paymentId
          };
        baseService.patch(options, params);
      },
      confirmInternationalDDIssueWithAuthDeferred, confirmInternationalDDIssueWithAuth = function(paymentId, authKey, deferred) {
        var options = {
            url: "payments/drafts/international/{paymentId}/authentication",
            headers: {
              "TOKEN_ID": authKey
            },
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "paymentId": paymentId
          };
        baseService.update(options, params);
      },
      initiateInternationalDDInstructionIssueDeferred, initiateInternationalDDInstructionIssue = function(model, deferred) {
        var options = {
          url: "payments/instructions/drafts/international",
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
      listAccessPointDeferred, listAccessPoint = function(deferred) {
        var options = {
          url: "accessPoints",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      confirmInternationalDDInstructionIssueDeferred, confirmInternationalDDInstructionIssue = function(paymentId, deferred) {
        var options = {
            url: "payments/instructions/drafts/international/{instructionId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            "instructionId": paymentId
          };
        baseService.patch(options, params);
      },
      confirmInternationalDDInstructionIssueWithAuthDeferred, confirmInternationalDDInstructionIssueWithAuth = function(paymentId, authKey, deferred) {
        var options = {
            url: "payments/instructions/drafts/international/{instructionId}/authentication",
            headers: {
              "TOKEN_ID": authKey
            },
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "instructionId": paymentId
          };
        baseService.update(options, params);
      },
      getDemandDraftPayeeDeferred, getDemandDraftPayee = function(payeeId, groupId, deferred) {
        var options = {
            url: "payments/payeeGroup/{groupId}/payees/demandDraft/{payeeId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "payeeId": payeeId,
            "groupId": groupId
          };
        baseService.fetch(options, params);
      },
      getTransferDataDeferred, getTransferData = function(paymentId, param1, param2, date, deferred) {
        var url;
        if (date === "now") {
          url = "payments/{paymentType}/{transferType}/{paymentId}";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
        }
        var options = {
            url: url,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            paymentType: param1,
            transferType: param2,
            paymentId: paymentId
          };
        baseService.fetch(options, params);
      },
      addFavoritesDeferred, addFavorites = function(model, deferred) {
        var options = {
          url: "payments/favorites",
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
      },
      getNewModel: function() {
        return new Model();
      },
      getAccountList: function() {
        objectInitializedCheck();
        getAccountListDeferred = $.Deferred();
        getAccountList(getAccountListDeferred);
        return getAccountListDeferred;
      },
      initiateDomesticDDIssue: function(model) {
        objectInitializedCheck();
        initiateDomesticDDIssueDeferred = $.Deferred();
        initiateDomesticDDIssue(model, initiateDomesticDDIssueDeferred);
        return initiateDomesticDDIssueDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);
        return listAccessPointDeferred;
      },
      confirmDomesticDDIssue: function(paymentId) {
        objectInitializedCheck();
        confirmDomesticDDIssueDeferred = $.Deferred();
        confirmDomesticDDIssue(paymentId, confirmDomesticDDIssueDeferred);
        return confirmDomesticDDIssueDeferred;
      },
      confirmDomesticDDIssueWithAuth: function(paymentId, authKey) {
        objectInitializedCheck();
        confirmDomesticDDIssueWithAuthDeferred = $.Deferred();
        confirmDomesticDDIssueWithAuth(paymentId, authKey, confirmDomesticDDIssueWithAuthDeferred);
        return confirmDomesticDDIssueWithAuthDeferred;
      },
      deleteFavourite: function(paymentId, transactionType) {
        objectInitializedCheck();
        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);
        return deleteFavouriteDeferred;
      },
      initiateDomesticDDInstructionIssue: function(model) {
        objectInitializedCheck();
        initiateDomesticDDInstructionIssueDeferred = $.Deferred();
        initiateDomesticDDInstructionIssue(model, initiateDomesticDDInstructionIssueDeferred);
        return initiateDomesticDDInstructionIssueDeferred;
      },
      confirmDomesticDDInstructionIssue: function(paymentId) {
        objectInitializedCheck();
        confirmDomesticDDInstructionIssueDeferred = $.Deferred();
        confirmDomesticDDInstructionIssue(paymentId, confirmDomesticDDInstructionIssueDeferred);
        return confirmDomesticDDInstructionIssueDeferred;
      },
      confirmDomesticDDInstructionIssueWithAuth: function(paymentId, authKey) {
        objectInitializedCheck();
        confirmDomesticDDInstructionIssueWithAuthDeferred = $.Deferred();
        confirmDomesticDDInstructionIssueWithAuth(paymentId, authKey, confirmDomesticDDInstructionIssueWithAuthDeferred);
        return confirmDomesticDDInstructionIssueWithAuthDeferred;
      },
      initiateInternationalDDIssue: function(model) {
        objectInitializedCheck();
        initiateInternationalDDIssueDeferred = $.Deferred();
        initiateInternationalDDIssue(model, initiateInternationalDDIssueDeferred);
        return initiateInternationalDDIssueDeferred;
      },
      confirmInternationalDDIssue: function(paymentId) {
        objectInitializedCheck();
        confirmInternationalDDIssueDeferred = $.Deferred();
        confirmInternationalDDIssue(paymentId, confirmInternationalDDIssueDeferred);
        return confirmInternationalDDIssueDeferred;
      },
      confirmInternationalDDIssueWithAuth: function(paymentId, authKey) {
        objectInitializedCheck();
        confirmInternationalDDIssueWithAuthDeferred = $.Deferred();
        confirmInternationalDDIssueWithAuth(paymentId, authKey, confirmInternationalDDIssueWithAuthDeferred);
        return confirmInternationalDDIssueWithAuthDeferred;
      },
      initiateInternationalDDInstructionIssue: function(model) {
        objectInitializedCheck();
        initiateInternationalDDInstructionIssueDeferred = $.Deferred();
        initiateInternationalDDInstructionIssue(model, initiateInternationalDDInstructionIssueDeferred);
        return initiateInternationalDDInstructionIssueDeferred;
      },
      confirmInternationalDDInstructionIssue: function(paymentId) {
        objectInitializedCheck();
        confirmInternationalDDInstructionIssueDeferred = $.Deferred();
        confirmInternationalDDInstructionIssue(paymentId, confirmInternationalDDInstructionIssueDeferred);
        return confirmInternationalDDInstructionIssueDeferred;
      },
      confirmInternationalDDInstructionIssueWithAuth: function(paymentId, authKey) {
        objectInitializedCheck();
        confirmInternationalDDInstructionIssueWithAuthDeferred = $.Deferred();
        confirmInternationalDDInstructionIssueWithAuth(paymentId, authKey, confirmInternationalDDInstructionIssueWithAuthDeferred);
        return confirmInternationalDDInstructionIssueWithAuthDeferred;
      },
      getPayeeList: function() {
        objectInitializedCheck();
        getPayeeListDeferred = $.Deferred();
        getPayeeList(getPayeeListDeferred);
        return getPayeeListDeferred;
      },
      getPayeeSubList: function(groupId) {
        objectInitializedCheck();
        getPayeeSubListDeferred = $.Deferred();
        getPayeeSubList(groupId, getPayeeSubListDeferred);
        return getPayeeSubListDeferred;
      },
      getDemandDraftPayee: function(payeeId, groupId) {
        objectInitializedCheck();
        getDemandDraftPayeeDeferred = $.Deferred();
        getDemandDraftPayee(payeeId, groupId, getDemandDraftPayeeDeferred);
        return getDemandDraftPayeeDeferred;
      },
      getBranchAddress: function(branchCode) {
        objectInitializedCheck();
        getBranchAddressDeferred = $.Deferred();
        getBranchAddress(branchCode, getBranchAddressDeferred);
        return getBranchAddressDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        objectInitializedCheck();
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);
        return getTransferDataDeferred;
      },
      fetchCourierAddress: function(addressType) {
        fetchCourierAddressDeferred = $.Deferred();
        fetchCourierAddress(addressType, fetchCourierAddressDeferred);
        return fetchCourierAddressDeferred;
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      addFavorites: function(model) {
        objectInitializedCheck();
        addFavoritesDeferred = $.Deferred();
        addFavorites(model, addFavoritesDeferred);
        return addFavoritesDeferred;
      },
      getHostDate: function() {
        objectInitializedCheck();
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      }
    };
  };
  return new DemandDraftModel();
});
