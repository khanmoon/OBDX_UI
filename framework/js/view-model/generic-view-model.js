define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "framework/js/constants/constants",
    "baseService",
    "baseModel",
    "baseLogger",
    "base-models/css",
    "text!build.fingerprint",
    "extensions/override/extensions",
    "promise"
], function (oj, ko, $, Constants, BaseService, BaseModel, BaseLogger, CSS, BuildFingerPrint, ExtensionOverride) {
    "use strict";
    var baseModel = BaseModel.getInstance();
    // eslint-disable-next-line no-console
    window.console.log = console.log = BaseLogger.info;
    var module = baseModel.QueryParams.get("module") === "default" ? "" : baseModel.QueryParams.get("module");
    var context = baseModel.QueryParams.get("context"),
        currentModule = {},
        queryMap = baseModel.QueryParams.get(),
        currentRole = ko.observable(),
        dashboards = [],
        applicationArguments = JSON.parse(baseModel.QueryParams.get("OBDX_ARGS") || baseModel.QueryParams.get("OBDX_ARGS", decodeURIComponent(baseModel.QueryParams.get("redirect_url"))) || "{}"),
        isBrandFetched = false;
    if (queryMap && queryMap.homeComponent && queryMap.homeModule) {
        currentModule = {
            homeComponent: queryMap.homeComponent,
            moduleName: queryMap.homeModule
        };
    }
    var vm = {
            getBaseModel: function () {
                return baseModel;
            },
            menuNavigationAvailable: true,
            getOJET: function () {
                return oj;
            }
        },
        isDashboardSet = ko.observable(true);
    Constants.buildFingerPrint = JSON.parse(BuildFingerPrint);
    if (!baseModel.isEmpty(baseModel.QueryParams.get("menuNavigationAvailable"))) {
        vm.menuNavigationAvailable = baseModel.QueryParams.get("menuNavigationAvailable") === "true";
    }

    function fetchCurrentBrand() {
        return isBrandFetched ? Promise.resolve() : new Promise(function (resolve) {
            BaseService.getInstance().fetch({
                url: "brands/current",
                showMessage: false
            }).then(function (data) {
                if (data.assetDTO) {
                    Constants.brandID = data.assetDTO.brandId;
                }
                isBrandFetched = true;
                resolve(data);
            }).catch(function () {
                resolve();
            });
        });
    }

    function setDashboard(userData) {
        dashboards.length = 0;
        var obj = {};
        var i;
        if (userData.dashboardResponse) {
            for (i = 0; i < userData.dashboardResponse.dashboardDTOs.length; i++) {
                obj[userData.dashboardResponse.dashboardDTOs[i].module] = userData.dashboardResponse.dashboardDTOs[i];
            }
            for (i = 0; i < userData.dashboardResponse.defaultDashboards.modules.length; i++) {
                var dashboard = obj[userData.dashboardResponse.defaultDashboards.modules[i].moduleName] || userData.dashboardResponse.defaultDashboards.modules[i];
                dashboard.moduleName = userData.dashboardResponse.defaultDashboards.modules[i].moduleName;
                dashboard.isProfileDashboard = userData.dashboardResponse.defaultDashboards.modules[i].isProfileDashboard;
                dashboards.push(dashboard);
                delete obj[dashboard.moduleName];
            }
            Object.keys(obj).forEach(function (key) {
                obj[key].moduleName = obj[key].module;
                if (userData.userProfile.roles.indexOf(obj[key].module) !== -1) {
                    dashboard.isProfileDashboard = true;
                    dashboards.unshift(obj[key]);
                }
            });
        }
    }

    function getModuleData(module) {
        module = module || currentRole();
        for (var i = 0; i < dashboards.length; i++) {
            if (module === dashboards[i].moduleName) {
                return dashboards[i];
            }
        }
    }

    function getDefaultDashboard() {
        return dashboards[0].isProfileDashboard ? dashboards[0] : null;
    }

    function getLocalJSON(module, data, resolve) {
        setDashboard(data);
        if (!currentModule.homeComponent) {
            if (module) {
                var metadata = getModuleData(module, data);
                if (metadata) {
                    currentModule = metadata;
                } else {
                    currentModule = {
                        homeComponent: "error",
                        moduleName: "error"
                    };
                }
            } else {
                currentModule = getDefaultDashboard();
            }
            currentRole(module === "login" ? "home" : module || currentModule.moduleName);
        }
        resolve({
            currentModule: currentModule,
            userData: data
        });
    }

    function computeContext(segment) {
        if (segment === "CORPADMIN") {
            return "corp-admin";
        } else if (segment === "RETAIL") {
            return "retail";
        } else if (segment === "CORP") {
            return "corporate";
        } else if (segment === "ADMIN") {
            return "admin";
        }
        return "index";
    }

    function computeSegment(roles, context) {
        var rolesString = roles.toString().toLowerCase();
        var extUserType = ExtensionOverride.evaluateSegment(roles);
        if (context) {
            return "ANON";
        } else if (extUserType) {
            return extUserType;
        } else if (rolesString.indexOf("corporateadminmaker") > -1 || rolesString.indexOf("corporateadminchecker") > -1) {
            return "CORPADMIN";
        } else if (rolesString.indexOf("retailuser") > -1) {
            return "RETAIL";
        } else if (rolesString.indexOf("corporateuser") > -1) {
            return "CORP";
        } else if (rolesString.indexOf("administrator") > -1) {
            return "ADMIN";
        }
        return "ANON";
    }

    function changeSegment(segment, roles) {
        Constants.userSegment = ExtensionOverride.evaluateSegment(roles, segment) || segment || computeSegment(roles) || Constants.userSegment;
        $("body").addClass(Constants.userSegment);
        Constants.jsonContext = ExtensionOverride.evaluateContext(Constants.userSegment, roles) || computeContext(Constants.userSegment);
    }

    function setConstants(entity, segment, timezoneOffset) {
        changeSegment(segment);
        // eslint-disable-next-line no-storage/no-browser-storage
        Constants.currentEntity = entity || sessionStorage.getItem("entity") || Constants.currentEntity || Constants.defaultEntity;
        Constants.timezoneOffset = timezoneOffset || Constants.timezoneOffset;
    }

    function anonymousRequest(resolve, module, sessionAvailable) {
        BaseService.getInstance().fetch({
            url: "dashboards/default"
        }).then(function (data) {
            module = module || "home";
            var userData = {
                dashboardResponse: data,
                userProfile: sessionAvailable ? {} : null
            };
            getLocalJSON(module, userData, resolve);
        }).catch(function () {
            var userData = {
                userProfile: sessionAvailable ? {} : null
            };
            getLocalJSON(module, userData, resolve);
        });
    }

    function changeUser(userData) {
        vm.isUserDataSet(false);
        isDashboardSet(false);
        $(window).off();
        ko.tasks.runEarly();
        vm.userInfoPromise = new Promise(function (resolve) {
            if (userData.userProfile) {
                getLocalJSON(null, userData, resolve);
            } else {
                anonymousRequest(resolve, null);
            }
            currentRole(null);
            isDashboardSet(true);
        });
    }

    function resetLayout() {
        $(window).off();
        isDashboardSet(false);
        vm.isUserDataSet(false);
        ko.tasks.runEarly();
        isDashboardSet(true);
    }

    function onError(jqXHR, resolve, module) {
        setConstants(null, computeSegment([]), null);
        var sessionAvailable = false;
        if (jqXHR && jqXHR.status === 400) {
            sessionAvailable = true;
            if (jqXHR.responseJSON.message.code === "DIGX_UM_042") {
                currentModule = {
                    homeComponent: "change-password",
                    moduleName: "change-password"
                };
            } else {
                baseModel.showMessages(jqXHR);
                currentModule = {
                    homeComponent: "error",
                    moduleName: "error"
                };
            }
        } else if (jqXHR && jqXHR.status >= 500) {
            baseModel.showMessages(jqXHR);
            currentModule = {
                homeComponent: "error",
                moduleName: "error"
            };
        }
        anonymousRequest(resolve, module, sessionAvailable);
    }

    function systemConfiguration(module, userData, resolve) {
        BaseService.getInstance().fetch({
            url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION"
        }).then(function (data) {
            if (data.configResponseList[0].propertyValue === "false") {
                currentModule = {
                    homeComponent: "system-configuration-home",
                    moduleName: "system-configuration"
                };
            }
            getLocalJSON(module, userData, resolve);
        });
    }

    function onSuccess(data, resolve) {
        if (data.userProfile.prospect && !module) {
            module = "home";
            context = "index";
        } else if (!data.firstLoginFlowDone) {
            currentModule = {
                homeComponent: "configuration-base",
                moduleName: "user-login-configuration"
            };
        }
        if (module === "login") {
            module = "";
        }

        if (vm.menuNavigationAvailable) {
            vm.menuNavigationAvailable = data.firstLoginFlowDone && data.menuSupported;
        }

        var entity;
        if (!baseModel.isEmpty(baseModel.QueryParams.get("entity"))) {
            entity = baseModel.QueryParams.get("entity");
        } else {
            entity = data.userProfile.homeEntity;
        }

        var segment = computeSegment(data.userProfile.roles, context);
        setConstants(entity, segment, data.userProfile.timeZoneDTO.offset);
        if (Constants.userSegment === "ADMIN" && data.userProfile.roles.indexOf("AuthAdmin") !== -1) {
            systemConfiguration(module, data, resolve);
        } else {
            getLocalJSON(module, data, resolve);
        }
    }

    function setUserInformation() {
        return new Promise(function (resolve) {
            BaseService.getInstance().fetch({
                url: "me",
                showMessage: false,
                throttle: false
            }).then(function (data) {
                CSS.loadCSS(fetchCurrentBrand());
                onSuccess(data, resolve);
            }, function (jqXHR) {
                CSS.loadCSS(fetchCurrentBrand());
                onError(jqXHR, resolve, module);
            });
        });
    }

    $(document).ready(function () {
        baseModel.registerElement("dashboard", "core");
        baseModel.registerElement("message-box", "core");
        baseModel.registerElement("modal-window");
        ko.utils.extend(vm, {
            userInfoPromise: setUserInformation(),
            fetchCurrentBrand: fetchCurrentBrand,
            isUserDataSet: ko.observable(false),
            queryMap: queryMap || null,
            applicationArguments: applicationArguments,
            changeUser: changeUser,
            resetLayout: resetLayout,
            changeSegment: changeSegment,
            isDashboardSet: isDashboardSet,
            currentRole: currentRole,
            getModuleData: getModuleData,
            getDefaultDashboard: getDefaultDashboard
        });
        $(".message-box").remove();
        ko.applyBindings(Object.seal(vm));
    });
});