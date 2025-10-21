sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.piaggio.sap.lifing.lifing.controller.View1", {
        onInit: function () {

        },

        onScPress: function() {
            this.getOwnerComponent().getRouter().navTo("StructureCreation");
        },

        onSnopress: function() {
            this.getOwnerComponent().getRouter().navTo("SerialNumberCreation");
        },

        onHmgtpress: function() {
            this.getOwnerComponent().getRouter().navTo("HistorySearch");
        },
        onUploadpress: function() {
            this.getOwnerComponent().getRouter().navTo("DataUpload");
        },
        onNavButtonPress: function() {
            window.history.go(-1);
        },

        onLmPress: function() {
            this.getOwnerComponent().getRouter().navTo("LifingManagement");
        }
    });
});
