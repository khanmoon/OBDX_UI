/**
 * transaction-mapping-search contains search method to search application roles.
 *
 * @module role-transaction-mapping
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} BaseLogger
 * @requires {object} TransactionMappingSearchModel
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation"
], function(oj, ko, $, BaseLogger, TransactionMappingSearchModel, resourceBundle) {
  "use strict";
  /**
   * User should see the search option based on the User Segment and Application Role name.
   * User selects user segment and can search application roles.
   *
   * @param {object}  rootParams  An object which contains contect of dashboard and param values
   * @return {function} function
   */
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.userSegment = ko.observableArray();
    self.childRoleList = ko.observableArray();
    self.isRoleFetched = ko.observable(false);
    self.appRoleName = ko.observable();
    self.selectedUser = ko.observable(self.nls.headings.all);
    self.roleListAdmin = ko.observableArray();
    self.roleListCorp = ko.observableArray();
    self.roleListRetail = ko.observableArray();
    self.roleListAdminExternal = ko.observableArray();
    self.roleListCorpExternal = ko.observableArray();
    self.roleListRetailExternal = ko.observableArray();
    self.roleListInternal = ko.observableArray();
    self.roleListExternal = ko.observableArray();
    self.roleListLoaded = ko.observable(false);
    self.roleList = ko.observableArray([]);
    self.roleListDataSourceArray = ko.observableArray([]);
    self.resultListLoaded = ko.observable(false);
    rootParams.baseModel.registerElement("nav-bar");

    self.roleListDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    self.roleListDataSourceAdmin = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    self.roleListDataSourceCorp = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    self.roleListDataSourceRetail = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    self.roleListDataSourceAdminExternal = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    self.roleListDataSourceCorpExternal = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    self.roleListDataSourceRetailExternal = new oj.ArrayTableDataSource([], {
      idAttribute: "applicationRoleId"
    });
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    rootParams.baseModel.registerComponent("transaction-mapping-search-list", "role-transaction-mapping");
    /** All rest will be called once the component is loaded.
     * Rest response can be either successful or rejected.
     *
     * @instance {object} TransactionMappingSearchModel
     * @param fetchUserGroupOptions
     * @response {array}  data  An array containg the response of the rest fired
     **/
    TransactionMappingSearchModel.fetchUserGroupOptions().done(function(data) {
      if (data.enterpriseRoleDTOs) {
        self.userSegment().push({
          text: self.nls.headings.all,
          value: self.nls.headings.all
        });
        for (var i = 0; i < data.enterpriseRoleDTOs.length; i++) {
          self.userSegment().push({
            text: data.enterpriseRoleDTOs[i].enterpriseRoleName,
            value: data.enterpriseRoleDTOs[i].enterpriseRoleId
          });
        }
        self.isRoleFetched(true);

      }
    });
    /**This function will fetch the application roles list based on the User Segment
     *  and Application Role Name.
     * Function will create the dataSources for table to be displayed for application roles.
     *
     * @memberof transactionMappingSearch
     * @function fetchUserGroupListOptions
     * @returns {void}
     */
    self.fetchUserGroupListOptions = function() {
      if (self.appRoleName() === null || self.appRoleName() === undefined) {
        self.appRoleName("");
      }
     if (self.selectedUser().toUpperCase() === "ALL" || self.appRoleName() === undefined) {
        self.selectedUser("");
      }
      var applicationRoleParameters = {
        "applicationRoleName": self.appRoleName(),
        "enterpriseRole": self.selectedUser()
      };
      self.roleListAdmin([]);
      self.roleListCorp([]);
      self.roleListRetail([]);
      self.roleListExternal([]);
      self.roleListInternal([]);
      self.roleListAdminExternal([]);
      self.roleListCorpExternal([]);
      self.roleListRetailExternal([]);
      self.resultListLoaded(false);
      self.roleListLoaded(false);
      TransactionMappingSearchModel.fetchUserGroupListOptions(applicationRoleParameters).done(function(data) {
        if (data.applicationRoleDTOs && data.applicationRoleDTOs.length > 0) {
          self.roleListLoaded(true);
          self.roleList(data.applicationRoleDTOs);
          ko.utils.arrayForEach(self.roleList(), function(item) {
            if ((item.enterpriseRole.toLowerCase()=== "administrator" && item.accessPointType === "INT")) {
              self.roleListAdmin().push({
                applicationRoleName: item.applicationRoleName,
                applicationRoleDescription: item.applicationRoleDescription,
                applicationRoleId: item.applicationRoleId,
                enterpriseRole: item.enterpriseRole,
                accessPointType: item.accessPointType,
                userType: self.nls.header.admin
              });
            }
            if ((item.enterpriseRole.toLowerCase() === "corporateuser" && item.accessPointType === "INT")) {
              self.roleListCorp().push({
                applicationRoleName: item.applicationRoleName,
                applicationRoleDescription: item.applicationRoleDescription,
                applicationRoleId: item.applicationRoleId,
                enterpriseRole: item.enterpriseRole,
                accessPointType: item.accessPointType,
                userType: self.nls.header.corporate
              });
            }
            if ((item.enterpriseRole.toLowerCase() === "retailuser" && item.accessPointType === "INT")) {
              self.roleListRetail().push({
                applicationRoleName: item.applicationRoleName,
                applicationRoleDescription: item.applicationRoleDescription,
                applicationRoleId: item.applicationRoleId,
                enterpriseRole: item.enterpriseRole,
                accessPointType: item.accessPointType,
                userType: self.nls.header.retail
              });
            }
            if ((item.enterpriseRole.toLowerCase() === "administrator" && item.accessPointType === "EXT")) {
              self.roleListAdminExternal().push({
                applicationRoleName: item.applicationRoleName,
                applicationRoleDescription: item.applicationRoleDescription,
                applicationRoleId: item.applicationRoleId,
                enterpriseRole: item.enterpriseRole,
                accessPointType: item.accessPointType,
                userType: self.nls.header.admin
              });
            }
            if ((item.enterpriseRole.toLowerCase() === "corporateuser" && item.accessPointType === "EXT") ) {
              self.roleListCorpExternal().push({
                applicationRoleName: item.applicationRoleName,
                applicationRoleDescription: item.applicationRoleDescription,
                applicationRoleId: item.applicationRoleId,
                enterpriseRole: item.enterpriseRole,
                accessPointType: item.accessPointType,
                userType: self.nls.header.corporate
              });
            }
            if ((item.enterpriseRole.toLowerCase() === "retailuser" && item.accessPointType === "EXT") ) {
              self.roleListRetailExternal().push({
                applicationRoleName: item.applicationRoleName,
                applicationRoleDescription: item.applicationRoleDescription,
                applicationRoleId: item.applicationRoleId,
                enterpriseRole: item.enterpriseRole,
                accessPointType: item.accessPointType,
                userType: self.nls.header.retail
              });
            }
          });
          self.roleListDataSourceAdmin = new oj.ArrayTableDataSource(self.roleListAdmin(), {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceCorp = new oj.ArrayTableDataSource(self.roleListCorp(), {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceRetail = new oj.ArrayTableDataSource(self.roleListRetail(), {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceAdminExternal = new oj.ArrayTableDataSource(self.roleListAdminExternal(), {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceCorpExternal = new oj.ArrayTableDataSource(self.roleListCorpExternal(), {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceRetailExternal = new oj.ArrayTableDataSource(self.roleListRetailExternal(), {
            idAttribute: "applicationRoleId"
          });
        } else {
          self.roleListDataSourceAdmin = new oj.ArrayTableDataSource([], {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceCorp = new oj.ArrayTableDataSource([], {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceRetail = new oj.ArrayTableDataSource([], {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceAdminExternal = new oj.ArrayTableDataSource([], {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceCorpExternal = new oj.ArrayTableDataSource([], {
            idAttribute: "applicationRoleId"
          });
          self.roleListDataSourceRetailExternal = new oj.ArrayTableDataSource([], {
            idAttribute: "applicationRoleId"
          });
        }
        self.roleListInternal.push({
          roleListDataSource: self.roleListDataSourceAdmin
        });
        self.roleListInternal.push({
          roleListDataSource: self.roleListDataSourceCorp
        });
        self.roleListInternal.push({
          roleListDataSource: self.roleListDataSourceRetail
        });

        self.roleListExternal.push({
          roleListDataSource: self.roleListDataSourceAdminExternal
        });
        self.roleListExternal.push({
          roleListDataSource: self.roleListDataSourceCorpExternal
        });
        self.roleListExternal.push({
          roleListDataSource: self.roleListDataSourceRetailExternal
        });
        self.resultListLoaded(true);
      });
    };
    self.fetchUserGroupListOptions();
    self.selectedUser = ko.observable(self.nls.headings.all);
    /**This function will be executed on click of Search button.
     * It will execute the fetchUserGroupListOptions function to get list of application Roles.
     *
     * @memberof transactionMappingSearch
     * @function searchApplicationRoles
     * @returns {void}
     */
    self.searchApplicationRoles = function() {
      self.selectedUserType = ko.observable(self.selectedUser);
      self.fetchUserGroupListOptions();
    };
    /**This function will be executed on click of Clear button.
     * It will set the value of User Segment to "ALL" and clear value in application role name.
     *
     * @memberof transactionMappingSearch
     * @function resetForm
     * @returns {void}
     */
    self.resetForm = function() {
      self.appRoleName("");
      self.selectedUser([]);
    };
    /**This function will be executed on click of Cancel button.
     * It loads the dashboard.
     *
     * @memberof transactionMappingSearch
     * @function cancel
     * @returns {void}
     */
    self.cancel = function() {
      rootParams.dashboard.openDashBoard();
    };
  };
});
