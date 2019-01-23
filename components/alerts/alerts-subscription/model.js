define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Asset Information Model. This file contains the model definition
   * for asset information section and exports the AssetsInfoModel which can be injected
   * in any framework and developer will, by default get a self aware model for Asset
   * Information Section.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Model for Assets Section using [getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
   *      <li>Service abstractions to fetch all the necessary component level data, which includes:
   *          <ul>
   *              <li>[init()]{@link AssetsInfoModel.init}</li>
   *              <li>[getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
   *              <li>[getAssetTypeList()]{@link AssetsInfoModel.getAssetTypeList}</li>
   *              <li>[getExistingAssets()]{@link AssetsInfoModel.getExistingAssets}</li>
   *              <li>[saveModel()]{@link AssetsInfoModel.saveModel}</li>
   *              <li>[deleteModel()]{@link AssetsInfoModel.deleteModel}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace AssetsInfo~AssetsInfoModel
   * @class AssetsInfoModel
   * @property {String} id - asset id
   * @property {String} type - type of selected asset
   * @property {Object} value - object to store value of asset
   * @property {Integer} value.amount - asset's worth
   * @property {String} value.currency - currency code used
   * @property {Integer} ownershipPercentage - ownership percentage
   */
  var CustomerSubscriptionModel = function() {
    /**
     * In case more than one instance of model is required, eg for main and co-applicant
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf CustomerSubscriptionModel
     */
    var Model = function() {
        return {
          subscribedAlerts: null,
          unsubscribedAlerts: null,
          isSubscriptionPresent: null
        };
      },
      RecipientMessageTemplateModel = function() {
        return {
          destination: null,
          recipient: null,
          recipientCategory: null,
          templateId: null,
          recipientType: null
        };
      },
      AlertModel = function() {
        return {
          index: null,
          alertName: null,
          start_date: null,
          end_date: null,
          recipientMessageTemplates: null,
          actionTemplateId: null,
          actionId: null,
          activityId: null,
          eventId: null,
          expiryDate: null,
          eventType: null,
          destinationEmail: null,
          destinationSMS: null,
          activeEmail: null,
          activeSMS: null,
          emailpreference: null,
          smspreference: null,
          emailSelected: null,
          smsSelected: null,
          subscribed: null,
          readonly: null,
          amount: null,
          transactional: null
        };
      },
      PreferenceModel = function() {
        return {
          rowIndex: null,
          destination: null,
          destinationAddress: null,
          recipient: null,
          recipientCategory: null,
          recipientType: null,
          templateId: null,
          contact_name: null,
          amount: null,
          priority: null,
          selected: null,
          selected_destinationAddress: null
        };
      },
      EmailContactModel = function() {
        return {
          emailId: null,
          contactType: null,
          contactId: null
        };
      },
      PhoneContactModel = function() {
        return {
          number: null,
          contactType: null,
          contactId: null
        };
      },
      ActionSubscriptionCreateModel = function() {
        return {
          isActive: null,
          subscriptionLevel: null,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          subscriber: null,
          subscribedActions: null
        };
      },
      ActionSubscriptionModel = function() {
        return {
          subscriptionId: null,
          isActive: null,
          subscriptionLevel: null,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          subscriber: null,
          subscribedActions: null
        };
      },
      SubscribedActionModel = function() {
        return {
          module: null,
          actionId: null,
          activityId: null,
          eventId: null,
          subscribedActionStartDate: null,
          subscribedActionEndDate: null,
          alertName: null,
          eventType: null,
          subscriptionPreferences: null
        };
      },
      SubscriptionPreferenceModel = function() {
        return {
          recipientCategory: null,
          recipient: null,
          destinationAddress: null,
          startRestrictedTime: null,
          endRestrictedTime: null,
          transactionAmount: null,
          consolidationRequired: null,
          timeRestricted: null,
          destination: null,
          recipientType: null,
          urgencyType: null
        };
      },
      TransactionAmountModel = function() {
        return {
          currency: null,
          amount: null
        };
      },
      SelectedContactModel = function() {
        return {
          index: null,
          value: null
        };
      },
      AccountModel = function() {
        return {
          accountType: null,
          accountId: null,
          displayValue: null,
          customerName: null,
          currencyCode: null
        };
      },
      UserModel = function() {
        return {
          userId: null,
          userRoles: null,
          mobileNo: null,
          emailId: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      SelectedAccount = function() {
        return {
          displayValue: null,
          value: null
        };
      },
      getAccountListDeferred, getAccountList = function(deferred, accountType) {
        var options = {
            url: "accounts/{accountType}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "accountType": accountType
          };
        baseService.fetch(options, params);
      },
      getAlertListDeferred,
      /**
       * Private method to fetch list of Asset Types. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getAssetTypeList
       * @memberOf AssetsInfoModel
       * @private
       */
      getAlertList = function(deferred, moduleType, subscriptionLevel, subscriptionKey, partyId, userId, isCorp) {
        var options = {
            url: isCorp? "actionSubscriptions?userId={userId}": "actionSubscriptions?subscriptionLevelType={subscriptionLevel}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "moduleType": moduleType,
            "subscriptionLevel": subscriptionLevel,
            "subscriptionKey": subscriptionKey,
            "partyId": partyId,
            "userId": userId
          };
        baseService.fetch(options, params);
      },
      getActivityEventActionListDeferred, getActivityEventActionList = function(deferred, moduleId) {
        var options = {
            url: "activityEventActions?moduleId={moduleType}&alertType=S",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "moduleType": moduleId
          };
        baseService.fetch(options, params);
      },
      getContactListDeffered, getContactDetails = function(deferred, partyId) {
        var options = {
            url: "parties/{partyId}/contactPoints",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "partyId": partyId
          };
        baseService.fetch(options, params);
      },
      getUserDeffered, getUser = function(deferred) {
        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getUserDetailsDeffered, getUserDetails = function(deferred) {
        var options = {
          url: "",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      saveModelDeferred,
      /**
       * Private method to save or update information of a users Asset. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveModel
       * @memberOf AssetsInfoModel
       * @private
       */
      saveModel = function(model, deferred) {
        var options = {
            url: "actionSubscriptions",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          modelData = JSON.parse(model);
        if (modelData.subscriptionId) {
          options.url += "/" + modelData.subscriptionId;
          baseService.update(options);
        } else {
          baseService.add(options);
        }
      },
      deleteModelDeferred,
      /**
       * Private method to delete an asset of the user. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function deleteModel
       * @memberOf AssetsInfoModel
       * @private
       */
      deleteModel = function(subscriptionId, deferred) {
        var options = {
            url: "actionSubscriptions/{subscriptionId}",
            data: "",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            subscriptionId: subscriptionId
          };
        baseService.remove(options, params);
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
      getNewAlertModel: function() {
        return new AlertModel();
      },
      getNewPreferenceModel: function() {
        return new PreferenceModel();
      },
      getNewRecipientMessageTemplateModel: function() {
        return new RecipientMessageTemplateModel();
      },
      getNewEmailContactModel: function() {
        return new EmailContactModel();
      },
      getNewPhoneContactModel: function() {
        return new PhoneContactModel();
      },
      getNewActionSubscriptionCreateModel: function() {
        return new ActionSubscriptionCreateModel();
      },
      getNewActionSubscriptionModel: function() {
        return new ActionSubscriptionModel();
      },
      getNewSubscribedActionModel: function() {
        return new SubscribedActionModel();
      },
      getNewSubscriptionPreferenceModel: function() {
        return new SubscriptionPreferenceModel();
      },
      getNewSelectedContactModel: function() {
        return new SelectedContactModel();
      },
      getNewTransactionAmountModel: function() {
        return new TransactionAmountModel();
      },
      getNewAccountModel: function() {
        return new AccountModel();
      },
      getAlertList: function(moduleType, subscriptionLevel, subscriptionKey, partyId, userId, isCorp) {
        if (modelStateChanged) {
          getAlertListDeferred = $.Deferred();
          getAlertList(getAlertListDeferred, moduleType, subscriptionLevel, subscriptionKey, partyId, userId, isCorp);
        }
        return getAlertListDeferred;
      },
      getUserModel: function() {
        return new UserModel();
      },
      getNewSelectedAccountModel: function() {
        return new SelectedAccount();
      },
      getAccountList: function(accountType) {
        if (modelStateChanged) {
          getAccountListDeferred = $.Deferred();
          getAccountList(getAccountListDeferred, accountType);
        }
        return getAccountListDeferred;
      },
      getActivityEventActionList: function(moduleId) {
        if (modelStateChanged) {
          getActivityEventActionListDeferred = $.Deferred();
          getActivityEventActionList(getActivityEventActionListDeferred, moduleId);
        }
        return getActivityEventActionListDeferred;
      },
      getContactDetails: function(partyId) {
        if (modelStateChanged) {
          getContactListDeffered = $.Deferred();
          getContactDetails(getContactListDeffered, partyId);
        }
        return getContactListDeffered;
      },
      getUserDetails: function(userId) {
        if (modelStateChanged) {
          getUserDetailsDeffered = $.Deferred();
          getUserDetails(getUserDetailsDeffered, userId);
        }
        return getUserDetailsDeffered;
      },
      getUser: function() {
        if (modelStateChanged) {
          getUserDeffered = $.Deferred();
          getUser(getUserDeffered);
        }
        return getUserDeffered;
      },
      /**
       * Public method to save/update asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveModel
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.saveModel().then(function (data) {
       *
       *      });
       */
      saveModel: function(subscriptionModel) {
        if (modelStateChanged) {
          saveModelDeferred = $.Deferred();
          saveModel(subscriptionModel, saveModelDeferred);
        }
        return saveModelDeferred;
      },
      /**
       * Public method to delete asset information of an applicant. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteModel
       * @memberOf AssetsInfoModel
       * @returns deferredObject
       * @example
       *      AssetsInfoModel.deleteModel().then(function (data) {
       *
       *      });
       */
      deleteModel: function(subscriptionId) {
        deleteModelDeferred = $.Deferred();
        deleteModel(subscriptionId, deleteModelDeferred);
        return deleteModelDeferred;
      }
    };
  };
  return new CustomerSubscriptionModel();
});
