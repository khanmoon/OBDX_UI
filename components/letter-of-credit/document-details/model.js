define([

], function() {
  "use strict";

  var DocumentDetailsModel = function() {
    var Model = function() {
      this.DocumentDetails = {
        "clause": [],
        "copies": null,
        "incoterm": null,
        "name": null,
        "originals": null
      };
    };
    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new DocumentDetailsModel();
});