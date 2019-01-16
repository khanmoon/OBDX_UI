define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/financial-summary",
  "ojs/ojarraytabledatasource",
  "ojs/ojaccordion",
  "ojs/ojlistview"
], function (oj, ko, $, ListingModel, ResourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable(false);
    self.renderFlipAccount = ko.observable(false);
    var accountType = [
      "CSA",
      "TRD",
	  "RD",
      "LON",
      "CCA"
    ];
    self.filteredAccount = {};
    self.items = ko.observableArray();
    self.type = ko.observable();
    self.dataSource = new oj.ArrayTableDataSource(self.items, {
      idAttribute: "type"
    });
    for (var i = 0; i < accountType.length; i++) {
      self.items.push({
        type: accountType[i],
        value: 0,
        ccy: "",
        loaded: ko.observable(!rootParams.baseModel.small())
      });
      self.filteredAccount[accountType[i]] = ko.observableArray();
    }
    self.selectedType = ko.observable();
    rootParams.baseModel.registerComponent("flip-account", "accounts");
    self.showingFront = true;
    self.openAccount = function (data) {
      if (data.type === "TRD") {
        rootParams.baseModel.registerComponent("td-open", "term-deposits");
        rootParams.dashboard.loadComponent("td-open", {});
      }
    };
    self.turnCard = function (data) {
      var elem = document.getElementById("animatable");
      var startAngle = self.showingFront ? "0deg" : "180deg";
      var endAngle = self.showingFront ? "180deg" : "0deg";
      oj.AnimationUtils.flipOut(elem, {
        "flipTarget": "children",
        "persist": "all",
        "startAngle": startAngle,
        "timingFunction": "cubic-bezier(0.175, 0.885, 0.32, 1.4)",
        "endAngle": endAngle
      });
      self.showingFront = !self.showingFront;
      if (self.showingFront) {
        $("#MyAccountHeading").focus();
        if (rootParams.baseModel.large()) {
          $("#accountResults").addClass("hide");
        }
      } else {
        self.type(data.type);
        $("#flipAccountHeading").focus();
        if (rootParams.baseModel.large()) {
          oj.Context.getContext(document.querySelector("#accountResults")).getBusyContext().whenReady().then(function () {
            $("#accountResults").removeClass("hide");
          });
        }
      }
    };
    self.listClick = function (data) {
      if (!data.loaded()) {
        self.openAccount(data);
      } else {
        self.selectedType(data.type);
        self.turnCard(data);
      }
    };

    function checkAndSave(type, account) {
      self.filteredAccount[type].push(account);
    }

    function filterAccount(accounts) {
      for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].type === "CSA") {
          checkAndSave("CSA", accounts[i]);
        } else if (accounts[i].type === "TRD" && accounts[i].module === "RD") {
          accounts[i].type = "RD";
          checkAndSave("RD", accounts[i]);
        } else if (accounts[i].type === "TRD") {
          checkAndSave("TRD", accounts[i]);
        } else if (accounts[i].type === "LON") {
          checkAndSave("LON", accounts[i]);
        }
      }
      self.renderFlipAccount(true);
    }

    function setData(data) {
      self.renderFlipAccount(false);
      var summarydata = data.summary.items;
      if (summarydata) {
        for (var i = 0; i < summarydata.length; i++) {
          if (summarydata[i].accountType === "TRD") {
            self.items()[1].value += summarydata[i].totalActiveAvailableBalance.amount + summarydata[i].totalISLActiveAvailableBalance.amount;
            self.items()[1].ccy = summarydata[i].totalActiveAvailableBalance.currency;
            self.items()[2].value += summarydata[i].totalRDActiveAvailableBalance.amount;
            self.items()[2].ccy = summarydata[i].totalRDActiveAvailableBalance.currency;
            self.items()[1].loaded(true);
            self.items()[2].loaded(true);
          } else if (summarydata[i].accountType === "LON") {
            self.items()[3].value += summarydata[i].totalActiveOutstandingBalance.amount + summarydata[i].totalISLActiveOutstandingBalance.amount;
            self.items()[3].ccy = summarydata[i].totalActiveOutstandingBalance.currency;
            self.items()[3].loaded(true);
          } else if (summarydata[i].accountType === "CSA") {
            self.items()[0].value += summarydata[i].totalActiveAvailableBalance.amount + summarydata[i].totalISLActiveAvailableBalance.amount;
            self.items()[0].ccy = summarydata[i].totalActiveAvailableBalance.currency;
            self.items()[0].loaded(true);
          }
        }
        self.items.valueHasMutated();
        self.dataSource.reset();
        filterAccount(data.accounts);
        self.dataLoaded(true);
      } else {
        self.dataLoaded(false);
      }
    }
    function ProcessingCardDetails(data) {
      for (var i = 0; i < data.creditcards.length; i++) {
        data.creditcards[i].id = {};
        data.creditcards[i].id.value = data.creditcards[i].creditCard.value;
        data.creditcards[i].type = "CCA";
        data.creditcards[i].status = data.creditcards[i].cardStatus === "ACT" ? "ACTIVE" : "INACTIVE";
        data.creditcards[i].accountNickname = data.creditcards[i].cardNickname;
        data.creditcards[i].associatedParty = data.associatedParty;
        checkAndSave("CCA", data.creditcards[i]);
      }
      self.items()[4].value = data.sumOfEquivalentDue.amount || 0;
      self.items()[4].ccy = data.domesticCurrency;
      self.items()[4].loaded(!!data.creditcards.length);
      self.items.valueHasMutated();
      self.dataSource.reset();
    }
    ListingModel.fetchAccounts().done(setData);
    ListingModel.fetchCardInfo().done(ProcessingCardDetails);
    self.refreshWidget = function () {
      $("#accordionPage").ojAccordion("refresh");
    };
  };
});
