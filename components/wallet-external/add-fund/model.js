define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model file for Product Requirements section. This file contains the model definition
   * for product requirements section and exports the Requirements model which can be used
   * as a component in any form in which user's product requirements are required.
   *
   * @namespace Wallet~WalletModel
   * @class

   * @Notifications {string} - gender of the applicant
   */
  var WalletModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    var Model = function() {
        this.merchantPaymentModel = {
          merchantCode: null,
          flgFailStat: null,
          fldDatTimeTxn: null,
          clientAccNum: null,
          flagAccReq: null,
          flgSucStat: null,
          txnAmt: {
            amount: null,
            currency: null
          },
          merchRefNbr: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      postMerchantDetailsDeferred, postMerchantDetails = function(model, deferred) {
        var options = {
          url: "payments/transfers/merchantTransferData",
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
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid wallet Id. ";
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
      /**
       * Method to get new instance of Asset Information model. This method is a static member
       * of AssetsInfoModel class, and on calling it will instantiate the defined [Model]{@link
       * AssetsInfoModel.Model} (private to this class) and return a new instance of same.
       *
       * @function getNewModel
       * @param {object} modelData - javascript object with predefined attributed present with which
       * the model will be initialized
       * @memberOf AssetsInfoModel
       * @returns Model
       */
      getNewModel: function() {
        return new Model();
      },
      postMerchantDetails: function(payload) {
        objectInitializedCheck();
        postMerchantDetailsDeferred = $.Deferred();
        postMerchantDetails(payload, postMerchantDetailsDeferred);
        return postMerchantDetailsDeferred;
      }
    };
  };
  return new WalletModel();
});