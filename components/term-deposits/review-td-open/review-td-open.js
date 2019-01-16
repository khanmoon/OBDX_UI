define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/review-td-open",
    "framework/js/constants/constants"
], function(oj, ko, $, ResourceBundle, Constants) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.constants = Constants;
        self.createRDModel = self.params.data;
        self.parties =self.params.parties;
        rootParams.baseModel.registerComponent("review-add-edit-nominee", "nominee");
        self.component = ko.observable("review-add-edit-nominee");
        rootParams.dashboard.headerName(self.resource.common.termDpositHeader);
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resource.common.review;
        self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
        /**
         * This function is used set tenure of Recurring Deposit .
         *
         * @memberOf review-create-rd
         * @function formatTenure
         * @returns {void}
         */
        self.formatTenure = function() {
          var year, month, day;
          if (self.createRDModel.tenure.years() <= 1)
            year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
              n: self.createRDModel.tenure.years()
            });
          else
            year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
              n: self.createRDModel.tenure.years()
            });
          if (self.createRDModel.tenure.months() <= 1)
            month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
              n: self.createRDModel.tenure.months()
            });
          else
            month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
              n: self.createRDModel.tenure.months()
            });
            if (self.createRDModel.tenure.days() <= 1)
              day = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.day, {
                n: self.createRDModel.tenure.days()
              });
            else
              day = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.day, {
                n: self.createRDModel.tenure.days()
              });

          return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
            years: year,
            months: month,
            days:day
          });
        };
    };
});
