define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewThemeModel = function () {
    var Deferred, get = function (brandId, deferred) {
        var options = {
          url: "brands/{brandId}",
          success: function (data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, {
          "brandId": brandId
        });
      },
      deleteDocumentDeferred, deleteDocument = function (brandId, deferred) {
        var options = {
          url: "brands/{brandId}",
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.remove(options, {
          "brandId": brandId
        });
      },
      downloadImageAssetsDeferred, downloadImageAssets = function (brandId, deferred) {
        var options = {
          url: "brands/{brandId}/asset?type=I",
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };
        baseService.downloadFile(options, {
          "brandId": brandId
        });
      },
      fetchAssetsDeferred, fetchAssets = function (brandId, deferred) {
        var options = {
          url: "brands/{brandId}/asset?type=S",
          success: function (data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, {
          "brandId": brandId
        });
      };
    return {
      get: function (brandId) {
        Deferred = $.Deferred();
        get(brandId, Deferred);
        return Deferred;
      },
      deleteDocument: function (brandId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(brandId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      },
      downloadImageAssets: function (brandId) {
        downloadImageAssetsDeferred = $.Deferred();
        downloadImageAssets(brandId, downloadImageAssetsDeferred);
        return downloadImageAssetsDeferred;
      },
      fetchAssets: function (brandId) {
        fetchAssetsDeferred = $.Deferred();
        fetchAssets(brandId, fetchAssetsDeferred);
        return fetchAssetsDeferred;
      }
    };
  };
  return new ReviewThemeModel();
});