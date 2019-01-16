/**
 * Defines the web worker API instance for OBDX.
 * Usage:
 * WebWorker.getInstance().then(function(worker){
 *    worker.get({
 *             'cmd': 'loadLibrary',
 *             'name': "ojmenu"
 *         }).then(function(value){
 *           console.log('ojmenu loaded');
 *         });
 *  });
 */
define([], function() {
  "use strict";
  var WebWorkerInstance = {
    createInstance: function() {
      return new Promise(function(workerCreateResolve) {
        var worker = new Worker("/framework/js/workers/require-worker.js");
        worker.onmessage = function(e) {
          if (e.data === "worker_loaded") {
            worker.get = function(argument) {
              return new Promise(function(resolve) {
                worker.onmessage = function(e) {
                  if (e.data instanceof Object) {
                    resolve(e.data.response);
                  }
                };
                worker.postMessage(argument);
              });
            };
            workerCreateResolve(worker);
          }
        };
      });
    }
  };
  var instance;
  return {
    getInstance: function() {
      if (!instance) {
        instance = WebWorkerInstance.createInstance();
      }
      return instance;
    }
  };
});
