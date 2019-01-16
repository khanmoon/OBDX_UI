define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/register-biller", "ojL10n!resources/nls/register-biller-error"], function(Generic, registerBiller,registerBillerError) {
  "use strict";
  var QuickPaymentsLocale = function() {
    return {
      root: {
        generic : Generic,
        registerBiller : registerBiller,
        registerBillerError:registerBillerError,
        labels: {
        rechargeAmount: "Recharge Amount",
        quickBillPay: "Quick Bill Pay",
        selectPlan:"Select Plan"
      },
      messages: {
        reviewQuickRechargeMsg: "You initiated a request for quick recharge. Please review details before you confirm!",
        noBillersMapped: "Currently no billers are available under the selected location",
        cancelOperation: "Are you sure you want to cancel the operation?",
        scheduledDate : "Scheduled Date"
      },
      heading: {
        quickRecharge: "Quick Recharge"
      }

    },
    ar: false,
    en: false,
    "en-us": false
  };
};
return new QuickPaymentsLocale();
});
