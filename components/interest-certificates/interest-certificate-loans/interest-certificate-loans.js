define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/interest-certificates",
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
  "ojs/ojvalidationgroup",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, $, loansModel, Constants, resourceBundle) {
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
    self.customPayeeId = ko.observable();
    self.fromFavourites = ko.observable(false);
    self.year = ko.observable(false);
    self.years = ko.observable("");
    rootParams.dashboard.headerName(resourceBundle.title);
    self.type = ko.observable("loan");
    self.fromDate = ko.observable("");
    self.toDate = ko.observable("");
    self.interestsLoaded = ko.observable(false);
    self.currentDate = rootParams.baseModel.getDate();
    self.minFromDate = ko.observable();
    self.maxFromDate = ko.observable();
    self.minToDate = ko.observable();
    self.maxToDate = ko.observable();
    self.noYears = 3;
    self.financialYear = ko.observable();
    self.financialYears = ko.observableArray([]);
    self.interests = ko.observableArray([]);
    self.yearsLoaded = ko.observable(false);
    self.numberOfAccounts = ko.observable("single");
    self.showDownload = ko.observable(false);
    self.pagingTableDataSource = ko.observable();
    self.columnData = ko.observableArray([{
      "headerText": self.resource.tableHeading.accountNo,
      "field": "accountId"
    }, {
      "headerText": self.resource.tableHeading.productType,
      "field": "productName"
    }, {
      "headerText": self.resource.tableHeading.date,
      "field": "date"
    }, {
      "headerText": self.resource.tableHeading.interestPaid,
      "field": "interestAmount"
    }]);
    if (self.rootParams.rootModel.params.id && self.rootParams.rootModel.params.type === "LON") {
      self.customPayeeId(self.rootParams.rootModel.params.id.value);
    } else {
      self.customPayeeId("");
    }
    loansModel.fetchCurrentDate().done(function(data) {
      self.currentDate = new Date(data.currentDate.valueDate);
      if ((self.currentDate.getMonth() + 1) <= 3) {
        self.financialYear(self.currentDate.getFullYear());
        self.minFromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear() - 3, "03", "01")));
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
        self.minFromDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.currentDate.getFullYear() - 2, "03", "01")));
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
      self.maxFromDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate));
      self.maxToDate(oj.IntlConverterUtils.dateToLocalIso(self.currentDate));
      self.minToDate(self.fromDate());
      self.yearsLoaded(true);
    });
    /**
     * Option change handler for Financial Year/ Duration
     *
     * @return {type} description
     */
    self.optionChanged = function() {
      self.fromDate("");
      self.toDate("");
      self.years("");
      if (self.duration() === "duration") {
        self.year(true);
      } else {
        self.year(false);
      }

    };
    /**
     * Option change handler for number of Accounts
     *
     * @return {type}  description
     */
    self.numberOfAccountsHandler = function(){
      self.fromDate("");
      self.toDate("");
      self.years("");
      self.year(false);
      self.duration("financialYear");
        self.dataprovider = new oj.ArrayTableDataSource([], {
        idAttribute: ["id"]
        });
        self.interestsLoaded(false);
    };

    /**
     * self - description
     *
     * @return {type} description
     */
    self.view = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
          self.showDownload(false);
          self.interestsLoaded(false);
        if (self.duration() === "financialYear") {
          self.fromDate(self.years() + "-04-01");
          if ((+self.years() + 1) === self.financialYear()) {
            self.toDate((+self.currentDate.getFullYear()) + "-" + (+self.currentDate.getMonth() + 1) + "-" + self.currentDate.getDate());
          } else {
            self.toDate((+self.years() + 1) + "-03-31");
          }
        }
        if(self.numberOfAccounts() === "single"){
        loansModel.fetchLoanInterests(ko.utils.unwrapObservable(self.customPayeeId()), self.fromDate(), self.toDate()).done(function(data) {
          self.interests.removeAll();
          if (data.loanAccountInterestListResponseDTO && data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO && data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO.length > 0) {
            for(var i=0; i<data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO.length; i++){
              self.interests.push({
              accountId: data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO[i].accountId.displayValue,
              interestAmount: self.rootParams.baseModel.formatCurrency(data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO[i].interestAmount.amount, data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO[i].interestAmount.currency),
              productName: data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO[i].productName,
              date: self.rootParams.baseModel.formatDate(data.loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO[i].date),
              id: i
            });
          }}
          if(self.interests().length>0){
            self.showDownload(true);
          }
          self.dataprovider = new oj.ArrayTableDataSource(self.interests, {
            idAttribute: ["id"]
          });
          self.pagingTableDataSource(new oj.PagingTableDataSource(self.dataprovider));
          self.interestsLoaded(true);
        });
      }
      else if(self.numberOfAccounts() === "all"){
        loansModel.fetchLoanInterestsForAll("LN_I_IC", self.fromDate(), self.toDate()).done(function(data) {
          self.interests.removeAll();
          if (data.loanAccountInterestResponseDTOs && data.loanAccountInterestResponseDTOs.length > 0) {
            var k=0;
            for(var i=0; i<data.loanAccountInterestResponseDTOs.length; i++){
              if(data.loanAccountInterestResponseDTOs[i].loanAccountInterestListResponseDTO){
                for(var j=0; j<data.loanAccountInterestResponseDTOs[i].loanAccountInterestListResponseDTO.loanAccountInterestResponseDTO.length; j++){
            var interests=data.loanAccountInterestResponseDTOs[i].loanAccountInterestListResponseDTO;
            self.interests.push({
              accountId: interests.loanAccountInterestResponseDTO[j].accountId.displayValue,
              interestAmount: self.rootParams.baseModel.formatCurrency(interests.loanAccountInterestResponseDTO[j].interestAmount.amount, interests.loanAccountInterestResponseDTO[j].interestAmount.currency),
              productName: interests.loanAccountInterestResponseDTO[j].productName,
              date: self.rootParams.baseModel.formatDate(interests.loanAccountInterestResponseDTO[j].date),
              id: ++k
            });
          }
          }
        }}
        if(self.interests().length>0){
          self.showDownload(true);
        }
          self.dataprovider = new oj.ArrayTableDataSource(self.interests, {
            idAttribute: ["id"]
          });
          self.pagingTableDataSource(new oj.PagingTableDataSource(self.dataprovider));
          self.interestsLoaded(true);
        });
      }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    /**
     * anonymous function - description
     *
     * @return {type}  description
     */
    self.download = function() {
      $("#passwordDialog").trigger("openModal");
      if(self.numberOfAccounts() === "single"){
        loansModel.fetchPDF(ko.utils.unwrapObservable(self.customPayeeId()), self.fromDate(), self.toDate());
      }
      else if(self.numberOfAccounts() === "all"){
        loansModel.fetchPDFForAll("LN_I_IC", self.fromDate(), self.toDate());
      }
    };
    self.ok = function() {
      $("#passwordDialog").trigger("closeModal");
    };
  };
});
