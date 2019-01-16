define([
    "ojs/ojcore",
    "knockout",
     "ojs/ojtreeview",
    "ojs/ojjsontreedatasource"
], function (oj,ko) {
    "use strict";
    return function (rootParams) {
      var self = this;
      var request, response;
      ko.utils.extend(self, rootParams.rootModel);
      rootParams.dashboard.headerName(self.nls.header.auditlogmaintenance);
 for(var i=0; i< self.params.auditDetailsDTOList.length; i++){
      if(self.params.auditDetailsDTOList[i].auditType === "1"){
                        self.url = self.params.resolvedRequestUrl;
                       request = self.params.auditDetailsDTOList[i].request;
        response = self.params.auditDetailsDTOList[i].response;
       }
              }
      var jsonRequestData = [];
      var jsonResponseData = [];
       /**
       * Converts the JSON data to attr, children format suitable for JSON Tree Data Source.
       * @param {Object} object The object to be converted.
       * @param {Array} target The target array is returned, which holds the results.
       * @returns {void}
       */
      function jsonify(object, target) {
        for (var property in object) {
          if (object[property]) {
            var wrapper = {
              attr: {
                id: rootParams.baseModel.incrementIdCount(),
                title: property
              }
            };
            if (object[property] instanceof Array || object[property] instanceof Object) {
              wrapper.children = [];
              jsonify(object[property], wrapper.children);
            } else {
              wrapper.attr.value = object[property];
            }
            target.push(wrapper);
          }
        }
      }
      jsonify(request, jsonRequestData);
      jsonify(response, jsonResponseData);
      this.requestData = new oj.JsonTreeDataSource(jsonRequestData);
      this.responseData = new oj.JsonTreeDataSource(jsonResponseData);
      self.back = function() {
        history.go(-1);
      };
};});
