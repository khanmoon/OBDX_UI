define(
  [],
  function() {
    "use strict";
    var UserSpendCategoryCard = function() {
      return {
        root: {
          edit: "Edit",
          alt : "Click here to edit spend category",
          title : "Click here to edit spend category"
        },
        ar: true,
        fr: true,
        cs: true,
        sv: true,
        en: false,
        "en-us": false,
        el: true
      };
    };
    return new UserSpendCategoryCard();
  }
);