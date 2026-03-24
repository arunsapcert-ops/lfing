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
                // this.getView().setModel(oMaterialListModel, "mList");
                // var oMaterialListModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(oMaterialListModel, "matList");
                this.getView().setModel(oUiStateModel, "uiState");
                this.oTable = this.getView().byId("idserialNoCreateTable");
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function (oEvent) {
                this.getView().getModel("matList").setData({
                    "root": []
                });
                this.getView().byId("_IDGenComboBox4").setSelectedItem(null);
                this.getView().byId("_IDGenComboBox4").setEnabled(true);
                // this.getView().byId("idAddButton1").setEnabled(false);
                this.getView().byId("_IDMatSearchField").setEnabled(false);
                this.getView().byId("idCreationButton").setEnabled(false);
                this.getView().byId("idRemoveButton").setEnabled(false);
                this._hideTrafficLight();
            },

            onNavButtonPress: function () {
                // this.oTable.clearSelection();
                // this.getView().getModel("matList").setData();
                this.getView().getModel("matList").setData({
                    "root": []
                });
                window.history.go(-1);
            },

            onSelectStorageLocation: function (oEvent) {
                this.storageLocation = oEvent.getSource().getSelectedKey();
                // this.storageLocation = oEvent.getSource().getSelectedKey();
                this.getView().byId("_IDGenComboBox4").setEnabled(this.storageLocation ? false : true);
                // this.getView().byId("idAddButton1").setEnabled(true);
                this.getView().byId("_IDMatSearchField").setEnabled(true);
                // this.getView().byId("idCreationButton").setEnabled(true);
            },

            onSelectionChange: function () {
                var aSelectedItems = this.oTable.getSelectedItems();
                var oButton = this.getView().byId("idCreationButton");
                var oMoveBtn = this.getView().byId("idMovementButton");
                var oConsumptionBtn = this.getView().byId("idConsumptionButton");
                var oRemoveBtn = this.getView().byId("idRemoveButton");
                // No selection → disable
                if (aSelectedItems.length === 0) {
                    oButton.setEnabled(false);
                    if (oMoveBtn) {
                        oMoveBtn.setEnabled(false);
                    }
                    if (oConsumptionBtn) {
                        oConsumptionBtn.setEnabled(false);
                    }
                    if (oRemoveBtn) {
                        oRemoveBtn.setEnabled(false);
                    }
                    this._enableCreationFieldsForSelection([]);
                    return;
                }

                var bAllEquipmentEmpty = aSelectedItems.every(function (oItem) {
                    var oObj = oItem.getBindingContext("matList").getObject();
                    return !oObj.Equipment;
                });

                var bAllEquipmentFilled = aSelectedItems.every(function (oItem) {
                    var oObj = oItem.getBindingContext("matList").getObject();
                    return !!oObj.Equipment;
                });

                if (bAllEquipmentEmpty) {
                    oButton.setEnabled(true);
                    if (oMoveBtn) {
                        oMoveBtn.setEnabled(false);
                    }
                    if (oConsumptionBtn) {
                        oConsumptionBtn.setEnabled(false);
                    }
                    if (oRemoveBtn) {
                        oRemoveBtn.setEnabled(false);
                    }
                    this._enableCreationFieldsForSelection(aSelectedItems);
                    return;
                }

                oButton.setEnabled(false);
                this._enableCreationFieldsForSelection([]);

                if (oMoveBtn) {
                    oMoveBtn.setEnabled(true);
                }
                if (oConsumptionBtn) {
                    oConsumptionBtn.setEnabled(true);
                }
                if (oRemoveBtn) {
                    oRemoveBtn.setEnabled(bAllEquipmentFilled);
                }

                // Check if any selected row has equipment already filled
                var bAnyEquipmentFilled = aSelectedItems.some(function (oItem) {
                    var oObj = oItem.getBindingContext("matList").getObject();
                    return oObj.Equipment && oObj.Equipment !== "";
                });

                if (bAnyEquipmentFilled) {
                    // Contains already created items → disable
                    oButton.setEnabled(false);
                } else {
                    // All selected rows are empty → enable
                    oButton.setEnabled(true);
                }
            },

            onOpenRemove: function () {
                this.onOpenMovement("R", "remove");
            },

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

            onSaveddMovement: function () {
                var oView = this.getView();
                var oInput = sap.ui.core.Fragment.byId(oView.getId(), "idMovementStorageLoc");
                var sStorLoc = (oInput && oInput.getValue ? oInput.getValue() : "") || "";
                sStorLoc = sStorLoc.trim();

                if (!sStorLoc) {
                    if (oInput) {
                        oInput.setValueState(sap.ui.core.ValueState.Error);
                        oInput.setValueStateText("Storage Location is required");
                    }
                    return;
                }
                if (oInput) {
                    oInput.setValueState(sap.ui.core.ValueState.None);
                }

                var aSelectedItems = this.oTable.getSelectedItems();
                if (!aSelectedItems.length) {
                    MessageBox.error("Please select at least one row.");
                    return;
                }

                var oLIFING7Model = this.getOwnerComponent().getModel("seventhModel");
                var that = this;
                oView.setBusy(true);

                var aReqs = aSelectedItems.map(function (oItem) {
                    var oRow = oItem.getBindingContext("matList").getObject();
                    var sEquipment = oRow.Equipment || "";

                    return new Promise(function (resolve) {
                        if (!sEquipment) {
                            // resolve({ ok: false, msg: "Equipment is empty for a selected row" });
                            resolve({ ok: false, msg: "Equipment is empty for a selected row", equipment: sEquipment});
                            return;
                        }

                        var sNote = oRow.Note || "";
                        var sPosition = oRow.level || "";
                        var sFunctionGroup = oRow.fg || "";
                        var sSerialNumber = oRow.snumber || "";

                        // Build OData call for LIFING7 with all parameters
                        var sPath = "/ZLIFING7Set(IEquipment='" + encodeURIComponent(sEquipment) +
                            "',INote='" + encodeURIComponent(sNote) +
                            "',IPosition='" + encodeURIComponent(sPosition) +
                            "',IFunctiongroup='" + encodeURIComponent(sFunctionGroup) +
                            "',ISerialNumber='" + encodeURIComponent(sSerialNumber) +
                            "',IStoragelocation='" + encodeURIComponent(sStorLoc) + "')";

                        console.log("Calling LIFING7 for Equipment:", sEquipment, "Storage Location:", sStorLoc);

                        oLIFING7Model.read(sPath, {
                            // success: function (oResp) {
                            //     resolve({ ok: true, data: oResp });
                            // },
                            // error: function (oErr) {
                            //     resolve({ ok: false, err: oErr });
                            // }
                            success: function (oResp) {
                                console.log("LIFING7 success for Equipment:", sEquipment, "Response:", oResp);
                                // Handle success if needed
                                // if (oResp.results && oResp.results.length > 0) {
                                //     var oResult = oResp.results[0];
                                //     if (oResult.ERETURNCODE === "OK") {
                                //         console.log("LIFING7 completed successfully for Equipment:", sEquipment);
                                //         resolve({ ok: true, data: oResp, returnCode: "OK", equipment: sEquipment });
                                //     } else {
                                //         console.warn("LIFING7 returned code:", oResult.ERETURNCODE, "for Equipment:", sEquipment);
                                //         resolve({ ok: true, data: oResp, returnCode: oResult.ERETURNCODE, equipment: sEquipment });
                                //     }
                                // } else {
                                //     resolve({ ok: true, data: oResp, returnCode: "", equipment: sEquipment });
                                // }
                                var sReturnCode = oResp.ReturnCode || "";
                                var sReturnMessage = oResp.ReturnMessage || oResp.EReturnMessage || "";
                                if (sReturnCode === "OK") {
                                    console.log("LIFING7 completed successfully for Equipment:", sEquipment);
                                    resolve({ ok: true, data: oResp, returnCode: "OK", equipment: sEquipment ,returnMessage: sReturnMessage });
                                } else if (sReturnCode === "KO") {
                                    console.warn("LIFING7 returned KO for Equipment:", sEquipment, "Message:", sReturnMessage);
                                    resolve({ ok: false, data: oResp, returnCode: "KO", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else {
                                    console.warn("LIFING7 returned code:", sReturnCode, "for Equipment:", sEquipment);
                                    resolve({ ok: true, data: oResp, returnCode: sReturnCode, equipment: sEquipment , returnMessage: sReturnMessage });
                                }
                            },
                            error: function (oErr) {
                                console.error("LIFING7 error for Equipment:", sEquipment, "Error:", oErr);
                                resolve({ ok: false, err: oErr, equipment: sEquipment });
                            }
                        });
                    });
                });

                Promise.all(aReqs).then(function (aResults) {
                    oView.setBusy(false);
                    that.onCloseMovement();

                    // Remove rows where ReturnCode is OK
                    var oMatListModel = that.getView().getModel("matList");
                    var oData = oMatListModel.getData();
                    var aRoot = oData.root || [];
                    var aRowsToRemove = [];

                    aResults.forEach(function (oResult) {
                        if (oResult.returnCode === "OK" && oResult.equipment) {
                            // Find and remove the row by Equipment ID
                            var iIndex = aRoot.findIndex(function (oRow) {
                                return oRow.Equipment === oResult.equipment;
                            });
                            if (iIndex !== -1) {
                                aRowsToRemove.push(iIndex);
                            }
                        }
                    });

                    // Remove rows in reverse order to maintain correct indices
                    aRowsToRemove.sort(function (a, b) { return b - a; });
                    aRowsToRemove.forEach(function (iIndex) {
                        aRoot.splice(iIndex, 1);
                    });

                    // Update model if any rows were removed
                    if (aRowsToRemove.length > 0) {
                        oMatListModel.updateBindings();
                    if (that.oTable && that.oTable.removeSelections) {
                        that.oTable.removeSelections(true);
                    }
                    if (typeof that.onSelectionChange === "function") {
                        that.onSelectionChange();
                    }
                    }

                    // var aFails = aResults.filter(function (r) { return !r.ok; });
                    // if (aFails.length) {
                    //     MessageBox.error("Movement failed for " + aFails.length + " row(s).");
                    // } else {
                    //     sap.m.MessageToast.show("Movement saved successfully");
                    // }

                     var aFails = aResults.filter(function (r) { return !r.ok || r.returnCode === "KO"; });
                    var aSuccesses = aResults.filter(function (r) { return r.ok && r.returnCode === "OK"; });
                    
                    if (aFails.length > 0) {
                        // Build error message with return messages from OData
                        var aErrorMessages = aFails.map(function (r) {
                            var sEquip = r.equipment || "Unknown";
                            var sMsg = r.returnMessage || r.msg || "Movement failed";
                            return "Equipment " + sEquip + ": " + sMsg;
                        });
                        var sErrorText = "Movement failed for " + aFails.length + " row(s):\n\n" + aErrorMessages.join("\n");
                        MessageBox.error(sErrorText);
                    }
                    
                    if (aSuccesses.length > 0 && aFails.length === 0) {
                        sap.m.MessageToast.show("Movement saved successfully");
                    } else if (aSuccesses.length > 0) {
                        sap.m.MessageToast.show("Movement completed for " + aSuccesses.length + " row(s)");
                    }
                }).catch(function (e) {
                    oView.setBusy(false);
                    MessageBox.error("Movement failed.");
                    console.error(e);
                });
            },

            onSaveMovement: function () {
                var oView = this.getView();
                var oInput = sap.ui.core.Fragment.byId(oView.getId(), "idMovementStorageLoc");
                var sStorLoc = (oInput && oInput.getValue ? oInput.getValue() : "") || "";
                sStorLoc = sStorLoc.trim();
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

                var aSelectedItems = this.oTable.getSelectedItems();
                if (!aSelectedItems.length) {
                    MessageBox.error("Please select at least one row.");
                    return;
                }

                var oLIFING11Model = this.getOwnerComponent().getModel("eleventhModel");
                var sParameter = this._sMovementParameter || "M";
                var sActionLabel = this._sMovementAction === "remove" ? "Remove" : "Movement";
                var that = this;
                oView.setBusy(true);

                var aReqs = aSelectedItems.map(function (oItem) {
                    var oRow = oItem.getBindingContext("matList").getObject();
                    var sEquipment = oRow.Equipment || "";

                    return new Promise(function (resolve) {
                        if (!sEquipment) {
                            resolve({ ok: false, msg: "Equipment is empty for a selected row", equipment: sEquipment });
                            return;
                        }

                        // Movement must call LIFING11 with Equipment + Storage Location + Parameter=M
                        // var sPath = "/ZLIFING11Set(IEquipment='" + encodeURIComponent(sEquipment) +
                        //     "',IParameter='M" +
                        //     "',Ilgort='" + encodeURIComponent(sStorLoc) + "')";

                        // var sPath = "/ZLIFING11Set(IEquipment='" + encodeURIComponent(sEquipment) +
                        //     "',IParameter='M" +
                        //     "',Ilgort='" + encodeURIComponent(sStorLoc) +
                        //     "',IMaterial=''" +
                        //     "',IOrder=''" +
                        //     "',IKostl='')";

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
                                    console.log("LIFING11 Movement completed successfully for Equipment:", sEquipment);
                                    resolve({ ok: true, data: oResp, returnCode: "OK", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else if (sReturnCode === "KO") {
                                    console.warn("LIFING11 Movement returned KO for Equipment:", sEquipment, "Message:", sReturnMessage);
                                    resolve({ ok: false, data: oResp, returnCode: "KO", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else {
                                    console.warn("LIFING11 Movement returned code:", sReturnCode, "for Equipment:", sEquipment);
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

                    // Avoid "auto-select next row" when we remove items from the model
                    if (that.oTable && that.oTable.removeSelections) {
                        that.oTable.removeSelections(true);
                    }

                    // Remove rows where ReturnCode is OK
                    var oMatListModel = that.getView().getModel("matList");
                    var oData = oMatListModel.getData();
                    var aRoot = oData.root || [];
                    var aRowsToRemove = [];

                    aResults.forEach(function (oResult) {
                        if (oResult.returnCode === "OK" && oResult.equipment) {
                            // Find and remove the row by Equipment ID
                            var iIndex = aRoot.findIndex(function (oRow) {
                                return oRow.Equipment === oResult.equipment;
                            });
                            if (iIndex !== -1) {
                                aRowsToRemove.push(iIndex);
                            }
                        }
                    });

                    // Remove rows in reverse order to maintain correct indices
                    aRowsToRemove.sort(function (a, b) { return b - a; });
                    aRowsToRemove.forEach(function (iIndex) {
                        aRoot.splice(iIndex, 1);
                    });

                    // Update model if any rows were removed
                    if (aRowsToRemove.length > 0) {
                        oMatListModel.updateBindings();
                    }

                    // Clear selection again after rebinding and refresh buttons state
                    if (that.oTable && that.oTable.removeSelections) {
                        that.oTable.removeSelections(true);
                    }
                    if (typeof that.onSelectionChange === "function") {
                        that.onSelectionChange();
                    }

                    // Collect failed results (KO or error)
                    var aFails = aResults.filter(function (r) { return !r.ok || r.returnCode === "KO"; });
                    var aSuccesses = aResults.filter(function (r) { return r.ok && r.returnCode === "OK"; });
                    
                    if (aFails.length > 0) {
                        // Build error message with return messages from OData
                        var aErrorMessages = aFails.map(function (r) {
                            var sEquip = r.equipment || "Unknown";
                            // var sMsg = r.returnMessage || r.msg || "Movement failed";
                            var sMsg = r.returnMessage || r.msg || sActionLabel + " failed";
                            return "Equipment " + sEquip + ": " + sMsg;
                        });
                        // var sErrorText = "Movement failed for " + aFails.length + " row(s):\n\n" + aErrorMessages.join("\n");
                        var sErrorText = sActionLabel + " failed for " + aFails.length + " row(s):\n\n" + aErrorMessages.join("\n");
                        MessageBox.error(sErrorText);
                    }
                    
                    if (aSuccesses.length > 0 && aFails.length === 0) {
                        // sap.m.MessageToast.show("Movement saved successfully");
                        sap.m.MessageToast.show(sActionLabel + " saved successfully");
                    } else if (aSuccesses.length > 0) {
                        // sap.m.MessageToast.show("Movement completed for " + aSuccesses.length + " row(s)");
                        sap.m.MessageToast.show(sActionLabel + " completed for " + aSuccesses.length + " row(s)");
                    }
                }).catch(function (e) {
                    oView.setBusy(false);
                    // MessageBox.error("Movement failed.");
                    MessageBox.error(sActionLabel + " failed.");
                    console.error(e);
                });
            },
            
            // onSearch: function (oEvent) {
            //     var matSelected = oEvent.getSource().getValue();
            //     var that = this;
            //     var oDataModel = this.getOwnerComponent().getModel("secondModel");
            //     var oFilter = new sap.ui.model.Filter({
            //         filters: [
            //             new sap.ui.model.Filter({
            //                 path: 'IMATNR',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: matSelected
            //             }),
            //             new sap.ui.model.Filter({
            //                 path: 'ILAGER',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: this.storageLocation
            //             }),
            //         ],
            //         and: true
            //     })
            //     this.getView().setBusy(true);
            //     var odataCall = "/ZLIFING2SET";
            //     oDataModel.read(odataCall, {
            //         filters: [oFilter],
            //         success: function (oresponse) {
            //             console.log(oresponse.results[0]);
            //             var resultData = oresponse.results;
            //             var matList = [];
            //             resultData.forEach((data, index) => {
            //                 if (data.ERETURNCODE == "OK") {

            //                     var iQty = 0;
            //                     if (data.EQUANTITY) {
            //                         // trim spaces and parse as float
            //                         var fQty = parseFloat(data.EQUANTITY.trim());
            //                         iQty = isNaN(fQty) ? 0 : Math.floor(fQty);   // make it integer
            //                     }

            //                     // 2) Create that many rows
            //                     for (var i = 0; i < iQty; i++) {
            //                         var matObj = {
            //                             level: data.ELEVEL,
            //                             fg: "",
            //                             Material: data.EMATNR,
            //                             Desc: data.EMATDESC,     // make sure this matches your view binding
            //                             snumber: data.ISERNR,             // one serial number per row
            //                             km: "",
            //                             Revisione: data.EKMREVISION,
            //                             Note: data.IINVNR,
            //                             min: data.EKMMIN,
            //                             max: data.EKMMAX,
            //                             children: []
            //                         };

            //                         matList.push(matObj);
            //                     }
            //                     // var matObj = {
            //                     //     level: data.ELEVEL,
            //                     //     fg: "",
            //                     //     Material: data.EMATNR,
            //                     //     Description: data.EMATDESC,
            //                     //     sNo: "",
            //                     //     km: "",
            //                     //     Revisione: data.EKMREVISION,
            //                     //     min: data.EKMMIN,
            //                     //     max: data.EKMMAX,
            //                     //     children: []
            //                     // };
            //                     // matList.push(matObj);

            //                     //For grouping and sorting
            //                     // if (typeof that.mGroupData[matObj.fg] === "undefined") {
            //                     //     that.mGroupData[matObj.fg] = [];
            //                     //     that.mGroupData[matObj.fg].push(matObj);
            //                     //     that.mGroupData[matObj.fg].sort((a, b) => a.level - b.level);
            //                     // } else {
            //                     //     that.mGroupData[matObj.fg].push(matObj);
            //                     //     that.mGroupData[matObj.fg].sort((a, b) => a.level - b.level);
            //                     // }
            //                 } else if (data.ERETURNCODE == "KO") {
            //                     MessageBox.show(data.ERETURNMESSAGE);
            //                 }
            //             });
            //             var mergedData = [...that.getView().getModel("matList").getData().root, ...matList];
            //             that.getView().byId("_IDMatSearchField").setValue();
            //             that.getView().getModel("matList").getData().root = mergedData;
            //             that.getView().getModel("matList").updateBindings();
            //             //    that.sortTableData();
            //             that.getView().setBusy(false);
            //         },
            //         error: function (oerror) {
            //             console.log(oerror)
            //         }
            //     });
            // },

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
                        if (oCostCenter) {
                            oCostCenter.setValue("");
                            oCostCenter.setValueState(sap.ui.core.ValueState.None);
                        }
                        if (oOrder) {
                            oOrder.setValue("");
                            oOrder.setValueState(sap.ui.core.ValueState.None);
                        }
                        this._oConsumptionDialog.open();
                    }.bind(this));
                } else {
                    var oCostCenter = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionCostCenter");
                    var oOrder = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionOrder");
                    if (oCostCenter) {
                        oCostCenter.setValue("");
                        oCostCenter.setValueState(sap.ui.core.ValueState.None);
                    }
                    if (oOrder) {
                        oOrder.setValue("");
                        oOrder.setValueState(sap.ui.core.ValueState.None);
                    }
                    this._oConsumptionDialog.open();
                }
            },

            onCloseConsumption: function () {
                if (this._oConsumptionDialog) {
                    this._oConsumptionDialog.close();
                }
            },

            _enableCreationFieldsForSelection: function (aSelectedItems) {
                var oMatListModel = this.getView().getModel("matList");
                var oData = oMatListModel && oMatListModel.getData ? oMatListModel.getData() : null;
                var aRows = oData && Array.isArray(oData.root) ? oData.root : [];

                aRows.forEach(function (oRow) {
                    oRow.CreationEditable = false;
                });

                aSelectedItems.forEach(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();
                    oRowObj.CreationEditable = true;
                });

                if (oMatListModel) {
                    oMatListModel.updateBindings(true);
                }
            },

            onSaveConsumption: function () {
                var oView = this.getView();
                var oCostCenter = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionCostCenter");
                var oOrder = sap.ui.core.Fragment.byId(oView.getId(), "idConsumptionOrder");
                
                // Get Storage Location from ComboBox in toolbar
                var sStorLoc = this.storageLocation || "";
                var sCostCenter = (oCostCenter && oCostCenter.getValue ? oCostCenter.getValue() : "") || "";
                var sOrder = (oOrder && oOrder.getValue ? oOrder.getValue() : "") || "";
                
                sStorLoc = sStorLoc.trim();
                sCostCenter = sCostCenter.trim();
                sOrder = sOrder.trim();

                // Validation
                var bHasError = false;
                if (!sStorLoc) {
                    MessageBox.error("Please select a Storage Location from the dropdown.");
                    bHasError = true;
                }
                
                if (!sCostCenter) {
                    if (oCostCenter) {
                        oCostCenter.setValueState(sap.ui.core.ValueState.Error);
                        oCostCenter.setValueStateText("Cost Center is required");
                    }
                    bHasError = true;
                } else {
                    if (oCostCenter) {
                        oCostCenter.setValueState(sap.ui.core.ValueState.None);
                    }
                }
                
                if (!sOrder) {
                    if (oOrder) {
                        oOrder.setValueState(sap.ui.core.ValueState.Error);
                        oOrder.setValueStateText("Order is required");
                    }
                    bHasError = true;
                } else {
                    if (oOrder) {
                        oOrder.setValueState(sap.ui.core.ValueState.None);
                    }
                }

                if (bHasError) {
                    return;
                }

                var aSelectedItems = this.oTable.getSelectedItems();
                if (!aSelectedItems.length) {
                    MessageBox.error("Please select at least one row.");
                    return;
                }

                // Check if LIFING11 model exists, otherwise use a default model name
                // You may need to adjust the model name based on your manifest.json
                var oLIFING11Model = this.getOwnerComponent().getModel("eleventhModel");                                    
                                    
                var that = this;
                oView.setBusy(true);

                var aReqs = aSelectedItems.map(function (oItem) {
                    var oRow = oItem.getBindingContext("matList").getObject();
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

                        // Build OData call for LIFING11 with all parameters
                        // var sPath = "/ZLIFING11Set(IEquipment='" + encodeURIComponent(sEquipment) +
                        //     "',IParameter='C" +
                        //     "',IStoragelocation='" + encodeURIComponent(sStorLoc) +
                        //     "',IMaterial='" + encodeURIComponent(sMaterial) +
                        //     "',IOrder='" + encodeURIComponent(sOrder) +
                        //     "',ICostCenter='" + encodeURIComponent(sCostCenter) + "')";

                        var sPath = "/ZLIFING11Set(IEquipment='" + encodeURIComponent(sEquipment) +
                            "',IParameter='C" +
                            "',Ilgort='" + encodeURIComponent(sStorLoc) +
                            "',IMaterial='" + encodeURIComponent(sMaterial) +
                            "',IOrder='" + encodeURIComponent(sOrder) +
                            "',IKostl='" + encodeURIComponent(sCostCenter) + "')";


                        console.log("Calling LIFING11 for Equipment:", sEquipment, "Storage Location:", sStorLoc);

                        oLIFING11Model.read(sPath, {
                            success: function (oResp) {
                                console.log("LIFING11 success for Equipment:", sEquipment, "Response:", oResp);
                                // Handle success - response is directly on oResp
                                var sReturnCode = oResp.ReturnCode || "";
                                var sReturnMessage = oResp.ReturnMessage || oResp.EReturnMessage || "";
                                if (sReturnCode === "OK") {
                                    console.log("LIFING11 completed successfully for Equipment:", sEquipment);
                                    resolve({ ok: true, data: oResp, returnCode: "OK", equipment: sEquipment , returnMessage: sReturnMessage });
                                } else if (sReturnCode === "KO") {
                                    console.warn("LIFING11 returned KO for Equipment:", sEquipment, "Message:", sReturnMessage);
                                    resolve({ ok: false, data: oResp, returnCode: "KO", equipment: sEquipment, returnMessage: sReturnMessage });
                                } else {
                                    console.warn("LIFING11 returned code:", sReturnCode, "for Equipment:", sEquipment);
                                    resolve({ ok: true, data: oResp, returnCode: sReturnCode, equipment: sEquipment ,returnMessage: sReturnMessage});
                                }
                            },
                            error: function (oErr) {
                                console.error("LIFING11 error for Equipment:", sEquipment, "Error:", oErr);
                                resolve({ ok: false, err: oErr, equipment: sEquipment });
                            }
                        });
                    });
                });

                Promise.all(aReqs).then(function (aResults) {
                    oView.setBusy(false);
                    that.onCloseConsumption();

                    // Clear selection before removing rows
                    // if (that.oTable && that.oTable.removeSelections) {
                    //     that.oTable.removeSelections(true);
                    // }

                    // Remove rows where ReturnCode is OK
                    var oMatListModel = that.getView().getModel("matList");
                    var oData = oMatListModel.getData();
                    var aRoot = oData.root || [];
                    var aRowsToRemove = [];

                    aResults.forEach(function (oResult) {
                        if (oResult.returnCode === "OK" && oResult.equipment) {
                            // Find and remove the row by Equipment ID
                            var iIndex = aRoot.findIndex(function (oRow) {
                                return oRow.Equipment === oResult.equipment;
                            });
                            if (iIndex !== -1) {
                                aRowsToRemove.push(iIndex);
                            }
                        }
                    });

                    // Remove rows in reverse order to maintain correct indices
                    aRowsToRemove.sort(function (a, b) { return b - a; });
                    aRowsToRemove.forEach(function (iIndex) {
                        aRoot.splice(iIndex, 1);
                    });

                    // Update model if any rows were removed
                    if (aRowsToRemove.length > 0) {
                        oMatListModel.updateBindings();
                        // Clear selection again after rebinding and refresh buttons state
                    if (that.oTable && that.oTable.removeSelections) {
                        that.oTable.removeSelections(true);
                    }
                    if (typeof that.onSelectionChange === "function") {
                        that.onSelectionChange();
                    }
                    }                 

                    // var aFails = aResults.filter(function (r) { return !r.ok; });
                    // if (aFails.length) {
                    //     MessageBox.error("Consumption failed for " + aFails.length + " row(s).");
                    // } else {
                    //     sap.m.MessageToast.show("Consumption saved successfully");
                    // }

                     var aFails = aResults.filter(function (r) { return !r.ok || r.returnCode === "KO"; });
                    var aSuccesses = aResults.filter(function (r) { return r.ok && r.returnCode === "OK"; });
                    
                    if (aFails.length > 0) {
                        // Build error message with return messages from OData
                        var aErrorMessages = aFails.map(function (r) {
                            var sEquip = r.equipment || "Unknown";
                            var sMsg = r.returnMessage || r.msg || "Consumption failed";
                            return "Equipment " + sEquip + ": " + sMsg;
                        });
                        var sErrorText = "Consumption failed for " + aFails.length + " row(s):\n\n" + aErrorMessages.join("\n");
                        MessageBox.error(sErrorText);
                    }
                    
                    if (aSuccesses.length > 0 && aFails.length === 0) {
                        sap.m.MessageToast.show("Consumption saved successfully");
                    } else if (aSuccesses.length > 0) {
                        sap.m.MessageToast.show("Consumption completed for " + aSuccesses.length + " row(s)");
                    }
                }).catch(function (e) {
                    oView.setBusy(false);
                    MessageBox.error("Consumption failed.");
                    console.error(e);
                });
            },


            // onSearch: function (oEvent) {
            //     var matSelected = oEvent.getSource().getValue();
            //     var that = this;
            //     var oDataModel = this.getOwnerComponent().getModel("secondModel");
            //     var oFilter = new sap.ui.model.Filter({
            //         filters: [
            //             new sap.ui.model.Filter({
            //                 path: 'IMATNR',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: matSelected
            //             }),
            //             new sap.ui.model.Filter({
            //                 path: 'ILAGER',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: this.storageLocation
            //             }),
            //         ],
            //         and: true
            //     })
            //     this.getView().setBusy(true);
            //     var odataCall = "/ZLIFING2SET";
            //     oDataModel.read(odataCall, {
            //         filters: [oFilter],
            //         success: function (oresponse) {
            //             var aAllResults = oresponse.results || [];
                        
            //             if (aAllResults.length === 0) {
            //                 that.getView().setBusy(false);
            //                 MessageBox.warning("No data returned");
            //                 return;
            //             }

            //             // First row (results[0]): Extract Return Code (G/Y/R) for traffic light
            //             var oFirstRow = aAllResults[0] || {};
            //             // Extract return code for traffic light - check if ERETURNCODE contains G/Y/R
            //             var sReturnCode = "G"; // Default to Green
            //             if (oFirstRow.ERETURNCODE === "R" || oFirstRow.ERETURNCODE === "Y" || oFirstRow.ERETURNCODE === "G") {
            //                 sReturnCode = oFirstRow.ERETURNCODE;
            //             } else if (oFirstRow.ERETURNCODE) {
            //                 // If ERETURNCODE exists but is not G/Y/R, check if it's OK/KO
            //                 // For traffic light, we'll default to G if it's OK, or R if it's KO
            //                 sReturnCode = (oFirstRow.ERETURNCODE === "OK") ? "G" : "R";
            //             }
                        
            //             // Update traffic light based on Return Code
            //             // R = Red, Y = Yellow, G = Green
            //             that._updateTrafficLight(sReturnCode);

            //             // From second row onwards (results[1]...): Additional rows with Equipment and Serial Number
            //             var aDataRows = aAllResults.slice(1);
            //             var matList = [];

            //             // Process first row for quantity (as before)
            //             // The first row contains quantity information regardless of return code
            //             var iQty = 0;
            //             if (oFirstRow.EQUANTITY) {
            //                 // trim spaces and parse as float
            //                 var fQty = parseFloat(oFirstRow.EQUANTITY.trim());
            //                 iQty = isNaN(fQty) ? 0 : Math.floor(fQty);   // make it integer
            //             }

            //             // Create that many rows from first row data
            //             for (var i = 0; i < iQty; i++) {
            //                 var matObj = {
            //                     level: oFirstRow.ELEVEL,
            //                     fg: "",
            //                     Material: oFirstRow.EMATNR,
            //                     Desc: oFirstRow.EMATDESC,
            //                     snumber: oFirstRow.ISERNR,             // one serial number per row
            //                     km: "",
            //                     Revisione: oFirstRow.EKMREVISION,
            //                     Note: oFirstRow.IINVNR,
            //                     min: oFirstRow.EKMMIN,
            //                     max: oFirstRow.EKMMAX,
            //                     children: []
            //                 };

            //                 matList.push(matObj);
            //             }

            //             // Show error message if first row has KO status
            //             if (oFirstRow.ERETURNCODE == "KO") {
            //                 MessageBox.show(oFirstRow.ERETURNMESSAGE || "Error in first row");
            //             }

            //             // Process additional rows from results[1] onwards (Equipment and Serial Number rows)
            //             if (aDataRows.length > 0) {
            //                 aDataRows.forEach(function (data) {
            //                     // These rows contain Equipment and Serial Number and cannot be modified
            //                     var oNewRow = {
            //                         Equipment: data.EEQUIPMENT || "",
            //                         Material: data.EMATNR || oFirstRow.EMATNR || matSelected,
            //                         Desc: data.EMATDESC || oFirstRow.EMATDESC || "",
            //                         snumber: data.ESERIALNUMBER || "",
            //                         km: "",
            //                         Revisione: data.EKMREVISION || oFirstRow.EKMREVISION || "",
            //                         Note: data.IINVNR || oFirstRow.IINVNR || "",
            //                         min: data.EKMMIN || oFirstRow.EKMMIN || "",
            //                         max: data.EKMMAX || oFirstRow.EKMMAX || "",
            //                         created: true,                    // Mark as read-only (cannot be modified)
            //                         children: []
            //                     };

            //                     matList.push(oNewRow);
            //                 });
            //             }

            //             var mergedData = [...that.getView().getModel("matList").getData().root, ...matList];
            //             that.getView().byId("_IDMatSearchField").setValue();
            //             that.getView().getModel("matList").getData().root = mergedData;
            //             that.getView().getModel("matList").updateBindings();
            //             that.getView().setBusy(false);
            //         },
            //         error: function (oerror) {
            //             console.log(oerror);
            //             that.getView().setBusy(false);
            //             MessageBox.error("Error in OData call");
            //         }
            //     });
            // },

            onSearch: function (oEvent) {
                var matSelected = oEvent.getSource().getValue();
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel("fifthModel");
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'IParam',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "M"
                        }),
                        new sap.ui.model.Filter({
                            path: 'Imatnr',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: matSelected
                        }),
                        new sap.ui.model.Filter({
                            path: 'Ilager',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.storageLocation
                        }),
                    ],
                    and: true
                })
                this.getView().setBusy(true);
                var odataCall = "/ZLIFING5Set";
                oDataModel.read(odataCall, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        var aAllResults = oresponse.results || [];
                        
                        if (aAllResults.length === 0) {
                            that.getView().setBusy(false);
                            MessageBox.warning("No data returned");
                            return;
                        }

                        var sFirstRowReturnCode = String(aAllResults[0].Zreturn || "").toUpperCase().trim();
                        var sStatusText = "";
                        if (sFirstRowReturnCode === "R") {
                            sStatusText = "Red";
                        } else if (sFirstRowReturnCode === "G") {
                            sStatusText = "Green";
                        } else if (sFirstRowReturnCode === "Y") {
                            sStatusText = "Yellow";
                        }

                        var matList = [];
                        var bHasKO = false;
                        var sKoMessage = "";

                        // aAllResults.forEach(function (data) {
                        //     var sCode = String(data.ERETURNCODE || "").toUpperCase().trim();
                        //     if (sCode === "KO" && !bHasKO) {
                        //         bHasKO = true;
                        //         sKoMessage = data.ERETURNMESSAGE || "Error in returned data";
                        //     }

                        //     matList.push({
                        //         Equipment: data.EEQUIPMENT || "",
                        //         Material: data.EMATNR || matSelected,
                        //         Desc: data.EMATDESC || "",
                        //         MaterialDescription: data.EMATDESC || "",
                        //         snumber: data.ISERNR || "",
                        //         km: data.EKM2 || data.EKM || "",
                        //         Revisione: data.EKMREVISION || "",
                        //         RevisionNumber: data.EKMREVISION || "",
                        //         RevisionKm: data.EKMREVKM || data.EREVISIONKM || data.EKM_REVISION || "",
                        //         KmRevision: data.EKM_REVISION || data.EKMREVKM || data.EREVISIONKM || "",
                        //         Note: data.IINVNR || "",
                        //         level: data.ELEVEL || data.EPOSITION || "",
                        //         Position: data.ELEVEL || data.EPOSITION || "",
                        //         fg: data.EFUNCTIONALGROUP || data.EFUNCTIONGROUP || data.EFG || "",
                        //         FunctionalGroup: data.EFUNCTIONALGROUP || data.EFUNCTIONGROUP || data.EFG || "",
                        //         min: data.EKMMIN || "",
                        //         max: data.EKMMAX || "",
                        //         KmMin: data.EKMMIN || "",
                        //         KmMax: data.EKMMAX || "",
                        //         created: !!data.EEQUIPMENT,
                        //         children: []
                        //     });
                        // });

                        aAllResults.forEach(function (data) {
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

                        // Duplicate the first table row Zquan times (one row per serial / unit)
                        var vZquan = aAllResults[0] && aAllResults[0].Zquan;
                        var iZquan = typeof vZquan === "number" ? vZquan : parseFloat(String(vZquan != null ? vZquan : "").replace(",", "."), 10);
                        if (!isFinite(iZquan) || iZquan < 1) {
                            iZquan = 1;
                        }
                        iZquan = Math.floor(iZquan);
                        if (matList.length > 0 && iZquan > 1) {
                            var oFirstRow = matList[0];
                            var aExpanded = [oFirstRow];
                            for (var iDup = 1; iDup < iZquan; iDup++) {
                                var oClone = JSON.parse(JSON.stringify(oFirstRow));
                                oClone.snumber = "";
                                aExpanded.push(oClone);
                            }
                            matList = aExpanded.concat(matList.slice(1));
                        }

                        if (bHasKO) {
                            MessageBox.show(sKoMessage);
                        }

                        var mergedData = [...that.getView().getModel("matList").getData().root, ...matList];
                        that._setFirstRowStatusVisibility(mergedData);
                        that.getView().byId("_IDMatSearchField").setValue();
                        that.getView().getModel("matList").getData().root = mergedData;
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

            oncloseDialog: function (oEvent) {
                this._oDialog.close();
            },

            _setFirstRowStatusVisibility: function (aRows) {
                if (!Array.isArray(aRows)) {
                    return;
                }
                aRows.forEach(function (oRow, iIndex) {
                    oRow.ShowStatus = iIndex === 0;
                });
            },

            statusCodeToColor: function (sStatusCode) {
                var sCode = String(sStatusCode || "").toUpperCase().trim();
                if (sCode === "R") {
                    return "#ff0000";
                }
                if (sCode === "Y") {
                    return "#f4c542";
                }
                if (sCode === "G") {
                    return "#008000";
                }
                return "#6a6d70";
            },

            OnAddSnoMaterial: function (oEvent) {
                var oView = this.getView();
                var oMaterialModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oMaterialModel, "material");
                if (!this._oDialog) {
                    Fragment.load({
                        id: oView.getId(),  // Ensure unique ID
                        name: "com.piaggio.sap.lifing.lifing.view.AddSnoMaterial", // Fragment path
                        controller: this // Bind the controller
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog); // Add dialog to view
                        this._oDialog = oDialog; // Store for reuse
                        this._oDialog.open(); // Open dialog
                    }.bind(this));
                } else {
                    this._oDialog.open();
                }
            },

            onSnoSave: function (oEvent) {
                // var matData = this.getView().getModel("material").getData();
                // var material = [...this.getView().getModel("matList").getData(), ...[matData]];
                // this.getView().getModel("matList").setData(material);
                // this.getView().getModel("matList").updateBindings();
                var oMatData = this.getView().getModel("material").getData();

                // get matList model & data
                var oMatListModel = this.getView().getModel("matList");
                var oData = oMatListModel.getData();   // { root: [...] }

                if (!oData.root) {
                    oData.root = [];
                }

                // push new row
                oData.root.push(oMatData);

                // update bindings so table refreshes
                oMatListModel.updateBindings();
                this._oDialog.close();
            },

            // OnPressCreation: function () {
            //     var sMatList = this.oTable.getBinding("items");
            //     var aRequests = [];
            //     var bRequests = [];
            //     this.getView().setBusy(true);
            //     var that = this;
            //     this.getView().byId("_IDGenColumne").setVisible(true);
            //     // this.getView().byId("_IDGenColumnd").setVisible(true);
            //     for (var i in this.oTable.getSelectedItems()) {
            //         var that = this;
            //         var oDataModel = this.getOwnerComponent().getModel();
            //         // var index = this.oTable.;
            //         var oFilter = new sap.ui.model.Filter({
            //             filters: [
            //                 new sap.ui.model.Filter({
            //                     path: 'IPARAMETER',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: "S"
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'IMATNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: this.oTable.getSelectedItems()[i].getBindingContext("matList").getObject().Material
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ISTORLOCATION',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: this.storageLocation
            //                 })
            //             ],
            //             and: true
            //         })
            //         var odataCall = "/ZLIFING1SET";
            //         var oRequest = new Promise((resolve, reject) => {
            //             oDataModel.read(odataCall, {
            //                 filters: [oFilter],
            //                 success: function (oresponse) {
            //                     resolve(oresponse.results[0]);
            //                 },
            //                 error: function (oerror) {
            //                     console.log(oerror)
            //                 }
            //             });
            //         });
            //         aRequests.push(oRequest);
            //     }

            //     // Execute all OData reads in parallel
            //     var mListData = this.getView().getModel("matList").getData();
            //     Promise.all(aRequests).then((aResponses) => {
            //         for (var i in aResponses) {
            //             if (aResponses[i].ERETURNCODE == 'OK') {
            //                 var serNum = this.oTable.getSelectedItems()[i].getBindingContext("matList").getObject().snumber;
            //                 var oFilter = new sap.ui.model.Filter({
            //                     filters: [
            //                         new sap.ui.model.Filter({
            //                             path: 'IMATNR',
            //                             operator: sap.ui.model.FilterOperator.EQ,
            //                             value1: aResponses[i].EMATNR
            //                         }),
            //                         new sap.ui.model.Filter({
            //                             path: 'IINVNR',
            //                             operator: sap.ui.model.FilterOperator.EQ,
            //                             value1: ''
            //                         }),
            //                         new sap.ui.model.Filter({
            //                             path: 'IGROES',
            //                             operator: sap.ui.model.FilterOperator.EQ,
            //                             value1: sMatList.getContextByIndex(index).getObject().level
            //                         }),
            //                         new sap.ui.model.Filter({
            //                             path: 'ISERNR',
            //                             operator: sap.ui.model.FilterOperator.EQ,
            //                             value1: serNum
            //                         }),
            //                         new sap.ui.model.Filter({
            //                             path: 'ITIDNR',
            //                             operator: sap.ui.model.FilterOperator.EQ,
            //                             value1: ''
            //                         }),
            //                         new sap.ui.model.Filter({
            //                             path: 'ILAGER',
            //                             operator: sap.ui.model.FilterOperator.EQ,
            //                             value1: this.storageLocation
            //                         }),
            //                     ],
            //                     and: true
            //                 })
            //                 that.oTable.getSelectedItems()[i].getBindingContext("matList").getObject().Desc = aResponses[i].EMATDESC;
            //                 var oDataModel = this.getOwnerComponent().getModel("secondModel");
            //                 var odataCall = "/ZLIFING2SET";
            //                 var oRequest = new Promise((resolve, reject) => {
            //                     oDataModel.read(odataCall, {
            //                         filters: [oFilter],
            //                         success: function (oresponse) {
            //                             resolve(oresponse.results[0]);
            //                         },
            //                         error: function (oerror) {
            //                             console.log(oerror);
            //                         }
            //                     });
            //                 });
            //                 bRequests.push(oRequest);
            //                 Promise.all(bRequests).then((aResponses) => {
            //                     aResponses.forEach((data, index) => {
            //                         that.oTable.getSelectedItems()[index].getBindingContext("matList").getObject().Equipment = data.EEQUIPMENT;
            //                     })
            //                     that.getView().getModel("matList").updateBindings();
            //                     that.getView().setBusy(false);
            //                 });
            //             } else if (aData.ERETURNCODE == "KO") {
            //                 saveErr = true;
            //             }
            //         }
            //     }).catch((oError) => {
            //         console.error("Error loading data:", oError);
            //     });
            //     if (saveErr) MessageBox.show("One or more of the creation failed");
            // }

            OnPressCreation: function () {
                var oTable = this.oTable;
                var aSelectedItems = oTable.getSelectedItems();
                var that = this;

                if (!aSelectedItems.length) {
                    sap.m.MessageBox.error("Please select at least one row.");
                    return;
                }

                var bMissingSerialNumber = false;
                aSelectedItems.forEach(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();
                    var sSerNum = String(oRowObj.snumber || "").trim();
                    var aCells = oItem.getCells();
                    var oSerialInput = aCells && aCells.length ? aCells[aCells.length - 1] : null;

                    if (oSerialInput && oSerialInput.setValueState) {
                        oSerialInput.setValueState(sap.ui.core.ValueState.None);
                        oSerialInput.setValueStateText("");
                    }

                    if (!sSerNum) {
                        bMissingSerialNumber = true;
                        if (oSerialInput && oSerialInput.setValueState) {
                            oSerialInput.setValueState(sap.ui.core.ValueState.Error);
                            oSerialInput.setValueStateText("Serial Number is required");
                        }
                    }
                });

                if (bMissingSerialNumber) {
                    sap.m.MessageBox.error("Please enter Serial Number for all selected rows.");
                    return;
                }

                var aRequestsFirst = [];
                var aRequestsSecond = [];
                var oModel1 = this.getOwnerComponent().getModel();               // ZLIFING1SET
                var oModel2 = this.getOwnerComponent().getModel("secondModel");  // ZLIFING2SET
                var saveErr = false;

                this._hideTrafficLight();

                this.getView().setBusy(true);
                this.byId("_IDGenColumne").setVisible(true);
                // this.byId("_IDGenColumnd").setVisible(true); // if needed

                // ---- 1st round of reads: ZLIFING1SET ----
                aSelectedItems.forEach(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();

                    var oFilter1 = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: "IPARAMETER",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: "S"
                            }),
                            new sap.ui.model.Filter({
                                path: "IMATNR",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: oRowObj.Material
                            }),
                            new sap.ui.model.Filter({
                                path: "ISTORLOCATION",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: that.storageLocation
                            })
                        ],
                        and: true
                    });

                    var oReq1 = new Promise(function (resolve, reject) {
                        oModel1.read("/ZLIFING1SET", {
                            filters: [oFilter1],
                            success: function (oResponse) {
                                console.log(oResponse.results[0]);
                                resolve(oResponse.results[0]);       // one line per material
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

                        // Build 2nd round of calls (ZLIFING2SET)
                        aResponses.forEach(function (oResp, idx) {
                            if (oResp.ERETURNCODE === "OK") {

                                var oRowObj = aSelectedItems[idx].getBindingContext("matList").getObject();
                                var sSerNum = oRowObj.snumber;

                                // update description from first call
                                oRowObj.Desc = oResp.EMATDESC;

                                var oFilter2 = new sap.ui.model.Filter({
                                    filters: [
                                        new sap.ui.model.Filter({
                                            path: "IMATNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: oResp.EMATNR
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "IINVNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: oRowObj.Note
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "IGROES",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: ""          // instead of undefined index
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "ISERNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: sSerNum
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "ITIDNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: ""
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "ILAGER",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: that.storageLocation
                                        })
                                    ],
                                    and: true
                                });

                                var oReq2 = new Promise(function (resolve, reject) {
                                    oModel2.read("/ZLIFING2SET", {
                                        filters: [oFilter2],
                                        success: function (oResponse2) {
                                            // resolve(oResponse2.results[0]);
                                            var aAllResults = oResponse2.results || [];
                                            
                                            // First row (results[0]): Extract Return Code (G/Y/R) - NOT displayed in table
                                            var oFirstRow = aAllResults[0] || {};
                                            var sReturnCode = oFirstRow.ERETURNCODE || "G"; // Default to Green if missing
                                            
                                            // From second row onwards (results[1]...): Data rows to display
                                            var aDataRows = aAllResults.slice(1);
                                            
                                            resolve({
                                                returnCode: sReturnCode,  // For traffic light (G, Y, or R)
                                                dataRows: aDataRows,       // Equipment + Serial Number rows
                                                originalRowIndex: idx     // Keep reference to original row
                                            });
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
                    // .then(function (aSecondResponses) {
                    //     var aSuccess = [];
                    //     var aError = [];
                    //     // Set Equipment on each selected row from second response
                    //     aSecondResponses.forEach(function (data, idx) {
                    //         var oRowObj = aSelectedItems[idx].getBindingContext("matList").getObject();
                    //         // oRowObj.Equipment = data.EEQUIPMENT;
                    //         if (data.EEQUIPMENT) {
                    //             oRowObj.Equipment = data.EEQUIPMENT;
                    //         }

                    //         if (data.ERETURNCODE === "OK") {
                    //             oRowObj.created = true;
                    //             aSuccess.push(data.ERETURNMESSAGE || "Success");
                    //         } else {
                    //             aError.push(data.ERETURNMESSAGE || "Operation failed");
                    //         }
                    //     });

                    //     that.getView().getModel("matList").updateBindings();
                    //     that.getView().setBusy(false);

                    //     if (aError.length === 0 && aSuccess.length > 0) {
                    //         // All OK
                    //         sap.m.MessageToast.show(
                    //             // "ALL DONE: " + aSuccess[0]
                    //             aSuccess[0] || "Equipment created correctly"
                    //         );
                    //     } else if (aError.length > 0) {
                    //         // Some or all failed → show combined error
                    //         var sMsg = "One or more creations failed:\n" + aError.join("\n");
                    //         sap.m.MessageBox.error(sMsg);
                    //     }

                    //     if (saveErr) {
                    //         sap.m.MessageBox.show("One or more of the creations failed");
                    //     }
                    // })
                    then(function (aSecondResponses) {
                        var aSuccess = [];
                        var aError = [];
                        var aTrafficCodes = []; // Collect Return Codes for traffic light
                        var oMatListModel = that.getView().getModel("matList");
                        var aRoot = oMatListModel.getData().root || [];

                        // Process each response
                        aSecondResponses.forEach(function (oResponseData, idx) {
                            var sReturnCode = oResponseData.returnCode; // G, Y, or R
                            var aDataRows = oResponseData.dataRows || [];
                            var iOriginalIndex = oResponseData.originalRowIndex;
                            var oOriginalRow = aSelectedItems[iOriginalIndex].getBindingContext("matList").getObject();

                            // Store Return Code for traffic light (use worst case if multiple)
                            // aTrafficCodes.push(sReturnCode);

                            // Add data rows (from results[1] onwards) to table
                            if (aDataRows.length > 0) {
                                aDataRows.forEach(function(oDataRow) {
                                    var oNewRow = {
                                        Equipment: oDataRow.EEQUIPMENT || "",
                                        Material: oOriginalRow.Material, // Same material as original
                                        snumber: oDataRow.ISERNR || "",   // Serial Number from response
                                        Note: oOriginalRow.Note || "",    // Note from original row
                                        created: true,                    // Read-only (cannot be modified)
                                        isFromCreation: true              // Flag to identify creation rows
                                    };
                                    aRoot.push(oNewRow);
                                });
                                aSuccess.push("Equipment created successfully");
                            } else {
                                // No additional rows returned
                                aError.push("No equipment data returned");
                            }
                        });

                        // Update traffic light based on Return Codes
                        // Show worst case: R > Y > G
                        var sWorstCode = "G";
                        if (aTrafficCodes.indexOf("R") !== -1) {
                            sWorstCode = "R";
                        } else if (aTrafficCodes.indexOf("Y") !== -1) {
                            sWorstCode = "Y";
                        }

                        // Update traffic light icon in toolbar
                        // that._updateTrafficLight(sWorstCode);

                        // Update model with new rows
                        oMatListModel.setData({ root: aRoot });
                        oMatListModel.updateBindings();
                        that.getView().setBusy(false);

                        if (aError.length === 0 && aSuccess.length > 0) {
                            // All OK
                            sap.m.MessageToast.show(
                                aSuccess[0] || "Equipment created correctly"
                            );
                        } else if (aError.length > 0) {
                            // Some or all failed → show combined error
                            var sMsg = "One or more creations failed:\n" + aError.join("\n");
                            sap.m.MessageBox.error(sMsg);
                        }

                        if (saveErr) {
                            sap.m.MessageBox.show("One or more of the creations failed");
                        }
                    })
                    .catch(function (oError) {
                        console.error("Error loading data:", oError);
                        that.getView().setBusy(false);
                        sap.m.MessageBox.error("Error while creating serial numbers.");
                    });
            },
            
            //    _updateTrafficLight: function(sReturnCode) {
            //     var oIcon = this.getView().byId("idTrafficLightIcon");
            //     if (!oIcon) {
            //         return; // Icon not found
            //     }
                
            //     var sIconSrc = "sap-icon://circle-task-2";
            //     var sColor;
                
            //     // Use uppercase to ensure correct comparison
            //     var sCode = String(sReturnCode || "G").toUpperCase().trim();
                
            //     // Use SAP UI5 IconColor enum values
            //     if (sCode === "R") {
            //         sColor = sap.ui.core.IconColor.Negative; // Red
            //     } else if (sCode === "Y") {
            //         sColor = sap.ui.core.IconColor.Critical; // Yellow
            //     } else { // G or default
            //         sColor = sap.ui.core.IconColor.Positive; // Green
            //     }
                
            //     oIcon.setSrc(sIconSrc);
            //     var sCustomColor = "#F8D71C"
            //     // oIcon.setStyle("color: " + sCustomColor);
            //     oIcon.$().css("color", sCustomColor);
            //     oIcon.setColor(sColor);
            //     oIcon.setVisible(true);
            // }, 

            OnCreation: function () {
                var oTable = this.oTable;
                var aSelectedItems = oTable.getSelectedItems();
                var that = this;

                if (!aSelectedItems.length) {
                    sap.m.MessageBox.error("Please select at least one row.");
                    return;
                }

                var bNeedEnableCreationFields = aSelectedItems.some(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();
                    return !oRowObj.CreationEditable;
                });
                if (bNeedEnableCreationFields) {
                    this._enableCreationFieldsForSelection(aSelectedItems);
                    sap.m.MessageToast.show("Functional Group, Position and Note are enabled for selected rows. Update values and click Creation again.");
                    return;
                }

                
                var bMissingSerialNumber = false;
                aSelectedItems.forEach(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();
                    var sSerNum = String(oRowObj.snumber || "").trim();
                    var aCells = oItem.getCells();
                    var oSerialInput = aCells && aCells.length ? aCells[aCells.length - 1] : null;

                    if (oSerialInput && oSerialInput.setValueState) {
                        oSerialInput.setValueState(sap.ui.core.ValueState.None);
                        oSerialInput.setValueStateText("");
                    }

                    if (!sSerNum) {
                        bMissingSerialNumber = true;
                        if (oSerialInput && oSerialInput.setValueState) {
                            oSerialInput.setValueState(sap.ui.core.ValueState.Error);
                            oSerialInput.setValueStateText("Serial Number is required");
                        }
                    }
                });

                if (bMissingSerialNumber) {
                    sap.m.MessageBox.error("Please enter Serial Number for all selected rows.");
                    return;
                }

                var aRequestsFirst = [];
                var aRequestsSecond = [];
                var oModel1 = this.getOwnerComponent().getModel();               // ZLIFING1SET
                var oModel2 = this.getOwnerComponent().getModel("secondModel");  // ZLIFING2SET
                var saveErr = false;

                this.getView().setBusy(true);
                this.byId("_IDGenColumne").setVisible(true);
                // this.byId("_IDGenColumnd").setVisible(true); // if needed

                // ---- 1st round of reads: ZLIFING1SET ----
                aSelectedItems.forEach(function (oItem) {
                    var oRowObj = oItem.getBindingContext("matList").getObject();

                    var oFilter1 = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: "IPARAMETER",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: "S"
                            }),
                            new sap.ui.model.Filter({
                                path: "IMATNR",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: oRowObj.Material
                            }),
                            new sap.ui.model.Filter({
                                path: "ISTORLOCATION",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: that.storageLocation
                            })
                        ],
                        and: true
                    });

                    var oReq1 = new Promise(function (resolve, reject) {
                        oModel1.read("/ZLIFING1SET", {
                            filters: [oFilter1],
                            success: function (oResponse) {
                                console.log(oResponse.results[0]);
                                resolve(oResponse.results[0]);       // one line per material
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

                        // Build 2nd round of calls (ZLIFING2SET)
                        aResponses.forEach(function (oResp, idx) {
                            if (oResp.ERETURNCODE === "OK") {

                                var oRowObj = aSelectedItems[idx].getBindingContext("matList").getObject();
                                var sSerNum = oRowObj.snumber;

                                var sNote = String(oRowObj.Note || "").trim();
                                var sPosition = String(oRowObj.Position || oRowObj.level || "").trim();
                                var sFunctionalGroup = String(oRowObj.FunctionalGroup || oRowObj.fg || "").trim();

                                // Keep aliases in sync for any legacy consumers in this controller.
                                oRowObj.level = sPosition;
                                oRowObj.fg = sFunctionalGroup;

                                // update description from first call
                                oRowObj.Desc = oResp.EMATDESC;

                                var oFilter2 = new sap.ui.model.Filter({
                                    filters: [
                                        new sap.ui.model.Filter({
                                            path: "IMATNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: oResp.EMATNR
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "IINVNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: sNote
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "IGROES",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: sPosition         // instead of undefined index
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "ISERNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: sSerNum
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "ITIDNR",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: sFunctionalGroup
                                        }),
                                        new sap.ui.model.Filter({
                                            path: "ILAGER",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: that.storageLocation
                                        })
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
                        // Set Equipment on each selected row from second response
                        aSecondResponses.forEach(function (data, idx) {
                            var oRowObj = aSelectedItems[idx].getBindingContext("matList").getObject();
                            // oRowObj.Equipment = data.EEQUIPMENT;
                            if (data.EEQUIPMENT) {
                                oRowObj.Equipment = data.EEQUIPMENT;
                            }

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
                            // All OK
                            sap.m.MessageToast.show(
                                // "ALL DONE: " + aSuccess[0]
                                aSuccess[0] || "Equipment created correctly"
                            );
                        } else if (aError.length > 0) {
                            // Some or all failed → show combined error
                            var sMsg = "One or more creations failed:\n" + aError.join("\n");
                            sap.m.MessageBox.error(sMsg);
                        }

                        if (saveErr) {
                            sap.m.MessageBox.show("One or more of the creations failed");
                        }
                    })
                    .catch(function (oError) {
                        console.error("Error loading data:", oError);
                        that.getView().setBusy(false);
                        sap.m.MessageBox.error("Error while creating serial numbers.");
                    });
            },

            _updateTrafficLight: function(sReturnCode) {
                var oIcon = this.getView().byId("idTrafficLightIcon");
                if (!oIcon) {
                    return; // Icon not found
                }
                
                var sIconSrc = "sap-icon://circle-task-2";
                var sColor;
                var bUseYellowClass = false;
                
                // Use uppercase to ensure correct comparison
                var sCode = String(sReturnCode || "G").toUpperCase().trim();
                
                // Set colors - use custom CSS class for yellow, semantic colors for others
                if (sCode === "R") {
                    sColor = sap.ui.core.IconColor.Negative; // Red
                } else if (sCode === "Y") {
                    // Use custom CSS class for true yellow color
                    bUseYellowClass = true;
                    sColor = ""; // Clear semantic color
                } else { // G or default
                    sColor = sap.ui.core.IconColor.Positive; // Green
                }
                
                oIcon.setSrc(sIconSrc);
                
                // Apply color via semantic color or custom CSS class
                if (bUseYellowClass) {
                    // Remove semantic color and add custom yellow CSS class
                    oIcon.setColor("");
                    oIcon.addStyleClass("yellowTrafficLight");
                } else {
                    // Use semantic color and remove custom CSS class
                    oIcon.removeStyleClass("yellowTrafficLight");
                    oIcon.setColor(sColor);
                }
                
                oIcon.setVisible(true);
            },

            _hideTrafficLight: function() {
                var oIcon = this.getView().byId("idTrafficLightIcon");
                if (oIcon) {
                    oIcon.setVisible(false);
                    oIcon.removeStyleClass("yellowTrafficLight");
                }
            }

        });
    });
