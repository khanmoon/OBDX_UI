define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";
    var ApplicationRolesCreateReviewModel = function() {
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
            },
            fetchAccessDeferred, fetchAccess = function(searchParams, deferred) {
                var options = {
                    url: "accessPoints?accessType={accessType}",
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
            fetchAccess: function(searchParams) {
                fetchAccessDeferred = $.Deferred();
                fetchAccess(searchParams, fetchAccessDeferred);
                return fetchAccessDeferred;
            }
        };
    };
    return new ApplicationRolesCreateReviewModel();
});
