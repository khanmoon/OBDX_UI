define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var MoneyTransferModel = function() {
    var Model = function() {
        this.internalPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          payeeId: null,
          dealId: null
        };
        this.internalPayLaterModel = {
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          statusType: null,
          payeeId: null,
          dealId: null
        };
        this.selfPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          creditAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          dealId: null
        };
        this.selfPayLaterModel = {
          amount: {
            currency: null,
            amount: null
          },
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          creditAccountId: {
            displayValue: null,
            value: null
          },
          statusType: null,
          dealId: null
        };
        this.internationalPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          payeeId: null,
          otherDetails: {
            line1: null
          },
          charges: null,
          dealId: null
        };
        this.internationalPayLaterModel = {
          paymentType: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          remarks: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          statusType: null,
          payeeId: null,
          otherDetails: {
            line1: null
          },
          charges: null,
          dealId: null
        };
        this.domesticPaymentModel = {
          amount: {
            currency: null,
            amount: null
          },
          network: null,
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          payeeId: null,
          sepaDomestic: {
            amount: {
              currency: null,
              amount: null
            },
            payeeId: null,
            oinNumber: null,
            oinDescription: null
          },
          charges: null
        };
        this.domesticPayLaterModel = {
          paymentType: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          instances: null,
          nextExecutionDate: null,
          amount: {
            currency: null,
            amount: null
          },
          network: null,
          remarks: null,
          purpose: null,
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: null
          },
          payeeId: null,
          sepaDomesticPayout: {
            amount: {
              currency: null,
              amount: null
            },
            payeeId: null,
            oinNumber: null,
            oinDescription: null
          },
          charges: null
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
          creditAccountId: {
            displayValue: null,
            value: null
          },
                    network: null,
          purpose: null,
          remarks: null,
          payeeGroupId: null,
          valueDate: null,
          payeeNickName: null,
          charges: null,
          payeeAccountName: null,
          internationalPaymentDetails: null,
          otherPurposeText: null
        };
        this.P2PPayment = {
          amount: {
            currency: "",
            amount: ""
          },
          transferMode: "",
          transferValue: "",
          remarks: "",
          purpose: "",
          purposeText: null,
          debitAccountId: {
            displayValue: null,
            value: ""
          }
        };
      },
      baseService = BaseService.getInstance(),
      getPayeeListDeferred, getPayeeList = function(isSIBoolean, deferred) {
        var url;
        if (isSIBoolean) {
          url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INDIADOMESTIC";
        } else {
          url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC,PEERTOPEER";
        }
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPayeeSubListDeferred, getPayeeSubList = function(groupId, deferred) {
        var options = {
            url: "payments/payeeGroup/{groupId}/payees",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "groupId": groupId
          };
        baseService.fetch(options, params);
      },
      initiatePaymentDeferred, initiatePayment = function(model, param1, param2, date, deferred) {
        var url;
        if (date === "now") {
          url = "payments/{paymentType}/{transferType}";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}";
        }

        var options = {
            url: url,
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            paymentType: param1,
            transferType: param2
          };
        baseService.add(options, params);
      },
      verifyPaymentDeferred, verifyPayment = function(param1, param2, paymentId, date, deferred) {
        var url;
        if (date === "now") {
          url = "payments/{paymentType}/{transferType}/{paymentId}";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
        }

        var options = {
            url: url,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            paymentType: param1,
            transferType: param2,
            paymentId: paymentId
          };
        baseService.patch(options, params);
      },
      confirmPaymentDeferred, confirmPayment = function(param1, param2, paymentId, otp, date, deferred) {
        var url;
        if (date === "now") {
          url = "payments/{paymentType}/{transferType}/{paymentId}/authentication";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}/{paymentId}/authentication";
        }

        var options = {
            url: url,
            headers: {
              "TOKEN_ID": otp
            },
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            paymentType: param1,
            transferType: param2,
            paymentId: paymentId
          };
        baseService.update(options, params);
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
      getPayeeDataDeferred, getPayeeData = function(payeeId, groupId, payeeType, deferred) {
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
            groupId: groupId,
            payeeType: payeeType,
            payeeId: payeeId
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
      getRepeatDeferred, getRepeateIntervals = function(deferred) {

        var options = {
          url: "enumerations/paymentFrequency",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fireBatchDeferred, fireBatch = function(deferred, batchRequest, type) {
        var options = {
          url: "batch",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.batch(options, {
          type: type
        }, batchRequest);
      },
      deleteFavouriteDeferred, deleteFavourite = function(paymentId, transactionType, deferred) {

        var options = {
            url: "payments/favorites?transactionId={paymentId}&&type={transactionType}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            paymentId: paymentId,
            transactionType: transactionType
          };
        baseService.remove(options, params);
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
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getNetworkTypes: function() {
        return baseService.fetch({
          url: "enumerations/networkType?REGION=INDIA"
        });
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      getPayeeList: function(isSIBoolean) {
        getPayeeListDeferred = $.Deferred();
        getPayeeList(isSIBoolean, getPayeeListDeferred);
        return getPayeeListDeferred;
      },
      getPayeeSubList: function(groupId) {
        getPayeeSubListDeferred = $.Deferred();
        getPayeeSubList(groupId, getPayeeSubListDeferred);
        return getPayeeSubListDeferred;
      },
      initiatePayment: function(model, param1, param2, date) {
        initiatePaymentDeferred = $.Deferred();
        initiatePayment(model, param1, param2, date, initiatePaymentDeferred);
        return initiatePaymentDeferred;
      },
      verifyPayment: function(param1, param2, paymentId, date) {
        verifyPaymentDeferred = $.Deferred();
        verifyPayment(param1, param2, paymentId, date, verifyPaymentDeferred);
        return verifyPaymentDeferred;
      },
      confirmPayment: function(param1, param2, paymentId, otp, date) {
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(param1, param2, paymentId, otp, date, confirmPaymentDeferred);
        return confirmPaymentDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);
        return listAccessPointDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);
        return getTransferDataDeferred;
      },
      getPayeeData: function(payeeId, groupId, payeeType) {
        getPayeeDataDeferred = $.Deferred();
        getPayeeData(payeeId, groupId, payeeType, getPayeeDataDeferred);
        return getPayeeDataDeferred;
      },
      addFavorites: function(model) {
        addFavoritesDeferred = $.Deferred();
        addFavorites(model, addFavoritesDeferred);
        return addFavoritesDeferred;
      },
      getRepeateIntervals: function() {
        getRepeatDeferred = $.Deferred();
        getRepeateIntervals(getRepeatDeferred);
        return getRepeatDeferred;
      },
      deleteFavourite: function(paymentId, transactionType) {
        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);
        return deleteFavouriteDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      },
      getCharges: function() {
        baseService.fetch({
          url: "charges"
        });
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      },

            /**
             * fetches maintenances
             * @returns {Promise}  Returns the promise object
             */
            getMaintenances: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            getUpcomingPaymentsList: function(fromDate, toDate, creditAccountId) {
                return baseService.fetch({
                    url: "payments/instructions?status=ACTIVE&type=ALL&fromDate={fromDate}&toDate={toDate}&creditAccountId={creditAccountId}"
                }, {
                    fromDate: fromDate,
                    toDate: toDate,
                    creditAccountId: creditAccountId
                });
            },
      getExchangeRate: function(data) {
        return baseService.fetch({
          url: "forex/rates?branchCode={branchCode}&ccy1Code={ccy1}&ccy2Code={ccy2}"
        }, {
          branchCode: data.branchCode,
          ccy1: data.ccy1Code,
          ccy2: data.ccy2Code
        });
      }
    };

  };
  return new MoneyTransferModel();
});
