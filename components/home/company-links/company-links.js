define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/company-links",
  "ojs/ojinputtext"
], function(ko, $, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.companyLinks = [{
      header: self.nls.companyLinks.labels.companyHeader,
      links: [{
        txt: self.nls.companyLinks.labels.Home,
        icon: null,
        linkhref: "#"
      }, {
        txt: self.nls.companyLinks.labels.About,
        icon: null,
        linkhref: "#"
      }, {
        txt: self.nls.companyLinks.labels.Help,
        icon: null,
        linkhref: "#"
      }]
    }, {
      header: self.nls.companyLinks.labels.legalHeader,
      links: [{
        txt: self.nls.companyLinks.labels.legalTerms,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.legalPolicy,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.legalPress,
        icon: null,
        linkhref: ""
      }]
    }, {
      header: self.nls.companyLinks.labels.helpHeader,
      links: [{
        txt: self.nls.companyLinks.labels.helpSign,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.helpRates,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.helpOffers,
        icon: null,
        linkhref: ""
      }]
    }, {
      header: self.nls.companyLinks.labels.contactHeader,
      links: [{
        txt: self.nls.companyLinks.labels.companyName,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.companyAddress1,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.companyAddress2,
        icon: null,
        linkhref: ""
      }, {
        txt: self.nls.companyLinks.labels.companyAddress3,
        icon: null,
        linkhref: ""
      }]
    }];
  };
});