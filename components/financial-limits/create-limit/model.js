define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var CreateLimitModel = function () {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      Model = function () {
        this.package = {
          key: {
            key: null
          },
          name: null,
          description: null,
          currency: null,
          owner: {
            key: {
              value: null,
              type: null
            }
          },
          targetLimitLinkages: []
        };
        this.PeriodicLimitModel = {
          limitName: "",
          limitDescription: "",
          limitType: "PER",
          currency: "",
          maxAmount: {
            currency: null,
            amount: ""
          },
          maxCount: "",
          periodicity: ""

        };
        this.TransactionalLimitModel = {
          limitName: "",
          limitDescription: "",
          limitType: "TXN",
          currency: "",
          amountRange: {
            minTransaction: {
              currency: null,
              amount: ""
            },
            maxTransaction: {
              currency: null,
              amount: ""
            }
          }
        };

        this.DurationLimitModel = {
          limitName: "",
          limitDescription: "",
          limitType: "DUR",
          currency: "",
          durationLimitSlots: [{
            startDuration: {
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0
            },
            amount: {
              currency: "GBP",
              amount: 0
            },
            endDuration: {
              days: "",
              hours: "",
              minutes: "",
              seconds: ""
            }
          }]
        };

        this.principalAmount = {
          amount: null,
          currency: null
        };
        this.tenure = {
          year: null,
          month: null,
          day: null
        };
        this.interestRate = null;
      };
    /**
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {String} productCode      - String indicating the product code of the product whose flow details are to be fetched
     * @param {Function} successHandler - function to be called once the flow details are successfully fetched
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    var fetchAllDeferred, fetchAll = function (deferred) {
        var params = {},
          options = {

            url: "limits",
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          };

        baseService.fetchJSON(options, params);
      },
      fetchCurrenciesDeffered, fetchCurrencies = function (deffered) {
        var options = {
          url: "currency",
          success: function (data) {
            deffered.resolve(data);
          },
          error: function (data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function () {
        return new Model();
      },
      fetchAll: function () {
        fetchAllDeferred = $.Deferred();
        fetchAll(fetchAllDeferred);
        return fetchAllDeferred;
      },
      fetchCurrencies: function () {
        fetchCurrenciesDeffered = $.Deferred();
        fetchCurrencies(fetchCurrenciesDeffered);
        return fetchCurrenciesDeffered;
      }
    };
  };
  return new CreateLimitModel();
});
