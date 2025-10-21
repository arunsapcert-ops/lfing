sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter"
], function (Controller, MessageToast, MessageBox, Filter) {
    "use strict";

    return Controller.extend("sap.ui.demo.historysearch.controller.dataupload", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel("tenthModel");
        },

        onSave: function () {
            var oView = this.getView();
            var sIEquipment = oView.byId("idEquipment").getValue();
            var sIRun = oView.byId("idRun").getValue();
            var sIKm = oView.byId("idKM").getValue();

            if (!sIEquipment || !sIRun || !sIKm) {
                MessageBox.error("All input fields must be filled.");
                return;
            }

            // --- 1. Construct the path for a specific entry ---
            // This is the key change. We build a single path string
            // that includes the key properties directly, as required by the OData service.
            var sPath = "/ZLIFING10Set(IEquipment='" + sIEquipment + "',IRun='" + sIRun + "',IKm='" + sIKm + "')";

            // --- 2. Call backend to perform a GET request (read) ---
            // The read method now uses the constructed path to access a single entry.
            this.oModel.read(sPath, {
                success: function (oData, oResponse) {
                    console.log("Backend response:", oResponse);
                    // Handle success response from the backend
                    if (oData) {
                        MessageToast.show("Data found successfully!");
                    } else {
                        MessageBox.error("No data found for the given criteria.");
                    }
                },
                error: function (oError) {
                    // Handle error response from the backend
                    MessageBox.error("An error occurred during the read operation.");
                    console.error("Read operation failed:", oError);
                }
            });
        },

        onNavButtonPress: function () {
            window.history.go(-1);
        }
    });
});
