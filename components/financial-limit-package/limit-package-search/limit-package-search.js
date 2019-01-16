define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",

  "ojL10n!resources/nls/limit-package-search",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojtable",
  "ojs/ojselectcombobox",
  "ojs/ojradioset"
], function(oj, ko, $, BaseLogger, componentModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.showOptionRecords = ko.observable(false);
    self.selectedRoleValues = ko.observable();
    self.selectedAccessPoint = ko.observable();
    self.selectedCurrency = ko.observable();
    rootParams.baseModel.registerElement("action-widget");
    rootParams.dashboard.headerName(self.nls.pageHeader);
    rootParams.baseModel.registerComponent("limits", "financial-limit-package");
    rootParams.baseModel.registerComponent("review-limit-package", "financial-limit-package");
    rootParams.baseModel.registerComponent("limit-package", "financial-limit-package");
    rootParams.baseModel.registerComponent("package-create", "financial-limit-package");
    self.isNewLimitGroup = false;
    self.validationTracker = ko.observable();
    self.accessPointType = ko.observable("SINGLE");
    self.isCorpAdmin = ko.observable();
    self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

    var partyId = {};
    partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
    partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
    if (partyId.value) {
      self.isCorpAdmin = true;
    } else {
      self.isCorpAdmin = false;
    }
    self.limitsData = ko.observable({
      LimitTransactions: ko.observable(),
      enterpriseRoles: ko.observable(),
      accessPoint: ko.observable(),
      accessPointGroup: ko.observable(),
      currencies: ko.observable()
    });
    self.groupData = ko.observableArray([{
        label: "INTERNAL",
        children: []
      },
      {
        label: "EXTERNAL",
        children: []
      }
    ]);
    self.headerText = [{
        "headerText": self.nls.limit_package_search.code_search,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("amountWithCurrencyField", true)
      },
      {
        "headerText": self.nls.limit_package_search.desc_search,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("descriptionTemplate", true)
      },
      {
        "headerText": self.nls.limit_package_search.access_point_search,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("accessPointTemplate", true)
      },
      {
        "headerText": self.nls.limit_package_search.currency,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("currencyTemplate", true)
      },
      {
        "headerText": self.nls.limit_package_search.lastUpdatedOn,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("lastUpdatedTemplate", true)
      }

    ].concat(self.isCorpAdmin ? []:
                    [{
        "headerText": self.nls.limit_package_search.roles,
        "renderer": oj.KnockoutTemplateUtils.getRenderer("rolesTemplate", true)
      }] );
    componentModel.fetchEnterpriseRoles().done(function(data) {
      self.limitsData().enterpriseRoles(data.enterpriseRoleDTOs);
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
    });
    componentModel.fetchAccessPointGroup().done(function(data) {
      self.limitsData().accessPointGroup(data.accessPointGroupListDTO);
    });
    self.showCurrencies = ko.observable(false);
    componentModel.fetchCurrencies().done(function(data) {
      self.limitsData().currencies(data.currencyList);
    });

    function setPageData(data) {
      var tempData = $.map(data.limitPackageDTOList, function(v) {
        var newObj = {
          key: {}
        };
        newObj.id = v.key.id;
        newObj.name = v.key.id;
        newObj.desc = v.description;
        self.roleArray = ko.observableArray();
        for (var i = 0; i < v.assignableToList.length; i++) {
          self.roleArray.push(v.assignableToList[i].key.value);

        }
        newObj.role = self.roleArray;
        newObj.currency = v.currency;
        newObj.accessPointValue = v.accessPointValue;
        newObj.accessPointGroupType = v.accessPointGroupType;
        newObj.count = v.targetLimitLinkages.length;
        if (v.lastUpdatedDate && v.lastUpdatedDate !=="-") {
          newObj.lastUpdatedOn = rootParams.baseModel.formatDate(v.lastUpdatedDate);
        } else {
          newObj.lastUpdatedOn = "-";
        }
        return newObj;
      });
      self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
        idAttribute: "id"
      })));
      self.showPackageData(true);
    }
    self.showOptions = function() {
      self.showOptionRecords(true);
    };
    self.showLessOptions = function() {
      self.showOptionRecords(false);
    };
    self.showPackageData = self.showPackageData || ko.observable(false);
    self.showPackageList = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      componentModel.fetchPackages(JSON.parse(ko.toJSON(self.searchParameters))).done(function(data) {
        setPageData(data);
      });
    };
    self.submitIfEnter = function(data, event) {
      if (event.keyCode === 13) {
        self.showPackageList();
      }
    };
    self.showPackageCreate = function() {
      rootParams.dashboard.loadComponent("limit-package", {
        action: "CREATE"
      }, self);
    };
    self.checkCorpAdmin=ko.observable();
    self.checkCorpAdmin(self.isCorpAdmin?"corporateuser":"");
    self.searchParameters = self.searchParameters || {
      name: null,
      id: null,
      description: null,
      assignableEntities: [{
        key: {
          "type": "ROLE",
          "value": self.checkCorpAdmin()
        }
      }],
      currency: null,
      accessPointValue: null,
      accessPointGroupType:null,
      fromDate:null,
      toDate:null
    };
    self.clearSearchParams = function() {
      self.searchParameters.name("");
      self.searchParameters.id("");
      self.searchParameters.description("");
      self.searchParameters.assignableEntities[0].key.value("");
      self.searchParameters.currency("");
      self.searchParameters.accessPointValue("");
      self.searchParameters.accessPointGroupType("");
      self.searchParameters.fromDate("");
      self.searchParameters.toDate("");

    };
    self.pagingDatasource = self.pagingDatasource || ko.observable();

    self.showPackageDetails = function(data) {
      rootParams.dashboard.loadComponent("review-limit-package", {
        data: data,
        packageId: data.id,
        action: "VIEW"
      }, self);
    };
  };
});
