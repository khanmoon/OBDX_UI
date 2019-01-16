define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";
    var EntitlementSearchModel = function() {
        var baseService = BaseService.getInstance();
        this.getNewModel = function() {
            return new this.Model();
        };
        var fetchModuleNameDeferred, fetchModuleName = function(deferred) {
            var options = {
                url: "enumerations/entitlementCategory",
                success: function(data) {
                    deferred.resolve(data);
                }
            };
            baseService.fetch(options);
        };
        var fetchCategoryNameDeferred, fetchCategoryName = function(id, deferred) {
          if(id.length!==0){
            var options = {
                url: "enumerations/entitlementCategory/" + id + "/subcategories",
                success: function(data) {
                    deferred.resolve(data);
                }
            };
            baseService.fetch(options);
          }
        };
        var fetchEntitlementsDeferred, fetchEntitlements = function(searchParams, deferred) {
            var options = {
                url: "entitlementGroups?module={module}&category={categoryName}&entitlement={entitlementName}",
                success: function(data) {
                    deferred.resolve(data);
                }
            };
            baseService.fetch(options, searchParams);
        };
        return {
            fetchModuleName: function() {
                fetchModuleNameDeferred = $.Deferred();
                fetchModuleName(fetchModuleNameDeferred);
                return fetchModuleNameDeferred;
            },
            fetchCategoryName: function(id) {
                fetchCategoryNameDeferred = $.Deferred();
                fetchCategoryName(id, fetchCategoryNameDeferred);
                return fetchCategoryNameDeferred;
            },
            fetchEntitlements: function(searchParams) {
                fetchEntitlementsDeferred = $.Deferred();
                fetchEntitlements(searchParams, fetchEntitlementsDeferred);
                return fetchEntitlementsDeferred;
            }
        };
    };
    return new EntitlementSearchModel();
});
