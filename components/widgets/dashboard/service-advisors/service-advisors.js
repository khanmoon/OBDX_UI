define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/service-advisors"
], function(oj, ko, $, serviceAdvisorsBaseModel, BaseLogger, resourceBundle) {
  "use strict";

  /**
   * return function - description
   *
   * @param  {type} rootParams description
   * @return {type}            description
   */
  return function(rootParams) {
    var self = this;
    self.resource = resourceBundle;
    self.advisorList = ko.observable("");
    self.requestPageLoad = ko.observable(false);
    self.advisorTypes = [];
    self.advisorMap = [];
    self.advisorsReponse = ko.observable(false);
    serviceAdvisorsBaseModel.fetchAdvisors().done(function(data) {
      self.advisorList = data.serviceAdvisors;
      if (self.advisorList && self.advisorList.length > 0) {
        var advisorsCount = self.advisorList.length;
        var i;
        var phoneNoCount;
        var j;
        for (i = 0; i < advisorsCount; i++) {
          for (var k = 0; k < self.advisorTypes.length; k++) {
            if (self.advisorTypes[k] === self.advisorList[i].relationship) {
              break;
            }
          }
          if (k === self.advisorTypes.length) {
            self.advisorTypes[self.advisorTypes.length] = self.advisorList[i].relationship;
          }
          if (self.advisorList[i].fullName === "" || !self.advisorList[i].fullName) {
            if (self.advisorList[i].middleNAme === "" || !self.advisorList[i].middleNAme) {
              self.advisorList[i].fullName = rootParams.baseModel.format(self.resource.fullNameWithoutMiddleName, {
                firstName: self.advisorList[i].firstName,
                lastName: self.advisorList[i].lastName
              });
            } else {
              self.advisorList[i].fullName = rootParams.baseModel.format(self.resource.fullName, {
                firstName: self.advisorList[i].firstName,
                middleName: self.advisorList[i].middleNAme,
                lastName: self.advisorList[i].lastName
              });
            }
          }
          phoneNoCount = self.advisorList[i].phones.length;
          for (j = 0; j < phoneNoCount; j++) {
            self.advisorList[i].phones[j].contactNumber = rootParams.baseModel.format(self.resource.contactNumber, {
              areaCode: self.advisorList[i].phones[j].areaCode,
              number: self.advisorList[i].phones[j].number
            });
          }
        }
        var count = 0;
        for (var l = 0; l < self.advisorTypes.length; l++) {
          self.advisorMap[l] = {};
          self.advisorMap[l].type = self.advisorTypes[l];
          self.advisorMap[l].advisorList = [];
          count = 0;
          for (i = 0; i < self.advisorList.length; i++) {
            if (self.advisorMap[l].type === self.advisorList[i].relationship) {
              self.advisorMap[l].advisorList[count++] = self.advisorList[i];
            }
          }
        }
        self.sortedAdvisor = [];
        count=0;
        for (i = 0; i < self.advisorMap.length; i++) {
          for (j = 0; j < self.advisorMap[i].advisorList.length; j++) {
            self.sortedAdvisor[count++] = self.advisorMap[i].advisorList[j];
          }
        }
        self.advisorsReponse(true);
      }
      self.requestPageLoad(true);
    });
  };
});
