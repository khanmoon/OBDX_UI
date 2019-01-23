define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",

  "ojL10n!resources/nls/review-limit-package",
  "ojs/ojinputtext",
  "ojs/ojnavigationlist"
], function (oj, ko, $, BaseLogger, componentModel, resourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.pageHeader);
    self.showPackageDetails = ko.observable(false);
    self.showConfirmScreen = ko.observable(false);
    self.showDeleteConfirmation = ko.observable(false);
    self.accessPointDescription = ko.observable();
    self.createPackageData = ko.observable();
    self.flag = self.params.flag ? ko.observable(self.params.flag) : ko.observable(false);
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("action-header");
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.review_limit_package.review;
    self.reviewTransactionName.reviewHeader = self.nls.review_limit_package.confirmScreenheader;

    self.limitPackageData = null;
    self.returnAfterUpdate = ko.observable(false);
    self.originalPackageExpiry = ko.observableArray();
    if (self.params.originalPackageExpiry) {
      self.originalPackageExpiry(self.params.originalPackageExpiry);
    }
    self.isCorpAdmin = ko.observable();

    var partyId = {};
    partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
    partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
    if (partyId.value) {
      self.isCorpAdmin = true;
    } else {
      self.isCorpAdmin = false;
    }

    function getTransactionName(temp) {
      if (self.limitPackageData.targetLimitLinkages()[temp].target.type.id() === "TASK" && !self.limitPackageData.targetLimitLinkages()[temp].target.name && self.limitPackageData.targetLimitLinkages()[temp].target.value) {
        componentModel.getTransactionName(self.limitPackageData.targetLimitLinkages()[temp].target.value()).done(function (data) {
          if (data.task) {
            self.limitPackageData.targetLimitLinkages()[temp].target.name = ko.observable(data.task.name);
          }
          temp++;
          if (temp < self.limitPackageData.targetLimitLinkages().length) {
            getTransactionName(temp);
          } else {
            self.showPackageDetails(true);
          }
        });
      } else if (self.limitPackageData.targetLimitLinkages()[temp].target.type.id() === "TASK_GROUP" && !self.limitPackageData.targetLimitLinkages()[temp].target.name && self.limitPackageData.targetLimitLinkages()[temp].target.value) {
        componentModel.getTransactionGroupName(self.limitPackageData.targetLimitLinkages()[temp].target.value()).done(function (data) {
          if (data.taskGroupDTO) {
            self.limitPackageData.targetLimitLinkages()[temp].target.name = ko.observable(data.taskGroupDTO.name);
          }
          temp++;
          if (temp < self.limitPackageData.targetLimitLinkages().length) {
            getTransactionName(temp);
          } else {
            self.showPackageDetails(true);
          }
        });
      } else {
        temp++;
        if (temp < self.limitPackageData.targetLimitLinkages().length) {
          getTransactionName(temp);
        } else {
          self.showPackageDetails(true);
        }
      }
    }

    function getAccessPoint() {
      if (self.limitPackageData.accessPointGroupType() === "SINGLE") {
        componentModel.fetchAccessPoint().done(function (data) {
          for (var i = 0; i < data.accessPointListDTO.length; i++) {
            if (self.limitPackageData.accessPointValue() === data.accessPointListDTO[i].id) {
              self.accessPointDescription(data.accessPointListDTO[i].description);
              break;
            }
          }
        });
      } else if (self.limitPackageData.accessPointGroupType() === "GROUP") {
        componentModel.fetchAccessPointGroup().done(function (data) {
          for (var i = 0; i < data.accessPointGroupListDTO.length; i++) {
            if (self.limitPackageData.accessPointValue() === data.accessPointGroupListDTO[i].accessPointGroupId) {
              self.accessPointDescription(data.accessPointGroupListDTO[i].description);
              break;
            }
          }
        });
      }
    }
    self.roleListArrayValue = ko.observableArray();
    self.roleListArray = ko.observable();

    if (self.params.action === "VIEW") {
      componentModel.fetchPackageDetails(self.params.packageId).done(function (data) {
        self.limitPackageData = ko.mapping.fromJS(data.limitPackageDTO);
        for (var i = 0; i < self.limitPackageData.assignableToList().length; i++) {
          self.roleListArrayValue()[i] = self.limitPackageData.assignableToList()[i].key.value;
        }
        self.roleListArray(self.roleListArrayValue().join(", "));
        getTransactionName(0);
        getAccessPoint();

      });
    } else if (self.params.action === "CREATE" || self.params.action === "EDIT" || self.params.action === "editAfterSave" || self.params.mode === "approval" || self.params.action === "CLONE" || self.params.action === "cloneAfterEdit") {
      self.limitPackageData = self.params.data;
      for (var i = 0; i < self.limitPackageData.assignableToList().length; i++) {
        self.roleListArrayValue()[i] = self.limitPackageData.assignableToList()[i].key.value;
      }
      self.roleListArray(self.roleListArrayValue().join(", "));
      getTransactionName(0);
      getAccessPoint();
    }


    self.confirmDelete = function () {
      $("#deleteDialog").trigger("openModal");
    };
    self.closeDeleteDialog = function () {
      $("#deleteDialog").hide();
    };
    self.cancel = function () {
      $("#cancelDialogBox").trigger("openModal");
    };
    self.closeDialogBox = function () {
      $("#cancelDialogBox").hide();
    };
    self.deleteLimitPackage = function () {
      componentModel.deletePackage(self.params.packageId).done(function (data, status, jqXhr) {
        $("#deleteDialog").hide();
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.review_limit_package.deletePackage
        }, self);
      }).fail(function () {
        $("#deleteDialog").hide();
      });
    };


    self.editLimitPackage = function () {
      var action = self.params.action === "CREATE" ? "CREATE" : "EDIT";
      rootParams.dashboard.loadComponent("limit-package", {
        action: action,
        data: self.limitPackageData,
        duplicateLinkage: self.params.duplicateLinkage,
        returnAfterUpdate: self.returnAfterUpdate(),
        originalPackageExpiry: self.originalPackageExpiry()
      }, self);
    };
    self.cloneLimitPackage = function () {
      self.action = "cloneAfterEdit";
      var action = self.action;
      rootParams.dashboard.loadComponent("limit-package", {
        action: action,
        data: self.limitPackageData,
        limitsData: self.limitsData,
        duplicateLinkage: self.params.duplicateLinkage,
        returnAfterUpdate: self.returnAfterUpdate(),
        originalPackageExpiry: self.originalPackageExpiry()
      }, self);
    };
    self.limitTypeArray = ko.observableArray();
    var getCoolingLimitObj = {};
    getCoolingLimitObj = {
      "limitId": ko.observable(null),
      "limitName": ko.observable(null),
      "limitDescription": ko.observable(null),
      "limitType": ko.observable("DUR"),
      "durationLimitSlots": ko.observable(null),
      "currency": ko.observable(null)
    };
    var getTransLimitObj = {};
    getTransLimitObj = {
      "limitId": ko.observable(null),
      "limitName": ko.observable(null),
      "limitDescription": ko.observable(null),
      "limitType": ko.observable("TXN"),
      "amountRange": ko.observable(null),
      "currency": ko.observable(null)
    };
    var getPeriodicDailyLimitObj = {};
    getPeriodicDailyLimitObj = {
      "limitId": ko.observable(null),
      "limitName": ko.observable(null),
      "limitDescription": ko.observable(null),
      "limitType": ko.observable("PER"),
      "maxAmount": ko.observable(null),
      "maxCount": ko.observable(null),
      "periodicity": ko.observable("DAILY"),
      "currency": ko.observable(null)
    };
    var getPeriodicMonthlyLimitObj = {};
    getPeriodicMonthlyLimitObj = {
      "limitId": ko.observable(null),
      "limitName": ko.observable(null),
      "limitDescription": ko.observable(null),
      "limitType": ko.observable("PER"),
      "maxAmount": ko.observable(null),
      "maxCount": ko.observable(null),
      "periodicity": ko.observable("MONTHLY"),
      "currency": ko.observable(null)
    };
    self.periodicityTypeArray = ko.observableArray();
    self.clone = function () {
      $(self.limitPackageData.targetLimitLinkages()).each(function (k, v) {

        $(v.limits()).each(function (lk, lv) {
          self.limitTypeArray.push(lv.limitType());
          if (lv.limitType() === "PER")
            self.periodicityTypeArray.push(lv.periodicity());
        });
        var searchDurLimit = 0;
        var searchTxnLimit = 0;
        var searchPerDailyLimit = 0;
        var searchPerMonthlyLimit = 0;
        for (var i = 0; i < self.limitTypeArray().length; i++) {
          if (self.limitTypeArray()[i] === "DUR")
            searchDurLimit++;

          if (self.limitTypeArray()[i] === "TXN")
            searchTxnLimit++;

          if (self.limitTypeArray()[i] === "PER") {
            $(self.periodicityTypeArray()).each(function (a) {
              if (self.periodicityTypeArray()[a] === "DAILY")
                searchPerDailyLimit++;
              if (self.periodicityTypeArray()[a] === "MONTHLY")
                searchPerMonthlyLimit++;
            });
          }
        }
        if (searchTxnLimit === 0) {
          v.limits.push(getTransLimitObj);
        }
        if (searchDurLimit === 0) {
          v.limits.push(getCoolingLimitObj);
        }
        if (searchPerDailyLimit === 0) {
          v.limits.push(getPeriodicDailyLimitObj);
        }
        if (searchPerMonthlyLimit === 0) {
          v.limits.push(getPeriodicMonthlyLimitObj);
        }
      });
      self.cloneLimitPackage();
    };

    rootParams.baseModel.registerComponent("limit-package-search", "financial-limit-package");
    self.showSearchScreen = function () {
      self.accessPointDescription("");
      rootParams.dashboard.loadComponent("limit-package-search", {}, self);
    };

    self.backToEdit = function () {
      self.returnAfterUpdate(true);
      if (self.params.action === "VIEW" || self.params.action === "EDIT") {

        self.editLimitPackage();
      } else {
        $(self.limitPackageData.targetLimitLinkages()).each(function (k, v) {
          if (v.expiry) {
            delete v.expiry;
          }
        });
        $(".financialLimitPackage").trigger("openModal");
        $(".financialLimitPackage").show();

        var action = self.params.action === "EDIT" ? "EDIT" : "editAfterSave";
        rootParams.dashboard.loadComponent("limit-package", {
          effectiveSameDayFlag: self.effectiveSameDayFlag(),
          action: action,
          data: self.limitPackageData,
          limitsData: self.limitsData,
          duplicateLinkage: self.params.duplicateLinkage,
          returnAfterUpdate: self.returnAfterUpdate(),
          originalPackageExpiry: self.originalPackageExpiry()
        }, self);
      }
    };
    self.editableCopy = null;
    self.confirmPackage = function () {
      if (!self.limitPackageData.targetLimitLinkages().length) {
        return;
      }
      $(self.limitPackageData.targetLimitLinkages()).each(function (k, v) {
        v.limits.remove(function (data) {
          return data.limitId() === null;
        });
      });
      if (self.params.action === "CREATE" || self.params.action === "editAfterSave" || self.action === "cloneAfterEdit") {
        $(self.limitPackageData.targetLimitLinkages()).each(function (k, v) {
          if (v.editable) {
            self.editableCopy = v.editable;
            delete v.editable;
          }
        });
        componentModel.createNewPackage(JSON.stringify(ko.mapping.toJS(self.limitPackageData))).done(function (data, status, jqXhr) {
          self.httpStatus(jqXhr.status);
          self.transactionStatus(data.status);
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.review_limit_package.createNewPackage
          }, self);
        }).fail(function () {
          $(self.limitPackageData.targetLimitLinkages()).each(function (k, v) {
            v.editable = self.editableCopy;
          });
        });
      } else if (self.params.action === "EDIT") {
        var temp = 0;
        var d = rootParams.baseModel.getDate();
        d.setDate(d.getDate() + 1);
        for (temp = 0; temp < self.limitPackageData.targetLimitLinkages().length; temp++) {
          var v = self.limitPackageData.targetLimitLinkages()[temp];
          if (v.expiryDate) {
            if (!v.expiryDate())
              delete v.expiryDate;

          }

          if (v.expiryDate && new Date(v.expiryDate()) < (rootParams.baseModel.getDate())) {
            self.limitPackageData.targetLimitLinkages.splice(temp, 1);
            temp--;
          }
          if (!v.editable && v.expiry) {
            v.expiryDate = v.expiryDate || ko.observable();
            v.expiryDate(d);
          }
          delete v.editable;
          if (v.expiry)
            delete v.expiry;
        }
        $(self.limitPackageData.targetLimitLinkages()).each(function (k, v) {
          $(v.limits()).each(function (lk, lv) {
            if (!lv.limitId()) {
              v.limits().splice(lk, 1);
            }
          });
        });

        var tempData = (JSON.parse(ko.mapping.toJSON(self.limitPackageData)));
        componentModel.updatePackage(JSON.stringify(tempData)).done(function (data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.review_limit_package.editPackage
          }, self);
        });
      }
    };

    self.closeSPopup = function () {
      $("#disclaimer-container").fadeOut("slow");
    };
  };
});