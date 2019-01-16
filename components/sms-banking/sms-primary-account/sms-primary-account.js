define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/sms-primary-account",
  "framework/js/constants/constants",
  "ojs/ojselectcombobox",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojswitch",
  "ojs/ojtable",
  "ojs/ojradioset",
  "ojs/ojbutton"
], function(oj, ko, $, BaseLogger, Model, resourceBundle, Constants) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = resourceBundle;
    self.items = ko.observableArray();
    self.selectedAccount = ko.observable();
    self.datasource = new oj.ArrayTableDataSource(self.items, {
      idAttribute: "accountTypeAndNumber"
    });
    self.renderRadioButton = oj.KnockoutTemplateUtils.getRenderer("radio_button", true);
    Params.dashboard.headerName(self.resource.primaryAccountNumber);


    var mePreference = {};
    Model.mePreference().then(function(data) {
      mePreference = data;
      ko.utils.arrayForEach(data.operativeAccount, function(item) {
        if (Constants.currentEntity === item.determinantValue) {
          self.selectedAccount(item.accountId.value);
        }
      });
    });

    Model.getDemandDeposits().then(function(data) {
      var tempData = $.map(data.accounts, function(item) {
        var newObj = {};
        newObj.accountTypeAndNumber = item.id.displayValue + "-" + item.ddaAccountType;
        newObj.partyName = item.partyName;
        newObj.nickName = item.accountNickname || "-";
        newObj.accountId = item.id.value;
        return newObj;
      });
      ko.utils.arrayPushAll(self.items, tempData);
    });

    /**
     * submit - Click handler for submit
     *
     * @return {void}  returns nothing
     */
    self.submit = function() {
      delete mePreference.status;
      mePreference.operativeAccount = mePreference.operativeAccount.filter(function(item) {
        return item.determinantValue !== Constants.currentEntity;
      });
      mePreference.operativeAccount.push({
        determinantValue: Constants.currentEntity,
        accountId: self.selectedAccount()
      });
      var payload = ko.mapping.toJSON(mePreference);
      Model.updatePreference(payload).then(function() {
        Params.baseModel.showMessages(null, [self.resource.successMsg], "CONFIRMATION");
      });
    };

  };
});
