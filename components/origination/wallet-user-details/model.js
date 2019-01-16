define([
  "jquery",
  "baseService"
], function ($, BaseService) {
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
  var WalletModel = function () {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf Requirements~RequirementsModel
     */
    var Model = function () {
        this.partyOnBoardingDTO = {
          individualDTO: {
            salutation: "",
            gender: "",
            firstName: "",
            lastName: "",
            birthDate: "",
            isMarketingConsent: "false",
            mobileNumber: {
              number: "userMobileNumber"
            }
          }
        };
        this.walletDTO = {
          emailId: ""
        };
        this.credentialsDTO = {
          username: "",
          password: ""
        };
      },
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      baseService = BaseService.getInstance();
    var fetchGenderDeferred, fetchGender = function (deferred) {
        var options = {
          url: "enumerations/gender",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSalutationDeferred, fetchSalutation = function (deferred) {
        var options = {
          url: "enumerations/salutation?isCoreRequest=false",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSecurityQuestionsDeferred, fetchSecurityQuestions = function (deferred) {
        var options = {
          url: "enumerations/securityQuestion?isCoreRequest=false",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      saveModelDeferred, saveModel = function (model, deferred) {

        var options = {
          url: "wallets/registration",
          data: model,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      readSignUpDeferred, readSignUp = function (registrationId, deferred) {

        var options = {
          url: "wallets/register/{registrationId}",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        var params = {
          registrationId: registrationId
        };
        baseService.fetch(options, params);
      },
      verifyEmailDeferred, verifyEmail = function (email, deferred) {

        var options = {
          url: "wallets/registration/securityCode/email",
          data: email,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      resendVerifyEmailDeferred, resendVerifyEmail = function (email, deferred) {

        var options = {
          url: "wallets/registration/securityCode/email",
          data: email,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      authenticateEMailDeferred, authenticateEMail = function (code, email, deferred) {

        var options = {
          headers: {
            "TOKEN_ID": code
          },
          url: "wallets/registration/securityCode/email/authentication",
          data: email,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      confirmSignUpDeferred, confirmSignUp = function (registrationId, deferred) {

        var options = {
            url: "wallets/register/{registrationId}",
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          },
          params = {
            registrationId: registrationId
          };
        baseService.patch(options, params);
      },
      authenticateSignUpDeferred, authenticateSignUp = function (registrationId, emailverificationCode, pass, deferred) {

        var options = {
            headers: {
              "TOKEN_ID": emailverificationCode,
              "WALLET_PASSWORD": pass
            },
            url: "wallets/register/{registrationId}/authentication",
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          },
          params = {
            registrationId: registrationId
          };
        baseService.update(options, params);
      },
      claimMoneyDeferred, claimMoney = function (walletId, deferred) {
        var options = {
            url: "wallets/{walletId}/claims",
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId
          };
        baseService.add(options, params);
      },
      fetchPasswordPolicyDeferred, fetchPasswordPolicy = function (deferred) {
        var options = {
          url: "passwordPolicy",
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchGender: function () {
        fetchGenderDeferred = $.Deferred();
        fetchGender(fetchGenderDeferred);
        return fetchGenderDeferred;
      },
      fetchSalutation: function () {
        fetchSalutationDeferred = $.Deferred();
        fetchSalutation(fetchSalutationDeferred);
        return fetchSalutationDeferred;
      },
      fetchSecurityQuestions: function () {
        fetchSecurityQuestionsDeferred = $.Deferred();
        fetchSecurityQuestions(fetchSecurityQuestionsDeferred);
        return fetchSecurityQuestionsDeferred;
      },
      fetchPasswordPolicy: function () {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
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
      getNewModel: function () {
        return new Model();
      },
      saveModel: function (walletModel) {
        saveModelDeferred = $.Deferred();
        saveModel(walletModel, saveModelDeferred);
        return saveModelDeferred;
      },
      readSignUp: function (registrationId) {
        readSignUpDeferred = $.Deferred();
        readSignUp(registrationId, readSignUpDeferred);
        return readSignUpDeferred;
      },
      confirmSignUp: function (registrationId) {
        confirmSignUpDeferred = $.Deferred();
        confirmSignUp(registrationId, confirmSignUpDeferred);
        return confirmSignUpDeferred;
      },
      authenticateSignUp: function (registrationId, emailverificationCode, pass) {
        authenticateSignUpDeferred = $.Deferred();
        authenticateSignUp(registrationId, emailverificationCode, pass, authenticateSignUpDeferred);
        return authenticateSignUpDeferred;
      },
      verifyEmail: function (email) {
        verifyEmailDeferred = $.Deferred();
        verifyEmail(email, verifyEmailDeferred);
        return verifyEmailDeferred;
      },
      resend_verifyEmail: function (email) {
        resendVerifyEmailDeferred = $.Deferred();
        resendVerifyEmail(email, resendVerifyEmailDeferred);
        return resendVerifyEmailDeferred;
      },
      authenticateEMail: function (code, email) {
        authenticateEMailDeferred = $.Deferred();
        authenticateEMail(code, email, authenticateEMailDeferred);
        return authenticateEMailDeferred;
      },
      claimMoney: function (walletId) {
        claimMoneyDeferred = $.Deferred();
        $.when(claimMoney).done(function () {
          claimMoney(walletId, claimMoneyDeferred);
        });
        return claimMoneyDeferred;
      }
    };
  };
  return new WalletModel();
});