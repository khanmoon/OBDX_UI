define([], function() {
  "use strict";
  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsSubscriptionModel
   */
  var AlertsSubscriptionPAYMENTSModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    var AccountModel = function() {
        this.accountType = null;
        this.accountId = null;
        this.accountDisplayId = null;
        this.alertsAvailable = null;
        this.activityEventActions = null;
      },
      PreferenceModel = function() {
        this.version = null;
        this.generatedPackageId = null;
        this.auditSequence = null;
        this.destination = null;
        this.recipientCategory = null;
        this.transactionAmount = null;
        this.consolidationRequired = null;
        this.timeRestricted = null;
        this.startRestrictedTime = null;
        this.endRestrictedTime = null;
        this.urgencyType = null;
        this.activityId = null;
        this.eventId = null;
        this.actionId = null;
        this.subscriptionId = null;
        this.subscriptionLevel = null;
        this.subscriberValue = null;
        this.subscriptionLevelAccountKey = null;
        this.destinationAddress = null;
      },
      ActionTemplateModel = function() {
        this.version = null;
        this.generatedPackageId = null;
        this.auditSequence = null;
        this.keyDTO = null;
      };
    return {
      getNewAccountModel: function() {
        return new AccountModel();
      },
      getNewPreferenceModel: function() {
        return new PreferenceModel();
      },
      getNewActionTemplateModel: function() {
        return new ActionTemplateModel();
      }
    };
  };
  return new AlertsSubscriptionPAYMENTSModel();
});