/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SMSBankingEditModel = function() {
    var Model = function() {
        this.requestDataAttribute = {
          attribute: {
            attributeID: null,
            attributeName: null
          },
          dataAttrOrder: null
        };
        this.responseDataAttribute = {
          attribute: {
            attributeID: null,
            attributeName: null
          }
        };
        this.eventTempUpdate = {
          dto: {
            event: {
              eventName: null
            },
            pinRequired: false,
            requestTemplate: {
              id: null,
              message: null,
              requestDataAttributes: []
            },
            responseTemplate: {
              id: null,
              message: null,
              responseDataAttributes: []
            }
          }
        };
      },
      baseService = BaseService.getInstance();
    return {
      /**
       * getNewModel - returns the model
       * @param {String} modelData model for event Template
       * @returns {Promise}  Returns the promise object
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * fetchResponseAttributeList - fetches event attribute List
       * @param {String} eventId  eventId for an event
       * @returns {Promise}  Returns the promise object
       */
      fetchResponseAttributeList: function(eventId) {
        var params = {
            "eventId": eventId
          },
          options = {
            url: "smsbanking/events/{eventId}/responseDataAttributes"
          };
        return baseService.fetch(options, params);
      },
      /**
       * fetchRequestAttributeList - fetches request attribute List
       * @param {String} eventId  eventId for an event
       * @returns {Promise}  Returns the promise object
       */
      fetchRequestAttributeList: function(eventId) {
        var params = {
            "eventId": eventId
          },
          options = {
            url: "smsbanking/events/{eventId}/requestDataAttributes"
          };
        return baseService.fetch(options, params);
      }
    };
  };
  return new SMSBankingEditModel();
});
