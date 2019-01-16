define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"

], function(Generic, Common) {
  "use strict";
  var BillerDetailsLocal = function() {
    return {
      root: {
        billers: {
          addnewbiller: "Add New Biller",
          header: "Billers List",
          create: "Add New",
          add: "Add",
          billerName: "Biller Name",
          category: "Category",
          relationshipnum: "Relationship Number",
          manageBillers: "Biller List",
          searchBy: "Biller Name or Relationship Number",
          title: "Biller List",
          cancel: "Cancel",
          tableheader: "Biller List Details",
          openmenualt: "Click here for more options",
          openmenutitle: "Click here for more options",
          altBillerDetails: "Click for biller details",
          titleBillerDetails: "Click for biller details",
          billerListMessage: "No Data to Display",
          menuoptions: {
            pay: "Pay",
            viewedit: "View/Edit",
            delete: "Delete"
          },
          common: Common.payments.common,

          labels: {
            edit: "Edit",
            view: "View/Edit Biller",
            billername: "Biller Name : {name}",
            category: "Category",
            relno1: "Relationship Number 1",
            relno2: "Relationship Number 2",
            relno3: "Relationship Number 3",
            pay: "Pay",
            deletebiller: "Delete Biller"
          },

          message: {
            deletesuccess: "Biller Deleted Successfully",
            editsuccess: "Biller Edited Successfully",
            nobiller: "No Biller Added",
            delete: "You are about to delete a Biller- {name} from your list. The Biller will be deleted from the application & all details will be lost! Are you sure you want to proceed?"
          },
          generic: Generic
        }
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
  return new BillerDetailsLocal();
});