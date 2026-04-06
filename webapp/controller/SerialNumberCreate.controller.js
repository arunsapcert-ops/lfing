sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    function (Controller, Fragment, MessageBox) {
        "use strict";

        return Controller.extend("com.piaggio.sap.lifing.lifing.controller.SerialNumberCreate", {
            onInit: function () {
                var oMaterials = {
                    "root": []
                };
                var oMaterialListModel = new sap.ui.model.json.JSONModel(oMaterials);
                var oUiStateModel = new sap.ui.model.json.JSONModel({
                    movementStorageRequired: true
                });
                this.getView().setModel(oMaterialListModel, "matList");
                this.getView().setModel(oUiStateModel, "uiState");
                this.oTable = this.getView().byId("idserialNoCreateTable");
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function (oEvent) {
                this._lastSearchedMaterial = "";
                this.getView().getModel("matList").setData({ "root": [] });
                this.getView().byId("_IDGenComboBox4").setSelectedItem(null);
                this.getView().byId("_IDGenComboBox4").setEnabled(true);
                this.getView().byId("_IDMatSearchField").setEnabled(false);
                this.getView().byId("idCreationButton").setEnabled(false);
                this.getView().byId("idRemoveButton").setEnabled(false);
                this._hideTrafficLight();
            },

            onNavButtonPress: function () {
                this._lastSearchedMaterial = "";
                this.getView().getModel("matList").setData({ "root": [] });
                window.history.go(-1);
            },

            onSelectStorageLocation: function (oEvent) {
                this.storageLocation = oEvent.getSource().getSelectedKey();
                this._lastSearchedMaterial = "";
                this.getView().byId("_IDGenComboBox4").setEnabled(this.storageLocation ? false : true);
                this.getView().byId("_IDMatSearchField").setEnabled(true);
            },

            // ─── HELPER: get selected row objects from sap.ui.table.Table ───────────
            _getSelectedRowObjects: function () {
                var oTable = this.oTable;
                return oTable.getSelectedIndices().map(function (iIndex) {
                    return oTable.getContextByIndex(iIndex).getObject();
                });
            },

            // ─── SELECTION CHANGE ────────────────────────────────────────────────────
            onSelectionChange: function () {
                var oTable = this.oTable;
                var aSelectedIndices = oTable.getSelectedIndices();
                var oButton = this.getView().byId("idCreationButton");
                var oMoveBtn = this.getView().byId("idMovementButton");
                var oConsumptionBtn = this.getView().byId("idConsumptionButton");
                var oRemoveBtn = this.getView().byId("idRemoveButton");

                if (aSelectedIndices.length === 0) {
                    oButton.setEnabled(false);
                    if (oMoveBtn) oMoveBtn.setEnabled(false);
                    if (oConsumptionBtn) oConsumptionBtn.setEnabled(false);
                    if (oRemoveBtn) oRemoveBtn.setEnabled(false);
                    this._enableCreationFieldsForSelectionByObjects([]);
                    return;
                }

                var aSelectedObjects = this._getSelectedRowObjects();

                var bAllEquipmentEmpty = aSelectedObjects.every(function (oObj) {
                    return !oObj.Equipment;
                });

                var bAllEquipmentFilled = aSelectedObjects.every(function (oObj) {
                    return !!oObj.Equipment;
                });

                if (bAllEquipmentEmpty) {
                    oButton.setEnabled(true);
                    if (oMoveBtn) oMoveBtn.setEnabled(false);
                    if (oConsumptionBtn) oConsumptionBtn.setEnabled(false);
                    if (oRemoveBtn) oRemoveBtn.setEnabled(false);
                    this._enableCreationFieldsForSelectionByObjects(aSelectedObjects);
                    return;
                }

                oButton.setEnabled(false);
                this._enableCreationFieldsForSelectionByObjects([]);

                if (oMoveBtn) oMoveBtn.setEnabled(true);
                if (oConsumptionBtn) oConsumptionBtn.setEnabled(true);
                if (oRemoveBtn) oRemoveBtn.setEnabled(bAllEquipmentFilled);
            },

            // ─── OPEN/CLOSE REMOVE ───────────────────────────────────────────────────
            onOpenRemove: function () {
                this.onOpenMovement("R", "remove");
            },

            // ─── OPEN/CLOSE MOVEMENT DIALOG ──────────────────────────────────────────
            onOpenMovement: function (sParameter, sAction) {
                this._sMovementAction = sAction || "movement";
                this._sMovementParameter = sParameter || "M";
                this.getView().getModel("uiState").setProperty("/movementStorageRequired", this._sMovementAction !== "remove");
                var oView = this.getView();
                if (!this._oMovementDialog) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.MovementDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        this._oMovementDialog = oDialog;
                        var oInput = sap.ui.core.Fragment.byId(oView.getId(), "idMovementStorageLoc");
                        if (oInput) {
                            oInput.setValue("");
                            oInput.setValueState(sap.ui.core.ValueState.None);
                        }
                        this._oMovementDialog.open();
                    }.bind(this));
                } else {
                    var oInput = sap.ui.core.Fragment.byId(oView.getId(), "idMovementStorageLoc");
                    if (oInput) {
                        oInput.setValue("");
                        oInput.setValueState(sap.ui.core.ValueState.None);
                    }
                    this._oMovementDialog.open();
                }
            },

            onCloseMovement: function () {
                if (this._oMovementDialog) {
                    this._oMovementDialog.close();
                }
            },

            // ─── SAVE MOVEMENT ───────────────────────────────────────────────────────
            onSaveMovement: function () {
                var oView = this.getView();
                var oInput = sap.ui.core.Fragment.byId(oView.getId(), "idMovementStorageLoc");
                var sStorLoc = (oInput && oInput.getValue ? oInput.getValue() : "") || "";
                sStorLoc = sStorLoc.trim().toUpperCase();
                if (oInput && sStorLoc) {
                    oInput.setValue(sStorLoc);
                }

                var bIsRemoveAction = this._sMovementAction === "remove";

                if (!bIsRemoveAction && !sStorLoc) {
                    if (oInput) {
                        oInput.setValueState(sap.ui.core.ValueState.Error);
                        oInput.setValueStateText("Storage Location is required");
                    }
                    return;
                }
                if (oInput) {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }

                var aSelectedObjects = this._getSelectedRowObjects();
                if (!aSelectedObjects.length) {
                    MessageBox.error("Please select at least one row.");
                    return;
                }

                var oLIFING11Model = this.getOwnerComponent().getModel("eleventhModel");
                var sParameter = this._sMovementParameter;
                if (typeof sParameter !== "string") sParameter = "";
                sParameter = sParameter.trim();
                if (!sParameter) {
                    sParameter = this._sMovementAction === "remove" ? "R" : "M";
                }

                var sActionLabel = this._sMovementAction === "remove" ? "Remove" : "Movement";
                var that = this;
                oView.setBusy(true);

                var aReqs = aSelectedObjects.map(function (oRow) {
                    var sEquipment = oRow.Equipment || "";

                    return new Promise(function (resolve) {
                        if (!sEquipment) {
                            resolve({ ok: false, msg: "Equipment is empty for a selected row", equipment: sEquipment });
                            return;
                        }

                        var sPath = "/ZLIFING11Set(" +
                            "IEquipment='" + sEquipment + "'," +
                            "IParameter='" + sParameter + "'," +
                            "Ilgort='" + sStorLoc + "'," +
                            "IMaterial=''," +
                            "IOrder=''," +
                            "IKostl='')";

                        console.log("Calling LIFING11 for Movement. Equipment:", sEquipment, "Storage Location:", sStorLoc);

                        oLIFING11Model.read(sPath, {
                            success: function (oResp) {
                                console.log("LIFING11 Movement success for Equipment:", sEquipment, "Response:", oResp);
                                var sReturnCode = oResp.ReturnCode || "";
                                var sReturnMessage = oResp.ReturnMessage || oResp.EReturnMessage || "";
                                if (sReturnCode === "OK") {
                                    resolve({ ok: true, data: oResp, returnCode: "OK", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else if (sReturnCode === "KO") {
                                    resolve({ ok: false, data: oResp, returnCode: "KO", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else {
                                    resolve({ ok: true, data: oResp, returnCode: sReturnCode, equipment: sEquipment, returnMessage: sReturnMessage });
                                }
                            },
                            error: function (oErr) {
                                console.error("LIFING11 Movement error for Equipment:", sEquipment, "Error:", oErr);
                                resolve({ ok: false, err: oErr, equipment: sEquipment, returnMessage: "OData call failed" });
                            }
                        });
                    });
                });

                Promise.all(aReqs).then(function (aResults) {
                    oView.setBusy(false);
                    that.onCloseMovement();

                    if (that.oTable) {
                        that.oTable.clearSelection();
                    }

                    // Remove OK rows from model
                    var oMatListModel = that.getView().getModel("matList");
                    var oData = oMatListModel.getData();
                    var aRoot = oData.root || [];
                    var aRowsToRemove = [];

                    aResults.forEach(function (oResult) {
                        if (oResult.returnCode === "OK" && oResult.equipment) {
                            var iIndex = aRoot.findIndex(function (oRow) {
                                return oRow.Equipment === oResult.equipment;
                            });
                            if (iIndex !== -1) aRowsToRemove.push(iIndex);
                        }
                    });

                    aRowsToRemove.sort(function (a, b) { return b - a; });
                    aRowsToRemove.forEach(function (iIndex) { aRoot.splice(iIndex, 1); });

                    if (aRowsToRemove.length > 0) {
                        oMatListModel.updateBindings();
                    }

                    if (that.oTable) that.oTable.clearSelection();
                    if (typeof that.onSelectionChange === "function") that.onSelectionChange();

                    var aFails = aResults.filter(function (r) { return !r.ok || r.returnCode === "KO"; });
                    var aSuccesses = aResults.filter(function (r) { return r.ok && r.returnCode === "OK"; });

                    if (aFails.length > 0) {
                        var aErrorMessages = aFails.map(function (r) {
                            return "Equipment " + (r.equipment || "Unknown") + ": " + (r.returnMessage || r.msg || sActionLabel + " failed");
                        });
                        MessageBox.error(sActionLabel + " failed for " + aFails.length + " row(s):\n\n" + aErrorMessages.join("\n"));
                    }

                    if (aSuccesses.length > 0 && aFails.length === 0) {
                        sap.m.MessageToast.show(sActionLabel + " saved successfully");
                    } else if (aSuccesses.length > 0) {
                        sap.m.MessageToast.show(sActionLabel + " completed for " + aSuccesses.length + " row(s)");
                    }

                    if (that._sMovementAction === "remove" && aSuccesses.length > 0) {
                        that._refreshMatListFromSearch();
                    }
                }).catch(function (e) {
                    oView.setBusy(false);
                    MessageBox.error(sActionLabel + " failed.");
                    console.error(e);
                });
            },

            // ─── OPEN/CLOSE CONSUMPTION DIALOG ───────────────────────────────────────
            onOpenConsumption: function () {
                var oView = this.getView();
                if (!this._oConsumptionDialog) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.ConsumptionDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        this._oConsumptionDialog = oDialog;
                        var oCostCenter = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionCostCenter");
                        var oOrder = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionOrder");
                        if (oCostCenter) { oCostCenter.setValue(""); oCostCenter.setValueState(sap.ui.core.ValueState.None); }
                        if (oOrder) { oOrder.setValue(""); oOrder.setValueState(sap.ui.core.ValueState.None); }
                        this._oConsumptionDialog.open();
                    }.bind(this));
                } else {
                    var oCostCenter = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionCostCenter");
                    var oOrder = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionOrder");
                    if (oCostCenter) { oCostCenter.setValue(""); oCostCenter.setValueState(sap.ui.core.ValueState.None); }
                    if (oOrder) { oOrder.setValue(""); oOrder.setValueState(sap.ui.core.ValueState.None); }
                    this._oConsumptionDialog.open();
                }
            },

            onCloseConsumption: function () {
                if (this._oConsumptionDialog) {
                    this._oConsumptionDialog.close();
                }
            },

            // ─── SAVE CONSUMPTION ────────────────────────────────────────────────────
            onSaveConsumption: function () {
                var oView = this.getView();
                var oCostCenter = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionCostCenter");
                var oOrder = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionOrder");

                var sStorLoc = this.storageLocation || "";
                var sCostCenter = (oCostCenter && oCostCenter.getValue ? oCostCenter.getValue() : "") || "";
                var sOrder = (oOrder && oOrder.getValue ? oOrder.getValue() : "") || "";

                sStorLoc = sStorLoc.trim();
                sCostCenter = sCostCenter.trim();
                sOrder = sOrder.trim();

                var bHasError = false;
                if (!sStorLoc) {
                    MessageBox.error("Please select a Storage Location from the dropdown.");
                    bHasError = true;
                }
                if (!sCostCenter) {
                    if (oCostCenter) { oCostCenter.setValueState(sap.ui.core.ValueState.Error); oCostCenter.setValueStateText("Cost Center is required"); }
                    bHasError = true;
                } else {
                    if (oCostCenter) oCostCenter.setValueState(sap.ui.core.ValueState.None);
                }
                if (!sOrder) {
                    if (oOrder) { oOrder.setValueState(sap.ui.core.ValueState.Error); oOrder.setValueStateText("Order is required"); }
                    bHasError = true;
                } else {
                    if (oOrder) oOrder.setValueState(sap.ui.core.ValueState.None);
                }

                if (bHasError) return;

                var aSelectedObjects = this._getSelectedRowObjects();
                if (!aSelectedObjects.length) {
                    MessageBox.error("Please select at least one row.");
                    return;
                }

                var oLIFING11Model = this.getOwnerComponent().getModel("eleventhModel");
                var that = this;
                oView.setBusy(true);

                var aReqs = aSelectedObjects.map(function (oRow) {
                    var sEquipment = oRow.Equipment || "";
                    var sMaterial = oRow.Material || "";

                    return new Promise(function (resolve) {
                        if (!sEquipment) {
                            resolve({ ok: false, msg: "Equipment is empty for a selected row", equipment: sEquipment });
                            return;
                        }
                        if (!sMaterial) {
                            resolve({ ok: false, msg: "Material is empty for a selected row", equipment: sEquipment });
                            return;
                        }

                        var sPath = "/ZLIFING11Set(IEquipment='" + encodeURIComponent(sEquipment) +
                            "',IParameter='C" +
                            "',Ilgort='" + encodeURIComponent(sStorLoc) +
                            "',IMaterial='" + encodeURIComponent(sMaterial) +
                            "',IOrder='" + encodeURIComponent(sOrder) +
                            "',IKostl='" + encodeURIComponent(sCostCenter) + "')";

                        console.log("Calling LIFING11 for Consumption. Equipment:", sEquipment, "Storage Location:", sStorLoc);

                        oLIFING11Model.read(sPath, {
                            success: function (oResp) {
                                console.log("LIFING11 Consumption success for Equipment:", sEquipment, "Response:", oResp);
                                var sReturnCode = oResp.ReturnCode || "";
                                var sReturnMessage = oResp.ReturnMessage || oResp.EReturnMessage || "";
                                if (sReturnCode === "OK") {
                                    resolve({ ok: true, data: oResp, returnCode: "OK", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else if (sReturnCode === "KO") {
                                    resolve({ ok: false, data: oResp, returnCode: "KO", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else {
                                    resolve({ ok: true, data: oResp, returnCode: sReturnCode, equipment: sEquipment, returnMessage: sReturnMessage });
                                }
                            },
                            error: function (oErr) {
                                console.error("LIFING11 Consumption error for Equipment:", sEquipment, "Error:", oErr);
                                resolve({ ok: false, err: oErr, equipment: sEquipment });
                            }
                        });
                    });
                });

                Promise.all(aReqs).then(function (aResults) {
                    oView.setBusy(false);
                    that.onCloseConsumption();

                    var oMatListModel = that.getView().getModel("matList");
                    var oData = oMatListModel.getData();
                    var aRoot = oData.root || [];
                    var aRowsToRemove = [];

                    aResults.forEach(function (oResult) {
                        if (oResult.returnCode === "OK" && oResult.equipment) {
                            var iIndex = aRoot.findIndex(function (oRow) {
                                return oRow.Equipment === oResult.equipment;
                            });
                            if (iIndex !== -1) aRowsToRemove.push(iIndex);
                        }
                    });

                    aRowsToRemove.sort(function (a, b) { return b - a; });
                    aRowsToRemove.forEach(function (iIndex) { aRoot.splice(iIndex, 1); });

                    if (aRowsToRemove.length > 0) {
                        oMatListModel.updateBindings();
                        if (that.oTable) that.oTable.clearSelection();
                        if (typeof that.onSelectionChange === "function") that.onSelectionChange();
                    }

                    var aFails = aResults.filter(function (r) { return !r.ok || r.returnCode === "KO"; });
                    var aSuccesses = aResults.filter(function (r) { return r.ok && r.returnCode === "OK"; });

                    if (aFails.length > 0) {
                        var aErrorMessages = aFails.map(function (r) {
                            return "Equipment " + (r.equipment || "Unknown") + ": " + (r.returnMessage || r.msg || "Consumption failed");
                        });
                        MessageBox.error("Consumption failed for " + aFails.length + " row(s):\n\n" + aErrorMessages.join("\n"));
                    }

                    if (aSuccesses.length > 0 && aFails.length === 0) {
                        sap.m.MessageToast.show("Consumption saved successfully");
                    } else if (aSuccesses.length > 0) {
                        sap.m.MessageToast.show("Consumption completed for " + aSuccesses.length + " row(s)");
                    }

                    if (aSuccesses.length > 0) {
                        that._refreshMatListFromSearch();
                    }
                }).catch(function (e) {
                    oView.setBusy(false);
                    MessageBox.error("Consumption failed.");
                    console.error(e);
                });
            },

            // ─── LIVE CHANGE: UPPERCASE MATERIAL SEARCH ──────────────────────────────
            onMatSearchLiveChange: function (oEvent) {
                var sVal = oEvent.getParameter("newValue") || "";
                var sUpper = sVal.toUpperCase();
                if (sVal !== sUpper) {
                    oEvent.getSource().setValue(sUpper);
                }
            },

            // ─── SEARCH ──────────────────────────────────────────────────────────────
            onSearch: function (oEvent) {
                var oSrc = oEvent.getSource();
                var matSelected = String(oSrc.getValue() || "").trim().toUpperCase();
                if (typeof oSrc.setValue === "function") {
                    oSrc.setValue(matSelected);
                }

                var that = this;
                var oDataModel = this.getOwnerComponent().getModel("fifthModel");
                var oMatListModel = this.getView().getModel("matList");
                oMatListModel.setData({ root: [] });
                oMatListModel.updateBindings(true);
                if (this.oTable) this.oTable.clearSelection();

                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({ path: 'IParam', operator: sap.ui.model.FilterOperator.EQ, value1: "M" }),
                        new sap.ui.model.Filter({ path: 'Imatnr', operator: sap.ui.model.FilterOperator.EQ, value1: matSelected }),
                        new sap.ui.model.Filter({ path: 'Ilager', operator: sap.ui.model.FilterOperator.EQ, value1: this.storageLocation })
                    ],
                    and: true
                });

                this.getView().setBusy(true);

                oDataModel.read("/ZLIFING5Set", {
                    filters: [oFilter],
                    success: function (oresponse) {
                        var aAllResults = oresponse.results || [];

                        if (aAllResults.length === 0) {
                            that.getView().setBusy(false);
                            MessageBox.warning("No data returned");
                            return;
                        }

                        var sFirstRowReturnCode = String(aAllResults[0].Zreturn || "").toUpperCase().trim();
                        var sStatusText = sFirstRowReturnCode === "R" ? "Red" : sFirstRowReturnCode === "G" ? "Green" : sFirstRowReturnCode === "Y" ? "Yellow" : "";

                        var matList = [];
                        var bHasKO = false;
                        var sKoMessage = "";
                        var bIsYellowStatus = sFirstRowReturnCode === "Y";
                        var aRowsToDisplay = bIsYellowStatus ? aAllResults : aAllResults.slice(1);

                        aRowsToDisplay.forEach(function (data) {
                            var sCode = String(data.Zreturn || data.ERETURNCODE || "").toUpperCase().trim();
                            if (sCode === "KO" && !bHasKO) {
                                bHasKO = true;
                                sKoMessage = data.ZreturnMsg || data.ERETURNMESSAGE || "Error in returned data";
                            }
                            matList.push({
                                Equipment: data.Zequnr || data.EEQUIPMENT || "",
                                Material: data.Zmatnr || data.EMATNR || matSelected,
                                Desc: data.Zmaktx || data.EMATDESC || "",
                                MaterialDescription: data.Zmaktx || data.EMATDESC || "",
                                snumber: data.Zsernr || data.ISERNR || "",
                                km: data.Zkm2 || data.EKM2 || data.EKM || "",
                                Revisione: data.ZkmRevisione || data.ZrevisionNumber || data.EKMREVISION || "",
                                RevisionNumber: data.ZrevisionNumber || data.ZkmRevisione || data.EKMREVISION || "",
                                RevisionKm: data.ZrevisionKm || data.EKMREVKM || data.EREVISIONKM || data.EKM_REVISION || "",
                                KmRevision: data.ZrevisionKm || data.EKM_REVISION || data.EKMREVKM || data.EREVISIONKM || "",
                                Note: data.Note || data.IINVNR || "",
                                level: data.Zposition || data.ELEVEL || data.EPOSITION || "",
                                Position: data.Zposition || data.ELEVEL || data.EPOSITION || "",
                                fg: data.ZfunctionalGroup || data.EFUNCTIONALGROUP || data.EFUNCTIONGROUP || data.EFG || "",
                                FunctionalGroup: data.ZfunctionalGroup || data.EFUNCTIONALGROUP || data.EFUNCTIONGROUP || data.EFG || "",
                                min: data.ZkmMin || data.EKMMIN || "",
                                max: data.ZkmMax || data.EKMMAX || "",
                                KmMin: data.ZkmMin || data.EKMMIN || "",
                                KmMax: data.ZkmMax || data.EKMMAX || "",
                                StatusCode: sFirstRowReturnCode,
                                Status: sStatusText,
                                created: !!(data.Zequnr || data.EEQUIPMENT),
                                children: []
                            });
                        });

                        if (bIsYellowStatus && matList.length > 1) {
                            var oRow0 = matList[0];
                            var oRow1 = matList[1];
                            if (oRow0 && oRow1) {
                                if (!oRow0.RevisionKm) oRow0.Revisione = oRow1.Revisione;
                                if (!oRow0.KmMax) oRow0.KmMax = oRow1.KmMax;
                                if (!oRow0.KmMin) oRow0.KmMin = oRow1.KmMin;
                            }
                        }

                        var iYellowHeadRows = 1;
                        if (bIsYellowStatus) {
                            var vZquan = aAllResults[0] && aAllResults[0].Zquan;
                            var iZquan = typeof vZquan === "number" ? vZquan : parseFloat(String(vZquan != null ? vZquan : "").replace(",", "."), 10);
                            if (!isFinite(iZquan) || iZquan < 1) iZquan = 1;
                            iZquan = Math.floor(iZquan);

                            if (matList.length > 0 && iZquan > 1) {
                                var oFirstRow = matList[0];
                                var oSecondRow = matList.length > 1 ? matList[1] : null;
                                var aExpanded = [oFirstRow];
                                for (var iDup = 1; iDup < iZquan; iDup++) {
                                    var oClone = JSON.parse(JSON.stringify(oFirstRow));
                                    oClone.snumber = "";
                                    if (oSecondRow) {
                                        oClone.Revisione = oSecondRow.Revisione;
                                        oClone.KmMax = oSecondRow.KmMax;
                                        oClone.KmMin = oSecondRow.KmMin;
                                    }
                                    aExpanded.push(oClone);
                                }
                                iYellowHeadRows = iZquan;
                                matList = aExpanded.concat(matList.slice(1));
                            }
                        }

                        matList = that._sortMatListByEquipment(matList, sFirstRowReturnCode, iYellowHeadRows);

                        if (bHasKO) MessageBox.show(sKoMessage);

                        that._applyStatusVisibility(matList, sFirstRowReturnCode);
                        that._lastSearchedMaterial = String(matSelected || "").trim();
                        that.getView().byId("_IDMatSearchField").setValue();
                        that.getView().getModel("matList").setData({ root: matList });
                        that.getView().getModel("matList").updateBindings();
                        that.getView().setBusy(false);
                    },
                    error: function (oerror) {
                        console.log(oerror);
                        that.getView().setBusy(false);
                        MessageBox.error("Error in OData call");
                    }
                });
            },

            // ─── CREATION (first-click enables fields, second-click creates) ─────────
            OnCreation: function () {
                var that = this;
                var aSelectedObjects = this._getSelectedRowObjects();

                if (!aSelectedObjects.length) {
                    MessageBox.error("Please select at least one row.");
                    return;
                }

                // First click: enable editable fields for selected rows
                var bNeedEnableCreationFields = aSelectedObjects.some(function (oObj) {
                    return !oObj.CreationEditable;
                });
                if (bNeedEnableCreationFields) {
                    this._enableCreationFieldsForSelectionByObjects(aSelectedObjects);
                    sap.m.MessageToast.show("Functional Group, Position and Note are enabled for selected rows. Update values and click Creation again.");
                    return;
                }

                // Validate serial numbers
                var bMissingSerialNumber = aSelectedObjects.some(function (oObj) {
                    return !String(oObj.snumber || "").trim();
                });
                if (bMissingSerialNumber) {
                    MessageBox.error("Please enter Serial Number for all selected rows.");
                    return;
                }

                var aRequestsFirst = [];
                var aRequestsSecond = [];
                var oModel1 = this.getOwnerComponent().getModel();
                var oModel2 = this.getOwnerComponent().getModel("secondModel");
                var saveErr = false;

                this.getView().setBusy(true);
                this.byId("_IDGenColumne").setVisible(true);

                // ---- 1st round: ZLIFING1SET ----
                aSelectedObjects.forEach(function (oRowObj) {
                    var oFilter1 = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({ path: "IPARAMETER", operator: sap.ui.model.FilterOperator.EQ, value1: "S" }),
                            new sap.ui.model.Filter({ path: "IMATNR", operator: sap.ui.model.FilterOperator.EQ, value1: oRowObj.Material }),
                            new sap.ui.model.Filter({ path: "ISTORLOCATION", operator: sap.ui.model.FilterOperator.EQ, value1: that.storageLocation })
                        ],
                        and: true
                    });

                    var oReq1 = new Promise(function (resolve, reject) {
                        oModel1.read("/ZLIFING1SET", {
                            filters: [oFilter1],
                            success: function (oResponse) {
                                console.log(oResponse.results[0]);
                                resolve(oResponse.results[0]);
                            },
                            error: function (oError) {
                                console.error(oError);
                                reject(oError);
                            }
                        });
                    });

                    aRequestsFirst.push(oReq1);
                });

                Promise.all(aRequestsFirst)
                    .then(function (aResponses) {
                        aResponses.forEach(function (oResp, idx) {
                            if (oResp.ERETURNCODE === "OK") {
                                var oRowObj = aSelectedObjects[idx];
                                var sSerNum = oRowObj.snumber;
                                var sNote = String(oRowObj.Note || "").trim();
                                var sPosition = String(oRowObj.Position || oRowObj.level || "").trim();
                                var sFunctionalGroup = String(oRowObj.FunctionalGroup || oRowObj.fg || "").trim();

                                oRowObj.level = sPosition;
                                oRowObj.fg = sFunctionalGroup;
                                oRowObj.Desc = oResp.EMATDESC;

                                var oFilter2 = new sap.ui.model.Filter({
                                    filters: [
                                        new sap.ui.model.Filter({ path: "IMATNR", operator: sap.ui.model.FilterOperator.EQ, value1: oResp.EMATNR }),
                                        new sap.ui.model.Filter({ path: "IINVNR", operator: sap.ui.model.FilterOperator.EQ, value1: sNote }),
                                        new sap.ui.model.Filter({ path: "IGROES", operator: sap.ui.model.FilterOperator.EQ, value1: sPosition }),
                                        new sap.ui.model.Filter({ path: "ISERNR", operator: sap.ui.model.FilterOperator.EQ, value1: sSerNum }),
                                        new sap.ui.model.Filter({ path: "ITIDNR", operator: sap.ui.model.FilterOperator.EQ, value1: sFunctionalGroup }),
                                        new sap.ui.model.Filter({ path: "ILAGER", operator: sap.ui.model.FilterOperator.EQ, value1: that.storageLocation })
                                    ],
                                    and: true
                                });

                                var oReq2 = new Promise(function (resolve, reject) {
                                    oModel2.read("/ZLIFING2SET", {
                                        filters: [oFilter2],
                                        success: function (oResponse2) {
                                            resolve(oResponse2.results[0]);
                                        },
                                        error: function (oError2) {
                                            console.error(oError2);
                                            reject(oError2);
                                        }
                                    });
                                });

                                aRequestsSecond.push(oReq2);
                            } else if (oResp.ERETURNCODE === "KO") {
                                saveErr = true;
                            }
                        });

                        return Promise.all(aRequestsSecond);
                    })
                    .then(function (aSecondResponses) {
                        var aSuccess = [];
                        var aError = [];

                        aSecondResponses.forEach(function (data, idx) {
                            var oRowObj = aSelectedObjects[idx];
                            if (data.EEQUIPMENT) oRowObj.Equipment = data.EEQUIPMENT;

                            if (data.ERETURNCODE === "OK") {
                                oRowObj.created = true;
                                aSuccess.push(data.ERETURNMESSAGE || "Success");
                            } else {
                                aError.push(data.ERETURNMESSAGE || "Operation failed");
                            }
                        });

                        that.getView().getModel("matList").updateBindings();
                        that.getView().setBusy(false);

                        if (aError.length === 0 && aSuccess.length > 0) {
                            MessageBox.success(aSuccess[0] || "Equipment created correctly", {
                                actions: [MessageBox.Action.OK],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        that._refreshMatListFromSearch();
                                    }
                                }
                            });
                        } else if (aError.length > 0) {
                            MessageBox.error("One or more creations failed:\n" + aError.join("\n"));
                        }

                        if (saveErr) MessageBox.show("One or more of the creations failed");
                    })
                    .catch(function (oError) {
                        console.error("Error loading data:", oError);
                        that.getView().setBusy(false);
                        MessageBox.error("Error while creating serial numbers.");
                    });
            },

            // ─── HELPERS ─────────────────────────────────────────────────────────────

            _enableCreationFieldsForSelection: function (aSelectedItems) {
                // Legacy overload kept for any internal calls that pass sap.m.Table items
                var oMatListModel = this.getView().getModel("matList");
                var oData = oMatListModel && oMatListModel.getData ? oMatListModel.getData() : null;
                var aRows = oData && Array.isArray(oData.root) ? oData.root : [];
                aRows.forEach(function (oRow) { oRow.CreationEditable = false; });
                aSelectedItems.forEach(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();
                    oRowObj.CreationEditable = true;
                });
                if (oMatListModel) oMatListModel.updateBindings(true);
            },

            _enableCreationFieldsForSelectionByObjects: function (aSelectedObjects) {
                var oMatListModel = this.getView().getModel("matList");
                var oData = oMatListModel && oMatListModel.getData ? oMatListModel.getData() : null;
                var aRows = oData && Array.isArray(oData.root) ? oData.root : [];

                aRows.forEach(function (oRow) { oRow.CreationEditable = false; });
                aSelectedObjects.forEach(function (oObj) { oObj.CreationEditable = true; });

                if (oMatListModel) oMatListModel.updateBindings(true);
            },

            _applyStatusVisibility: function (aRows, sStatusCode) {
                if (!Array.isArray(aRows)) return;
                var sCode = String(sStatusCode || "").toUpperCase().trim();
                var bShowAllRows = sCode === "R" || sCode === "G";
                aRows.forEach(function (oRow, iIndex) {
                    oRow.ShowStatus = bShowAllRows ? true : iIndex === 0;
                });
            },

            _setFirstRowStatusVisibility: function (aRows) {
                if (!Array.isArray(aRows)) return;
                aRows.forEach(function (oRow, iIndex) {
                    oRow.ShowStatus = iIndex === 0;
                });
            },

            statusCodeToColor: function (sStatusCode) {
                var sCode = String(sStatusCode || "").toUpperCase().trim();
                if (sCode === "R") return "#ff0000";
                if (sCode === "Y") return "#f4c542";
                if (sCode === "G") return "#008000";
                return "#6a6d70";
            },

            _sortMatListByEquipment: function (aRows, sStatusCode, iYellowHeadRows) {
                if (!Array.isArray(aRows) || aRows.length < 2) return aRows;
                var sCode = String(sStatusCode || "").toUpperCase().trim();
                var iHead = 0;
                if (sCode === "Y") {
                    iHead = typeof iYellowHeadRows === "number" && iYellowHeadRows >= 1 ? Math.floor(iYellowHeadRows) : 1;
                    if (iHead >= aRows.length) return aRows;
                }
                var aHead = aRows.slice(0, iHead);
                var aTail = aRows.slice(iHead);
                var iPad = 30;
                aTail.sort(function (a, b) {
                    var ea = String(a && a.Equipment ? a.Equipment : "").trim();
                    var eb = String(b && b.Equipment ? b.Equipment : "").trim();
                    if (!ea && !eb) return 0;
                    if (!ea) return 1;
                    if (!eb) return -1;
                    return ea.padStart(iPad, "0").localeCompare(eb.padStart(iPad, "0"));
                });
                return aHead.concat(aTail);
            },

            _refreshMatListFromSearch: function () {
                if (!this.storageLocation) return;
                var oSearch = this.getView().byId("_IDMatSearchField");
                var sMat = oSearch ? String(oSearch.getValue() || "").trim() : "";
                if (!sMat) sMat = String(this._lastSearchedMaterial || "").trim();
                if (!sMat) return;
                var sMatForRead = sMat;
                this.onSearch({
                    getSource: function () {
                        return {
                            getValue: function () { return sMatForRead; },
                            setValue: function () {}
                        };
                    }
                });
            },

            _updateTrafficLight: function (sReturnCode) {
                var oIcon = this.getView().byId("idTrafficLightIcon");
                if (!oIcon) return;
                var sCode = String(sReturnCode || "G").toUpperCase().trim();
                var bUseYellowClass = false;
                var sColor;

                if (sCode === "R") {
                    sColor = sap.ui.core.IconColor.Negative;
                } else if (sCode === "Y") {
                    bUseYellowClass = true;
                    sColor = "";
                } else {
                    sColor = sap.ui.core.IconColor.Positive;
                }

                oIcon.setSrc("sap-icon://circle-task-2");

                if (bUseYellowClass) {
                    oIcon.setColor("");
                    oIcon.addStyleClass("yellowTrafficLight");
                } else {
                    oIcon.removeStyleClass("yellowTrafficLight");
                    oIcon.setColor(sColor);
                }

                oIcon.setVisible(true);
            },

            _hideTrafficLight: function () {
                var oIcon = this.getView().byId("idTrafficLightIcon");
                if (oIcon) {
                    oIcon.setVisible(false);
                    oIcon.removeStyleClass("yellowTrafficLight");
                }
            },

            oncloseDialog: function () {
                if (this._oDialog) this._oDialog.close();
            },

            OnAddSnoMaterial: function () {
                var oView = this.getView();
                var oMaterialModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oMaterialModel, "material");
                if (!this._oDialog) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.AddSnoMaterial",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        this._oDialog = oDialog;
                        this._oDialog.open();
                    }.bind(this));
                } else {
                    this._oDialog.open();
                }
            },

            onSnoSave: function () {
                var oMatData = this.getView().getModel("material").getData();
                var oMatListModel = this.getView().getModel("matList");
                var oData = oMatListModel.getData();
                if (!oData.root) oData.root = [];
                oData.root.push(oMatData);
                oMatListModel.updateBindings();
                this._oDialog.close();
            }

        });
    });