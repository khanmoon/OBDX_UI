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
    "ojs/ojbutton"
], function (oj, ko, $, BaseLogger, UserSegmentProductMapModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.header.productMapping);
        self.tasksLoaded = ko.observable(true);
        self.productTypeName = ko.observable(self.resource.productMapping.productType[self.params.productTypeId]);
        var productType = self.params.productTypeId;
        self.userSegmentName = self.params.name;
        self.userSegmentId = self.params.Id;
        self.rowTemplateValue = ko.observable("rowTemplate");
        rootParams.baseModel.registerElement("confirm-screen");
        self.datasource = ko.observable();
        self.productsMapped = ko.observable(false);
        self.mode = ko.observable(self.params.mode);
        self.prevMode = ko.observable();
        self.prevReviewMode = ko.observable();
        self.productsTemplateId = ko.observable();
        self.productHeading = ko.observable(self.params.mode);
        self.expired = ko.observable();
        self.approverReview = ko.observable(false);
        self.version = self.params.version;
        self.back = function () {
            if (self.prevMode() === "VIEW") {
                self.productHeading(self.resource.common.view);
                self.mode("VIEW");
                self.prevMode("");
                self.view();
            } else if (self.prevMode() === "CREATE") {
                self.productHeading(self.resource.generic.common.create);
                self.mode("CREATE");
                self.prevMode("");
                self.fetchProductList();
            } else if (self.prevMode() === "EDIT") {
                self.productHeading(self.resource.generic.common.edit);
                self.mode("EDIT");
                self.prevMode("VIEW");
                self.productsTemplateId("row_Template_products_edit");
            } else if (self.prevMode() === "REVIEW") {
                if (self.mode() === "EDIT") {
                    self.productHeading(self.resource.common.view);
                    self.mode("VIEW");
                    self.prevMode("");
                    self.view();
                } else if (self.mode() === "CREATE") {
                    history.back();
                }
            } else
                history.back();
        };
        self.checkExpiryDate = function (expiryDate) {
            if (expiryDate && Date.parse(expiryDate) < Date.parse(rootParams.baseModel.getDate())) {
                self.expired("Expired!");
            } else {
                self.expired("");
            }
            return self.expired();
        };
        self.save = function () {
            var productids = [];
            for (var i = 0; i < self.datasource.data.length; i++) {
                if (self.datasource.data[i].productsMapped.product[0] === "checked")
                    productids.push(self.datasource.data[i].productId);
            }
            self.productHeading(self.resource.common.review);
            self.prevMode(self.mode());
            self.mode("REVIEW");
            self.productsTemplateId("row_Template_products_read");
        };
        self.edit = function () {
            if (self.prevReviewMode() !== self.mode()) {
                self.prevReviewMode(self.prevMode());
            }
            self.prevMode(self.mode());
            if (self.prevReviewMode() === "CREATE") {
                self.productHeading(self.resource.generic.common.create);
                self.mode("CREATE");
            } else {
                self.productHeading(self.resource.generic.common.edit);
                self.mode("EDIT");
            }
            self.productsTemplateId("row_Template_products_read");
        };
        self.getNewKoModel = function () {
            var KoModel = UserSegmentProductMapModel.getNewModel();
            return KoModel;
        };
        if (self.transactionId) {
            self.mode("REVIEW");
            self.productTypeName = self.resource.productMapping.productType[self.params.data.productType()];
            switch (self.params.data.userSegmentId()) {
            case "administrator":
                self.userSegmentName = self.resource.productMapping.administrator;
                break;
            case "retailuser":
                self.userSegmentName = self.resource.productMapping.retailuser;
                break;
            case "corporateuser":
                self.userSegmentName = self.resource.productMapping.corporateuser;
                break;
            }
            self.tasksLoaded(false);
            UserSegmentProductMapModel.productList(productType).done(function (data) {
                $.map(data.tdProductDTOList, function (productDataLocal) {
                    productDataLocal.productsMapped = { product: [] };
                    if ("expiryDate" in productDataLocal)
                        productDataLocal.productExpiryDate = rootParams.baseModel.formatDate(productDataLocal.expiryDate);
                    else
                        productDataLocal.productExpiryDate = "";
                    productDataLocal.expiredFlag = self.checkExpiryDate(productDataLocal.productExpiryDate);
                    return productDataLocal;
                });
                if (data.tdProductDTOList.length > 0) {
                    self.datasource = new oj.ArrayTableDataSource(data.tdProductDTOList, { idAttribute: "productId" });
                }
            if(self.datasource()){
                for (var i = 0; i < self.datasource.data.length; i++) {
                    if (self.params.data.productIds() && self.params.data.productIds().length > 0) {
                        for (var j = 0; j < self.params.data.productIds().length; j++) {
                            if (self.datasource.data[i].productId === self.params.data.productIds()[j])
                                self.datasource.data[i].productsMapped.product[0] = "checked";
                        }
                    }
                }
            }
                self.productsTemplateId("row_Template_products_read");
                self.tasksLoaded(true);
            });
            self.productHeading("");
            self.approverReview(true);
        }
        self.confirm = function () {
            var payload = self.getNewKoModel();
            payload.userSegmentId = self.userSegmentId;
            payload.productType = productType;
            payload.version = self.version;
            var productids = [];
            for (var i = 0; i < self.datasource.data.length; i++) {
                if (self.datasource.data[i].productsMapped.product[0] === "checked")
                    productids.push(self.datasource.data[i].productId);
            }
            payload.productIds = productids;
            if (self.prevMode() === "CREATE") {
                UserSegmentProductMapModel.addProductMapping(ko.toJSON(payload), self.userSegmentId, productType).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resource.header.productMapping
                    }, self);
                });
            } else if (self.prevMode() === "EDIT") {
                UserSegmentProductMapModel.updateProductMapping(ko.toJSON(payload), self.userSegmentId, productType).done(function (data, status, jqXhr) {
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resource.header.productMapping
                    }, self);
                });
            }
        };
        self.fetchProductList = function () {
            self.tasksLoaded(false);
            UserSegmentProductMapModel.productList(productType).done(function (data) {
                $.map(data.tdProductDTOList, function (productDataLocal) {
                    productDataLocal.productsMapped = { product: [] };
                    if ("expiryDate" in productDataLocal)
                        productDataLocal.productExpiryDate = rootParams.baseModel.formatDate(productDataLocal.expiryDate);
                    else
                        productDataLocal.productExpiryDate = "";
                    productDataLocal.expiredFlag = self.checkExpiryDate(productDataLocal.productExpiryDate);
                    return productDataLocal;
                });
                if (data.tdProductDTOList.length > 0) {
                    self.datasource = new oj.ArrayTableDataSource(data.tdProductDTOList, { idAttribute: "productId" });
                    self.tasksLoaded(true);
                }
                self.productsTemplateId("row_Template_products_read");
            });
        };
        if (self.mode() === "CREATE") {
            self.productHeading(self.resource.generic.common.create);
            self.fetchProductList();
        }
        self.view = function () {
            UserSegmentProductMapModel.fetchMappedProducts(self.userSegmentId, productType).done(function (data1) {
                self.tasksLoaded(false);
                UserSegmentProductMapModel.productList(productType).done(function (data) {
                    $.map(data.tdProductDTOList, function (productDataLocal) {
                        productDataLocal.productsMapped = { product: [] };
                        if ("expiryDate" in productDataLocal)
                            productDataLocal.productExpiryDate = rootParams.baseModel.formatDate(productDataLocal.expiryDate);
                        else
                            productDataLocal.productExpiryDate = "";
                        productDataLocal.expiredFlag = self.checkExpiryDate(productDataLocal.productExpiryDate);
                        return productDataLocal;
                    });
                    if (data.tdProductDTOList.length > 0) {
                        self.datasource = new oj.ArrayTableDataSource(data.tdProductDTOList, { idAttribute: "productId" });
                    }
                    for (var i = 0; i < self.datasource.data.length; i++) {
                        if (data1.userSegmentProductMapDTO && data1.userSegmentProductMapDTO.productIds && data1.userSegmentProductMapDTO.productIds.length > 0) {
                            for (var j = 0; j < data1.userSegmentProductMapDTO.productIds.length; j++) {
                                if (self.datasource.data[i].productId === data1.userSegmentProductMapDTO.productIds[j])
                                    self.datasource.data[i].productsMapped.product[0] = "checked";
                            }
                        }
                    }
                    self.productsTemplateId("row_Template_products_read");
                    self.tasksLoaded(true);
                });
            });
        };
        if (self.mode() === "VIEW") {
            self.productHeading(self.resource.common.view);
            self.view();
        }
    };
});