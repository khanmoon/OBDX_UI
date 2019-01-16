define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseModel"
], function(oj, ko, $, BaseModel) {
  "use strict";
  return function() {
    ko.utils.extend(self, BaseModel.getInstance());
    self.registerElement("address-input");
  };
});