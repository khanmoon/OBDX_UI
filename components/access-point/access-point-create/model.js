define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var AccessPointCreateModel = function() {
    var Model = function() {
      this.accessPointModel = {
        id: null,
        description: null,
        clientId: null,
        status: null,
        type: null,
        headlessMode: null,
        twoFactorAuthentication: null,
        selfOnboard: null,
        defaultSelect: null,
        isMenuSupported: null,
        imgRefno: null,
        scopes: null,
        version: null,
        skipLoginFlow: false
      };
    };
    var baseService = BaseService.getInstance();
    var fetchAccessPointTypeDeferred, fetchAccessPointType = function(deferred) {
      var options = {
        url: "enumerations/accessPointType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchScopeDeferred, fetchScope = function(deferred) {
      var options = {
        url: "accessPointScopes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var uploadImageDeferred, uploadImage = function(form, deferred) {
      var options = {
        url: "contents",
        selfLoader: true,
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function() {
          deferred.reject();
        }
      };
      baseService.uploadFile(options);
    };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchAccessPointType: function() {
        fetchAccessPointTypeDeferred = $.Deferred();
        fetchAccessPointType(fetchAccessPointTypeDeferred);
        return fetchAccessPointTypeDeferred;
      },
      fetchScope: function() {
        fetchScopeDeferred = $.Deferred();
        fetchScope(fetchScopeDeferred);
        return fetchScopeDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeferred = $.Deferred();
        uploadImage(form, uploadImageDeferred);
        return uploadImageDeferred;
      }
    };
  };
  return new AccessPointCreateModel();
});
