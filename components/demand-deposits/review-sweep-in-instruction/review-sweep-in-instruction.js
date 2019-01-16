/**
 * Create sweep in instruction lists all the accounts that have been linked to a particular account.
 * Also it gives option to link additional accounts to the beneficiary account.
 *
 * @module sweep-in-instruction
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */

define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/sweep-in-instruction"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.dashboard.headerName(ResourceBundle.title);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resource.labels.review;
    self.reviewTransactionName.reviewHeader = self.resource.labels.reviewHeader;
    self.selectColumnData = function() {
      if (self.accountType() === "casa") {
        self.linkedAccountscolumnData(self.casaConfirmScreenAccountscolumnData());
      } else {
        self.linkedAccountscolumnData(self.tdConfirmScreenAccountscolumnData());
      }
    };
    self.casaConfirmScreenAccountscolumnData = ko.observableArray([{
        "headerText": self.resource.labels.accountNo,
        "field": "accountId"
      }, {
        "headerText": self.resource.labels.partyName,
        "field": "partyName"
      },
      {
        "headerText": self.resource.labels.balance,
        "field": "balance",
        "style": "width:3%; text-align:right"
      }, {
        "renderer": oj.KnockoutTemplateUtils.getRenderer("new_account", true)
      }
    ]);
    self.tdConfirmScreenAccountscolumnData = ko.observableArray([{
        "headerText": self.resource.labels.accountNo,
        "field": "accountId"
      }, {
        "headerText": self.resource.labels.partyName,
        "field": "partyName",
        "style": "width:30%"
      }, {
        "renderer": oj.KnockoutTemplateUtils.getRenderer("new_account", true),
          "style": "width:1%"
      }
    ]);
    self.selectColumnData();
    self.linkedaccountsDataprovider = new oj.ArrayTableDataSource(self.showDetails(self.accountsAddedSweepInlist), {
      idAttribute: ["accountId"] || []
    });
    self.linkedaccountsPagingDataprovider(new oj.PagingTableDataSource(self.linkedaccountsDataprovider));
    self.linkedaccountsDataproviderLoaded(true);
  };
});
