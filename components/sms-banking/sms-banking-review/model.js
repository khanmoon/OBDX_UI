/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SMSBankingReviewModel = function() {

    var baseService = BaseService.getInstance();
    /**
     * Method to update a particular event
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function updateEvent
     * @memberOf SMSBankingReviewModel
     * @param {Oject} payload  events parameters passed
     * @param {String} eventId  eventId for an event
     * @param {String} locale  eventId for an event
     * @param {String} menuSelected  menuSelected for an event
     * @param {Oject} deferred  resolved for successful request
     * @returns {void}  Returns the promise object
     * @private
     */
    var updateEventDeferred, updateEvent = function(payload, eventId, locale, menuSelected, deferred) {
      var params = {
          "eventId": eventId,
          "locale": locale,
          "menuSelected": menuSelected
        },
        options = {
          url: "smsbanking/events/{eventId}/type/{menuSelected}/locale/{locale}/eventTemplateMappings",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
      baseService.update(options, params);
    };
    return {
      updateEvent: function(payload, eventId, locale, menuSelected) {
        updateEventDeferred = $.Deferred();
        updateEvent(payload, eventId, locale, menuSelected, updateEventDeferred);
        return updateEventDeferred;
      }

    };
  };
  return new SMSBankingReviewModel();
});
