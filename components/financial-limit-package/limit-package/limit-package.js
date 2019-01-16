define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/limit-package",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojnavigationlist",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, BaseLogger, componentModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.selectedAccessPoint = ko.observable();

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("action-widget");
    self.selectedCurrency = ko.observable();
    self.limitPackageCloneId = ko.observable();
    self.limitPackageCloneDesc = ko.observable();
    self.transactionId = ko.observable("TASK");
    self.transactionGroupId = ko.observable("TASK_GROUP");
    self.nls = resourceBundle;
    self.showEnterpriseRole = ko.observable(false);
    rootParams.baseModel.registerComponent("limits", "financial-limit-package");
    rootParams.baseModel.registerComponent("package-create", "financial-limit-package");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("review-limit-package", "financial-limit-package");
    self.templateLoadingFlag = ko.observable("transaction");
    self.showAccessPoint = ko.observable(false);
    self.showAccessPointGroup = ko.observable(false);
    self.accessPointDescription = ko.observable();
    self.taskCodeList = ko.observableArray();
    self.taskCodeListFetch = ko.observable(false);
    self.groupValid = ko.observable();
    self.transactionGroupList = ko.observableArray();
    self.transactionGroupListFetch = ko.observable(false);
    self.showResult = ko.observable(false);
    self.limitPackageInput = ko.observable(true);
    self.validationTracker = ko.observable();
    self.showConfirm = ko.observable(true);
    self.isNewLimitGroup = ko.observable(true);
    self.showCoolingLimitSearchSection = ko.observable(false);
    self.showTransactionLimitsSearch = ko.observable(false);
    self.showCummulativeSearchSection = ko.observable(false);
    self.gapDetected = ko.observable(false);
    self.abruptEndDetected = ko.observable(false);
    self.userOkWithAbruptEndDetected = ko.observable(false);
    self.userOkWithGapDetected = ko.observable(false);
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.packageMode = ko.observable("CREATE");
    self.effectiveSameDayFlag = ko.observable();
    self.groupData = ko.observableArray([{
        label: "INTERNAL",
        children: []
      },
      {
        label: "EXTERNAL",
        children: []
      }
    ]);
    self.accessPointType = ko.observable("SINGLE");
    var today = rootParams.baseModel.getDate();

    self.limitsData = ko.observable({
      LimitTransactions: ko.observable(),
      enterpriseRoles: ko.observable(),
      accessPoint: ko.observable(),
      accessPointGroup: ko.observable(),
      accessPointType: ko.observable(),
      coolingLimits: ko.observable(),
      transactionLimits: ko.observable(),
      cummulativeLimitsDaily: ko.observableArray(),
      cummulativeLimitsMonthly: ko.observableArray(),
      currencies: ko.observable()
    });
    self.back = function() {
      self.showCoolingLimitSearchSection(false);
      self.showTransactionLimitsSearch(false);
      self.showCummulativeSearchSection(false);
      rootParams.dashboard.loadComponent("limit-package-search", {}, self);
    };
    self.cancel = function() {
      $("#cancelDialog").trigger("openModal");
    };
    self.closeDialogBox = function() {
      $("#cancelDialog").hide();
    };
    var getPackageModel = function() {
      var KoModel = componentModel.getPackageModel();
      return ko.mapping.fromJS(KoModel);
    };
    componentModel.fetchEffectiveTodayDetails().done(function(data) {
      self.effectiveSameDayFlag(data.isEffectiveSameDay);
    });
    if (!self.params.returnAfterUpdate && self.params.action !== "CREATE")
      for (var i = 0; i < self.params.data.targetLimitLinkages().length; i++) {
        if (self.params.data.targetLimitLinkages()[i].expiryDate) {
          self.params.originalPackageExpiry.push(self.params.data.targetLimitLinkages()[i].expiryDate());
        } else {
          self.params.originalPackageExpiry.push(ko.observable());
        }
      }
    if (self.params.action === "editAfterSave" || self.params.action === "EDIT" || self.params.action === "cloneAfterEdit") {
      if (self.params.action === "editAfterSave") {
        rootParams.visibility = true;
        self.limitsData(self.params.limitsData());
        self.showCoolingLimitSearchSection(true);
        self.showTransactionLimitsSearch(true);
        self.showCummulativeSearchSection(true);
      }
      self.selectedCurrency(self.params.data.currency());
      self.createPackageData(self.params.data);
      self.accessPointType(self.createPackageData().accessPointGroupType());
      self.selectedAccessPoint(self.createPackageData().accessPointValue());
      self.duplicateLinkage = self.params.duplicateLinkage;
    } else {
      self.duplicateLinkage = ko.observableArray();
      self.createPackageData = ko.observable(getPackageModel());
    }

    self.closeDateDialog = function() {
      $("#deleteDateDialog").hide();
    };
    self.closeDateDialogTransactionGroup = function() {
      $("#deleteDateDialogTransactionGroup").hide();
    };
    self.closegapDetected = function() {
      $("#gapDetected").hide();
    };
    self.closeabruptEndDetected = function() {
      $("#abruptEndDetected").hide();
    };

    self.callReviewScreen = function() {
      $(".financialLimitPackage").hide();
      var action = self.params.action ? self.params.action : "CREATE";
      rootParams.dashboard.loadComponent("review-limit-package", {
        action: action,
        flag:true,
        data: self.createPackageData(),
        duplicateLinkage: self.duplicateLinkage,
        originalPackageExpiry: self.params.originalPackageExpiry
      }, self);
    };

    self.userOkWithAbruptEnd = function() {
      self.userOkWithAbruptEndDetected(true);
      $("#abruptEndDetected").hide();
      self.abruptEndDetected(false);

      if (!self.abruptEndDetected() && !self.gapDetected()) {
        self.callReviewScreen();
      } else if (self.abruptEndDetected() && self.userOkWithAbruptEndDetected() && !self.gapDetected()) {
        self.callReviewScreen();
      } else if (self.gapDetected() && self.userOkWithGapDetected() && !self.abruptEndDetected()) {
        self.callReviewScreen();
      } else if (self.gapDetected() && self.userOkWithGapDetected() && self.abruptEndDetected() && self.userOkWithAbruptEndDetected()) {
        self.callReviewScreen();
      }
    };

    self.userOkWithGap = function() {
      self.userOkWithGapDetected(true);
      self.gapDetected(false);
      $("#gapDetected").hide();

      if (!self.abruptEndDetected() && !self.gapDetected()) {
        self.callReviewScreen();
      } else if (self.abruptEndDetected() && self.userOkWithAbruptEndDetected() && !self.gapDetected()) {
        self.callReviewScreen();
      } else if (self.gapDetected() && self.userOkWithGapDetected() && !self.abruptEndDetected()) {
        self.callReviewScreen();
      } else if (self.gapDetected() && self.userOkWithGapDetected() && self.abruptEndDetected() && self.userOkWithAbruptEndDetected()) {
        self.callReviewScreen();
      }
    };

    function fetchChildLimitTasks(task) {
      var taskCodeList = [];
      for (var i = 0; i < task.childTasks.length; i++) {
        var currentTask = task.childTasks[i];
        var taskObject = {};
        taskObject.label = currentTask.name;
        if (currentTask.aspects.length > 0) {
          for (var j = 0; j < currentTask.aspects.length; j++) {
            if (currentTask.aspects[j].taskAspect === "limit" && currentTask.aspects[j].enabled)
              taskObject.value = currentTask.id;
          }
        }
        if (currentTask.childTasks) {
          taskObject.value = "";
          taskObject.children = fetchChildLimitTasks(currentTask);
        }
        taskCodeList.push(taskObject);
      }
      return taskCodeList;
    }

    function fetchTransGroups(task) {
      var transactionGroupList = [];
      for (var i = 0; i < task.length; i++) {
        var currentTask = task[i];
        var taskObject = {};
        taskObject.label = currentTask.name;

        if (currentTask.taskAspect === "limit")
          taskObject.value = currentTask.id;

        transactionGroupList.push(taskObject);
      }
      return transactionGroupList;
    }
    var dataTaskList = null;
    componentModel.fetchLimitTransactions().done(function(data) {
      dataTaskList = data.taskList;
      for (var k = 0; k < dataTaskList.length; k++) {
        var fetchedTasks = fetchChildLimitTasks(dataTaskList[k]);
        for (var j = 0; j < fetchedTasks.length; j++) {
          self.taskCodeList().push(fetchedTasks[j]);
        }
        self.taskCodeList().sort(function(left, right) {
          return left.name === right.name ? 0 : (left.name < right.name ? -1 : 1);
        });
        self.taskCodeListFetch(true);
      }
    });

    componentModel.fetchTransactionGroup().done(function(data) {
      var fetchedTransGrp = fetchTransGroups(data.taskGroupDTOlist);
      for (var j = 0; j < fetchedTransGrp.length; j++) {
        self.transactionGroupList().push(fetchedTransGrp[j]);
      }
      self.transactionGroupList().sort(function(left, right) {
        return left.name === right.name ? 0 : (left.name < right.name ? -1 : 1);
      });
      self.transactionGroupListFetch(true);
    });

    componentModel.fetchEnterpriseRoles().done(function(data) {
      self.showEnterpriseRole(false);
      self.limitsData().enterpriseRoles(data.enterpriseRoleDTOs);
      self.showEnterpriseRole(true);
    });
    componentModel.fetchAccessPoint().done(function(data) {
      self.limitsData().accessPoint(data.accessPointListDTO);
      for (var i = 0; i < data.accessPointListDTO.length; i++) {
        if (data.accessPointListDTO[i].type === "INT") {
          self.groupData()[0].children.push({
            value: data.accessPointListDTO[i].id,
            label: data.accessPointListDTO[i].description
          });
        } else if (data.accessPointListDTO[i].type === "EXT") {
          self.groupData()[1].children.push({
            value: data.accessPointListDTO[i].id,
            label: data.accessPointListDTO[i].description
          });
        }
      }
      self.showAccessPoint(true);
    });
    componentModel.fetchAccessPointGroup().done(function(data) {
      self.limitsData().accessPointGroup(data.accessPointGroupListDTO);
      self.showAccessPointGroup(true);
    });
    self.showCurrencies = ko.observable(false);
    componentModel.fetchCurrencies().done(function(data) {
      self.limitsData().currencies(data.currencyList);
      self.showCurrencies(true);
    });
    var getTargetLinkageModel = function() {
      var KoModel = componentModel.getTargetLinkageModel();
      return ko.mapping.fromJS(KoModel);
    };

    self.addTask = function() {
      self.templateLoadingFlag("transaction");
      var size = self.createPackageData().targetLimitLinkages().length - 1;
      if (self.createPackageData().targetLimitLinkages().length > 0 && self.createPackageData().targetLimitLinkages()[size].target.value() === null && self.createPackageData().targetLimitLinkages()[size].target.name() === null) {
        self.createPackageData().targetLimitLinkages.splice(size, 1);
        size--;
      }
      self.createPackageData().targetLimitLinkages.push(getTargetLinkageModel());
      size++;

      self.createPackageData().targetLimitLinkages()[size].target.type.id("TASK");
      self.createPackageData().targetLimitLinkages()[size].target.type.name("TASK");
    };
    self.addTransactionGroup = function() {
      self.templateLoadingFlag("transactionGroup");
      var size = self.createPackageData().targetLimitLinkages().length - 1;
      if (self.createPackageData().targetLimitLinkages().length > 0 && self.createPackageData().targetLimitLinkages()[size].target.value() === null && self.createPackageData().targetLimitLinkages()[size].target.name() === null) {
        self.createPackageData().targetLimitLinkages.splice(size, 1);

        size--;
      }
      self.createPackageData().targetLimitLinkages.push(getTargetLinkageModel());
      size++;

      self.createPackageData().targetLimitLinkages()[size].target.type.id("TASK_GROUP");
      self.createPackageData().targetLimitLinkages()[size].target.type.name("TASK_GROUP");
    };
    self.removeTransactionFromPackage = function(index, data) {
      if (!data.editable()) {
        self.createPackageData().targetLimitLinkages()[index].expiry = "today";
        var t = $(".financialLimitPackage .transactionLimitBox");
        $(t[index]).addClass("deleteLinakge");
      } else if (self.createPackageData().targetLimitLinkages().length > 1) {
        self.createPackageData().targetLimitLinkages.splice(index, 1);
        if (self.duplicateLinkage !== null) {
          self.duplicateLinkage.splice(index, 1);
        }
      }
    };
    self.undoTransactionFromPackage = function(index) {
      var t = $(".financialLimitPackage .transactionLimitBox");
      $(t[index]).removeClass("deleteLinakge");
      delete self.createPackageData().targetLimitLinkages()[index].expiry;
    };

    self.httpStatus = ko.observable();
    self.createNewPackage = function() {
      var tracker = document.getElementById("tracker");
      if (tracker && tracker.valid !== "valid") {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
        return;
      }
      if (self.params.action === "cloneAfterEdit") {
        self.createPackageData().key.id(self.limitPackageCloneId());
        self.createPackageData().description(self.limitPackageCloneDesc());
      }
      for (var i = 0; i < self.createPackageData().targetLimitLinkages().length; i++) {
        var flag = false;
        for (var j = 0; j < self.createPackageData().targetLimitLinkages()[i].limits().length; j++) {

          if (self.createPackageData().targetLimitLinkages()[i].limits()[j].limitType() === "PER" && self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId() !== null)
            flag = true;
        }
        if (flag === false) {
          rootParams.baseModel.showMessages(null, [self.nls.limit_package.cumulative_msg], "ERROR");
          return;
        }

      }

      self.callReviewScreen();
    };

    self.periodicLimitCheck = function() {
      var i;
      for (i = 0; i < self.createPackageData().targetLimitLinkages().length; i++) {
        var flag = false;
        for (var j = 0; j < self.createPackageData().targetLimitLinkages()[i].limits().length; j++) {

          if (self.createPackageData().targetLimitLinkages()[i].limits()[j].limitType() === "PER" && self.createPackageData().targetLimitLinkages()[i].limits()[j].limitId() !== null)
            flag = true;
        }
        if (flag === false) {
          rootParams.baseModel.showMessages(null, [self.nls.limit_package.cumulative_msg], "ERROR");
          return;
        }

      }
    };
    self.functionCall = function() {
      for (var i = 0; i < self.duplicateLinkage().length; i++) {
        var limitAvialable = false;
        for (var j = 0; j < self.duplicateLinkage().length; j++) {
          if (self.duplicateLinkage()[i].transName === self.duplicateLinkage()[j].transName && j !== i) {
            if (self.duplicateLinkage()[i].transExpiry) {
              var tempExpiryDate = new Date(self.duplicateLinkage()[i].transExpiry.substring(0, 4) + "-" + self.duplicateLinkage()[i].transExpiry.substring(4, 6) + "-" + self.duplicateLinkage()[i].transExpiry.substring(6)).setHours(0, 0, 0);
            }
            var tempEffectiveDate = new Date(self.duplicateLinkage()[j].transDate.substring(0, 4) + "-" + self.duplicateLinkage()[j].transDate.substring(4, 6) + "-" + self.duplicateLinkage()[j].transDate.substring(6)).setHours(0, 0, 0);

            var curTxnEffectiveDate = new Date(self.duplicateLinkage()[i].transDate.substring(0, 4) + "-" + self.duplicateLinkage()[i].transDate.substring(4, 6) + "-" + self.duplicateLinkage()[i].transDate.substring(6)).setHours(0, 0, 0);

            if (curTxnEffectiveDate >= today.setHours(0, 0, 0)) {
              limitAvialable = true;
            } else
            if (self.duplicateLinkage()[i].transExpiry && tempEffectiveDate >= tempExpiryDate) {
              limitAvialable = true;
              break;
            }
          }
        }
        if (!limitAvialable && self.duplicateLinkage()[i].transExpiry) {
          $("#abruptEndDetected").trigger("openModal");
          self.abruptEndDetected(true);
        }

      }
    };

    self.cloneMode = function() {
      self.packageMode("cloneAfterEdit");
      self.selectedCurrency(self.params.data.currency());
      self.cummulativeLimitSelected = true;
      self.coolingLimitSelected = true;
      self.transactionLimitSelected = true;
      var isDuplicateLinkageEmpty = false;
      if (self.duplicateLinkage === undefined) {
        self.duplicateLinkage = ko.observableArray();
        isDuplicateLinkageEmpty = true;
      }
      $(self.createPackageData().targetLimitLinkages()).each(function(k) {
        if (self.createPackageData().targetLimitLinkages()[k].editable === undefined || self.createPackageData().targetLimitLinkages()[k].editable === null) {
          self.createPackageData().targetLimitLinkages()[k].editable = ko.observable();
        }
        if (self.createPackageData().targetLimitLinkages()[k].effectiveDate() !== null && new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate()) <= (rootParams.baseModel.getDate())) {

          self.createPackageData().targetLimitLinkages()[k].effectiveDate(rootParams.baseModel.getDate());
        }
        self.createPackageData().targetLimitLinkages()[k].effectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate())));

        if (!self.createPackageData().targetLimitLinkages()[k].expiryDate) {
          self.createPackageData().targetLimitLinkages()[k].expiryDate = ko.observable();
        } else if (self.createPackageData().targetLimitLinkages()[k].expiryDate()) {
          self.createPackageData().targetLimitLinkages()[k].expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].expiryDate())));
        }
        if (isDuplicateLinkageEmpty) {
          self.duplicateLinkage.push({
            transName: self.createPackageData().targetLimitLinkages()[k].target.value(),
            transDate: (self.createPackageData().targetLimitLinkages()[k].effectiveDate().substring(0, 10)),
            transExpiry: (self.createPackageData().targetLimitLinkages()[k].expiryDate()) ? (self.createPackageData().targetLimitLinkages()[k].expiryDate().substring(0, 10)) : null
          });
        }

      });

      self.createPackageData().currency(self.selectedCurrency());
      self.createPackageData().key.id(self.limitPackageCloneId());
      self.createPackageData().description(self.limitPackageCloneDesc());
      self.createPackageData().accessPointValue(self.selectedAccessPoint());
      ko.tasks.runEarly();
      componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function(data) {
        self.limitsData().coolingLimits(data.limitDTOs);
        self.showCoolingLimitSearchSection(true);
      });
      componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function(data) {
        self.limitsData().transactionLimits(data.limitDTOs);
        self.showTransactionLimitsSearch(true);
      });
      componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function(data) {
        if (data.limitDTOs) {
          self.limitsData().cummulativeLimitsMonthly.removeAll();
          self.limitsData().cummulativeLimitsDaily.removeAll();
          ko.utils.arrayForEach(data.limitDTOs, function(limit) {
            if (limit.periodicity === "MONTHLY")
              self.limitsData().cummulativeLimitsMonthly.push(limit);
            else
              self.limitsData().cummulativeLimitsDaily.push(limit);
          });
        }
        self.showCummulativeSearchSection(true);
      });
    };
    if (self.params.action === "cloneAfterEdit") {
      self.cloneMode();

    }

    self.editMode = function() {
      self.packageMode("EDIT");
      self.isNewLimitGroup(false);
      self.selectedCurrency(self.params.data.currency());
      self.cummulativeLimitSelected = true;
      self.coolingLimitSelected = true;
      self.transactionLimitSelected = true;
      var isDuplicateLinkageEmpty = false;
      if (self.duplicateLinkage === undefined) {
        self.duplicateLinkage = ko.observableArray();
        isDuplicateLinkageEmpty = true;
      }
      $(self.createPackageData().targetLimitLinkages()).each(function(k) {
        if (self.createPackageData().targetLimitLinkages()[k].editable === undefined || self.createPackageData().targetLimitLinkages()[k].editable === null) {
          self.createPackageData().targetLimitLinkages()[k].editable = ko.observable();
        }
        if (self.createPackageData().targetLimitLinkages()[k].effectiveDate() !== null && new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate()) <= (rootParams.baseModel.getDate())) {
          self.createPackageData().targetLimitLinkages()[k].editable(false);
        }
        self.createPackageData().targetLimitLinkages()[k].effectiveDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].effectiveDate())));

        if (!self.createPackageData().targetLimitLinkages()[k].expiryDate) {
          self.createPackageData().targetLimitLinkages()[k].expiryDate = ko.observable();
        } else if (self.createPackageData().targetLimitLinkages()[k].expiryDate()) {
          self.createPackageData().targetLimitLinkages()[k].expiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.createPackageData().targetLimitLinkages()[k].expiryDate())));
        }
        if (isDuplicateLinkageEmpty) {
          self.duplicateLinkage.push({
            transName: self.createPackageData().targetLimitLinkages()[k].target.value(),
            transDate: (self.createPackageData().targetLimitLinkages()[k].effectiveDate().substring(0, 10)),
            transExpiry: (self.createPackageData().targetLimitLinkages()[k].expiryDate()) ? (self.createPackageData().targetLimitLinkages()[k].expiryDate().substring(0, 10)) : null
          });
        }
      });

      self.createPackageData().currency(self.selectedCurrency());
      ko.tasks.runEarly();
      componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function(data) {
        self.limitsData().coolingLimits(data.limitDTOs);
        self.showCoolingLimitSearchSection(true);
      });
      componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function(data) {
        self.limitsData().transactionLimits(data.limitDTOs);
        self.showTransactionLimitsSearch(true);
      });
      componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function(data) {
        if (data.limitDTOs) {
          self.limitsData().cummulativeLimitsMonthly.removeAll();
          self.limitsData().cummulativeLimitsDaily.removeAll();
          ko.utils.arrayForEach(data.limitDTOs, function(limit) {
            if (limit.periodicity === "MONTHLY")
              self.limitsData().cummulativeLimitsMonthly.push(limit);
            else
              self.limitsData().cummulativeLimitsDaily.push(limit);
          });
        }
        self.showCummulativeSearchSection(true);
      });
    };
    self.abruptEndOrGapCheck = function() {
      for (i = 0; i < self.duplicateLinkage().length - 1; i++) {
        if (self.duplicateLinkage()[i].transName !== self.duplicateLinkage()[i + 1].transName) {
          if (!self.userOkWithAbruptEndDetected() && (self.duplicateLinkage()[i + 1].transExpiry)) {
            $("#abruptEndDetected").trigger("openModal");
            self.abruptEndDetected(true);
            break;
          }
        } else if (!self.userOkWithGapDetected() && self.duplicateLinkage()[i].transDate - self.duplicateLinkage()[i + 1].transExpiry !== 0) {
          $("#gapDetected").trigger("openModal");
          self.gapDetected(true);
          break;
        }
      }
    };
    var duplicateLinkageCopy = null;
    self.updatePackage = function() {
      self.periodicLimitCheck();

      for (i = 0; i < self.duplicateLinkage().length; i++) {
        if (self.duplicateLinkage()[i].transExpiry) {
          self.duplicateLinkage()[i].transExpiry = self.duplicateLinkage()[i].transExpiry.replace(/-/g, "");
        }
        self.duplicateLinkage()[i].transDate = self.duplicateLinkage()[i].transDate.replace(/-/g, "");
      }
      duplicateLinkageCopy = ko.toJS(ko.mapping.fromJS(self.duplicateLinkage()));
      self.gapDetected(false);
      self.abruptEndDetected(false);
      self.duplicateLinkage().sort(function(a,b) {
    if ( a.transName < b.transName )
        return -1;
    if ( a.transName > b.transName )
        return 1;
    return 0;
} );

      var swapped;
      do {
        swapped = false;
        for (i = 0; i < self.duplicateLinkage().length - 1; i++) {
          if (self.duplicateLinkage()[i].transName === self.duplicateLinkage()[i + 1].transName && self.duplicateLinkage()[i].transDate < self.duplicateLinkage()[i + 1].transDate) {
            var temp = self.duplicateLinkage()[i];
            self.duplicateLinkage()[i] = self.duplicateLinkage()[i + 1];
            self.duplicateLinkage()[i + 1] = temp;
            swapped = true;
          }
        }
      } while (swapped);
      i = 0;
      if (self.effectiveSameDayFlag() !== "Y" && self.params.effectiveSameDayFlag !== "Y") {
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      }
      if (!self.userOkWithAbruptEndDetected()) {
        self.functionCall();

      }

      self.abruptEndOrGapCheck();

      self.duplicateLinkage(duplicateLinkageCopy);
      if (!self.abruptEndDetected() && !self.gapDetected()) {
        self.callReviewScreen();
      } else if (self.abruptEndDetected() && self.userOkWithAbruptEndDetected() && !self.gapDetected()) {
        self.callReviewScreen();
      } else if (self.gapDetected() && self.userOkWithGapDetected() && !self.abruptEndDetected()) {
        self.callReviewScreen();
      } else if (self.gapDetected() && self.userOkWithGapDetected() && self.abruptEndDetected() && self.userOkWithAbruptEndDetected()) {
        self.callReviewScreen();
      }
    };

    if (self.params.action === "EDIT") {
      self.editMode();

    }
    var selectedCurrencyDispose = self.selectedCurrency.subscribe(function() {
      self.createPackageData().currency(self.selectedCurrency());
    });
    var selectedAccessPointDispose = self.selectedAccessPoint.subscribe(function() {
      if (self.accessPointType() === "SINGLE") {
        for (var i = 0; i < self.limitsData().accessPoint().length; i++) {
          if (self.limitsData().accessPoint()[i].id === self.selectedAccessPoint()) {
            self.createPackageData().accessPointValue(self.limitsData().accessPoint()[i].id);
            self.accessPointDescription(self.limitsData().accessPoint()[i].description);
            break;
          }
        }
      } else if (self.accessPointType() === "GROUP") {
        for (var j = 0; j < self.limitsData().accessPointGroup().length; j++) {
          if (self.limitsData().accessPointGroup()[j].accessPointGroupId === self.selectedAccessPoint()) {
            self.createPackageData().accessPointValue(self.selectedAccessPoint());
            self.accessPointDescription(self.limitsData().accessPointGroup()[j].description);
            break;
          }
        }
      }
      self.createPackageData().accessPointGroupType(self.accessPointType());

    });
    self.transactionLimitsFlag = ko.computed(function() {
      return self.showCummulativeSearchSection() && self.showTransactionLimitsSearch() && self.showCoolingLimitSearchSection();
    }, this);

    self.currencyOptionChangeHandler = function(event) {
      self.selectedCurrency(event.detail.value.toString());
      ko.tasks.runEarly();

      componentModel.fetchCoolingLimits(self.selectedCurrency()).done(function(data) {
        self.limitsData().coolingLimits(data.limitDTOs);
        self.showCoolingLimitSearchSection(true);
      });

      componentModel.fetchTransactionLimits(self.selectedCurrency()).done(function(data) {
        self.limitsData().transactionLimits(data.limitDTOs);
        self.showTransactionLimitsSearch(true);
      });

      componentModel.fetchCummulativeLimits(self.selectedCurrency()).done(function(data) {
        if (data.limitDTOs) {
          self.limitsData().cummulativeLimitsMonthly.removeAll();
          self.limitsData().cummulativeLimitsDaily.removeAll();
          ko.utils.arrayForEach(data.limitDTOs, function(limit) {
            if (limit.periodicity === "MONTHLY")
              self.limitsData().cummulativeLimitsMonthly.push(limit);
            else
              self.limitsData().cummulativeLimitsDaily.push(limit);
          });
        }
        self.showCummulativeSearchSection(true);
      });

      componentModel.fetchEffectiveTodayDetails().done(function(data) {
        self.effectiveSameDayFlag(data.isEffectiveSameDay);
      });
      self.createPackageData().targetLimitLinkages.splice(0, self.createPackageData().targetLimitLinkages().length);
      self.duplicateLinkage.splice(0, self.duplicateLinkage().length);
      self.addTask();
    };
    self.dispose = function() {
      self.transactionLimitsFlag.dispose();
      selectedCurrencyDispose.dispose();
      selectedAccessPointDispose.dispose();

    };
  };
});
