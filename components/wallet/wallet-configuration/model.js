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
        this.configModel = {
          dictionaryArray: null,
          refLinks: null,
          configOfferDTO: {
            dictionaryArray: null,
            refLinks: null,
            productGroupId: "",
            productId: "",
            offerCode: "",
            offerName: "",
            offerCurrency: ""
          },
          configLimitsDTO: {
            dictionaryArray: null,
            refLinks: null,
            balanceLimit: {
              currency: "",
              amount: null
            },
            dailyDebitLimit: {
              currency: "",
              amount: null
            },
            dailyCreditLimit: {
              currency: "",
              amount: null
            }
          },
          configGLDTO: [{
              propName: "WALLET_GL_CODE",
              dictionaryArray: null,
              refLinks: null,
              ledgerCode: "",
              ledgerCategoryType: "L",
              ledgerLevelType: "L",
              ledgerType: "I",
              parentLedgerCode: "",
              ledgerDescription: ""
            },
            {
              propName: "INTERMEDIATE_GL_CODE_RECEIVE",
              dictionaryArray: null,
              refLinks: null,
              ledgerCode: "",
              ledgerCategoryType: "L",
              ledgerLevelType: "L",
              ledgerType: "I",
              parentLedgerCode: "",
              ledgerDescription: ""
            },
            {
              propName: "INTERMEDIATE_GL_CODE_TRANSFER",
              dictionaryArray: null,
              refLinks: null,
              ledgerCode: "",
              ledgerCategoryType: "A",
              ledgerLevelType: "L",
              ledgerType: "I",
              parentLedgerCode: "",
              ledgerDescription: ""
            },
            {
              propName: "NODE_GL_CODE_LIABILITY",
              dictionaryArray: null,
              refLinks: null,
              ledgerCode: "",
              ledgerCategoryType: "L",
              ledgerLevelType: "N",
              ledgerType: "I",
              parentLedgerCode: "",
              ledgerDescription: ""
            },
            {
              propName: "NODE_GL_CODE_ASSETS",
              dictionaryArray: null,
              refLinks: null,
              ledgerCode: "",
              ledgerCategoryType: "A",
              ledgerLevelType: "N",
              ledgerType: "I",
              parentLedgerCode: "",
              ledgerDescription: ""
            }
          ]
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      fetchday0 = function(deferred) {
        var options = {
            url: "wallets/configuration",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {};
        baseService.fetch(options, params);
      },
      fetchUserDetailsDeferred, fetchUserDetails = function(deferred) {
        var options = {
          url: "parties/me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchFrequencyBasisDeferred, fetchFrequencyBasis = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchChargeBasisDeferred, fetchChargeBasis = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchFeeFrequencyDeferred, fetchFeeFrequency = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchStmtFrequencyDeferred, fetchStmtFrequency = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchFrequencyDeferred, fetchFrequency = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchSecurityQuestionsDeferred, fetchSecurityQuestions = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      createOfferDeferred, createOffer = function(model, deferred, day0Details) {
        var options = {

            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productGroupId: day0Details.productGroupId,
            productId: day0Details.productCode
          };
        baseService.add(options, params);
      },
      updateInterestRuleDeferred, updateInterestRule = function(model, deferred, day0Details) {
        var options = {

            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productGroupId: day0Details.productGroupId,
            productId: day0Details.productCode,
            interestRuleCode: day0Details.interestRuleId
          };
        baseService.update(options, params);
      },
      updateChargeAttributeDeferred, updateChargeAttribute = function(model, deferred, day0Details) {
        var options = {

            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productGroupId: day0Details.productGroupId,
            productId: day0Details.productCode,
            chargeAttributeCode: day0Details.chargeAttributeId
          };
        baseService.update(options, params);
      },
      updateStatementPolicyDeferred, updateStatementPolicy = function(model, deferred, day0Details) {
        var options = {

            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productGroupId: day0Details.productGroupId,
            productId: day0Details.productCode,
            statementPolicyCode: day0Details.statementPolicyId
          };
        baseService.update(options, params);
      },
      addProductLedgerDeferred, addProductLedger = function(model, deferred) {
        var options = {

            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {};
        baseService.add(options, params);
      },
      readWalletCurrencyDeferred, readWalletCurrency = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletConfigarationsDeferred, readWalletConfigarations = function(deferred) {
        var options = {
          url: "configurations/base/WalletConfiguration/properties",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletOfferNameDeferred, readWalletOfferName = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletTotalLimitDeferred, readWalletTotalLimit = function(deferred) {
        var options = {

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {};
        baseService.fetch(options, params);
      },
      fireDigXPropertyUpdaterDeferred, fireDigXPropertyUpdater = function(model, deferred) {
        var options = {
            url: "wallets/configuration",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {};
        baseService.update(options, params);
      },
      readWalletDebitLimitDeferred, readWalletDebitLimit = function(deferred) {
        var options = {

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {};
        baseService.fetch(options, params);
      },
      readWalletCreditLimitDeferred, readWalletCreditLimit = function(deferred) {
        var options = {

            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {};
        baseService.fetch(options, params);
      },
      readWalletGLCodeDeferred, readWalletGLCode = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletGLCodeReceiveDeferred, readWalletGLCodeReceive = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletGLCodeTransferDeferred, readWalletGLCodeTransfer = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletGLCodeLiabilityDeferred, readWalletGLCodeLiability = function(deferred) {
        var options = {

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readWalletGLCodeAssetsDeferred, readWalletGLCodeAssets = function(deferred) {
        var options = {

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
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf AssetsInfoModel
       */
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      fetchFrequencyBasis: function() {
        fetchFrequencyBasisDeferred = $.Deferred();
        fetchFrequencyBasis(fetchFrequencyBasisDeferred);
        return fetchFrequencyBasisDeferred;
      },
      fetchChargeBasis: function() {
        fetchChargeBasisDeferred = $.Deferred();
        fetchChargeBasis(fetchChargeBasisDeferred);
        return fetchChargeBasisDeferred;
      },
      fetchFrequency: function() {
        fetchFrequencyDeferred = $.Deferred();
        fetchFrequency(fetchFrequencyDeferred);
        return fetchFrequencyDeferred;
      },
      fetchFeeFrequency: function() {
        fetchFeeFrequencyDeferred = $.Deferred();
        fetchFeeFrequency(fetchFeeFrequencyDeferred);
        return fetchFeeFrequencyDeferred;
      },
      fetchStmtFrequency: function() {
        fetchStmtFrequencyDeferred = $.Deferred();
        fetchStmtFrequency(fetchStmtFrequencyDeferred);
        return fetchStmtFrequencyDeferred;
      },
      fetchSecurityQuestions: function() {
        fetchSecurityQuestionsDeferred = $.Deferred();
        fetchSecurityQuestions(fetchSecurityQuestionsDeferred);
        return fetchSecurityQuestionsDeferred;
      },
      fetchUserDetails: function() {
        objectInitializedCheck();
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred);
        return fetchUserDetailsDeferred;
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

      createOffer: function(createOfferModel, day0Details) {
        objectInitializedCheck();
        createOfferDeferred = $.Deferred();
        createOffer(createOfferModel, createOfferDeferred, day0Details);
        return createOfferDeferred;
      },
      updateInterestRule: function(updateInterestRuleModel, day0Details) {
        objectInitializedCheck();
        updateInterestRuleDeferred = $.Deferred();
        updateInterestRule(updateInterestRuleModel, updateInterestRuleDeferred, day0Details);
        return updateInterestRuleDeferred;
      },
      updateChargeAttribute: function(updateChargeAttributeModel, day0Details) {
        objectInitializedCheck();
        updateChargeAttributeDeferred = $.Deferred();
        updateChargeAttribute(updateChargeAttributeModel, updateChargeAttributeDeferred, day0Details);
        return updateChargeAttributeDeferred;
      },
      updateStatementPolicy: function(updateStatementPolicyModel, day0Details) {
        objectInitializedCheck();
        updateStatementPolicyDeferred = $.Deferred();
        updateStatementPolicy(updateStatementPolicyModel, updateStatementPolicyDeferred, day0Details);
        return updateStatementPolicyDeferred;
      },
      addProductLedger: function(addProductLedgerModel) {
        objectInitializedCheck();
        addProductLedgerDeferred = $.Deferred();
        addProductLedger(addProductLedgerModel, addProductLedgerDeferred);
        return addProductLedgerDeferred;
      },
      readWalletCurrency: function() {
        objectInitializedCheck();
        readWalletCurrencyDeferred = $.Deferred();
        readWalletCurrency(readWalletCurrencyDeferred);
        return readWalletCurrencyDeferred;
      },
      readWalletConfigarations: function() {
        objectInitializedCheck();
        readWalletConfigarationsDeferred = $.Deferred();
        readWalletConfigarations(readWalletConfigarationsDeferred);
        return readWalletConfigarationsDeferred;
      },
      readWalletOfferName: function() {
        objectInitializedCheck();
        readWalletOfferNameDeferred = $.Deferred();
        readWalletOfferName(readWalletOfferNameDeferred);
        return readWalletOfferNameDeferred;
      },
      fireDigXPropertyUpdater: function(fireDigXPropertyUpdaterModel) {
        objectInitializedCheck();
        fireDigXPropertyUpdaterDeferred = $.Deferred();
        fireDigXPropertyUpdater(fireDigXPropertyUpdaterModel, fireDigXPropertyUpdaterDeferred);
        return fireDigXPropertyUpdaterDeferred;
      },
      readWalletTotalLimit: function() {
        objectInitializedCheck();
        readWalletTotalLimitDeferred = $.Deferred();
        readWalletTotalLimit(readWalletTotalLimitDeferred);
        return readWalletTotalLimitDeferred;
      },
      readWalletDebitLimit: function() {
        objectInitializedCheck();
        readWalletDebitLimitDeferred = $.Deferred();
        readWalletDebitLimit(readWalletDebitLimitDeferred);
        return readWalletDebitLimitDeferred;
      },
      readWalletCreditLimit: function() {
        objectInitializedCheck();
        readWalletCreditLimitDeferred = $.Deferred();
        readWalletCreditLimit(readWalletCreditLimitDeferred);
        return readWalletCreditLimitDeferred;
      },
      readWalletGLCode: function() {
        objectInitializedCheck();
        readWalletGLCodeDeferred = $.Deferred();
        readWalletGLCode(readWalletGLCodeDeferred);
        return readWalletGLCodeDeferred;
      },
      readWalletGLCodeReceive: function() {
        objectInitializedCheck();
        readWalletGLCodeReceiveDeferred = $.Deferred();
        readWalletGLCodeReceive(readWalletGLCodeReceiveDeferred);
        return readWalletGLCodeReceiveDeferred;
      },
      readWalletGLCodeTransfer: function() {
        objectInitializedCheck();
        readWalletGLCodeTransferDeferred = $.Deferred();
        readWalletGLCodeTransfer(readWalletGLCodeTransferDeferred);
        return readWalletGLCodeTransferDeferred;
      },
      readWalletGLCodeLiability: function() {
        objectInitializedCheck();
        readWalletGLCodeLiabilityDeferred = $.Deferred();
        readWalletGLCodeLiability(readWalletGLCodeLiabilityDeferred);
        return readWalletGLCodeLiabilityDeferred;
      },
      readWalletGLCodeAssets: function() {
        objectInitializedCheck();
        readWalletGLCodeAssetsDeferred = $.Deferred();
        readWalletGLCodeAssets(readWalletGLCodeAssetsDeferred);
        return readWalletGLCodeAssetsDeferred;
      },
      fetchday0: function(fetchday0Deferred) {
        objectInitializedCheck();
        if (modelStateChanged) {
          fetchday0Deferred = $.Deferred();
          $.when(fetchday0).done(function() {
            fetchday0(fetchday0Deferred);
          });
        }
        return fetchday0Deferred;
      }
    };
  };
  return new WalletModel();
});