define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/header",
  "platform",
  "ojs/ojpopup",
  "ojs/ojselectcombobox",
  "ojs/ojmenu",
  "ojs/ojmessages"
], function(oj, ko, $, HeaderModel, Constants, resourceBundle, Platform) {
  "use strict";
  return function(params) {
    var self = this;
    self.loadedComponent = params.loadedComponent;
    self.changeMenuState = params.changeMenuState;
    self.mailbox = params.mailbox;
    self.resourceBundle = resourceBundle;
    self.isExternalPayment = self.isExternalPayment ? self.isExternalPayment : null;
    self.module = Constants.module;
    self.userSegment = Constants.userSegment;
    self.helpDeskSession = Constants.helpDeskSessionKey;
    self.unreadmailCount = ko.observable(0);
    self.unreadAlertCount = ko.observable(0);
    self.unreadNotificationCount = ko.observable(0);
    self.totalUnreadNotification = ko.observable(0);
    self.searchKeyword = ko.observableArray();
    self.searchTags = ko.observableArray();
    self.isSearchVisible = ko.observable(false);
    self.loadMiniMailBox = ko.observable(false);
    self.messagePosition = {
      "my": {
        "vertical": "top",
        "horizontal": "end"
      },
      "at": {
        "vertical": "bottom",
        "horizontal": "end"
      },
      "of": ".notification-clear-all"
    };
    self.closeMessageHandler = function(event) {
      params.baseModel.messages.remove(function(message) {
        return message.id === event.detail.message.id;
      });
      if (event.detail.message.onClose) {
        event.detail.message.onClose();
      }
    };
    params.baseModel.registerComponent("search", "common");
    params.baseModel.registerComponent("mini-mailbox", "mailbox");
    params.baseModel.registerElement("profile", "core");
    params.baseModel.registerComponent("side-menu", "security");
    params.baseModel.registerComponent("locator", "atm-branch-locator");
    params.baseModel.registerElement("entity-switch", "core");
    params.baseModel.registerElement(["floating-panel", "help"]);
    var menu, menuPosition, placeholder,
      isAdded;
    self.openMailBox = function() {
      var isOpen = $("#popup1").ojPopup("isOpen");
      if (isOpen) {
        $("#popup1").ojPopup("close", "#mailbox-holder");
      } else {
        self.loadMiniMailBox(false);
        ko.tasks.runEarly();
        $("#popup1_wrapper_layer").show();
        $("#popup1").ojPopup("open", "#mailbox-holder", {
          "my": {
            "horizontal": "right",
            "vertical": "top"
          },
          "at": {
            "horizontal": "end",
            "vertical": "bottom"
          }
        });
        self.loadMiniMailBox(true);
      }
    };
    self.showHeaderMenu = ko.observable(false);
    self.showInformation = function() {
      if (params.dashboard.isHelpAvailable()) {
        $("#informationPopupHeader").trigger("openFloatingPanel");
      }
    };
    self.closeAllNotificationMessages = function() {
      var array = Array.prototype.slice.call(document.querySelectorAll("#message-box oj-message"));
      for (var i = 0; i < array.length; i++) {
        (function(index) {
          setTimeout(function() {
            array[index].close();
          }, 1000 / (index + 2));
        })(i);
      }
    };
    self.launchProfileMenu = function() {
      document.querySelector("#profileLauncherPopup").open("#profileLauncher");
    };
    self.showSearchBar = function() {
      self.searchKeyword(null);
      self.isSearchVisible(true);
      ko.tasks.runEarly();
      $(".nav-menu .oj-inputsearch-input").focus();
    };
    self.profilePopupAction = function(action) {
      document.querySelector("#profileLauncherPopup").close();
      switch (action) {
        case "profile":
          if (self.userSegment !== "ADMIN") {
            params.dashboard.loadComponent("side-menu");
          } else {
            params.dashboard.loadComponent("profile");
          }
          break;
        case "logout":
          self.logout();
          break;
      }
    };
    self.searchKeyword.subscribe(function(newValue) {
      if (newValue) {
        var selectedValue;
        try {
          selectedValue = JSON.parse(newValue);
        } catch (e) {
          return;
        }
        params.menuOptionSelect(selectedValue);
        self.isSearchVisible(false);
      }
    });

    self.login = function() {
      if (Constants.authenticator === "OBDXAuthenticator") {
        params.baseModel.switchPage({
          module: "login"
        }, false);
      } else {
        params.baseModel.switchPage({}, true);
      }
    };

    function flattenMenuArray(array, parent) {
      var result = [];
      array.forEach(function(element) {
        if (Array.isArray(element.submenus)) {
          result = result.concat(flattenMenuArray(element.submenus, element.name));
        } else {
          element.parent = parent;
          result.push(element);
        }
      });
      return result;
    }

    self.logout = function() {
      window.onbeforeunload = null;
      if (Constants.authenticator === "OBDXAuthenticator") {
        HeaderModel.logOutDBAuth();
      } else {
        HeaderModel.logOut(function() {
          Platform.getInstance().then(function(platform) {
            platform("logOut");
          });
        });
      }
    };

    params.rootModel.userInfoPromise.then(function() {
      self.showHeaderMenu(false);
      ko.tasks.runEarly();
      self.userSegment = Constants.userSegment;
      if (params.dashboard.userData.userProfile) {
        params.dashboard.getMailCount();
      }
      require.undef("json!menu");
      require(["json!menu", "ojL10n!resources/nls/menu"], function(MenuJSON, MenuLocale) {
        var menus;
        if (MenuJSON.menus[params.baseModel.getDeviceSize()]) {
          menus = MenuJSON.menus[params.baseModel.getDeviceSize()];
        }
        if (!menus) {
          menus = MenuJSON.menus.default;
        }
        var output = flattenMenuArray(menus).map(function(element) {
          return {
            value: JSON.stringify(element),
            label: params.baseModel.format("{type} - {selection}", {
              type: MenuLocale.menu.groups[element.parent],
              selection: MenuLocale.menu.groups[element.name]
            })
          };
        });
        self.searchTags(output);
      });
      self.showHeaderMenu(true);
    });
    self.showHeaderMenu.subscribe(function(newValue) {
      if (!newValue) {
        params.dashboard.getMailCount();
        self.showHeaderMenu(true);
      }
    });
    var setoffset = function() {
      menu = document.querySelector(".fixed-header");
      if (placeholder && isAdded) {
        menu.parentNode.removeChild(placeholder);
        menu.classList.remove("sticky");
      }
      menuPosition = null;
      placeholder = document.createElement("div");

      isAdded = false;
    };
    $(window).scroll(function() {
      if (!menuPosition) {
        if(!menu){
          setoffset();
        }
        menuPosition = menu.getBoundingClientRect();
        placeholder.style.width = menuPosition.width + "px";
        placeholder.style.height = menuPosition.height + "px";
      }
      var y = $(this).scrollTop();
      if (y >= 60) {
        $(".header-container").addClass("shadow");
      } else {
        $(".header-container").removeClass("shadow");
      }
      if (window.pageYOffset >= menuPosition.top && !isAdded) {
        menu.classList.add("sticky");
        menu.parentNode.insertBefore(placeholder, menu);
        isAdded = true;
      } else if (window.pageYOffset < menuPosition.top && isAdded) {
        menu.classList.remove("sticky");
        menu.parentNode.removeChild(placeholder);
        isAdded = false;
      }
    });
    self.resetModalComponent = function() {
      params.dashboard.modalComponent("");
    };
    $(document).keyup(function(event) {
      if (event.keyCode === 80 && event.altKey) {
        event.preventDefault();
        $("a[openProfile=\"true\"]")[0].click();
      }
    });

    var resizeHandler = ko.computed(function() {
      if (params.baseModel.large() ^ params.baseModel.medium() ^ params.baseModel.small()) {
        setoffset();
      }
    });
    self.dispose = function() {
      resizeHandler.dispose();
    };
    self.menuHeight = $(window).height() + "px";

    self.logOutHelpDeskSession = function() {
      var payload = {
        "sessionKey": Constants.helpDeskSessionKey
      };
      Constants.helpDeskSessionKey = "";
      HeaderModel.helpDeskSessionOut(JSON.stringify(payload)).then(function() {
        HeaderModel.showLoginTime().done(function(dataMeFetch) {
          params.rootModel.changeSegment("ADMIN" , params.dashboard.userData.userProfile.roles);
          params.rootModel.changeUser(dataMeFetch);
        });
      });
    };

  };
});
