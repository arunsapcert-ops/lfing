sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/Token",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Token, MessageBox, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("com.piaggio.sap.lifing.lifing.controller.HistorySearch", {

    // Create a token when user presses Enter in a MultiInput
    onAddToken: function (e) {
      const mi = e.getSource();
      const text = (e.getParameter("value") || "").trim();
      if (!text) return;

      // avoid duplicate tokens by text (simple guard)
      const exists = mi.getTokens().some(t => (t.getKey?.() || t.getText()) === text);
      if (!exists) {
        mi.addToken(new Token({ text: text, key: text }));
      }
      mi.setValue(""); // clear typing area
    },

    // Helper: read token texts/keys from a MultiInput
    _readTokens: function (sId) {
      const mi = this.byId(sId);
      return mi.getTokens()
        .map(t => t.getKey?.() || t.getText())
        .filter(Boolean);
    },

    // Build filters directly from the tokens
    _buildFilters: function (aMat, aEqp, aSer, sSLoc) {
      const byMany = (vals, path) =>
        vals.length
          ? new Filter({ filters: vals.map(v => new Filter(path, FilterOperator.EQ, v)), and: false })
          : null;

      const aTop = [];
      const fMat = byMany(aMat, "Material");
      const fEqp = byMany(aEqp, "Equipment");
      const fSer = byMany(aSer, "SerialNumber");
      if (fMat) aTop.push(fMat);
      if (fEqp) aTop.push(fEqp);
      if (fSer) aTop.push(fSer);

      if (sSLoc) aTop.push(new Filter("StorageLocation", FilterOperator.EQ, sSLoc));
      return aTop;
    },

    onNavButtonPress: function () {
      window.history.go(-1);
    },

    onSearch: function () {
      // 1) Read tokens straight from the UI
      const materials = this._readTokens("miMaterial");
      const equipments = this._readTokens("miEquipment");
      const serials = this._readTokens("miSerial");
      const storageLoc = (this.byId("inpStorageLoc").getValue() || "").trim();

      // 2) Validate (at least one of M/E/S)
      if (!(materials.length || equipments.length || serials.length)) {
        MessageBox.error("Enter at least one of Material, Equipment, or Serial Number.");
        return;
      }



      var aFilters = [];

      // OR group for Material
      if (materials.length) {
        aFilters.push(new sap.ui.model.Filter({
          filters: materials.map(function (m) {
            return new sap.ui.model.Filter("Zmatnr", sap.ui.model.FilterOperator.EQ, m);
          }),
          and: false
        }));
      }

      // OR group for Equipment
      if (equipments.length) {
        aFilters.push(new sap.ui.model.Filter({
          filters: equipments.map(function (e) {
            return new sap.ui.model.Filter("Zequnr", sap.ui.model.FilterOperator.EQ, e);
          }),
          and: false
        }));
      }

      // OR group for Serial Number
      if (serials.length) {
        aFilters.push(new sap.ui.model.Filter({
          filters: serials.map(function (s) {
            return new sap.ui.model.Filter("Zsernr", sap.ui.model.FilterOperator.EQ, s);
          }),
          and: false
        }));
      }

      // Single Storage Location
      if (storageLoc) {
        aFilters.push(new sap.ui.model.Filter("Zlager", sap.ui.model.FilterOperator.EQ, storageLoc));
      }

      // --- 4. Call backend with $filter ---
      var oDataModel = this.getOwnerComponent().getModel("ninethModel");
      var that = this;
      oDataModel.read("/ZEquipmentSet", {
        filters: aFilters,
        urlParameters: {
          "$expand": "ZEquiHistSet"
        },
        success: function (oResponse) {
          console.log("Backend results:", oResponse.results);

          var aFlat = [];

          oResponse.results.forEach(function (oMain) {
            if (oMain.ZEquiHistSet && oMain.ZEquiHistSet.results) {
              oMain.ZEquiHistSet.results.forEach(function (oHist) {
                // merge parent + child into one row
                aFlat.push({
                  ...oMain,
                  Zequnr: oMain.Zequnr,
                  Zmatnr: oMain.Zmatnr,
                  Zlager: oMain.Zlager,
                  Zposition: oMain.Zposition,
                  Znote: oMain.Znote,
                  // child fields
                  Zrun: oHist.Zrun,
                  Zserialnumber: oHist.Zserialnumber,
                  Zlapdistance: oHist.Zlapdistance,
                  Zmoto: oHist.Zmoto,
                  Zrun: oHist.Zrun,
                });
              });
            } else {
              // no history → still show parent if you want
              aFlat.push({
                Zequnr: oMain.Zequnr,
                Zmatnr: oMain.Zmatnr,
                Zlager: oMain.Zlager,
                Zposition: oMain.Zposition,
                Znote: oMain.Znote
              });
            }
          });

          var oJson = new sap.ui.model.json.JSONModel(aFlat);
          var oTable = this.byId("resultsTable");
          oTable.setModel(oJson, "searchResults");
          oTable.bindItems({
            path: "searchResults>/",
            template: oTable.getItems()[0].clone()
          });
          oTable.setVisible(true);
        }.bind(this),

        // var oJson = new sap.ui.model.json.JSONModel(aFlat);
        // // Option A: set directly on table
        // var oJsonModel = new sap.ui.model.json.JSONModel(oResponse.results);
        // oTable.setModel(oJsonModel, "searchResults");
        // oTable.bindItems({
        //   path: "searchResults>/",
        //   template: oTable.getItems()[0].clone()
        // });
        // oTable.setVisible(true);
        // },
        error: function (oError) {
          sap.m.MessageBox.error("Backend call failed. Check console for details.");
          console.error(oError);
        }
      });


      // 3) Build filters & bind/filter the table
      // const aFilters = this._buildFilters(materials, equipments, serials, storageLoc);
      // const oTable = this.byId("resultsTable");

      // if (!oTable.getBinding("items")) {
      //   // bind once (adjust path/template to your entity)
      //   oTable.bindItems({
      //     path: "mainModel>/Inventory",
      //     template: oTable.getItems()[0].clone()
      //   });
      // }

      // oTable.getBinding("items").filter(aFilters, "Application");
      // oTable.setVisible(true);
    }
  });
});
