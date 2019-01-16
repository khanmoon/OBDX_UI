define([
  "jquery"
], function($) {
  "use strict";
  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsSubscriptionModel
   */
  var AlertsSubscriptionProfileModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    var ActivityEventActionModel = function() {
        return {
          activityEventAction: null,
          emailPreference: null,
          emailSelected: null,
          smsPreference: null,
          smsSelected: null,
          mailboxPreference: null,
          mailboxSelected: null
        };
      },
      PreferenceModel = function() {
        return {
          version: null,
          generatedPackageId: null,
          auditSequence: null,
          destination: null,
          recipientCategory: null,
          transactionAmount: null,
          consolidationRequired: null,
          timeRestricted: null,
          startRestrictedTime: null,
          endRestrictedTime: null,
          urgencyType: null,
          activityId: null,
          eventId: null,
          actionId: null,
          subscriptionId: null,
          subscriptionLevel: null,
          subscriberValue: null,
          subscriptionLevelPartyKey: null,
          destinationAddress: null
        };
      },
      ActionTemplateModel = function() {
        return {
          version: null,
          generatedPackageId: null,
          auditSequence: null,
          keyDTO: null
        };
      };
    return {
      getNewActivityEventActionModel: function() {
        return new ActivityEventActionModel();
      },
      getNewPreferenceModel: function() {
        return new PreferenceModel();
      },
      getNewActionTemplateModel: function() {
        return new ActionTemplateModel();
      },
      getSubscribedAlertList: function() {
        var getSubscribedAlertListDeferred = $.Deferred();
        return getSubscribedAlertListDeferred;
      }
    };
  };
  return new AlertsSubscriptionProfileModel();
});
