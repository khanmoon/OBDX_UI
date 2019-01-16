define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/service-requests-configuration",
  "./model",
  "jqueryui-amd/widgets/sortable",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojpagingcontrol",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, constants, ResourceBundle) {
  "use strict";

  return function(Params) {
    var self = this;

    ko.utils.extend(self, Params.rootModel);

    self.model = Params.model;
    self.validationTracker = ko.observable();
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.serviceRequest.header);
    self.transactionName = ko.observable("Maintenance");
    self.natureOfTask = ko.observable();
    self.remarks = ko.observable();
    self.transactions = ko.observable();
    self.disableApproveRejectButton = ko.observable(true);
    self.showModal = ko.observable(false);

    Params.baseModel.registerComponent("service-requests-admin-track", "service-requests");
    Params.baseModel.registerComponent("service-requests-detail", "service-requests");
    Params.baseModel.registerComponent("service-requests-batch-approval", "service-requests");

    self.pagingDatasource(new oj.PagingTableDataSource(self.datasource));

    self.renderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.refnumber);
      checkBox.attr("name", "selection" + context.row.refnumber);
      checkBox.attr("aria-label", self.resource.serviceRequest.selectOneLabel);
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.refnumber + "_labelID");
      label.attr("for", context.row.refnumber + "_labelID");
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
    };
    self.renderHeadCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", "selectAll");
      checkBox.attr("name", "Parent");
      checkBox.attr("id", "headerbox_labelID");
      checkBox.attr("aria-label", self.resource.serviceRequest.selectAllLabel);
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", "headerbox_labelID");
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
    };

    self.columnsArray = [{
      headerRenderer: self.renderHeadCheckBox,
      renderer: self.renderCheckBox,
      sortable: "none"
    }, {
      headerText: self.resource.serviceRequest.date,
      field: "date"
    }, {
      headerText: self.resource.serviceRequest.requestName,
      renderer: oj.KnockoutTemplateUtils.getRenderer("requesttype_template", true),
      field: "requesttype"
    }, {
      headerText: self.resource.serviceRequest.requestedby,
      field: "requestedby"
    }, {
      headerText: self.resource.serviceRequest.userid,
      field: "userid"
    }, {
      headerText: self.resource.serviceRequest.partyname,
      field: "partyname",
      className: "ref-no-text"
    }, {
      headerText: self.resource.serviceRequest.refnumber,
      field: "refnumber"
    }, {
      headerText: self.resource.serviceRequest.statustype,
      field: "statustype"
    }, {
      renderer: oj.KnockoutTemplateUtils.getRenderer("alert_template", true),
      field: "iconClass"
    }];

    self.columnsArrayPending = [{
      headerText: self.resource.serviceRequest.date,
      field: "date"
    }, {
      headerText: self.resource.serviceRequest.requestName,
      renderer: oj.KnockoutTemplateUtils.getRenderer("requesttype_template", true),
      field: "requesttype"
    }, {
      headerText: self.resource.serviceRequest.requestedby,
      field: "requestedby"
    }, {
      headerText: self.resource.serviceRequest.userid,
      field: "userid"
    }, {
      headerText: self.resource.serviceRequest.partyname,
      field: "partyname",
      className: "ref-no-text"
    }, {
      headerText: self.resource.serviceRequest.refnumber,
      field: "refnumber"
    }, {
      headerText: self.resource.serviceRequest.statustype,
      field: "statustype"
    }, {
      renderer: oj.KnockoutTemplateUtils.getRenderer("alert_template", true),
      field: "iconClass"
    }];

    self.columnsArrayRetail = [{
      headerText: self.resource.serviceRequest.date,
      field: "date"
    }, {
      headerText: self.resource.serviceRequest.requesttype,
      renderer: oj.KnockoutTemplateUtils.getRenderer("requesttype_template", true),
      field: "requesttype"
    }, {
      headerText: self.resource.serviceRequest.refnumber,
      field: "refnumber"
    }, {
      headerText: self.resource.serviceRequest.statustype,
      field: "statustype"
    }];

    self.gotoMainScreen = function() {
      Params.dashboard.loadComponent("service-requests-list", {}, self);
    };
    self.goBack = function() {
      self.loadSecondScreen(true);
      Params.dashboard.loadComponent("service-requests-list", {}, self);
    };

    self.currentSelectionAdmin = function(data) {
      if(data.requestname==="OTHERS")
      {
        self.serviceRequest(data.refnumber);
        delete self.backFromDetails;
        Params.dashboard.loadComponent("service-requests-admin-track", {}, self);
      }
      else{
      self.serviceRequest(data.refnumber);
      delete self.backFromDetails;
      Params.dashboard.loadComponent("service-requests-detail", {}, self);
    }
    };

    self.currentSelection = function(event) {
      if (event.detail.value) {
        var selectionObj = event.detail.value;
        if ((selectionObj && selectionObj.length > 0 && selectionObj[0].startKey && selectionObj[0].startKey.row) || (selectionObj && selectionObj.rowKey)) {
          if (event.detail.value) {
            self.serviceRequest(selectionObj[0].startKey.row);
          } else {
            self.serviceRequest(selectionObj.rowKey);
          }
          delete self.backFromDetails;
          Params.dashboard.loadComponent("service-requests-detail", {}, self);
        }
      }
    };

    self.handleSelectionChanged = function(event) {
      self.serviceRequest(event.detail.value);
      delete self.backFromDetails;
      Params.dashboard.loadComponent("service-requests-detail", {}, self);
    };

    self.handleCurrentItemChanged = function(event) {
      self.serviceRequest(event.detail.value);
      delete self.backFromDetails;
      Params.dashboard.loadComponent("service-requests-detail", {}, self);
    };

    self.checked = false;
    if (constants.userSegment === "RETAIL") {
      $("#srList").on("ojoptionchange", self.currentSelection);
    }

    $(document).off("ojoptionchange", "#paging");
    $(document).on("ojoptionchange", "#paging", function(event) {
      if (event.detail && event.detail.value) {
        $("#headerbox_labelID").prop("checked", false);
      }
    });

    $(document).on("click", "#headerbox_labelID", function() {
      self.checked = !self.checked;
      if (self.checked) {
        $("input[name^=\"selection\"]").prop("checked", true);
      } else {
        $("input[name^=\"selection\"]").prop("checked", false);
      }
    });
    self.getTemplate = function() {
      if (constants.userSegment === "RETAIL") {
        return "templateRetail";
      }
      return "template";
    };
  };
});
