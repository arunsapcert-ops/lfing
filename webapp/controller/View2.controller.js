sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.piaggio.sap.lifing.lifing.controller.View2", {
        onInit: function () {

        },

        OnCsPress: function() {
            this.getOwnerComponent().getRouter().navTo("ScratchCreate");
        },

        OnBOMpress: function() {
            this.getOwnerComponent().getRouter().navTo("BOMCreate");
        },

        onNavButtonPress: function() {
            window.history.go(-1);
        }
    });
});
