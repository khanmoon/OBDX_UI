(function () {
    "use strict";
    var workerScript = document.currentScript && document.currentScript.dataset.serviceWorker;
    if (workerScript && "serviceWorker" in navigator) {
        navigator.serviceWorker.register(workerScript).then(function (registration) {
            //eslint-disable-next-line no-console
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }).catch(function (err) {
            //eslint-disable-next-line no-console            
            console.log("ServiceWorker registration failed: ", err);
        });
    }
})();
