define(["jquery", "baseService"], function ($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var CreateThemeModel = function () {
    return {
      getBrandVariables: function () {
        return baseService.fetchJSON({
          url: "themes"
        });
      },
      get: function (brandId) {
        return baseService.fetch({
          url: "brands/{brandId}"
        }, {
          brandId: brandId
        });
      },
      getTargetLinkageModel: function (styleData) {
        return {
          brandName: null,
          brandDescription: null,
          styleAsset: {
            colors: styleData ? styleData.colors : null,
            fontDetails: styleData ? styleData.fontDetails : null,
            fontSize: styleData ? styleData.fontSize : null,
            components:styleData?styleData.components:null,
            "base-colors":styleData?styleData["base-colors"]:null,
            "base-variables":styleData?styleData["base-variables"]:null,
            "button-colors":styleData?styleData["button-colors"]:null,
            "button-variables":styleData?styleData["button-variables"]:null,
            "font-weights":styleData?styleData["font-weights"]:null,
            "navigation-bar":styleData?styleData["navigation-bar"]:null,
            "table":styleData?styleData.table:null,
            "banner-colors":styleData?styleData["banner-colors"]:null,
            "banner-variables":styleData?styleData["banner-variables"]:null,
            "form-colors":styleData?styleData["form-colors"]:null,
            "form-variables":styleData?styleData["form-variables"]:null,
            "link":styleData?styleData.link:null
          }
        };
      },
      uploadDocument: function (themeData, zip) {
        var form = new FormData();
        var uploadDeferred = $.Deferred();
        form.append("brandName", themeData.brandName);
        form.append("brandDescription", themeData.brandDescription);
        form.append("styleAsset", JSON.stringify(themeData.styleAsset));
        form.append("imageAsset", zip);
        baseService.uploadFile({
          url: "brands",
          formData: form,
          success: function(data, status, jqXHR){
            uploadDeferred.resolve(data, status, jqXHR);
          },
          error: function(jqXHR, textStatus, errorThrown){
            uploadDeferred.reject(jqXHR, textStatus, errorThrown);
          }
        });
        return uploadDeferred;
      },
      updateDocument: function (themeData, zip, brandId) {
        var form = new FormData();
        var updateDeferred = $.Deferred();
        form.append("brandName", themeData.brandName);
        form.append("brandDescription", themeData.brandDescription);
        form.append("styleAsset", JSON.stringify(themeData.styleAsset));
        form.append("imageAsset", zip);
        baseService.uploadFile({
          url: "brands/{brandId}",
          formData: form,
          type: "PUT",
          success: function(data, status, jqXHR){
            updateDeferred.resolve(data, status, jqXHR);
          },
          error: function(jqXHR, textStatus, errorThrown){
            updateDeferred.reject(jqXHR, textStatus, errorThrown);
          }
        }, {
          "brandId": brandId
        });
        return updateDeferred;
      }
    };
  };
  return new CreateThemeModel();
});