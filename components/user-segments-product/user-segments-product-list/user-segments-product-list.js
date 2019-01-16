define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "ojL10n!resources/nls/user-segments-product",
    "promise",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojtable",
    "ojs/ojdatacollection-utils",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, BaseLogger, UserSegmentListModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("user-segments-product-map", "user-segments-product");
        rootParams.dashboard.headerName(self.resource.header.productMapping);
        rootParams.dashboard.headerCaption("");
        self.tasksLoaded = ko.observable(false);
        self.enterpriseRoleId = ko.observable();
        self.enterpriseRoleName = ko.observable();
        self.userLoaded = ko.observable(false);
        self.rowTemplateValue = ko.observable("rowTemplate");
        self.productMappedLocal = ko.observable();
        self.datasource = ko.observable();
        self.stageOne = ko .observable(false);
        self.selectedProductCode = ko.observable();
        self.productCodes = [
            {
                id: "TD",
                label: self.resource.productMapping.productType.TD
            },
            {
                id: "RD",
                label: self.resource.productMapping.productType.RD
            }
        ];

        self.back = function () {
            history.back();
        };
        self.createMap = function (role) {
            var context = {};
            context.mode = "CREATE";
            context.Id = role.enterpriseRoleId;
            context.name = role.enterpriseRoleName;
            context.version = role.version;
            context.productTypeId = self.productType();
            rootParams.dashboard.loadComponent("user-segments-product-map", context, self);
        };
        self.getNewKoModel = function () {
            var KoModel = UserSegmentListModel.getNewModel();
            return KoModel;
        };
        self.viewMappedProducts = function (role) {
            var context = {};
            context.mode = "VIEW";
            context.Id = role.enterpriseRoleId;
            context.name = role.enterpriseRoleName;
            context.version = role.version;
            context.productTypeId = self.productType();
            rootParams.dashboard.loadComponent("user-segments-product-map", context, self);
        };
        var oppRoleMap = {
            retailuser : "corporateuser",
            corporateuser : "retailuser"
        };

        function enhanceproductData(productData, productType){
            if (productData && productType === "TD" && productData.length === 1){
                    productData.push({
                            "version": 1,
                            "enterpriseRoleId": oppRoleMap[productData[0].enterpriseRoleId],
                            "enterpriseRoleName": self.resource.productMapping[oppRoleMap[productData[0].enterpriseRoleId]],
                            "productMappedLocal": self.resource.productMapping.zeroMapped,
                            "productCount" : 0
                        }
                    );
                    return productData;
            } else if(!productData){
                if (productType === "RD") {
                    return [{
                        "version": 1,
                        "enterpriseRoleId": "retailuser",
                        "enterpriseRoleName": self.resource.productMapping.retailuser,
                        "productMappedLocal": self.resource.productMapping.zeroMapped,
                        "productCount" : 0
                    }];
                }
                    return [{
                            "version": 1,
                            "enterpriseRoleId": "retailuser",
                            "enterpriseRoleName": self.resource.productMapping.retailuser,
                            "productMappedLocal": self.resource.productMapping.zeroMapped,
                            "productCount" : 0
                        },
                        {
                            "version": 1,
                            "enterpriseRoleId": "corporateuser",
                            "enterpriseRoleName": self.resource.productMapping.corporateuser,
                            "productMappedLocal": self.resource.productMapping.zeroMapped,
                            "productCount" : 0
                        }
                    ];


            }return productData;
            }
        self.fetchUserSegments = function (productType) {
            self.tasksLoaded(false);
            UserSegmentListModel.userSegmentsList().done(function (data) {
                var roles = [];
                ko.utils.arrayForEach(data.enterpriseRoleDTOs, function (role) {
                    if (role.enterpriseRoleId !== "administrator")
                        roles.push(role);
                });
                UserSegmentListModel.fetchAllMappedProducts(productType).done(function (data2) {
                    self.productMappedLocal(null);
                    for(var j = 0; j < data2.userSegmentProductMapDTOs.length; j++){
                    var productData = $.map(roles, function (productDataLocal) {
                        for (var i = 0; i < data2.userSegmentProductMapDTOs.length; i++) {
                            if (productDataLocal.enterpriseRoleId === data2.userSegmentProductMapDTOs[i].userSegmentId) {
                                self.productMappedLocal(rootParams.baseModel.format(self.resource.productMapping.noOfMapped, { count: data2.userSegmentProductMapDTOs[i].productIds.length }));
                                productDataLocal.version = data2.userSegmentProductMapDTOs[i].version;
                                productDataLocal.productMappedLocal = self.productMappedLocal();
                                productDataLocal.productCount = data2.userSegmentProductMapDTOs[i].productIds.length;
                                return productDataLocal;
                            }
                        }
                    });
                }
                    if (data.enterpriseRoleDTOs.length > 0) {
                        self.datasource = new oj.ArrayTableDataSource(enhanceproductData(productData, productType), { idAttribute: "enterpriseRoleId" });
                        self.tasksLoaded(true);
                    }
                });
            });
        };
        self.fetchUserSegments();
        self.productType =ko.observable();
        self.search = function(){
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("productTracker")))
                return;
            self.productType(self.selectedProductCode());
            if(self.productType()){
                self.stageOne(true);
                self.fetchUserSegments(self.productType());
            }
        };
    };
});