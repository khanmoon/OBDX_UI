define([], function() {
  "use strict";
  window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  window._paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
  window._paq.push(["trackPageView"]);
  window._paq.push(["enableLinkTracking"]);
  (function() {
    var u = "http://mum00chj.in.oracle.com:8080/";
    window._paq.push(["setTrackerUrl", u + "piwik.php"]);
    window._paq.push(["setSiteId", "4"]);
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.type = "text/javascript";
    g.async = true;
    g.defer = true;
    g.src = u + "piwik.js";
    s.parentNode.insertBefore(g, s);
  })();
  return {
    trackPageView: function(parameters) {
      window._paq.push(["setCustomUrl", "/" + window.location.search.substr(1)]);
      window._paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
      window._paq.push(["deleteCustomVariables", "page"]);
      window._paq.push(["setUserId", parameters.userId]);
      window._paq.push(["setGenerationTimeMs", 0]);
      window._paq.push(["trackPageView"]);
      window._paq.push(["enableHeartBeatTimer", 10]);
    }
  };
});
