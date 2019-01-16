/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SMSBankingSearchModel = function() {
    var baseService = BaseService.getInstance();

    return {

      /**
       * fetcheventTemplateMappings - fetches event Template
       * @param  {String} eventId  Id of mapped event template
       * @param  {String} locale locale selected for event template
      * @param  {String} menuSelected SMS/Missed Call selected for event template
       * @returns {Promise}  Returns the promise object
       */
      fetcheventTemplateMappings: function(eventId, locale, menuSelected) {
         var params = {
            "eventId": eventId,
             "locale" : locale,
             "menuSelected" : menuSelected
           },
         options = {
          url: "smsbanking/events/{eventId}/type/{menuSelected}/locale/{locale}/eventTemplateMappings"
          };
       return baseService.fetch(options, params);
     },

      /**
       * fetches event listing
       *
       * @returns {Promise}  Returns the promise object
       */
      fetchEventDescriptionList: function() {
        var options = {
          url: "smsbanking/events"

        };
        return baseService.fetch(options);

      },
      /**
       * fetches locale listing
       *
       * @returns {Promise}  Returns the promise object
       */
      fetchLocaleDescriptionList: function() {
        var options = {
          url: "enumerations/locale"

        };
        return baseService.fetch(options);
      }
    };
  };
  return new SMSBankingSearchModel();
});
