define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/user-map",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojpagingcontrol",

  "ojs/ojradioset",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, UserFIMapModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle.userMap;
    rootParams.dashboard.headerName(self.Nls.userfimap);
    rootParams.baseModel.registerComponent("review-file-identifier-map", "file-upload");
    var getNewKoModel = function() {
      var KoModel = UserFIMapModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.FIMapModel = getNewKoModel().FIMapPaylaod;
    self.fileIdentifierList = ko.observableArray();
    self.dataArray = [];
    self.fileIdentifierMap = {};
    self.flagOne = ko.observable(false);
    self.flagTwo = ko.observable(false);
    self.showEdit = ko.observable(false);
    self.isListReady = ko.observable(false);
    self.datasource = ko.observable();
    self.isEnabled = ko.observable(false);
    self.actionType = ko.observable(self.Nls.view);
    self.approvalTypesMap = {};
    self.transactionTypesMap = {};
    self.isApprovalTypesLoaded = ko.observable(false);
    self.isTransactionTypesLoaded = ko.observable(false);
    self.getMappedFIs = function(userId, partyId) {
      UserFIMapModel.listMappedFI(userId, partyId).done(function(data) {
        for (var i = 0; i < data.userTemplateRelationships.length; i++) {
          self.fileIdentifierMap[data.userTemplateRelationships[i].fileIdentifierRegistrationDTO.fileIdentifier] = data.userTemplateRelationships[i];
        }
        self.flagOne(true);
      });
    };
    self.getMappedFIAdmin = function(userId) {
      UserFIMapModel.listMappedFIAdmin(userId).done(function(data) {
        for (var i = 0; i < data.userTemplateRelationships.length; i++) {
          self.fileIdentifierMap[data.userTemplateRelationships[i].fileIdentifierRegistrationDTO.fileIdentifier] = data.userTemplateRelationships[i];
        }
        self.flagOne(true);
      });
    };
    self.getAllFIs = function(partyId) {
      UserFIMapModel.listAllFI(partyId).done(function(data) {
        self.fileIdentifierList(data.fileIdentifierRegistrations);
        if (self.fileIdentifierList().length > 0)
          self.showEdit(true);
        self.flagTwo(true);
      });
    };
    self.getAllFIAdmin = function() {
      UserFIMapModel.listAllFIAdmin().done(function(data) {
        self.fileIdentifierList(data.fileIdentifierRegistrations);
        if (self.fileIdentifierList().length > 0)
          self.showEdit(true);
        self.flagTwo(true);
      });
    };
    if (self.selectedUser().partyId) {
      self.getMappedFIs(self.selectedUser().username, self.selectedUser().partyId);
      self.getAllFIs(self.selectedUser().partyId);
    } else {
      self.getMappedFIAdmin(self.selectedUser().username);
      self.getAllFIAdmin();
    }

    ko.computed(function() {
      if (self.flagOne() && self.flagTwo() && self.isApprovalTypesLoaded() && self.isTransactionTypesLoaded()) {
        var k = 0;
        var fidata;
        for (var key in self.fileIdentifierMap) {
          if (self.fileIdentifierMap[key]) {
            fidata = self.fileIdentifierMap[key].fileIdentifierRegistrationDTO;
            fidata.isMapped = ko.observable(true);
            fidata.sensitiveCheck = self.fileIdentifierMap[key].sensitiveCheck;
            fidata.approvalDesc = self.approvalTypesMap[fidata.approvalType];
            if (fidata.fileTemplateDTO) {
              fidata.transactionDesc = self.transactionTypesMap[fidata.fileTemplateDTO.transaction];
            }
            fidata.description = fidata.fileIdentifier + " - " + fidata.description;
            self.fileIdentifierMap[key] = fidata;
            self.dataArray[k++] = fidata;
          }
        }
        for (var i = 0; i < self.fileIdentifierList().length; i++) {
          fidata = self.fileIdentifierList()[i];
          if (!self.fileIdentifierMap[fidata.fileIdentifier]) {
            fidata.isMapped = ko.observable(false);
            fidata.sensitiveCheck = false;
            fidata.approvalDesc = self.approvalTypesMap[fidata.approvalType];
            if (fidata.fileTemplateDTO) {
              fidata.transactionDesc = self.transactionTypesMap[fidata.fileTemplateDTO.transaction];
            }
            fidata.description = fidata.fileIdentifier + " - " + fidata.description;
            self.fileIdentifierList[i] = fidata;
            self.dataArray[k++] = fidata;
          }
        }
        self.datasource(new oj.ArrayTableDataSource(self.dataArray, {
          idAttribute: "fileIdentifier"
        }));
        self.isListReady(true);
      }
    });
    UserFIMapModel.getApprovalTypes().done(function(data) {
      for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.approvalTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
      }
      self.isApprovalTypesLoaded(true);
    });
    UserFIMapModel.getTransactionTypes().done(function(data) {
      for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
      }
      self.isTransactionTypesLoaded(true);
    });
    self.edit = function() {
      self.actionType(self.Nls.edit);
      self.isEnabled(true);
    };
    if (!self.selectedUser().isMapped)
      self.edit();
    self.initiate = function() {
      if (!self.selectedUser().isMapped)
        if ($("input[name=selection]:checked").length === 0) {
          rootParams.baseModel.showMessages(null, [self.Nls.userMapErrorMsg], "INFO");
          return;
        }
      self.actionType(self.Nls.review);
      self.FIMapModel.fileIdentifers.removeAll();
      self.FIMapModel.fileIdentifers($("input[name=selection]:checked").map(function() {
        if ($("#" + this.value + "_labelID2").is(":checked")) {
          return {
            fileIdentifier: this.value,
            sensitiveCheck: true
          };
        }
        return {
          fileIdentifier: this.value,
          sensitiveCheck: false
        };

      }).get());
      rootParams.dashboard.loadComponent("review-file-identifier-map", {
        mode: "review",
        data: self.FIMapModel
      }, self);
    };
    self.confirm = function() {
      var userMapPayload = ko.toJSON(self.FIMapModel);
      if (self.selectedUser().partyId) {
        UserFIMapModel.updateMap(userMapPayload, self.selectedUser().username, self.selectedUser().partyId).done(function(data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.Nls.transactionName
          }, self);
        });
      } else {
        UserFIMapModel.updateMapAdmin(userMapPayload, self.selectedUser().username).done(function(data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.Nls.transactionName
          }, self);
        });
      }
    };
    self.back = function() {
      history.go(-1);
    };
    self.renderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.fileIdentifier);
      checkBox.attr("name", "selection");
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.fileIdentifier + "_labelID");
      label.attr("for", context.row.fileIdentifier + "_labelID");
      label.text(self.Nls.childCheckBox);
      if (!self.isEnabled())
        checkBox.prop("disabled", true);
      else
        checkBox.prop("disabled", false);
      if (context.row.isMapped()) {
        checkBox.prop("checked", true);
      }
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      $(checkBox).change(function() {
        var sensitiveDataCheckBox = $("#" + context.row.fileIdentifier + "_labelID2");
        if (!$(this).prop("checked")) {
          sensitiveDataCheckBox.prop("checked", false);
          sensitiveDataCheckBox.prop("disabled", true);
        } else
          sensitiveDataCheckBox.prop("disabled", false);
      });
    };
    self.renderSensitiveDataCheckBox = function(context) {
      var senstiveDataCheckBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      senstiveDataCheckBox.attr("type", "checkbox");
      senstiveDataCheckBox.attr("value", context.row.sensitiveCheck);
      senstiveDataCheckBox.attr("name", "sensitiveCheck");
      label.attr("class", "oj-checkbox-label hide-label");
      senstiveDataCheckBox.attr("id", context.row.fileIdentifier + "_labelID2");
      label.attr("for", context.row.fileIdentifier + "_labelID2");
      label.text(self.Nls.childCheckBox);
      if (!self.isEnabled())
        senstiveDataCheckBox.prop("disabled", true);
      else if (!context.row.isMapped())
        senstiveDataCheckBox.prop("disabled", true);
      else
        senstiveDataCheckBox.prop("disabled", false);
      senstiveDataCheckBox.prop("checked", context.row.sensitiveCheck);
      $(context.cellContext.parentElement).append(senstiveDataCheckBox);
      $(context.cellContext.parentElement).append(label);
    };
    self.renderHeaderCheckBox = function(context) {
      var checkBox = $(document.createElement("input"));
      var label = $(document.createElement("label"));
      checkBox.attr("type", "checkbox");
      checkBox.attr("value", "selectAll");
      checkBox.attr("name", "selectionParent");
      checkBox.attr("id", "headerbox_labelID hide-label");
      checkBox.attr(":aria-label", self.Nls.headerCheckBox);
      label.attr("class", "oj-checkbox-label");
      label.attr("for", "headerbox_labelID");
      label.text(self.Nls.headerCheckBox);
      if (!self.isEnabled())
        checkBox.prop("disabled", true);
      else
        checkBox.prop("disabled", false);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
    };
    self.isEnabled.subscribe(function(data) {
      if (data) {
        $("input[name=selection]").prop("disabled", false);
        $("input[name=selectionParent]").prop("disabled", false);
        $("input[name=selection]:checked").each(function() {
          var checkboxId = $(this).attr("id");
          var sensitiveCheckboxId = checkboxId + "2";
          $("#" + sensitiveCheckboxId).prop("disabled", false);
        });
      } else {
        $("input[name=selectionParent]").prop("disabled", true);
        $("input[name=selection]").prop("disabled", true);
        $("input[name=sensitiveCheck]").prop("disabled", true);
      }
    });

    oj.Context.getContext(document.querySelector("selector")).getBusyContext().whenReady().then(function() {
      $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);
      $(document).on("change", "input[name=selection]", function() {
        $("input[name=selectionParent]").prop("checked", $("input[name=selection]:checked").length === $("input[name=selection]").length);
      });
      $(document).on("change", "input[name=selectionParent]", function() {
        var isHeaderCheckBoxChecked = $("input[name=selectionParent]").prop("checked");
        $("input[name=selection]").prop("checked", isHeaderCheckBoxChecked);
        if (!isHeaderCheckBoxChecked) {
          $("input[name=sensitiveCheck]").prop("checked", false);
          $("input[name=sensitiveCheck]").prop("disabled", true);
        } else {
          $("input[name=sensitiveCheck]").prop("disabled", false);
        }
      });
    });

  };
});
