define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsMaintenanceModel
   * @extends BaseService {@link BaseService}
   */
  var AlertsMaintenanceModel = function() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    var recipientMessageTemplateModel = function() {

      this.keyDTO = {

        activityId: null,
        eventId: null,
        actionId: null,
        recipientCategory: null,
        recipient: null,
        locale: null

      };

      this.approverGroupName = null;
      this.bankerType = "NA";
      this.amount = null;
      this.unsecureMsgId = null;
      this.conditional = false;
      this.alertType = null;
      this.messageTemplateDTO = [{
        id: null,
        destinationType: null,
        templateBuffer: null,
        subjectBuffer: null,
        dataAttributes: [{

          attributeMask: null,
          messageTemplateId: null,
          attributeId: null,
          dataSources: [{
            serviceAttributeId: null,
            activityId: null,
            attributeId: null,
            messageTemplateId: null
          }]
        }]
      }];

    };

    var messageTemplateModel = function() {

      this.id = null;
      this.name = null;
      this.description = null;
      this.destinationType = null;
      this.subjectBuffer = null;
      this.templateBuffer = null;
    };
    var Model = function() {

      this.alertKeyDTO = {
        activityId: null,
        eventId: null,
        actionId: null
      };
      this.alertTemplate = {

        keyDTO: {
          id: null
        },
        name: null,
        urgency: null,
        language: null,
        importance: null
      };
      this.recipientMessageTemplates = [{

        keyDTO: {
          dictionaryArray: null,
          refLinks: null,
          activityId: null,
          eventId: null,
          actionId: null,
          destinationType: null,
          recipientCategory: null,
          recipient: null,
          locale: null
        },
        alertType: null,
        approverGroupName: null,
        bankerType: "NA",
        amount: null,
        unsecureMsgId: null,
        conditional: false,
        messageTemplateDTO: [{
          id: null,
          name: null,
          destinationType: null,
          description: null,
          templateBuffer: null,
          subjectBuffer: null,
          dataAttributes: [{

            attributeMask: null,
            messageTemplateId: null,
            attributeId: null,
            dataSources: [{
              serviceAttributeId: null,
              activityId: null,
              attributeId: null,
              messageTemplateId: null
            }]
          }]
        }]
      }];
      this.alertName = null;
      this.maxRetryCount = null;
      this.expiryDate = null;
      this.alertType = null;
      this.alertDispatchType = null;
      this.eventType = null;
      this.conditional = false;
      this.retryAllowed = false;
      this.transactional = false;
    };
    var params, baseService = BaseService.getInstance();
    /**
     * Method to fetch list of alerts based on description  .
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function fetchDescriptionEventActivityList
     * @memberOf AlertsMaintenanceModel
     * @param {string} descriptionValue- for for fetching list of alerts matching with name
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    var fetchDescriptionEventActivityListDeferred, fetchDescriptionEventActivityList = function(moduleId, activityId, eventId, deferred) {
        var options = {
          url: "activityEvents?moduleId=" + moduleId + "&activityId=" + activityId + "&eventId=" + eventId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * Method to update a particular alert
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function updateAlert
       * @param {oject} deferred- resolved for successful request
       * @memberOf AlertsMaintenanceModel
       * @private
       */
      updateAlertDeferred, updateAlert = function(payload, alertName, deferred) {
        var options = {
          url: "activityEventActions/" + alertName,

          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },

      deleteAlertDeffered, deleteAlert = function(alertName, deferred) {

        var options = {
          url: "activityEventActions/" + alertName,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }

        };
        baseService.remove(options);
      },

      /**
       * Method to create a particular alert
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function createAlert
       * @param {oject} deferred- resolved for successful request
       * @memberOf AlertsMaintenanceModel
       * @private
       */
      createAlertDeferred, createAlert = function(payload, deferred) {
        var options = {
          url: "activityEventActions/",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      fetchAlertDeferred, fetchAlert = function(alertName, deferred) {
        var options = {
          url: "activityEventActions/" + alertName,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchEventDescriptionDeferred, fetchEventDescription = function(activityId, eventId, deferred) {
        params = {
          "activityId": activityId || "",
          "eventId": eventId || ""
        };
        var options = {
          url: "activityEventActions?activityId={activityId}&eventId={eventId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      /**
       * Method to fetch enumerations for alert type
       *  deferred object is resolved once the  information  is successfully fetched
       *
       * @function fetchAlertType
       * @param {oject} deferred- resolved for successful request
       * @memberOf AlertsMaintenanceModel
       * @private
       */
      fetchAlertTypeDeferred, fetchAlertType = function(deferred) {
        var options = {
          url: "enumerations/alertType",
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
      getNewModel: function() {
        return new Model();
      },
      getNewRecipientMessageTemplateModel: function() {
        return new recipientMessageTemplateModel();
      },
      getNewMessageTemplateModel: function() {
        return new messageTemplateModel();
      },
      fetchDescriptionEventActivityList: function(moduleId, activityId, eventId) {
        fetchDescriptionEventActivityListDeferred = $.Deferred();
        fetchDescriptionEventActivityList(moduleId, activityId, eventId, fetchDescriptionEventActivityListDeferred);
        return fetchDescriptionEventActivityListDeferred;
      },
      updateAlert: function(payload, alertName) {
        updateAlertDeferred = $.Deferred();
        updateAlert(payload, alertName, updateAlertDeferred);
        return updateAlertDeferred;
      },
      deleteAlert: function(alertName) {
        deleteAlertDeffered = $.Deferred();
        deleteAlert(alertName, deleteAlertDeffered);
        return deleteAlertDeffered;
      },
      createAlert: function(payload) {
        createAlertDeferred = $.Deferred();
        createAlert(payload, createAlertDeferred);
        return createAlertDeferred;
      },
      fetchAlert: function(alertName) {
        fetchAlertDeferred = $.Deferred();
        fetchAlert(alertName, fetchAlertDeferred);
        return fetchAlertDeferred;
      },
      fetchEventDescription: function(activityId, eventId) {
        fetchEventDescriptionDeferred = $.Deferred();
        fetchEventDescription(activityId, eventId, fetchEventDescriptionDeferred);
        return fetchEventDescriptionDeferred;
      },
      fetchAlertType: function() {
        fetchAlertTypeDeferred = $.Deferred();
        fetchAlertType(fetchAlertTypeDeferred);
        return fetchAlertTypeDeferred;
      }
    };
  };
  return new AlertsMaintenanceModel();
});