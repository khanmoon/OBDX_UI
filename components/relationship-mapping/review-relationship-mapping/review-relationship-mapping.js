define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/review-relationship-mapping",
    "ojs/ojtable",
    "ojs/ojcheckboxset",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext"
  ],
  function(oj, ko, $, reviewRelationshipMappingBaseModel, BaseLogger, resourceBundle) {
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
      self.reviewResource = resourceBundle;
      var getNewKoModel = function() {
        var KoModel = ko.mapping.fromJS(reviewRelationshipMappingBaseModel.getNewModel());
        return KoModel;
      };
      self.checkedRelationshipArray = [];
      if (self.currentView() === "view") {
        var relArrayLen = self.relationshipArray().length;
        var initialRelationshipArrayLen = self.initialRelationshipArray.length;
        for (var i = 0; i < relArrayLen; i++) {
          for (var j = 0; j < initialRelationshipArrayLen; j++) {
            if (self.relationshipArray()[i].channelRelId === self.initialRelationshipArray[j].channelRelId) {
              self.relationshipArray()[i].Selected(["checked"]);
              self.relationshipArray()[i].hostRelId(self.initialRelationshipArray[j].hostRelId);
              self.relationshipArray()[i].disabled(false);
              break;
            }
            if (j === initialRelationshipArrayLen - 1) {
              self.relationshipArray()[i].Selected([]);
              self.relationshipArray()[i].hostRelId("");
              self.relationshipArray()[i].disabled(true);
            }
          }
        }
        self.reviewDataSource = new oj.ArrayTableDataSource(self.relationshipArray(), {
          idAttribute: "channelRelId"
        });
      } else {
        var l;
        var reviewRelPayLen = self.relationshipArray().length;
        var countChecked = 0;
        for (l = 0; l < reviewRelPayLen; l++) {
          if (self.relationshipArray()[l].Selected()[0] === "checked") {
            self.checkedRelationshipArray[countChecked] = self.relationshipArray()[l];
            countChecked++;
          }
        }
        self.reviewDataSource = new oj.ArrayTableDataSource(self.checkedRelationshipArray, {
          idAttribute: "channelRelId"
        });
      }

      self.createRelationshipArray = {
        accountRelationshipMaintenaceDTOs: []
      };

      /**
       *
       */
      self.columnArray = [{
          "renderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_tmpl", true),
          "headerRenderer": oj.KnockoutTemplateUtils.getRenderer("checkbox_hdr_tmpl", true),
          "id": "column1"
        }, {
          "headerText": self.reviewResource.relationshipId,
          "field": "channekRelDesc",
          "id": "column2"
        },
        {
          "headerText": self.reviewResource.mapRelationship,
          "renderer": oj.KnockoutTemplateUtils.getRenderer("inputbox_tmpl", true),
          "id": "column4"
        }
      ];

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.createRelationship = function() {
        var i;
        for (i = 0; i < self.checkedRelationshipArray.length; i++) {
          self.createRelationshipArray.accountRelationshipMaintenaceDTOs[i] = getNewKoModel().createRelationshipMappingPayload;
          self.createRelationshipArray.accountRelationshipMaintenaceDTOs[i].relationshipCode(self.checkedRelationshipArray[i].channelRelId);
          self.createRelationshipArray.accountRelationshipMaintenaceDTOs[i].hostRelationshipCode(self.checkedRelationshipArray[i].hostRelId);
        }
        var payload = ko.toJSON(self.createRelationshipArray);
        reviewRelationshipMappingBaseModel.createRelationshipMapping(payload).done(function(data, status, jqXhr) {
          self.currentView("confirm");
          rootParams.baseModel.registerElement("confirm-screen");
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            status: status,
            data: data,
            transactionName: self.reviewResource.confirmationMessage,
            transactionStatus: "ok",
            confirmScreenExtensions: {
              isSet: true,
              taskCode: "AR_N_CMT",
              resourceBundle: self.reviewResource
            }
          }, self);
        });
      };

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.backFirst = function() {
        if (self.createOrUpdate() === "create") {
          self.currentView("create");
        } else {
          self.currentView("edit");
        }
        self.relationshipMappingBase("create-relationship-mapping");
      };

      /**
       * self - description
       *
       * @return {type}  description
       */
      self.editRelationship = function() {
        self.currentView("edit");
        rootParams.baseModel.registerComponent("create-relationship-mapping", "relationship-mapping");
        self.relationshipMappingBase("create-relationship-mapping");
      };
    };
  });
