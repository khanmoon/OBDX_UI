define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback-analysis",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojcore",
  "ojs/ojdatetimepicker",
  "ojs/ojchart",
  "ojs/ojnavigationlist",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojprogress",
  "ojs/ojselectcombobox",
  "ojs/ojgauge"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;

    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.transactionList = ko.observableArray([]);
    self.feedbackUserRole = ko.observable([]);
    self.selectedTransaction = ko.observable();
    self.selectedTimeFrame = ko.observable();
    self.fromDate = ko.observable();
    self.innerRadius = ko.observable(0.5);
    self.toDate = ko.observable();
    self.selectedItemGlobal = ko.observable("threetxn");
    self.titleForPie = ko.observable();
    self.selectedAccessPoint = ko.observable();
    self.selectedDataSet = ko.observable();
    self.chartLoaded = ko.observable(false);
    self.showAllTransactionsAnalytics = ko.observable(false);
    self.pieChartData = ko.observable([]);
    self.transactionId = ko.observable("ALL");
    self.allPieChartData = ko.observableArray([]);
    self.allPieChartDataBottom = ko.observableArray([]);
    self.accessPoint = ko.observable([]);
    self.groupValid = ko.observable();
    self.timeFrameData = ko.observable([]);
    self.transactionsLoaded = ko.observable(false);
    self.timeFrameDataLoaded = ko.observable(false);
    self.showTopThreeBottomThreeTxn = ko.observable(false);
    self.showIndividualTxnScreenLoaded = ko.observable(false);
    self.accessPointLoaded = ko.observable(false);
    self.selectedItem = ko.observable();
    self.questions = ko.observable([]);
    self.temp_datePickerLoaded = ko.observable(false);
    self.defaultShowComments = ko.observable(false);
    self.ratingDTO = ko.observable([]);
    self.feedbackUserRoleLoaded = ko.observable(false);
    self.orientationValue = ko.observable("vertical");
    self.lineChartData = ko.observable([]);
    self.lineChartGroup = ko.observable([]);
    self.totalAverageRating = ko.observable();
    self.topCount = ko.observable();
    self.bottomCount = ko.observable();
    self.totalRating = ko.observable();
    self.showNoData = ko.observable(false);
    self.ratingComments = ko.observable([]);
    self.charColor = ko.observableArray(["#33C5CF", "#14BA92", "#FAC85A", "#FF669E", "#A65496"]);
    self.currentComments = ko.observable([]);
    self.defaultRatingComments = ko.observable([]);
    self.showComments = ko.observable(false);
    params.dashboard.headerName(self.resource.analysisHeader);
    self.convertToInt = function(data) {
      return parseInt(data);
    };

    self.showIndividualTxn = function() {
      self.showIndividualTxnScreenLoaded(true);
    };

    self.submit = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        self.chartLoaded(false);
        self.showNoData(false);
        ko.tasks.runEarly();
        FeedbackModel.getLineChartData(self.selectedTransaction(), self.selectedAccessPoint(), self.selectedDataSet().toLowerCase(), self.selectedTimeFrame()).done(function(data) {
          self.lineChartGroup().length = 0;
          self.lineChartData().length = 0;
          if (data.ratingPeriodDTOs && data.ratingPeriodDTOs.length > 0) {
            for (var j = 0; j < data.ratingPeriodDTOs.length; j++) {
              self.lineChartGroup().push(data.ratingPeriodDTOs[j].period);
              data.ratingPeriodDTOs[j].ratingDTOs.sort(function(a, b) {
                return a.rating - b.rating;
              });
              for (var i = 0; i < data.ratingPeriodDTOs[j].ratingDTOs.length; i++) {
                if (j === 0) {
                  self.lineChartData().push({
                    name: parseInt(data.ratingPeriodDTOs[0].ratingDTOs[i].rating) + self.resource.starLabel,
                    items: [],
                    color: self.charColor()[i]
                  });
                }
                self.lineChartData()[i].items.push(parseInt(data.ratingPeriodDTOs[j].ratingDTOs[i].ratingPercentage));
              }
            }
            FeedbackModel.getPieChartData(self.selectedTransaction(), self.selectedAccessPoint(), self.selectedDataSet().toLowerCase(), self.fromDate(), self.toDate()).done(function(data) {
              self.pieChartData().length = 0;
              if (data.definitionReportDTO) {
                self.allPieChartDataRating = ko.observable(data.definitionReportDTO[0].ratingDTO);
                var pieChartDataObject = [{}];
                for (var i = 0; i < data.definitionReportDTO[0].ratingDTO.length; i++) {


                  pieChartDataObject = {
                    name: [parseInt(data.definitionReportDTO[0].ratingDTO[i].rating)] + self.resource.starLabel,
                    items: [data.definitionReportDTO[0].ratingDTO[i].ratingCount],
                    color: self.charColor()[i]
                  };
                  self.pieChartData().push(pieChartDataObject);
                }
                self.defaultRatingComments([]);
                if (data.definitionReportDTO[0].ratingDTO[0].ratingComments) {
                   for (var m = 0; m < data.definitionReportDTO[0].ratingDTO[0].ratingComments.length; m++) {
                     if (data.definitionReportDTO[0].ratingDTO[0].ratingComments[m].comments) {
                       self.defaultRatingComments().push(data.definitionReportDTO[0].ratingDTO[0].ratingComments[m]);
                     } else {
                       self.defaultRatingComments().push(self.resource.noCommentFound);
                     }
                   }
                   self.totalAverageRating(data.definitionReportDTO[0].totalAverageRating);
                   self.totalRating(data.definitionReportDTO[0].totalRating);
                   self.ratingDTO(data.definitionReportDTO[0].ratingDTO);
                   self.selectedItem(self.allPieChartDataRating()[0].rating);
                   self.showComments(true);
                   self.defaultShowComments(true);
                 }
               }
              self.showIndividualTxnScreenLoaded(true);
              self.chartLoaded(true);
              self.showTopThreeBottomThreeTxn(false);
              self.showAllTransactionsAnalytics(false);
            });
          } else {
            self.showNoData(true);
          }
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
    self.tabChangeHandler = function(event) {
      self.defaultShowComments(false);
      if (event.detail.value) {
        for (var i = 0; i < self.allPieChartDataRating().length; i++) {
          if (parseInt(self.allPieChartDataRating()[i].rating) === parseInt(event.detail.value)) {
            if (self.allPieChartDataRating()[i].ratingComments) {
              self.showComments(false);
              self.currentComments(self.allPieChartDataRating()[i].ratingComments);
              ko.tasks.runEarly();
              self.showComments(true);
            }
          }
        }
      }
    };

    self.selectPeriodHandler = function(event, data) {
      var date = params.baseModel.getDate();
      var date2 = params.baseModel.getDate();
      if (data.timeFrameData()[0].code === event.detail.value) {
        date2.setDate(date.getDate() - 7);
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(date2));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
      }
      if (data.timeFrameData()[1].code === event.detail.value) {
        date2.setMonth(date.getMonth() - 1);
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(date2));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
      }
      if (data.timeFrameData()[2].code === event.detail.value) {
        date2.setMonth(date.getMonth() - 3);
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(date2));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
      }
      if (data.timeFrameData()[3].code === event.detail.value) {
        date2.setMonth(date.getMonth() - 6);
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(date2));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
      }
      if (data.timeFrameData()[4].code === event.detail.value) {
        date2.setMonth(date.getMonth() - 12);
        self.fromDate(oj.IntlConverterUtils.dateToLocalIso(date2));
        self.toDate(oj.IntlConverterUtils.dateToLocalIso(date));
      }
      if (data.timeFrameData()[5].code === event.detail.value) {
        data.temp_datePickerLoaded(true);
      }
    };

    self.showtopThreebottomThreeTransaction = function() {
      FeedbackModel.getThreeTxnData(self.bottomCount(), self.topCount()).done(function(data) {
        self.allPieChartData([]);
        self.allPieChartDataBottom([]);
        if (data.definitionReportDTO) {
          var pieChartDataObject = {};
          for (var j = 0; j < data.definitionReportDTO.length; j++) {
            if (j < 3) {
              self.allPieChartData().push(data.definitionReportDTO[j]);
              self.allPieChartData()[j].pieChartData = ko.observableArray();
              self.pieChartData().length = 0;
              for (var i = 0; i < data.definitionReportDTO[j].ratingDTO.length; i++) {
                pieChartDataObject = {
                  name: [(parseInt(data.definitionReportDTO[j].ratingDTO[i].rating))] + self.resource.starLabel,
                  items: [data.definitionReportDTO[j].ratingDTO[i].ratingCount],
                  color: self.charColor()[i]
                };
                self.allPieChartData()[j].pieChartData().push(pieChartDataObject);
              }
              self.titleForPie(data.definitionReportDTO[j].taskName);
              self.totalAverageRating(data.definitionReportDTO[j].totalAverageRating);
              self.ratingDTO(data.definitionReportDTO[j].ratingDTO);
              self.totalRating(data.definitionReportDTO[j].totalRating);
            }
          }
          for (var k = data.definitionReportDTO.length - 1; k >= 0; k--) {
            if (k >= data.definitionReportDTO.length - 3) {
              self.allPieChartDataBottom().push(data.definitionReportDTO[k]);
              self.allPieChartDataBottom()[data.definitionReportDTO.length - 1 - k].pieChartData = ko.observableArray();
              self.pieChartData().length = 0;
              var pieChartDataObject1 = null;
              for (var m = 0; m < data.definitionReportDTO[k].ratingDTO.length; m++) {
                pieChartDataObject1 = {
                  name: [(parseInt(data.definitionReportDTO[k].ratingDTO[m].rating))] + self.resource.starLabel,
                  items: [data.definitionReportDTO[k].ratingDTO[m].ratingCount],
                  color: self.charColor()[m]
                };
                self.allPieChartDataBottom()[data.definitionReportDTO.length - 1 - k].pieChartData().push(pieChartDataObject1);
              }
              self.titleForPie(data.definitionReportDTO[k].taskName);
              self.totalAverageRating(data.definitionReportDTO[k].totalAverageRating);
              self.ratingDTO(data.definitionReportDTO[k].ratingDTO);
              self.totalRating(data.definitionReportDTO[k].totalRating);
            }
          }
          self.showTopThreeBottomThreeTxn(true);
          self.showIndividualTxnScreenLoaded(false);
          self.chartLoaded(false);
          self.showAllTransactionsAnalytics(false);
        }
      });
    };

    self.showtopThreebottomThreeTransaction();
    self.showAllTransactions = function() {
      FeedbackModel.getLineChartData().done(function(data) {
        self.lineChartGroup().length = 0;
        self.lineChartData().length = 0;
        if (data.ratingPeriodDTOs) {
          for (var j = 0; j < data.ratingPeriodDTOs.length; j++) {
            self.lineChartGroup().push(data.ratingPeriodDTOs[j].period);
            data.ratingPeriodDTOs[j].ratingDTOs.sort(function(a, b) {
              return a.rating - b.rating;
            });
            for (var i = 0; i < data.ratingPeriodDTOs[j].ratingDTOs.length; i++) {
              if (j === 0) {
                self.lineChartData().push({
                  name: parseInt(data.ratingPeriodDTOs[0].ratingDTOs[i].rating) + self.resource.starLabel,
                  items: [],
                  color: self.charColor()[i]
                });
              }
              self.lineChartData()[i].items.push(parseInt(data.ratingPeriodDTOs[j].ratingDTOs[i].ratingPercentage));
            }
          }
        }
        FeedbackModel.getPieChartData(self.transactionId()).done(function(data) {
          self.pieChartData().length = 0;
          if (data.definitionReportDTO) {
            self.allPieChartData(data.definitionReportDTO);
            var pieChartDataObject = [{}];
            for (var i = 0; i < data.definitionReportDTO[0].ratingDTO.length; i++) {
              pieChartDataObject = {
                name: [parseInt(data.definitionReportDTO[0].ratingDTO[i].rating)] + self.resource.starLabel,
                items: [data.definitionReportDTO[0].ratingDTO[i].ratingCount],
                color: self.charColor()[i]
              };
              self.pieChartData().push(pieChartDataObject);

            }
            self.totalAverageRating(data.definitionReportDTO[0].totalAverageRating);
            self.totalRating(data.definitionReportDTO[0].totalRating);
          }
          self.showAllTransactionsAnalytics(true);
          self.showIndividualTxnScreenLoaded(false);

          self.chartLoaded(false);
          self.showTopThreeBottomThreeTxn(false);
        });
      });
    };
    FeedbackModel.getAccessPoint().done(function(data) {
      if (data.accessPointListDTO) {
        self.accessPoint(data.accessPointListDTO);
        self.accessPointLoaded(true);
      }
    });
    FeedbackModel.getFeedbackUserRole().done(function(data) {
      if (data.enterpriseRoleDTOs) {
        self.feedbackUserRole(data.enterpriseRoleDTOs);
        self.feedbackUserRoleLoaded(true);
      }
    });
    FeedbackModel.getTimeFrameData().done(function(data) {
      if (data.enumRepresentations) {
        self.timeFrameData(data.enumRepresentations[0].data);
        self.timeFrameDataLoaded(true);
      }
    });
    FeedbackModel.getFeedbackTransaction().done(function(data) {
      if (data.taskList) {
        for (var i = 0; i < data.taskList.length; i++) {
          for (var j = 0; j < data.taskList[i].childTasks.length; j++) {
            if (data.taskList[i].childTasks[j].childTasks) {
              for (var k = 0; k < data.taskList[i].childTasks[j].childTasks.length; k++) {
                self.transactionList().push(data.taskList[i].childTasks[j].childTasks[k]);
              }
            }
          }
        }
        self.transactionsLoaded(true);
      }
    });
    self.clearFields = function() {
      self.selectedTransaction("");
      self.selectedTimeFrame("");
      self.selectedDataSet("");
      self.selectedAccessPoint("");
    };
  };
});
