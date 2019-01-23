define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/user-login-configuration",
    "ojs/ojcheckboxset"
], function (ko, $, UserLoginFlowModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        self.componentsList = ko.observableArray();
        self.uiComponentName = ko.observable();
        self.loginConfigId = ko.observable();
        var loadedComponentOrder;
        params.baseModel.registerElement("page-section");
        params.baseModel.registerComponent("change-password", "change-password");
        params.baseModel.registerComponent("security-question-option", "user-login-configuration");
        params.baseModel.registerComponent("terms-and-conditions", "user-login-configuration");
        params.baseModel.registerComponent("view-user-security-question", "user-security-question");
        UserLoginFlowModel.listUserLoginFlow().done(function (data) {
            if (data.userLoginFlowDTOList.length > 0) {
                for (var index = 0; index < data.userLoginFlowDTOList.length; index++) {
                    if (data.userLoginFlowDTOList[index].loginConfigDTO) {
                        self.componentsList.push(data.userLoginFlowDTOList[index].loginConfigDTO);
                    }
                }
                self.componentsList.sort(function (left, right) {
                    return left.displayOrder === right.displayOrder ? 0 : left.displayOrder < right.displayOrder ? -1 : 1;
                });
                loadedComponentOrder = 0;
                self.loginConfigId(self.componentsList()[0].id);
                self.uiComponentName(self.componentsList()[0].uiComponentName);
                params.dashboard.loadComponent(self.uiComponentName(), {}, self);
            }
        });
        self.loadNextComponent = function () {
            var payload = ko.toJSON({ loginConfigId: self.loginConfigId() });
            UserLoginFlowModel.createLoginConfig(payload).done(function () {
                loadedComponentOrder = loadedComponentOrder + 1;
                if (loadedComponentOrder < self.componentsList().length) {
                    self.uiComponentName(self.componentsList()[loadedComponentOrder].uiComponentName);
                    self.loginConfigId(self.componentsList()[loadedComponentOrder].id);
                    params.dashboard.loadComponent(self.uiComponentName(), {}, self);
                } else if (loadedComponentOrder === self.componentsList().length) {
                    if (params.baseModel.cordovaDevice()) {
                        params.baseModel.switchPage({ internal: true }, false, false);
                    } else {
                        params.baseModel.switchPage({ internal: false }, false, false);
                    }
                }
            });
        };
        self.incrementloadedComponentId = function () {
            loadedComponentOrder = loadedComponentOrder + 1;
            self.uiComponentName(self.componentsList()[loadedComponentOrder].uiComponentName);
            self.loginConfigId(self.componentsList()[loadedComponentOrder].id);
            params.dashboard.loadComponent(self.uiComponentName(), {}, self);
        };
    };
});
