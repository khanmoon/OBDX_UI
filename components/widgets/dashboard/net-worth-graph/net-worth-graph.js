define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/net-worth-graph",
  "ojs/ojchart"
], function(oj, ko, $, Model, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    self.pieSeriesValueForCredit = ko.observableArray();
    self.pieSeriesValueForDebit = ko.observableArray();
    self.showIHaveGraph = ko.observable(false);
    self.showIOweGraph = ko.observable(false);
    self.amountData = ko.observable(false);
    self.creditCardDetailsLoaded = ko.observable(false);
    self.selectedValue = ko.observable(self.resource.iHave);
    self.TotalAssets = ko.observable();
    self.TotalLiability = ko.observable();
    self.currency = ko.observable();
    self.asset = [];
    self.liability = [];
    var summary = [];
    var asset = 0;
    var liability = 0;
    var creditCardData;
    self.centerLabelStyle = ko.observable({
      "font-size": "1rem",
      "color": "#fff"
    });
    self.innerRadius = ko.observable("0.9");
    self.dataLabelPosition = ko.observable("none");
    self.legendPosition = ko.observable("auto");
    self.legendRenderer = ko.observable("off");
    self.netWorthLabels = [{
      id: "I Have",
      label: self.resource.iHave
    }, {
      id: "I Owe",
      label: self.resource.iOwe
    }];

    function calculateNetWorth(data) {
      var summarydata = data.summary.items;
      ko.utils.arrayForEach(summarydata, function(item) {

        if (item.accountType === "CSA" && item.totalActiveAvailableBalance.amount > 0) {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.CSAAmount += item.totalActiveAvailableBalance.amount;
        } else if (item.accountType === "CSA" && item.totalActiveAvailableBalance.amount < 0) {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.CSAODAmount -= item.totalActiveAvailableBalance.amount;
        } else if (item.accountType === "TRD") {
          self.currency(item.totalActiveAvailableBalance.currency);
          summary.TRDAmount += item.totalActiveAvailableBalance.amount;
          summary.RDAmount += item.totalRDActiveAvailableBalance.amount;
        } else if (item.accountType === "LON") {
          self.currency(item.totalActiveOutstandingBalance.currency);
          summary.LOANAmount += item.totalActiveOutstandingBalance.amount;
        }
      });
      self.pieSeriesValueForCredit.push({
        name: self.resource.labels.CSA,
        items: [summary.CSAAmount],
        color: "#FCB300"
      }, {
        name: self.resource.labels.TRD,
        items: [summary.TRDAmount],
        color: "#14BA92"
      }, {
        name: self.resource.labels.RD,
        items: [summary.RDAmount],
        color: "#FF669E"
      });
      self.pieSeriesValueForDebit.push({
        name: self.resource.labels.CSAOD,
        items: [summary.CSAODAmount],
        color: "#FCB300"
      }, {
        name: self.resource.labels.LON,
        items: [summary.LOANAmount],
        color: "#5fefef"
      });

      if (self.pieSeriesValueForCredit().length !== 0) {
        self.showIHaveGraph(true);
        self.amountData(true);
      }
      self.asset = {
        CASA: rootParams.baseModel.formatCurrency(summary.CSAAmount, self.currency()),
        TD: rootParams.baseModel.formatCurrency(summary.TRDAmount, self.currency()),
        RD: rootParams.baseModel.formatCurrency(summary.RDAmount, self.currency())
      };

      asset = summary.CSAAmount + summary.TRDAmount + summary.RDAmount;
      self.TotalAssets(rootParams.baseModel.formatCurrency(asset, self.currency()));

    }

    function setDataForAccounts() {
      self.pieSeriesValueForCredit.removeAll();
      self.pieSeriesValueForDebit.removeAll();
      summary.CSAAmount = 0;
      summary.CSAODAmount = 0;
      summary.TRDAmount = 0;
      summary.RDAmount = 0;
      summary.LOANAmount = 0;

      Model.fetchAccounts().then(function(data) {
        calculateNetWorth(data);
      });

    }

    self.selectedValue.subscribe(function(value) {
      if (value === "I Have") {
        setDataForAccounts();
        self.showIOweGraph(false);
      } else {
        self.showIHaveGraph(false);
        if (self.creditCardDetailsLoaded()) {
          if (creditCardData) {
            summary.CCAAmount = creditCardData.sumOfEquivalentDue.amount || 0;
            self.currency(creditCardData.sumOfEquivalentDue.currency || creditCardData.domesticCurrency);
            self.pieSeriesValueForDebit.push({
              name: self.resource.labels.CCA,
              items: [summary.CCAAmount],
              color: "#ff7b6d"
            });
          }
          self.liability = {
            CSAOD: rootParams.baseModel.formatCurrency(summary.CSAODAmount, self.currency()),
            LOAN: rootParams.baseModel.formatCurrency(summary.LOANAmount, self.currency()),
            CCA: rootParams.baseModel.formatCurrency(summary.CCAAmount, self.currency())
          };
          if (self.pieSeriesValueForDebit().length !== 0) {
            self.showIOweGraph(true);
            self.amountData(true);
          }
          liability = summary.CSAODAmount + summary.LOANAmount + summary.CCAAmount;
          self.TotalLiability(rootParams.baseModel.formatCurrency(liability, self.currency()));
        }
      }
    });

    function setData() {
      Model.creditCardDetails().then(function(data) {
        creditCardData = data;
        self.creditCardDetailsLoaded(true);
      });
      setDataForAccounts();
      self.styleDefaults = ko.pureComputed(function() {
        return {
          pieInnerRadius: self.innerRadius(),
          dataLabelPosition: self.dataLabelPosition()
        };
      });
      self.legend = ko.pureComputed(function() {
        return {
          position: self.legendPosition(),
          textStyle: self.centerLabelStyle(),
          rendered: self.legendRenderer()
        };
      });
    }
    setData();

    self.pieCenterLabelContent = function(dataContext) {
      var pieChartNode = document.createElement("div");
      var outerDiv;
      if (self.showIHaveGraph() === true && asset !== 0){
                pieChartNode.innerHTML =
                  "<div style=\"position:absolute;text-align:center;font-size:1rem;top:4rem;\">" +
                      "<div data=\"textlabel\">" + self.resource.iHave + "</div>" +
                    "<div data=\"amount\">" + self.TotalAssets() + "</div>" +
                  "</div>";
                  outerDiv = pieChartNode.children[0];
                  if(rootParams.baseModel.medium()){
                    outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                    outerDiv.style.top = (dataContext.innerBounds.y + 40) + "px";
                    outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                  }else{
                    outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
                    outerDiv.style.top = (dataContext.innerBounds.y + 20) + "px";
                    outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
                  }

        }else if (self.showIOweGraph() === true && liability !== 0) {
          pieChartNode.innerHTML =
            "<div style=\"position:absolute;text-align:center;font-size:1rem;top:4rem;\">" +
                "<div data=\"textlabel\">" + self.resource.iOwe + "</div>" +
              "<div data=\"amount\">" + self.TotalLiability() + "</div>" +
            "</div>";
            outerDiv = pieChartNode.children[0];
            if(rootParams.baseModel.medium()){
              outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
              outerDiv.style.top = (dataContext.innerBounds.y + 40) + "px";
              outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
            }else{
              outerDiv.style.width = (dataContext.innerBounds.width + 40) + "px";
              outerDiv.style.top = (dataContext.innerBounds.y + 20) + "px";
              outerDiv.style.left = (dataContext.innerBounds.x - 20) + "px";
            }
        }

                  return {"insert" : pieChartNode};

    };
  };
});
