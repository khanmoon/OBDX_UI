 /**
  * Rd Installment Calculation.
  *
  * @module recurring-deposit
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} recurringDepositModel
  * @requires {object} ResourceBundle
  */
 define([
     "ojs/ojcore",
     "knockout",
     "jquery",
     "./model",
     "ojL10n!resources/nls/rd-calculator",
     "ojs/ojknockout-validation",
     "ojs/ojcheckboxset",
     "ojs/ojradioset",
     "ojs/ojinputtext",
     "ojs/ojbutton",
     "ojs/ojvalidationgroup"
 ], function(oj, ko, $, recurringDepositModel, ResourceBundle) {
     "use strict";

     /** Rd Installment Calculation.
      *
      *It provide option of RD installment calculation before proceeding to booking page.
      * @param {object} rootParams  An object which contains contect of dashboard and param values
      * @return {function} function
      * @return {object} getNewKoModel
      *
      */
     return function(rootParams) {
         var self = this,
             getNewKoModel = function() {
                 var KoModel = ko.mapping.fromJS(recurringDepositModel.getNewModel());
                 return KoModel;
             };
         self.createRDModel = getNewKoModel().createRDModel;
         self.calculateModel = getNewKoModel().calculateModel;
         self.targetAmount = ko.observable();
         self.tenureMessage = ko.observable();
         self.depositMessage = ko.observable();
         self.inflationRate = ko.observable(0.00);
         self.url =ko.observable();
         ko.utils.extend(self, rootParams.rootModel.previousState || rootParams.rootModel);
         self.isProductSelected = ko.observable(false);
         self.step = ko.observable(0.01);
         self.isInstallmentCalculated = ko.observable(false);
         self.productsLoaded = ko.observable(false);
         self.minTenure = ko.observable();
         self.maxTenure = ko.observable();
         var productCcyDetails = [];
         self.component = ko.observable();
         self.resource = ResourceBundle;
         self.productList = ko.observableArray();
         self.tenureYears = ko.observableArray();
         self.tenureMonths = ko.observableArray();
         self.isTenureLoaded = ko.observable(false);
         self.isTenureListLoaded = ko.observable(true);
         self.maturityValid = ko.observable();
         self.validationTracker = ko.observable();
         rootParams.baseModel.registerComponent("create-rd", "recurring-deposit");
         rootParams.baseModel.registerElement(["amount-input", "page-section", "row"]);

         /**
          * This function will be called to fetch all product details based on product id.
          *
          * @memberOf rd-calculator
          * @function fetchSelectedProduct
          * @param {string} productId  A string to represent id of the product
          * @returns {object} product An object containing product details for given product id
          */
         function fetchSelectedProduct(productId) {
             return ko.utils.arrayFirst(self.productList(), function(element) {
                 return element.productId === productId;
             });
         }

         /**
          * This function is used set tenure Message for Recurring Deposit.
          *
          * @memberOf rd-calculator
          * @function formatTenureMessage
          * @param {number} tenureYear  A number represents year.
          * @param {number} tenureMonth  A number represents month.
          * @returns {void}
          */
         function formatTenureMessage(tenureYear, tenureMonth) {
             var year, month;
             if (tenureYear <= 1)
                 year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
                     n: tenureYear
                 });
             else
                 year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
                     n: tenureYear
                 });
             if (tenureMonth <= 1)
                 month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
                     n: tenureMonth
                 });
             else
                 month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
                     n: tenureMonth
                 });
             if (tenureMonth && tenureYear)
                 return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
                     years: year,
                     months: month
                 });
             else if (tenureMonth)
                 return month;
             else if (tenureYear)
                 return year;
         }

         /**
          * This function is used to calculate installment.
          *
          * @memberOf rd-calculator
          * @function calculateInstallment
          * @returns {void}
          */
         self.calculateInstallment = function() {
             if (rootParams.baseModel.showComponentValidationErrors(document.getElementById("maturityTracker"))) {
                 self.calculateModel.inflationRate(self.inflationRate() * 100);
                 recurringDepositModel.calculateInstallmentAmount(ko.mapping.toJSON(self.calculateModel)).then(function(data) {
                        self.createRDModel.principalAmount.amount(Math.round(data.installmentAmount.amount));
                     self.createRDModel.principalAmount.currency(data.installmentAmount.currency);
                     self.isInstallmentCalculated(true);
                   });
               }
         };

         /** This function will empty fields of the form on click of reset button.
          *
          * @memberOf rd-calculator
          * @function resetInstallment
          * @returns {void}
          */
         self.resetInstallment = function() {
             self.inflationRate(0.01);
             self.calculateModel.maturityAmount.amount(null);
             self.createRDModel.principalAmount.currency("");
             self.calculateModel.productId("");
             self.createRDModel.productDTO.name("");
             self.createRDModel.productDTO.depositProductType(null);
             self.calculateModel.tenure.month("");
             self.calculateModel.tenure.year("");
             self.tenureMessage(null);
             self.isProductSelected(null);
             self.isInstallmentCalculated(false);
         };

         /**
          * This function is used to set tenure limit for RD.
          *
          * @memberOf rd-calculator
          * @function setTenure
          * @param {object} product  An object represent the product
          * @returns {void}
          */
         function setTenure(product) {
             self.isTenureListLoaded(false);
             var minTenure = product.tenureParameter.minTenure;
             var maxTenure = product.tenureParameter.maxTenure;
             var minTenureYear = minTenure.years + Math.round(minTenure.months / 12);
             var minTenureMonth = minTenure.months % 12;
             var maxTenureYear = maxTenure.years + Math.round(maxTenure.months / 12);
             var maxTenureMonth = maxTenure.months % 12;
             self.tenureMessage(rootParams.baseModel.format(self.resource.depositDetail.productTenureMessage, {
                 "minTenure": formatTenureMessage(minTenureYear, minTenureMonth),
                 "maxTenure": formatTenureMessage(maxTenureYear, maxTenureMonth)
             }));
             self.tenureMonths.removeAll();
             self.tenureYears.removeAll();
             for (var m = 0; m <= 1; m++) {
                 self.tenureMonths.push({
                     "month": m.toString(),
                     "value": rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
                         n: m.toString()
                     })
                 });
             }
             for (var l = 2; l <= 11; l++) {
                 self.tenureMonths.push({
                     "month": l.toString(),
                     "value": rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
                         n: l.toString()
                     })
                 });
             }
             for (var k = 0; k <= maxTenureYear; k++) {
                 if (maxTenureYear >= k && k <= 1) {
                     self.tenureYears.push({
                         "year": k.toString(),
                         "value": rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
                             n: k.toString()
                         })
                     });

                 } else {
                     self.tenureYears.push({
                         "year": k.toString(),
                         "value": rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
                             n: k.toString()
                         })
                     });

                 }

             }
             ko.tasks.runEarly();
             self.isTenureListLoaded(true);
             self.isTenureLoaded(true);
         }

         /** The rest will be called once the component is loaded and html will be loaded only after
          * receiving the rest response.
          * Rest response can be either successful or rejected
          *
          * @instance {object} recurringDepositModel
          * @returns {object} data  It represent list of RD products.
          */
         recurringDepositModel.getProductList().then(function(data) {
             self.productList(data.tdProductDTOList);
             self.productsLoaded(true);
             if (self.calculateModel.productId()) {
                 var productObj = fetchSelectedProduct(self.calculateModel.productId());
                 self.createRDModel.productDTO.name(productObj.name);
                 self.createRDModel.productDTO.depositProductType(productObj.module);
                 self.isProductSelected(true);
                 setTenure(productObj);
             }
         });
         rootParams.dashboard.headerName(self.resource.header.newRecurringDeposit);

         /**
          * This function will be triggered when products for RD  is selected by user.
          *
          * @memberOf rd-calculator
          * @function productChangeHandler
          * @returns {void}
          */
         self.productChangeHandler = function() {
          self.url("products/deposit/" + self.calculateModel.productId());
             if (self.productList().length > 0) {
                 var productObj = fetchSelectedProduct(self.calculateModel.productId());
                 if(productObj){
                 self.createRDModel.productDTO.name(productObj.name);
                 self.createRDModel.productDTO.depositProductType(productObj.module);
                 self.isProductSelected(true);
                 setTenure(productObj);
               }
             }
         };

         /**
          * This function is used to fetch currency list,minimum and maximum amount limit with respect to product.
          *
          * @memberOf rd-calculator
          * @function currencyParser
          * @param {object} data  An object represent list of products
          * @returns {void}
          */
         self.currencyParser = function(data) {
             productCcyDetails = [];
             var output = {};
             output.currencies = [];
             if (self.calculateModel.productId()) {
                 if (data.tdProductDTOList.length > 0) {
                     if (data.tdProductDTOList[0].amountParameters) {
                         for (var i = 0; i < data.tdProductDTOList[0].amountParameters.length; i++) {
                             output.currencies.push({
                                 code: data.tdProductDTOList[0].amountParameters[i].currency,
                                 description: data.tdProductDTOList[0].amountParameters[i].currency
                             });
                             productCcyDetails.push({
                                 ccy: data.tdProductDTOList[0].amountParameters[i].currency,
                                 minAmount: data.tdProductDTOList[0].amountParameters[i].minAmount.amount,
                                 maxAmount: data.tdProductDTOList[0].amountParameters[i].maxAmount.amount
                             });
                         }
                     }
                 }
             }
             return output;
         };

         /**
          * This function is used set tenure of Recurring Deposit .
          *
          * @memberOf rd-calculator
          * @function formatTenure
          * @returns {void}
          */
         self.formatTenure = function() {
             var year, month;
             if (self.calculateModel.tenure.year() <= 1)
                 year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
                     n: self.calculateModel.tenure.year()
                 });
             else
                 year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
                     n: self.calculateModel.tenure.year()
                 });
             if (self.calculateModel.tenure.month() <= 1)
                 month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
                     n: self.calculateModel.tenure.month()
                 });
             else
                 month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
                     n: self.calculateModel.tenure.month()
                 });

             return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
                 years: year,
                 months: month
             });
         };

         /** This function will navigate to RD creation by passing required data.
          *
          * @memberOf rd-calculator
          * @function createRd
          * @returns {void}
          */
         self.createRd = function() {

          if((self.createRDModel.principalAmount.amount()>=productCcyDetails[0].minAmount) && (self.createRDModel.principalAmount.amount()<=productCcyDetails[0].maxAmount)){
             self.createRDModel.maturityAmount.amount(self.calculateModel.maturityAmount.amount());
             self.createRDModel.maturityAmount.currency(self.calculateModel.maturityAmount.currency());
             self.createRDModel.tenure.months(self.calculateModel.tenure.month());
             self.createRDModel.tenure.years(self.calculateModel.tenure.year());
             self.createRDModel.productDTO.productId(self.calculateModel.productId());
             self.depositMessage(rootParams.baseModel.format(self.resource.depositDetail.productAmountMessage, {
                 minAmount: rootParams.baseModel.formatCurrency(productCcyDetails[0].minAmount, self.createRDModel.principalAmount.currency()),
                 maxAmount: rootParams.baseModel.formatCurrency(productCcyDetails[0].maxAmount, self.createRDModel.principalAmount.currency())
             }));
             rootParams.dashboard.loadComponent("create-rd", {
                 createRDModel: self.createRDModel,
                 calculateModel: self.calculateModel,
                 tenureMessage: self.tenureMessage,
                 inflationRate: self.inflationRate,
                 url:self.url,
                 depositMessage: self.depositMessage
             });
           }
           else{
             rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.resource.validate.targetAmount, {
                 minAmount: rootParams.baseModel.formatCurrency(productCcyDetails[0].minAmount, self.createRDModel.principalAmount.currency()),
                 maxAmount: rootParams.baseModel.formatCurrency(productCcyDetails[0].maxAmount, self.createRDModel.principalAmount.currency())
             })], "ERROR");
           }
         };

         /** This function will decrement inflation rate by 1.
          *
          * @memberOf rd-calculator
          * @function leftClick
          * @returns {void}
          */
         self.leftClick = function() {
             var value = self.inflationRate();
             if (Math.round(value*100) >= 1) {
                 value -= 0.01;
                 self.inflationRate(value);
             }
         };

         /** This function will increment inflation rate by 1.
          *
          * @memberOf rd-calculator
          * @function rightClick
          * @returns {void}
          */
         self.rightClick = function() {
             var value = self.inflationRate();
             if (Math.round(value*100) <= 499) {
                 value += 0.01;
                 self.inflationRate(value);
             }
         };
     };
 });