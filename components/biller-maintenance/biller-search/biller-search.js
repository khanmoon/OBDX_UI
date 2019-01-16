define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/biller-onboarding",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojknockout",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojpagingcontrol"
], function(oj, ko, $, BillerSearchModel,resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        self.billerName = ko.observable();
        self.categoryId=ko.observable();
        self.operationalAreaId=ko.observable();
        self.dataSourceCreated = ko.observable(false);

        ko.utils.extend(self, params.rootModel);

        self.mode = ko.observable();
        self.resourceBundle = resourceBundle;
        params.baseModel.registerComponent("biller-create", "biller-maintenance");
        params.baseModel.registerComponent("review-biller", "biller-maintenance");
        params.dashboard.headerName(self.resourceBundle.heading.billerOnboarding);
        self.billerId=ko.observable();
        self.billerCategoryList = ko.observableArray([]);
        self.billerLocationList = ko.observableArray([]);
        self.dataprovider = ko.observableArray();
        self.dropdownListLoaded = {
            categories: ko.observable(false),
            locations: ko.observable(false)
        };

          self.create = function() {
          self.mode("CREATE");
          params.dashboard.loadComponent("biller-create", {}, self);
        };

        self.reset = function () {
            self.billerName(null);
            self.operationalAreaId(null);
            self.categoryId(null);
            self.dataSourceCreated(false);
        };

        BillerSearchModel.fetchCategory().done(function (data) {
            self.billerCategoryList(data.categoryDTOs);
            self.dropdownListLoaded.categories(true);
        });

        BillerSearchModel.fetchLocation().done(function (data) {
            self.billerLocationList(data.operationalAreaDTOs);
            self.dropdownListLoaded.locations(true);
        });

        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.categories() && self.dropdownListLoaded.locations();
        });

        self.headerText = ko.observableArray([
            {"headerText":self.resourceBundle.labels.billerNameAndId,
              "renderer": oj.KnockoutTemplateUtils.getRenderer("biller_link", true)},
            {"headerText":self.resourceBundle.labels.billerCategory,
              "field":"billerCategory"},
            {"headerText":self.resourceBundle.labels.billerLocation,
                "field":"billerLocation"}
        ]);

         self.getListBillers = function () {

            if(self.billerName()=== undefined || self.billerName()=== null){
              if((self.operationalAreaId() === undefined || self.operationalAreaId() === null) && (self.categoryId() === undefined || self.categoryId() === null)){
                params.baseModel.showMessages(null, [self.resourceBundle.messages.noSearchInputError], "ERROR");
                return;
              }
            }

             self.dataSourceCreated(false);
             BillerSearchModel.getBillerList(self.billerName(), self.categoryId(), self.operationalAreaId()).done(function (data) {
                 var billerList = [];
                 data.billerDTOs = params.baseModel.sortLib(data.billerDTOs,["name"],["asc"]);
                 for (var i = 0; i < data.billerDTOs.length; i++) {
                billerList.push({
                        billerName: data.billerDTOs[i].name,
                        billerId: data.billerDTOs[i].id,
                        billerCategory: data.billerDTOs[i].areaCategoryDetails[0] ?data.billerDTOs[i].areaCategoryDetails[0].categoryName : null,
                        billerLocation: data.billerDTOs[i].areaCategoryDetails[0] ? data.billerDTOs[i].areaCategoryDetails[0].operationalAreaName : null
                    });
                }
                self.pagingDatasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(billerList, {idAttribute:  ["billerName"] }));
                self.dataSourceCreated(true);
             });
         };

         self.viewBillerDetails = function (billerId) {
           BillerSearchModel.getBillerDetails(billerId).done(function (data) {
               var parameters = {
                   mode: "VIEW",
                   billerDetails: data.biller
               };
               params.dashboard.loadComponent("review-biller", parameters, self);
           });
         };

         self.dispose = function () {
             self.dataLoaded.dispose();
         };

    };
});
