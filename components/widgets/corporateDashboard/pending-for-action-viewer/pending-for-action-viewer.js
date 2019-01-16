define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/pending-for-action-mail-box",
  "framework/js/constants/constants"
], function(oj, ko, $, PendingActions, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.userSegment = Constants.userSegment;
    self.totalCountVar = 0;
    self.totalCount = ko.observable(0);
    self.dataLoaded = ko.observable(false);
    self.loadImage = ko.observable("dashboard/pending-for-approval.svg");
    self.hasAccess = ko.observable(false);

    function setData(data) {
      if (data.countDTOList.length) {
        for (var j = 0; j < data.countDTOList.length; j++) {
          var count = data.countDTOList[j].pendingApproval || 0;
          self.totalCountVar += count;
        }
        self.totalCount(self.totalCountVar);
        self.dataLoaded(true);
        self.hasAccess(true);
      }
    }
    PendingActions.getCountForApproval(self.userSegment === "CORPADMIN" ? "PA" : self.userSegment === "ADMIN" ? "A" : "P").then(function(data) {
      setData(data);
    }).catch(function(){
      self.hasAccess(false);
      self.dataLoaded(true);
    });
    self.switchRole = function(root) {
      root.currentRole("checker");
      rootParams.dashboard.switchModule("checker");
    };
  };
});
