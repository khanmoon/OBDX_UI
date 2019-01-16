define([], function() {
  "use strict";
  var shipmentDetailsLocale = function() {
    return {
      root: {
        labels: {
          descriptionOfGoods: "Description of Goods",
          goods: "Goods",
          goodWithSrNo: "Goods {srNo}",
          latestShipmentDate: "Latest Shipment Date",
          lastdateofShipment: "Latest Date for Shipment",
          portOfLoading: "Port of Loading",
          newPortOfLoading: "Port Of Loading(New)",
          partialShipment: "Partial Shipment",
          portOfDischarge: "Port of Discharge",
          newPortOfDischarge: "Port Of Discharge(New)",
          shipmentFrom: "Shipment From",
          newShipmentFrom: "Shipment From(New)",
          shipmentTo: "Shipment To",
          newShipmentTo: "Shipment To(New)",
          shipmentPeriod: "Shipment Period",
          newShipmentPeriod: "Latest Shipment Period(New)",
          shipmentDate: "Shipment Date",
          newShipmentDate: "Latest Shipment Date(New)",
          transShipment: "Transshipment",
          baseDate: "Base Date",
          maturityDate: "Maturity Date",
          billAmount: "Bill Amount",
          purchaseAmount: "Purchase Amount",
          daysFrom: "Days From",
          previousShipmentDate: "Previous Shipment Date",
          previousShipmentPeriod: "Previous Shipment Period",
          baseDateDescription: "Base Date Description",
          notApplicable: "N/A",
          units:"Units",
          pricePerUnit : "Price Per Unit",
          addGoods : "Add Goods",
          maxGoodLimit : "You can enter upto 5 goods only"
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
  return new shipmentDetailsLocale();
});
