define(["baseService"], function(BaseService) {
  "use strict";
  var LinkAccountModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var baseService = BaseService.getInstance();
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    return {
      fetchAccesstoken : function() {
        var options = {
          url: "accesstokens",
          showMessage: false
        };
        return baseService.fetch(options);
      }
    };
  };
  return new LinkAccountModel();
});
