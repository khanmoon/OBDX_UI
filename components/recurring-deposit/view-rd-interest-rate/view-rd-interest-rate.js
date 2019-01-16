 /**
  * View Interest Rate.
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
     "ojL10n!resources/nls/view-rd-interest-rate",
     "ojs/ojknockout-validation",
     "ojs/ojbutton",
     "ojs/ojarraytabledatasource",
     "ojs/ojtable"
 ], function(oj, ko, $, recurringDepositModel, ResourceBundle) {
     "use strict";
     /** View Interest Rate.
      *
      *It allows user to view interest rate for Recurring Deposit based on selected product.
      * @param {object} rootParams  An object which contains contect of dashboard and param values
      * @return {function} function
      *
      */
     return function(rootParams) {
         ko.utils.extend(self, rootParams.rootModel);
         self.interestSlabsLoaded = ko.observable(false);
         self.interestSlabsDataSource = ko.observable();
         var interestRateSlabsList = [];
         var interestList = [];
         self.rates = ResourceBundle;
         var productId = self.params.productId;
         if (!rootParams.baseModel.large())
             rootParams.dashboard.headerName(self.rates.interestslab.caption);
         /**
          * This function is used set tenure of Interest Rate in Recurring Deposit .
          *
          * @memberOf view-rd-interest-rate
          * @function formatInterestRate
          * @param {object} obj  An object containing the Interest rate of the product.
          * @returns {void}
          */
         function formatInterestRate(obj) {
             if (obj.days) {
                 if (obj.days <= 1)
                     return rootParams.baseModel.format(self.rates.interestslab.tenure.singular.day, {
                         n: obj.days.toString()
                     });
                 return rootParams.baseModel.format(self.rates.interestslab.tenure.plural.day, {
                         n: obj.days.toString()
                     });
             } else if (obj.months) {
                 if (obj.months <= 1)
                     return rootParams.baseModel.format(self.rates.interestslab.tenure.singular.month, {
                         n: obj.months.toString()
                     });
                 return rootParams.baseModel.format(self.rates.interestslab.tenure.plural.month, {
                         n: obj.months.toString()
                     });
             } else if (obj.years) {
                 if (obj.years <= 1)
                     return rootParams.baseModel.format(self.rates.interestslab.tenure.singular.year, {
                         n: obj.years.toString()
                     });
                 return rootParams.baseModel.format(self.rates.interestslab.tenure.plural.year, {
                         n: obj.years.toString()
                     });
             }
         }
         /** The rest will be called once the component is loaded and html will be loaded only after
          * receiving the rest response.
          * Rest response can be either successful or rejected
          * @param {string} productId  A string represents id of selected product.
          * @instance {object} recurringDepositModel
          * @returns {object} data  It represent interest slab for RD product.
          */
         recurringDepositModel.readProduct(productId).then(function(data) {
             interestRateSlabsList = data.tdProductDTOList[0].tDinterestRate.slabs[0].interestRateList;
             var from, to;
             interestList[0] = {};
             interestList[0].rate = rootParams.baseModel.format(self.rates.interestslab.percent, { percent: "0" });
             from = rootParams.baseModel.format(self.rates.interestslab.tenure.singular.day, {
                 n: "0"
             });
             for (var i = 0; i <= interestRateSlabsList.length; i++) {
                 if (i !== 0) {
                     interestList.push({});
                     interestList[i].rate = rootParams.baseModel.format(self.rates.interestslab.percent, { percent: interestRateSlabsList[i - 1].rate.toString() });
                     from = formatInterestRate(interestRateSlabsList[i - 1]);
                 }
                 if (i === interestRateSlabsList.length)
                     interestList[i].range = rootParams.baseModel.format(self.rates.interestslab.andabove, {
                         value: from
                     });
                 else {
                     to = formatInterestRate(interestRateSlabsList[i]);
                     interestList[i].range = rootParams.baseModel.format(self.rates.interestslab.fromtotenure, {
                         from: from,
                         to: to
                     });
                 }
             }
             self.interestSlabsDataSource(new oj.ArrayTableDataSource(interestList));
             ko.tasks.runEarly();
             self.interestSlabsLoaded(true);
         });
     };
 });