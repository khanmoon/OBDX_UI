define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/authorization",
  "ojs/ojknockout-keyset",
  "ojs/ojtreeview",
  "ojs/ojjsontreedatasource",
  "promise"
], function(oj, ko, $, BaseLogger, resourceBundle, keySet) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.expandFlag = ko.observable(false);
    self.expanded = new keySet.ObservableExpandedKeySet().add([self.category().id]);
    if (self.expanded()._keys.size > 0) {
      self.expandFlag(true);
    }
    self.renderer = oj.KnockoutTemplateUtils.getRenderer("item_template", true);
  };
});
