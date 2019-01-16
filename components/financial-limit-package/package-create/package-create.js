define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",

  "ojL10n!resources/nls/limit-package-create",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist"
], function(oj, ko, $, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.pageHeader);
    self.packageAction = ko.observable(self.nls.package_create.create);
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("page-section");
    self.selectedRoleValues = ko.observableArray();
    self.groupValid = ko.observable();

    self.isCorpAdmin = ko.observable();
    if (self.params.action === "editAfterSave") {
      self.packageAction(self.nls.package_create.create);
    }
    else if(self.params.action === "cloneAfterEdit")
      self.packageAction(self.nls.package_create.create);
      else if(self.params.action === "CREATE")
        self.packageAction(self.nls.package_create.create);

    else
      self.packageAction(self.nls.package_create.edit);

    var partyId = {};
    partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
    partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
    if (partyId.value) {
      self.isCorpAdmin = true;
    } else {
      self.isCorpAdmin = false;
    }

    if (self.createPackageData().assignableToList().length !== 0) {
      $(self.createPackageData().assignableToList()).each(function(k, v) {
        if (v.key.value() !== null) {
          self.selectedRoleValues.push(v.key.value());
        }
      });
    }
    self.selectedRoleValues.subscribe(function(data) {
      self.createPackageData().assignableToList.removeAll();
      $(data).each(function(k, v) {
        var assign = {
          key: {
            "type": "ROLE",
            "value": v
          }
        };
        self.createPackageData().assignableToList.push(ko.mapping.fromJS(assign));
      });
    });

  };
});
