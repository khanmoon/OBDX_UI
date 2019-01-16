define([], function() {
  "use strict";
  var SocialMedia = function() {
    return {
      root: {
        facebook: {
          title: "Facebook",
          anchor: {
            alt: "Click Here to Login to Facebook"
          },
          image: {
            alt: "Facebook logo"
          }
        },
        linkedin: {
          title: "LinkedIn",
          anchor: {
            alt: "Click Here to Login to LinkedIn"
          },
          image: {
            alt: "LinkedIn logo"
          }
        },
        SocialMediaLoginArialLabel: "Click Here to Login to Social media"

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
  return new SocialMedia();
});