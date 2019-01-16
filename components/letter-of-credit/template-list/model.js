define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TemplateModel = function() {
    var baseService = BaseService.getInstance();
    var Deferred, getTemplates = function(deferred) {
        var options = {
          url: "letterofcredits/templates",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTemplate = function(id, deferred) {
        var options = {
            url: "letterofcredits/templates/{templateId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "templateId": id
          };
        baseService.fetch(options, params);
      };
    return {
      getTemplates: function() {
        Deferred = $.Deferred();
        getTemplates(Deferred);
        return Deferred;
      },
      getTemplate: function(id) {
        Deferred = $.Deferred();
        getTemplate(id, Deferred);
        return Deferred;
      }
    };
  };
  return new TemplateModel();
});