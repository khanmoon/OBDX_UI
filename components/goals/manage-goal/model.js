define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var ManageGoalCategory = function ManageGoalCategory() {

    var baseService = BaseService.getInstance(),
      id, modelInitialized = true,
      Model = function() {
        this.goalAccountUpdateModel = {
            name: "",
            contentId: {
              value: ""
            },
            targetAmount: {
              amount: "",
              currency: ""
            },
            payoutDetails: {
              mode: ""

            }
          };
          this.withdrawAmountPayloadModel = {
            payoutDetails: {
              mode: "",
              typeRedemption: "",
              amount: {
                amount: "",
                currency: ""
              }
            }
          };
          this.goalAccountTopupModel = {
            payinDetails: {
              contributionAmount: {
                currency: "",
                amount: ""
              },
              frequency: "Monthly",
              debitAccount: {
                value: "",
                displayValue: ""
              },
              startDate: "",
              endDate: ""
            }
          };
          this.goalAccountSIModel = {
            id: null,
            account: {
              displayValue: "",
              value: ""
            },
            partyId: "",
            payinDetails: {
              contributionAmount: {
                amount: null,
                currency: null
              },
              frequency: null,
              debitAccount: {
                value: null,
                displayValue: null
              },
              startDate: null,
              endDate: null
            }
          };
      },
      updateGoalDeferred, updateGoal = function(deferred, data) {
        var options = {
            url: "goals/{id}",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            id: id
          };
        baseService.update(options, params);
      },
      reedemGoalDeferred, reedemGoal = function(deferred, payload) {
        var options = {
            url: "goals/{id}/withdrawals",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            id: id
          };
        baseService.add(options, params);
      },
      readGoalAccountDetailsDeferred, readGoalAccountDetails = function(deferred) {
        var options = {
            url: "goals/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            id: id
          };
        baseService.fetch(options, params);

      },
      /*getTransactionListDeferred, getTransactionList = function(deferred,goalId) {
          var options = {

              url:'goals/{goalId}/transactions?fromDate=2014-01-03&toDate=2017-02-03',
              success: function(data) {
                  deferred.resolve(data);
              },
              error: function(data) {
                  deferred.reject(data);
              }
          },params={
              'goalId':goalId,
              'fromDate':fromDate,
              'toDate':toDate
          };
          baseService.fetch(options,params);
      },*/
      getTransactionListDeferred, getTransactionList = function(deferred, goalId) {
        var options = {

            url: "goals/{goalId}/transactions",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "goalId": goalId
          };
        baseService.fetch(options, params);

      },
      getNetworkTypesDeferred, getNetworkTypes = function(region, deferred) {
        var options = {
            url: "enumerations/networkType?REGION={region}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "region": region
          };
        baseService.fetch(options, params);
      },
      stopStandingInstructionDeferred, stopStandingInstruction = function(deferred) {
        var options = {
            url: "goals/{id}/instruction",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "id": id
          };
        baseService.remove(options, params);
      },
      startStandingInstructionDeferred, startStandingInstruction = function(data, deferred) {
        var options = {
            url: "goals/{id}/instruction",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "id": id
          };
        baseService.add(options, params);
      },
      topUpGoalDeferred, topUpGoal = function(data, deferred) {
        var options = {
            url: "goals/{id}/funding",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "id": id
          };
        baseService.add(options, params);
      },
      getBankDetailsDCCDeferred, getBankDetailsDCC = function(code, network, region, deferred) {
        var options = {
            url: "financialInstitution/domesticClearingDetails?financialInstitutionCodeSearchType=S&financialInstitutionCode=" + code + "&network=" + network,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "domesticClearingCodeType": "INDIA",
            "domesticClearingCode": code
          };
        baseService.fetch(options, params);
      },
      readCategoryDeferred, readCategory = function(categoryId, deferred) {

        var options = {
            url: "goals/categories/{categoryId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            categoryId: categoryId
          };
        baseService.fetch(options, params);
      },
      readProductDeferred, readProduct = function(productId, deferred) {

        var options = {
            url: "goals/products/{productId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productId: productId
          };
        baseService.fetch(options, params);
      },
      fetchBankConfigDeferred, fetchBankConfig = function(deferred) {
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
      uploadImageDeffered, uploadImage = function(form, deferred) {
        var options = {
          url: "contents",
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.uploadFile(options);
      },
      deleteImageDeffered, deleteImage = function(id, deferred) {
        var options = {
            url: "contents/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "id": id
          };
        baseService.remove(options, params);
      },
      hostDateDeferred, getHostDate = function(deferred) {
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
      fetchMaxSizeDeffered, fetchMaxSize = function(deferred) {
        var options = {
          url: "configurations/base/DocumentConfig/properties/DOCUMENT_SIZE",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      init: function(goalAccountId) {
        modelInitialized = true;
        id = goalAccountId;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readGoalAccountDetails: function() {

        readGoalAccountDetailsDeferred = $.Deferred();
        readGoalAccountDetails(readGoalAccountDetailsDeferred);
        return readGoalAccountDetailsDeferred;
      },
      updateGoal: function(updatepayload) {

        updateGoalDeferred = $.Deferred();
        updateGoal(updateGoalDeferred, updatepayload);
        return updateGoalDeferred;
      },
      reedemGoal: function(reedempayload) {

        reedemGoalDeferred = $.Deferred();
        reedemGoal(reedemGoalDeferred, reedempayload);
        return reedemGoalDeferred;
      },

      /*getTransactionList: function(goalId,fromDate,toDate) {

          getTransactionListDeferred = $.Deferred();
          getTransactionList(getTransactionListDeferred,goalId,fromDate,toDate);
          return getTransactionListDeferred;
      },*/
      getTransactionList: function(goalId) {

        getTransactionListDeferred = $.Deferred();
        getTransactionList(getTransactionListDeferred, goalId);
        return getTransactionListDeferred;
      },
      getNetworkTypes: function(region) {

        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(region, getNetworkTypesDeferred);
        return getNetworkTypesDeferred;
      },
      stopStandingInstruction: function() {

        stopStandingInstructionDeferred = $.Deferred();
        stopStandingInstruction(stopStandingInstructionDeferred);
        return stopStandingInstructionDeferred;
      },
      startStandingInstruction: function(SIPayload) {

        startStandingInstructionDeferred = $.Deferred();
        startStandingInstruction(SIPayload, startStandingInstructionDeferred);
        return startStandingInstructionDeferred;
      },
      topUpGoal: function(topUpPayload) {

        topUpGoalDeferred = $.Deferred();
        topUpGoal(topUpPayload, topUpGoalDeferred);
        return topUpGoalDeferred;
      },
      getBankDetailsDCC: function(code, network, region) {

        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, network, region, getBankDetailsDCCDeferred);
        return getBankDetailsDCCDeferred;
      },
      readCategory: function(categoryId) {

        readCategoryDeferred = $.Deferred();
        readCategory(categoryId, readCategoryDeferred);
        return readCategoryDeferred;
      },
      readProduct: function(productId) {

        readProductDeferred = $.Deferred();
        readProduct(productId, readProductDeferred);
        return readProductDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);
        return uploadImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);
        return deleteImageDeffered;
      },
      fetchBankConfig: function() {
        fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);
        return fetchBankConfigDeferred;
      },
      fetchMaxSize: function() {
        fetchMaxSizeDeffered = $.Deferred();
        fetchMaxSize(fetchMaxSizeDeffered);
        return fetchMaxSizeDeffered;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);
        return hostDateDeferred;
      }

    };
  };

  return new ManageGoalCategory();
});