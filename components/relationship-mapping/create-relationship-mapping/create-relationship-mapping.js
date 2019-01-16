define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/create-relationship-mapping",
    "ojs/ojtable",
    "ojs/ojcheckboxset",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup"
  ],
  function(oj, ko, $, relationshipMappingBaseModel, BaseLogger, resourceBundle) {
    "use strict";

    /**
     * return function - description
     *
     * @param  {type} rootParams description
     * @return {type}            description
     */
    return function(rootParams) {
      var self = this;
      ko.utils.extend(self, rootParams.rootModel);
      self.resource = resourceBundle;
      self.groupValid = ko.observable();
      self.dataSource = new oj.ArrayTableDataSource(self.relationshipArray(), {
        idAttribute: "channekRelDesc"
      });

      /**
       *
       */
      self.columnArray = [{
          "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
          "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
          "id": "column1"
        }, {
          "headerText": self.resource.relationshipId,
          "field": "channekRelDesc",
          "id": "column2"
        },
        {
          "headerText": self.resource.mapRelationship,
          "renderer": oj.KnockoutTemplateUtils.getRenderer("inputbox_tmpl", true),
          "id": "column3"
        }
      ];

      var tracker = document.getElementById("tracker");

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.reviewRelationship = function() {
        if (tracker.valid === "valid") {
          rootParams.baseModel.registerComponent("review-relationship-mapping", "relationship-mapping");
          self.relationshipMappingBase("review-relationship-mapping");
          self.currentView("review");
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }
      };

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.backFirst = function() {
        self.currentView("view");
        self.relationshipMappingBase("review-relationship-mapping");
      };

      /**
       * anonymous function - description
       *
       * @return {type}  description
       */
      self.validators = ko.computed(function() {
        return [{
          type: "regExp",
          options: {
            pattern: "[a-zA-Z]{1,15}",
            messageDetail: self.resource.errorMessage.hostCode
          }
        }];
      });

      self.selectAllListener = function(event) {
        var i;
        var totalSize = self.dataSource.totalSize();
        if (event.detail) {
          if (event.detail.value.length > 0 && event.detail.value[0] === "checked") {
            for (i = 0; i < totalSize; i++) {
              self.dataSource.at(i).then(function(row) {
                row.data.Selected(["checked"]);
              });
            }
          } else {
            for (i = 0; i < totalSize; i++) {
              self.dataSource.at(i).then(function(row) {
                row.data.Selected([]);
              });
            }
          }
        }
      };

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.checkboxClicked = function() {
        setTimeout(function() {
          var relArrayLen = self.relationshipArray().length;
          for (var i = 0; i < relArrayLen; i++) {
            if (self.relationshipArray()[i].Selected()[0] === "checked") {
              self.relationshipArray()[i].disabled(false);
              if(!self.relationshipArray()[i].hostRelId()) {
                self.relationshipArray()[i].hostRelId(JSON.parse(JSON.stringify(self.relationshipArray()[i].channelRelId)));
              }
            } else {
              self.relationshipArray()[i].disabled(true);
            }
          }
        }, 0);
      };

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.dispose = function() {
        self.validators.dispose();
      };
      $("#relationship-table").on("click", ".oj-checkboxset", self.checkboxClicked);
    };
  });
