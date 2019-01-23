define([
  "knockout",
  "ojL10n!resources/nls/td-open",
  "framework/js/constants/constants"
], function(ko, locale, Constants) {
  "use strict";

  return function(rootParams) {
    var self = this;

    self.isNomineeRequired = rootParams.rootModel.params.isNomineeRequired;
    self.manageNominee = rootParams.rootModel.params.manageNominee;
    self.addNomineeModel = rootParams.rootModel.params.addNomineeModel;
    self.constants = Constants;
    self.locale=locale;
    rootParams.rootModel.params.hostSupportsNominee(true);
    self.component = ko.observable();
    self.isMinor = rootParams.rootModel.params.isMinor;
    self.nomineeDetails = rootParams.rootModel.params.nomineeDetails;
    self.rootModelInstance = rootParams.rootModel.params.rootModelInstance;
    self.accountModule = rootParams.rootModel.params.accountModule;
    self.jointAccount = rootParams.rootModel.params.jointAccount;
    self.holdingPattern = rootParams.rootModel.params.holdingPattern;

    /**
     * This function is used to handle the radio option of nominee.
     *
     * @memberOf td-open
     * @function nomineeDetailsChanged
     * @returns {void}
     */

    self.nomineeDetailsChanged = function(event) {
      if (event.detail.value === self.manageNominee() && event.detail.value !== event.detail.previousValue) {
        if (self.manageNominee() === self.nomineeDetails[1].id) {
          self.component("add-edit-nominee");
          self.isNomineeRequired(true);
          self.rootModelInstance.createTDData.nomineeDTO(self.addNomineeModel);
          rootParams.rootModel.params.resetNomineeModel(self.addNomineeModel, self.isMinor);
        } else if (self.manageNominee() === self.nomineeDetails[0].id) {
          self.isNomineeRequired(false);
          self.rootModelInstance.createTDData.nomineeDTO(null);
        }
      }
    };

    rootParams.baseModel.registerComponent("add-edit-nominee", "nominee");

    self.nomineeDetails = [{
      id: "no",
      label: self.locale.generic.common.no
    }, {
      id: "yes",
      label: self.locale.generic.common.yes
    }];

    self.manageNominee(self.manageNominee() ? self.manageNominee() : self.nomineeDetails[0].id);

    if (self.manageNominee() === self.nomineeDetails[1].id) {
      self.component("add-edit-nominee");
      self.isNomineeRequired(true);
    }
};
});