define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var wearableInstructionsLocale = function() {
    return {
      root: {
        IOS:{
          imageTitle:"Pair your Apple Watch with your iPhone before starting with the registration process.",
          step1header:"<b>Step 1: Installation of the App on Apple Watch</b>",
          step1:{
            step11:"Pair the Apple Watch with your iPhone from the Watch Menu",
            step12:"Click on ‘Install’ button against the Zigbank App on iPhone in the Watch Menu",
            step13:"Zigbank App gets installed on the Apple Watch"
          },
          step2header:"<b>Step 2: Registration of Apple Watch for Zigbank App along with PIN definition</b>",
          step2:{
            step21:"Step 2: Registration of Apple Watch for Zigbank App along with PIN definition",
            step22:"Set your 4 digit Watch Banking PIN to access Zigbank Application from the Apple Watch. Ensure your Apple Watch is paired with the iPhone during PIN definition.",
            step23:"Using this PIN login to Zigbank Application directly from your Apple Watch"
          }
        },
        ANDROID:{
          imageTitle:"Pair your Android Watch with your Android Phone before starting with the registration process.",
          step1header:"<b>Step 1: Installation of the App on Android Watch</b>",
          step1:{
            step11:"Pair the Android Watch with your Android Phone from the Watch Menu",
            step12:"Click on ‘Install’ button against the Zigbank App on Android Phone in the Watch Menu",
            step13:"Zigbank App gets installed on the Android Watch"
          },
          step2header:"<b>Step 2: Registration of Android Watch for Zigbank App along with PIN definition</b>",
          step2:{
            step21:"Step 2: Registration of Android Watch for Zigbank App along with PIN definition",
            step22:"Set your 4 digit Watch Banking PIN to access Zigbank Application from the Android Watch. Ensure your Android Watch is paired with the iPhone during PIN definition.",
            step23:"Using this PIN login to Zigbank Application directly from your Android Watch"
          }
        },
        header : "Wearable Instructions",
        imageTitle: "Wearable Watch",
        imageAlt: "Image of a Wearable Watch",
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new wearableInstructionsLocale();
});
