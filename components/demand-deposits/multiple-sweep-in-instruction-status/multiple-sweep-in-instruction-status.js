/**
 * Multiple sweep in instruction status lists all the sweep in requests and their
 * corresponding staus i.e whether they are completed or failed
 *
 * @module sweep-in-instruction
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define(["ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/multiple-sweep-in-instruction-status",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingtabledatasource",
  "ojs/ojlistview",
  "ojs/ojpopup",
  "ojs/ojlabel",
  "promise"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(rootParams.baseModel.small() ? self.resource.headerSmall : self.resource.header);
    self.multipleSweepInInstructionStatusDataProvider = ko.observable();
    self.multipleSweepInInstructionStatusDataProvider = new oj.ArrayTableDataSource(self.multipleSweepInInstructionStatusData, {
      idAttribute: ["accountId"] || []
    });

  };
});
