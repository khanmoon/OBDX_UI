define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var AccordionModel = function() {
    var baseService = BaseService.getInstance();
    var getQuickLinksDeferred, getQuickLinks = function(deferred, url) {
      var options = {
        url: "quick-links/{url}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetchJSON(options, {
        "url": url
      });
    };
    return {
      getQuickLinks: function(url) {
        getQuickLinksDeferred = $.Deferred();
        getQuickLinks(getQuickLinksDeferred, url);
        return getQuickLinksDeferred;
      }
    };
  };
  return new AccordionModel();
});