define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/tax-deduction-at-source",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojpopup",
  "ojs/ojradioset",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlabel",
  "ojs/ojlistview",
  "ojs/ojvalidationgroup",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, $, tdsModel, Constants, resourceBundle) {
  "use strict";


  /**
   * return function - description
   *
   * @param  {type} rootParams description
   * @return {type}            description
   */
  return function(rootParams) {
    var self = this;
    self.rootParams = rootParams;
    self.resource = resourceBundle;
    rootParams.baseModel.registerElement("account-input");
    self.duration = ko.observable("financialYear");
    self.deposit = ko.observable();
    self.additionalDetails = ko.observable();
    self.validationTracker = ko.observable();
    self.fromFavourites = ko.observable(false);
    self.year = ko.observable(false);
    self.years = ko.observable();
    rootParams.dashboard.headerName(resourceBundle.title);
    self.type = rootParams.type;
    self.fromDate = ko.observable();
    self.toDate = ko.observable();
    self.tds = ko.observableArray([]);
    self.TDSLoaded = ko.observable(false);
    self.TDSDataSource = ko.observable();
    self.tdsHeading = ko.observable();
    self.noYears = 3;
    self.financialYear = ko.observable();
    self.financialYears = ko.observableArray([]);
    self.yearsLoaded = ko.observable(false);
    self.showDownload = ko.observable(false);
    self.columnData = ko.observableArray([{
      "headerText": self.resource.tableHeading.accountNo,
      "field": "accountId",
      "style": "width:33%",
      "headerStyle": "width: 33%;"
    }, {
      "headerText": self.resource.tableHeading.interestEarned,
      "field": "interestEarned",
      "style": "text-align:right; width: 33%;",
      "sortable":"disabled",
      "headerStyle": "text-align: right; width: 33%;"
    }, {
      "headerText": self.resource.tableHeading.taxDeducted,
      "field": "taxDeducted",
      "style": "text-align:right",
      "sortable":"disabled",
      "headerStyle": "text-align: right;"
    }]);

    tdsModel.fetchCurrentDate().done(function(data) {
      self.currentDate = new Date(data.currentDate.valueDate);
      if ((self.currentDate.getMonth() + 1) <= 3) {
        self.financialYear(self.currentDate.getFullYear());
        for (var i = self.noYears; i > 0; i--) {
          self.financialYears.push({
            value: (self.currentDate.getFullYear() - i) + "",
            text: rootParams.baseModel.format(self.resource.year, {
              fromYear: self.currentDate.getFullYear() - i,
              toYear: self.currentDate.getFullYear() - i + 1
            })
          });
        }
      } else {
        self.financialYear((+self.currentDate.getFullYear()) + 1);
        for (i = self.noYears; i > 0; i--) {
          self.financialYears.push({
            value: (self.currentDate.getFullYear() - i + 1) + "",
            text: rootParams.baseModel.format(self.resource.year, {
              fromYear: self.currentDate.getFullYear() - i + 1,
              toYear: self.currentDate.getFullYear() - i + 2
            })
          });
        }
      }
      self.yearsLoaded(true);
    });

    /**
     * self - description
     *
     * @return {type}  description
     */
     self.download = function() {
       $("#passwordDialog").trigger("openModal");
       tdsModel.download("TD_I_TDS",self.fromDate(), self.toDate());
     };

     /**
      * self - description
      *
      * @return {type}  description
      */
     self.ok = function() {
       $("#passwordDialog").trigger("closeModal");
     };

    /**
     * self - description
     *
     * @return {type}  description
     */
    self.view = function() {
      self.showDownload(false);
      self.TDSLoaded(false);
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        self.fromDate(self.years() + "-04-01");
        if ((+self.years() + 1) === self.financialYear()) {
          self.toDate((+self.currentDate.getFullYear()) + "-" + (+self.currentDate.getMonth() + 1) + "-" + self.currentDate.getDate());
        } else {
          self.toDate((+self.years() + 1) + "-03-31");
        }
      var tds = [];
      var total = 0;
      var currency;
      tdsModel.view("TD_I_TDS",self.fromDate(), self.toDate()).done(function(data) {
        if (data && data.depositTaxPaidListResponseDTO && data.depositTaxPaidListResponseDTO.length > 0) {
            for (var i = 0; i < data.depositTaxPaidListResponseDTO.length; i++) {
        if (data.depositTaxPaidListResponseDTO[i].totalInterest && data.depositTaxPaidListResponseDTO[i].totalTaxPaid) {
          tds.push({
            accountId: data.depositTaxPaidListResponseDTO[i].depositTaxPaidDTOs[0].accountId.displayValue,
            interestEarned: self.rootParams.baseModel.formatCurrency(data.depositTaxPaidListResponseDTO[i].totalInterest.amount, data.depositTaxPaidListResponseDTO[i].totalInterest.currency),
            taxDeducted: self.rootParams.baseModel.formatCurrency(data.depositTaxPaidListResponseDTO[i].totalTaxPaid.amount, data.depositTaxPaidListResponseDTO[i].totalTaxPaid.currency),
            id: i
          });
          total = +total + parseFloat(data.depositTaxPaidListResponseDTO[i].totalTaxPaid.amount);
          currency = data.depositTaxPaidListResponseDTO[i].totalTaxPaid.currency;
          }
      }
      var year = self.years();
      if(currency){
      self.tdsHeading(self.rootParams.baseModel.format(self.resource.tdsHeading, {
        year: year,
        amount: self.rootParams.baseModel.formatCurrency(total, currency)
      }));
    }
    }
    if(tds.length>0){
      self.showDownload(true);
    }
        self.dataprovider = new oj.ArrayTableDataSource(tds, {
          idAttribute: ["id"]
        });
        self.TDSDataSource(new oj.PagingTableDataSource(self.dataprovider));
        self.TDSLoaded(true);
      });
    }
      else {
       tracker.showMessages();
       tracker.focusOn("@firstInvalidShown");
   }
  };
};
});
