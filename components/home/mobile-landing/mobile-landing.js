define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/mobile-landing",
  "platform"
], function(oj, ko, $, resourceBundle, Platform) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.renderModuleData = ko.observable(false);
    self.productTiles = ko.observable();
    self.selectedItem = ko.observable("home");
    Params.baseModel.registerComponent("bank-products ", "home");
    Params.baseModel.registerComponent("tools-and-calculators", "home");
    Params.baseModel.registerComponent("locator-index", "atm-branch-locator-index");
    Params.baseModel.registerComponent("locator", "atm-branch-locator");
    Params.baseModel.registerComponent("claim-payment-dashboard", "claim-payment");
    Params.baseModel.registerComponent("bot-client", "chatbot");


    self.gohome = function() {
      self.selectedItem("home");
    };


    if (Params.baseModel.cordovaDevice()) {
      self.quickLinks = [{
        txt: self.nls.quickLinks.labels.ScanToPay,
        icon: "dashboard/quick-access/scanToPay.svg",
        link: "ScanToPay"
      }];
    } else {
      self.quickLinks = [{
        txt: self.nls.quickLinks.labels.products,
        icon: "index/icons/products.svg",
        link: "products"
      }];
    }

    self.quickLinks.push({
      txt: self.nls.quickLinks.labels.ATMAndBranch,
      icon: "index/icons/ATMAndBranch.svg",
      link: "ATMAndBranch"
    });
    self.quickLinks.push({
      txt: self.nls.quickLinks.labels.claimMoney,
      icon: "dashboard/quick-access/request-money.svg",
      link: "claimMoney"
    });
    self.quickLinks.push({
      txt: self.nls.quickLinks.labels.toolsAndCalculators,
      icon: "index/icons/toolsAndCalculators.svg",
      link: "toolsAndCalculators"
    });

    self.onSelectClick = function(data) {
      self.selectedItem(data.link);
      if (data.link === "toolsAndCalculators") {
        Params.dashboard.loadComponent("tools-and-calculators", {}, self);
      }
      if (data.link === "ATMAndBranch") {
        Params.dashboard.loadComponent("locator-index", {}, self);
      }
      if (data.link === "ScanToPay") {
        Params.baseModel.registerComponent("product-home", "home");
        Params.dashboard.loadComponent("product-home", {
          landingModule: "payments",
          landingComponent: "scan-qr"
        }, self);
      }
      if (data.link === "products") {
        Params.dashboard.loadComponent("bank-products", {}, self);
      }
      if (data.link === "claimMoney") {
        Params.dashboard.loadComponent("claim-payment-dashboard", {}, self);
      }
    };
    var generateId = function() {
      var text = "";
      var size = 40;
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^*()_+{}[]:;<>,.?/";
      for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return "$CH$_" + text;
    };

    self.onChatBotClick = function() {
      Platform.getInstance().then(function(platform) {
        var chatbotConfig = platform("getChatbotConfig");
        Params.dashboard.loadComponent("bot-client", {
          websocketConnectionUrl: chatbotConfig.chatbot_url,
          userId: generateId(),
          channel: chatbotConfig.chatbot_id
        }, self);
      });
    };

    self.renderModuleData(true);

  };
});
