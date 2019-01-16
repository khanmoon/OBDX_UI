/**
 * transaction-mapping-search-list contains search method to search application roles.
 *
 * @module role-transaction-mapping
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} BaseLogger
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/authorization",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, resourceBundle) {
  "use strict";
  /**
   * User should see the list of application roles based on search.
   *
   * @param {object}  rootParams  An object which contains contect of dashboard and param values
   * @return {function} function
   */
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams);
    self.nls = resourceBundle;
    self.selectedItem = ko.observable("internal");
    self.roleListDataSourceAdmin = rootParams.roleListDataSourceAdmin;
    self.roleListLoaded = rootParams.roleListLoaded;
    self.resultListLoaded = rootParams.resultListLoaded;
    self.selectedUser = rootParams.selectedUser;
    self.roleListDataSourceAdmin = rootParams.roleListDataSourceAdmin;
    self.roleListExternal = rootParams.roleListExternal;
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerComponent("application-role-read", "role-transaction-mapping");

    rootParams.baseModel.registerElement("nav-bar");

    self.uiOptions = {
        "menuFloat": "left",
        "fullWidth": false,
        "defaultOption": self.selectedItem
    };
    self.menuOptions = ko.observableArray([{
        id: "internal",
        label: self.nls.common.menu.internal
      },
      {
        id: "external",
        label: self.nls.common.menu.external
      }
    ]);
    self.listItems = ko.observableArray([{
        id: "internal",
        label: self.nls.common.menu.internal
      },
      {
        id: "external",
        label: self.nls.common.menu.external
      }
    ]);
    /**
     * This function will provide the tab to select the application role based on internal type or sxternal type.
     *
     * @memberof transactionMappingSearchList
     * @function selectedTaskTabChangeHandler
     * @param {index} event  Event to select perticular tab.
     * @returns {void}
     */
    self.selectedTaskTabChangeHandler = function(event) {
      if (event.detail.value === 0) {
        self.selectedItem = self.listItems()[0].id;
      }
      if (event.detail.value === 1) {
        self.selectedItem = self.listItems()[1].id;
      }
    };
    self.appRoleRead = function(appRole) {
      rootParams.dashboard.loadComponent("application-role-read", {
        "appRoleId": appRole.applicationRoleId,
        "accessPointType": self.selectedItem()
      }, self);
    };
  };
});
