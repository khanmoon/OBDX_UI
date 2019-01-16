
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/report-list",
  "framework/js/constants/constants",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojlistview",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojcollectiontabledatasource"
], function(oj, ko, $, reportListModel, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.reportList;
    rootParams.dashboard.headerName(self.Nls.reportList);
    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    rootParams.baseModel.registerElement("date-time");
    rootParams.baseModel.registerElement("nav-bar");
    self.reportType = ko.observable();
    self.reportTypeListMap = {};
    self.selectedreportType = ko.observable();
    self.searchEnabled = ko.observable(false);
    self.reportTypeList = ko.observableArray();
    self.isReportTypeListLoaded = ko.observable(false);
    self.reportFormatList = ko.observableArray();
    self.reportFormatListFromEnum = ko.observableArray();
    self.reportFormatListMap = {};
    self.isReportFormatListLoaded = ko.observable(false);
    self.reportMapForReportId = {};
    self.reportDetails = ko.observableArray();
    self.datasource = ko.observable();
    self.pageNumber = ko.observable();
    self.viewing = ko.observable();
    self.frequencyList = ko.observableArray();
    self.frequencyListMap = {};
    self.isReportFrequencyListLoaded = ko.observable(false);
    self.reportDetails = ko.observableArray();
    self.isDefault = ko.observable(true);
    self.menuSelection = ko.observable();
    self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    self.columnArray = [{
      headerText: self.Nls.reportName,
      field: "reportName"
    }, {
      headerText: self.Nls.reportSubId,
      field: "reportRequestId",
      renderer: oj.KnockoutTemplateUtils.getRenderer("download_report", true)
    }, {
      headerText: self.Nls.generationDateTime,
      field: "executionDate"
    }, {
      headerText: self.Nls.reportStatus,
      template: "reportStatus",
      field: "status"
    }];
    self.uiOptions = {
      "menuFloat": "left",
      "fullWidth": false,
      "defaultOption": self.menuSelection
    };
    self.menuOptions = ko.observableArray();
    self.totalCount = ko.observable();
    self.searchData = {
      reportId: "",
      reportType: "",
      generationDateStartRange: "",
      generationDateEndRange: ""
    };
    self.searchData = ko.mapping.fromJS(self.searchData);
    self.currentSearchData = self.searchData;
    self.searchEnable = function() {
      $("#search").slideToggle(function() {
        if ($("#search:hidden").length === 0)
          self.searchEnabled(true);
        else
          self.searchEnabled(false);
      });
    };
    self.closeSearch = function() {
      $("#search").slideToggle();
      self.searchEnabled(false);
    };
    self.refreshSearch = function() {
      self.searchData.reportId("reset");
      self.searchData.reportId("");
      self.searchData.reportType([]);
      self.searchData.generationDateStartRange("");
      self.searchData.generationDateEndtRange("");
    };

    self.listReports = function(options, model) {
      self.pageNumber(Math.floor(options.startIndex / 10) + 1);
      if (!self.isReportTypeListLoaded()) {
        reportListModel.getReportTypes(Constants.userSegment).done(function(data) {
          for (var i = 0; i < data.listResponseDTO.length; i++) {
            self.reportTypeList.push(data.listResponseDTO[i]);
            self.reportMapForReportId[self.reportTypeList()[i].reportId] = self.reportTypeList()[i];
          }
          self.isReportTypeListLoaded(true);
          self.loadReportList(options, model);
        });
      } else {
        self.loadReportList(options, model);
      }
    };
    self.loadReportList = function(options, model) {
      reportListModel.listReportHistory(self.generateURL()).done(function(data) {
        self.reportDetails.removeAll();
        self.totalCount(data.totalCount);
        if (data.listResponseDTO) {
          for (var i = 0; i < data.listResponseDTO.length; i++) {
            var reportData = data.listResponseDTO[i];
            reportData.reportName = self.reportMapForReportId[reportData.description].description;
            if (reportData.executionDate && reportData.executionDate !=="-") {
              reportData.executionDate = rootParams.baseModel.formatDate(reportData.executionDate, "dateTimeStampFormat");
            } else {
              reportData.executionDate = "-";
            }
            self.reportDetails.push(reportData);
          }
        }
        options.success(self.reportDetails());
        model.totalResults = self.totalCount();
      });
    };
    reportListModel.getReportFrequencyTypes().done(function(data) {
      self.frequencyList(data.enumRepresentations[0].data.slice(0, 2));
      for (var i = 0; i < self.frequencyList().length; i++) {
        self.frequencyListMap[self.frequencyList()[i].code] = self.frequencyList()[i].description;
      }
      self.loadMenu();
      self.isReportFrequencyListLoaded(true);
      ko.tasks.runEarly();
      self.searchEnable();
    });
    self.loadMenu = function() {
      for (var i = 0; i < self.frequencyList().length; i++) {
        self.menuOptions.push({
          id: self.frequencyList()[i].code,
          label: self.frequencyList()[i].description
        });
      }
      self.menuSelection(self.menuOptions()[0].id);
    };
    self.myFetch = function(method, model, options) {
      if (method === "read" && model instanceof oj.Collection) {
        self.listReports(options, model);
      }
    };
    self.createTableSource = function() {
      self.reportDetailsCol = ko.observable();
      self.reportDetail = oj.Model.extend({
        idAttribute: "reportRequestId",
        sync: self.myFetch
      });
      self.myReportDetail = new self.reportDetail();
      self.reportDetailsCollection = oj.Collection.extend({
        model: self.myReportDetail,
        sync: self.myFetch,
        fetchSize: 10,
        hasMore: true
      });
      self.reportDetailsCol(new self.reportDetailsCollection());
      self.datasource(new oj.PagingTableDataSource(new oj.CollectionTableDataSource(self.reportDetailsCol(), {
        idAttribute: "reportRequestId"
      })));
      self.screenType();
    };
    self.screenType = function() {
      if (rootParams.baseModel.large())
        self.reportDetailsCol().reset();
      else
        self.reportDetailsCol().refresh();
    };
    self.createTableSource();
    self.searchReport = function() {
      if(self.searchData.generationDateStartRange() > self.today() )
         rootParams.baseModel.showMessages(null, [self.Nls.invalidStartDate], "ERROR");
      if(self.searchData.generationDateEndRange() > self.today() )
         rootParams.baseModel.showMessages(null, [self.Nls.invalidEndDate], "ERROR");
      if(self.searchData.generationDateEndRange() < self.searchData.generationDateStartRange()){
         rootParams.baseModel.showMessages(null, [self.Nls.invalidDateCombo], "ERROR");
       }else
              {
  if(self.searchData.reportType())
        self.searchData.reportType(self.searchData.reportType() + "");
      if(self.searchData.generationDateStartRange())
       self.searchData.generationDateStartRange(self.searchData.generationDateStartRange() + "");
      if(self.searchData.generationDateEndRange())
        self.searchData.generationDateEndRange(self.searchData.generationDateEndRange() + "");
      self.isDefault(false);
      self.pageNumber(1);
      self.currentSearchData = ko.mapping.toJS(self.searchData);
      self.screenType();}


    };
    var user = {
      "CORP": "U",
      "ADMIN": "A",
      "CORPADMIN": "C",
      "RETAIL": "U"
    };
    self.menuSelection.subscribe(function() {
     if(self.searchData.generationDateStartRange())
      self.searchData.generationDateStartRange(null);
     if(self.searchData.generationDateEndRange())
      self.searchData.generationDateEndRange(null);
     if(self.searchData.reportId())
       self.searchData.reportId(null);
     if(self.searchData.reportType())
        $("#reportName").val("");
     if( self.searchEnabled()){
       $("#search").slideToggle();
       self.searchEnabled(false);
     }


      self.screenType();
    });
    self.generateURL = function() {
      self.viewing("");
      if (!self.isDefault()) {
        if (!self.currentSearchData.reportId) {
          self.viewing(self.Nls.searchResults);
          return "reports/reportProcessHistory?pageSize=10&pageNo=" + self.pageNumber() + "&reportType=" + user[Constants.userSegment] + "&reportFrequency=" + self.menuSelection()+"&reportId="+self.searchData.reportType()
          +"&generationDateStartRange="+self.searchData.generationDateStartRange()+"&generationDateEndRange="+self.searchData.generationDateEndRange();
        }
          self.viewing(rootParams.baseModel.format(self.Nls.reportId, {
            reportId: self.currentSearchData.reportId
          }));
          return "reports/reportProcessHistory?pageSize=10&pageNo=" + self.pageNumber() + "&reportRequestId=" + self.currentSearchData.reportId + "&reportType=" + user[Constants.userSegment] + "&reportFrequency=" + self.menuSelection();

      }
return "reports/reportProcessHistory?pageSize=10&pageNo=" + self.pageNumber() + "&reportType=" + user[Constants.userSegment] + "&reportFrequency=" + self.menuSelection()+"&reportId="+self.searchData.reportType()
          +"&generationDateStartRange="+self.searchData.generationDateStartRange()+"&generationDateEndRange="+self.searchData.generationDateEndRange();
    };
    self.downloadReport = function(data) {
      reportListModel.downloadReport(data);
    };
  };
});
