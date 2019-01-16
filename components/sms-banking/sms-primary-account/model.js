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
    mePreference: function() {
         var options = {
          url: "me/preferences?userID"
          };
       return baseService.fetch(options);
     },
     updatePreference: function(payload) {
       var options = {
         data: payload,
         url: "me/preferences"
       };
       return baseService.update(options);
     },
getDemandDeposits: function() {
       var options = {
         url: "accounts/demandDeposit"
       };
       return baseService.fetch(options);
     }
    };
  };
  return new SMSBankingViewModel();
});
