define(["baseService"], function(BaseService) {
  "use strict";
  var AccountActivity = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();
    return {
      fetchActivitiesDetails: function(urlParam) {
        params = {
          "urlParam": urlParam
        };
        var options = {
          url: urlParam
        };
        return baseService.fetch(options, params);
      },
      fetchTransactionDetails: function(limit, urlParam) {
        params = {
          "urlParam": urlParam,
          "limit": limit
        };
        var options = {
          url: urlParam
        };
        return baseService.fetch(options, params);
      },
      fetchPDF: function(baseURL) {
        params = {};
        var options = {
          url: baseURL + "&media=application/pdf"
        };
        return baseService.downloadFile(options, params);
      },
      fetchAccounts:function(){
        var options = {
          url: "accounts"
        };
          return baseService.fetch(options);

      }
    };
  };
  return new AccountActivity();
});
