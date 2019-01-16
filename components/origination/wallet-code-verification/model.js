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

   * @Gender {string} - gender of the applicant
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
        self.mobileNumber = "";
      },
      ResendModel = function() {
        self.mobileNumber = "";
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      saveModelDeferred, saveModel = function(otp, model, deferred) {

        var options = {
          headers: {
            "TOKEN_ID": otp
          },
          url: "wallets/registration/securityCode/mobile/authentication",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      resendModelDeferred, resendModel = function(model, deferred) {

        var options = {
          url: "wallets/registration/securityCode/mobile",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      };
    return {
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
      getResendModel: function() {
        return new ResendModel();
      },
      saveModel: function(otp, walletModel) {
        saveModelDeferred = $.Deferred();
        saveModel(otp, walletModel, saveModelDeferred);
        return saveModelDeferred;
      },
      resendModel: function(walletModel) {
        resendModelDeferred = $.Deferred();
        resendModel(walletModel, resendModelDeferred);
        return resendModelDeferred;
      }
    };
  };
  return new WalletModel();
});