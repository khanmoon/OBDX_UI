define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UpgradeCardModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * var Model - description
     *
     * @return {type}  description
     */
    var Model = function() {
      this.upcardCardPayload = {
        requestType: "CHANGE_DEBIT_CARD",
        requestData: "",
        entityTypeIdentifier: "",
        status: "",
        entityTypeIdentifierKey: "",
        priorityType: "",
        entityType: "",
        definition: {
          id: ""
        }
      };
      this.upcardCardModel = {
        cardType: "",
        address: {
          line1: 0,
          line2: "",
          line3: "",
          line4: "",
          city: "",
          state: "",
          country: "",
          zipCode: ""
        },
        deliveryOption: ""
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
      this.requestData = {
        label: ""
      };
    };
    var createUpgradeCardSRDeferred,
      /**
       * This function fires a POST request to create supplementarycard request
       * and delegates control to the successhandler along with response data
       * once the details are successfully created
       *
       * @function createSupplimentaryCard
       * @param  {type} payload   description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      createUpgradeCardSR = function(payload, deferred) {
        var options = {
          url: "servicerequest",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      fetchCardTypesDeferred,
      fetchCardTypes = function(debitCardNo, deferred) {
        var params = {
            debitCardNo: debitCardNo
          },
          options = {
            url: "accounts/demandDeposit/{debitCardNo}/debitCards/applicableTypes",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
        baseService.fetch(options, params);
      },
      fetchCardTypeBenefitsDeferred,
      fetchCardTypeBenefits = function(deferred) {
        var options = {
          url: "card-type-benefits",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.fetchJSON(options);
      };
    return {
      /**
       * getNewModel - description
       *
       * @param  {type} modelData description
       * @return {type}           description
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * createReplaceCard - description
       *
       * @param  {type} payload   description
       * @param  {type} accountId description
       * @param  {type} cardNo    description
       * @return {type}           description
       */
      createUpgradeCardSR: function(payload) {
        createUpgradeCardSRDeferred = $.Deferred();
        createUpgradeCardSR(payload, createUpgradeCardSRDeferred);
        return createUpgradeCardSRDeferred;
      },
      fetchCardTypes: function(cardNo) {
        fetchCardTypesDeferred = $.Deferred();
        fetchCardTypes(cardNo, fetchCardTypesDeferred);
        return fetchCardTypesDeferred;
      },
      fetchCardTypeBenefits: function() {
        fetchCardTypeBenefitsDeferred = $.Deferred();
        fetchCardTypeBenefits(fetchCardTypeBenefitsDeferred);
        return fetchCardTypeBenefitsDeferred;
      }
    };
  };
  return new UpgradeCardModel();
});
