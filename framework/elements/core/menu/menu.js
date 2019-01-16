define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/menu",
  "framework/js/constants/constants",
  "platform",
  "hammerjs",
  "ojs/ojnavigationlist",
  "ojs/ojselectcombobox",
  "ojs/ojjquery-hammer"
], function (oj, ko, $, MenuModel, resourceBundle, Constants, Platform, Hammer) {
  "use strict";
  return function (params) {
    var self = this;
    self.languageOptions = params.languageOptions;
    self.changeMenuState = params.changeMenuState;
    self.menuLoaded = params.menuLoaded;
    params.baseModel.registerElement("breadcrumb", "core");
    params.baseModel.registerElement("profile", "core");
    params.baseModel.registerElement("about", "core");
    params.baseModel.registerComponent("mailbox-base", "mailbox");
    params.baseModel.registerComponent("alert-list", "mailbox");
    params.baseModel.registerComponent("notification-list", "mailbox");
    params.baseModel.registerElement("entity-switch", "core");
    self.showRoleSwitcher = ko.observable(false);
    self.showSecuritySettings = ko.observable(false);
    var genericViewModel = null;
    self.userMappedRoles = null;
    var segmentRoleMap = {
      CORPADMIN: ["corporateadminchecker", "corporateadminmaker"],
      CORP: ["viewer", "checker", "maker"]
    };
    self.listItem = ko.observableArray();
    self.nls = resourceBundle;
    params.rootModel.userInfoPromise.then(function () {
      require.undef("framework/js/plugins/json!menu");
      MenuModel.getMenu().then(function (data) {
        if (data.menus[params.baseModel.getDeviceSize()]) {
          self.listItem(data.menus[params.baseModel.getDeviceSize()]);
        }
        if (!self.listItem().length) {
          self.listItem(data.menus.default);
        }
        if (params.dashboard.userData.userProfile) {
          Platform.getInstance().then(function (platform) {
            platform("displaySecurity", params.dashboard.userData.userProfile.userName, self.showSecuritySettings);
          });
          self.userMappedRoles = params.dashboard.userData.dashboardResponse.defaultDashboards.modules.filter(function (element) {
            return element.isProfileDashboard;
          });
          if (self.userMappedRoles.length > 1) {
            self.showRoleSwitcher(true);
          }
        }
        self.menuLoaded(true);
      });
    });
    self.switchLanguage = function (event) {
      if (event.detail.trigger === "option_selected") {
        params.baseModel.setLocale(event.detail.value);
      }
    };
    self.getRootContext = function ($root) {
      genericViewModel = $root;
    };
    $("main").ojHammer({
      recognizers: [
        [
          Hammer.Swipe,
          {
            direction: Hammer.DIRECTION_RIGHT
          }
        ]
      ]
    }).on("swiperight", function (event) {
      if (event.gesture.center.x < 200 && event.gesture.target.nodeName === "DIV")
        self.changeMenuState("toggle");
    });
    $(document).keyup(function (event) {
      if (event.keyCode === 77 && event.altKey) {
        event.preventDefault();
        self.changeMenuState("toggle");
      }
    });
    self.loadPage = function (data) {
      params.dashboard.headerCaption("");
      params.menuOptionSelect(data);
      self.selectedItem(null);
      if (!params.baseModel.xl()) {
        self.changeMenuState("toggle");
      }
    };

    function getSelectedNode(node) {
      var path = node.split("~");
      var nodeObj = self.listItem();
      for (var i = 0; i < path.length; i++) {
        for (var j = 0; j < nodeObj.length; j++) {
          if (nodeObj[j].name === path[i]) {
            nodeObj = nodeObj[j].submenus || nodeObj[j];
            break;
          }
        }
      }
      self.loadPage(nodeObj);
    }
    self.menuItemSelect = function (event, ui) {
      var node = ui.item[0].id;
      getSelectedNode(node);
    };
    self.selectedItem = ko.observable();
    self.selectedItem.subscribe(function (newValue) {
      if (newValue !== null) {
        document.getElementById("message-box").closeAll();
        getSelectedNode(newValue);
      }
    });
    self.itemOnly = function (context) {
      if (Constants.userSegment === "ANON") {
        return true;
      }
        return context.leaf;

    };

    function getRoleBasedSegment(role) {
      if (segmentRoleMap.CORPADMIN.indexOf(role) > -1) {
        return "CORPADMIN";
      } else if (segmentRoleMap.CORP.indexOf(role) > -1) {
        return "CORP";
      }
    }

    self.roleSwitcherChanged = function (event) {
      if (params.rootModel.isUserDataSet() && event.detail.value && event.detail.trigger === "option_selected") {
        var computedRole = event.detail.value.toLowerCase();
        if (params.dashboard.application() !== computedRole) {
          var evaluatedSegment = getRoleBasedSegment(event.detail.value);
          if (evaluatedSegment && Constants.userSegment !== evaluatedSegment) {
            genericViewModel.changeSegment(evaluatedSegment, params.dashboard.userData.userProfile.roles);
            params.dashboard.switchModule(getRoleBasedSegment(event.detail.value));
          } else {
            params.dashboard.switchModule(computedRole);
          }
        }
      }
    };
  };
});
