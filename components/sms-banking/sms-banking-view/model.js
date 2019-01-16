/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SMSBankingViewModel = function() {
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
      }
    };
  };
  return new SMSBankingViewModel();
});
