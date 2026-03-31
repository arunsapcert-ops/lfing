sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    function (Controller, Fragment, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("com.piaggio.sap.lifing.lifing.controller.ScratchCreate", {
            onInit: function () {
                //  console.log("XLSX version:", XLSX.version);
                var oModel = new sap.ui.model.json.JSONModel()
                this.getView().setModel(oModel, "storageLocation");
                var oMaterials = {
                    "root": []
                };
                var oMaterialListModel = new sap.ui.model.json.JSONModel(oMaterials);
                this.getView().setModel(oMaterialListModel, "mList");
                this.oTable = this.getView().byId("idscratchCreateTable");
                var oEquipmentListModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(oEquipmentListModel, "eList");
                var oSerialNumberListModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(oSerialNumberListModel, "snumberList");
                var popOverModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(popOverModel, "popOver");
                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    isLifingManagement: false,
                    kmAlert: 500
                }), "app");
                this.lifingParameter = "L";
                this.mGroupData = {};
                this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
                // var oTableBinding = this.oTable.getBinding("rows"); // Use "rows" instead of "items"
                // if (oTableBinding) {
                //     oTableBinding.attachChange(this.disableStorage.bind(this));
                // }
                // if (sap.ui.core.routing.HashChanger.getInstance().getHash() !== "BOMCreate"){
                // 	this.getView().byId("fileUploader").setVisible(false);
                // }
            },

            // disableStorage: function(){
            //     if(this.getView().byId("idscratchCreateTable").getBinding("rows").getLength())
            //         this.getView().byId("_IDGenComboBox1").setEnabled(false);
            // },

            onRouteMatched: function (oEvent) {
                this.getView().getModel("popOver").setProperty("/popOverSource", false);
                this.oTable.clearSelection();
                this.oTable.fireRowSelectionChange();
                this.getView().getModel("mList").setData({
                    "root": []
                });
                this.mGroupData = {};
                this.getView().getModel("eList").setData();
                this.getView().byId("fileUploader").clear();
                // this.getView().byId("_IDGenComboBox1").setSelectedItem(null);
                this.getView().byId("_IDGenComboBox1").setValue("");
                this.getView().byId("_IDGenComboBox1").setEnabled(true);
                  this.storageLocation = "";
                // this.getView().byId("idAddButton").setEnabled(false);
                this.getView().byId("_IDGenSearchField").setEnabled(false);
                // this.getView().byId("_IDGenComboBox1").fireSelectionChange();
                if (oEvent.getParameters().name == "ScratchCreate") {
                    this.getView().byId("idBomBox").setVisible(false);
                    this.getView().byId("_IDGenColumneedb").setVisible(false);
                    this.getView().byId("fileUploader").setVisible(true);
                    this.getView().byId("_IDGenButtonec").setVisible(true);
                    this.getView().byId("_IDGenButtonsave").setVisible(true);
                    this.getView().byId("_IDGenButtonadds").setVisible(true);
                    this.getView().byId("_IDGenButtonsnr").setVisible(false);
                    this.getView().byId("_IDGenButtonsnr").setEnabled(false);
                    // this.getView().byId("_IDGenButtonsno").setEnabled(false);
                    // this.getView().byId("_IDGenButtonadds").setEnabled(false);
                    // this.getView().byId("fileUploader").setEnabled(false);
                    this.getView().byId("idDelButton").setEnabled(false);
                    //
                    this.getView().byId("idAddButton").setVisible(true);
                    this.getView().byId("_IDGenColumnKm").setVisible(false);
                    this.getView().byId("_IDGenColumnNextRun").setVisible(false);
                    this.getView().byId("_IDGenColumnKmNextRun").setVisible(false);
                    this.getView().byId("_IDGenColumnTraffic").setVisible(false);
                    this.getView().byId("_IDGenColumn71").setVisible(false);
                    this.getView().byId("_IDGenColumn72").setVisible(false);
                    this.getView().getModel("app").setProperty("/isLifingManagement", false);
                } else if (oEvent.getParameters().name == "BOMCreate") {
                    this.getView().byId("idBomBox").setVisible(true);
                    this.getView().byId("_IDGenColumneedb").setVisible(false);
                    this.getView().byId("_IDGenLabel3").setText("Material");
                    this.getView().byId("fileUploader").setVisible(false);
                    this.getView().byId("_IDGenButtonsnr").setVisible(false);
                    this.getView().byId("_IDGenButtonsnr").setEnabled(false);
                    this.getView().byId("idAddButton").setVisible(true);
                    this.getView().byId("_IDGenButtonec").setVisible(true);
                    this.getView().byId("_IDGenButtonsave").setVisible(true);
                    this.getView().byId("_IDGenButtonadds").setVisible(true);
                    // this.getView().byId("_IDGenButtonsno").setEnabled(false);
                    // this.getView().byId("_IDGenButtonadds").setEnabled(false);
                    // this.getView().byId("fileUploader").setEnabled(false);
                    this.getView().byId("idDelButton").setEnabled(false);
                    //
                    this.getView().byId("_IDGenColumnKm").setVisible(false);
                    this.getView().byId("_IDGenColumnNextRun").setVisible(false);
                    this.getView().byId("_IDGenColumnKmNextRun").setVisible(false);
                    this.getView().byId("_IDGenColumnTraffic").setVisible(false);
                    this.getView().byId("_IDGenColumn71").setVisible(true);
                    this.getView().byId("_IDGenColumn72").setVisible(true);
                    this.getView().getModel("app").setProperty("/isLifingManagement", false);
                } else if (oEvent.getParameters().name == "LifingManagement") {
                    this.getView().byId("idBomBox").setVisible(true);
                    this.getView().byId("_IDGenColumneedb").setVisible(true);
                    this.getView().getModel("app").setProperty("/isLifingManagement", true);
                    this.LifingManagement = true;
                    this.getView().byId("_IDGenButtonec").setVisible(false);
                    this.getView().byId("_IDGenButtonsave").setVisible(false);
                    this.getView().byId("_IDGenButtonadds").setVisible(false);
                    
                    // this.getView().byId("_IDGenButtonsno").setVisible(false);
                    // this.getView().byId("_IDGenButtoninst").setVisible(true);

                    // this.getView().byId("_IDGenButtonsno").setEnabled(false);
                    // this.getView().byId("_IDGenButtonadds").setEnabled(false);
                    this.getView().byId("_IDGenSearchField").setEnabled(true);
                    this.getView().byId("_IDGenLabel3").setText("Serial No");
                    this.getView().byId("fileUploader").setVisible(false);
                    this.getView().byId("_IDGenButtonsnr").setVisible(true);
                    this.getView().byId("_IDGenButtonsnr").setEnabled(true);
                    this.getView().byId("_IDGenButtonreplace").setEnabled(false);
                    this.lifingParameter = "L";
                    this.getView().byId("_IDGenSelectLifing").setSelectedKey("Yes");
                    this.getView().byId("idDelButton").setEnabled(false);
                    this.getView().byId("idAddButton").setVisible(false);
                    //
                    this.getView().byId("_IDGenColumnKm").setVisible(true);
                    this.getView().byId("_IDGenColumnNextRun").setVisible(true);
                    this.getView().byId("_IDGenColumnKmNextRun").setVisible(true);
                    this.getView().byId("_IDGenColumnTraffic").setVisible(true);
                    this.getView().byId("_IDGenColumn71").setVisible(true);
                    this.getView().byId("_IDGenColumn72").setVisible(true);
                }
            },

            onNavButtonPress: function () {
                // this.getView().byId("_IDGenButtonsno").setEnabled(false);
                // this.getView().byId("_IDGenButtonadds").setEnabled(false);
                // this.getView().byId("fileUploader").setEnabled(false);
                // this.getView().byId("idAddButton").setEnabled(false);
                this.oTable.clearSelection();
                this.oTable.fireRowSelectionChange();
                this.getView().getModel("mList").setData({
                    "root": []
                });
                this.mGroupData = {};
                this.getView().getModel("eList").setData();
                this.getView().byId("fileUploader").clear();
                // this.getView().byId("_IDGenComboBox1").setSelectedItem(null);
                this.getView().byId("_IDGenComboBox1").setValue("");
                this.getView().byId("_IDGenComboBox1").setEnabled(true);
                // this.getView().byId("_IDGenComboBox1").fireSelectionChange();
                this.storageLocation = "";
                window.history.go(-1);
            },

            onSelectStorageLocation: function (oEvent) {
                /* this.storageLocation = oEvent.getSource().getSelectedKey();
                this.getView().byId("_IDGenComboBox1").setEnabled(this.storageLocation ? false : true);
                // this.getView().byId("idAddButton").setEnabled(this.storageLocation ? false : true);
                this.getView().byId("idAddButton").setEnabled(!!this.storageLocation);
                this.getView().byId("_IDGenSearchField").setEnabled(!!this.storageLocation);
                this.getView().byId("fileUploader").setEnabled(true);
                this.getView().byId("_IDGenButtonsno").setEnabled(true);
                this.getView().byId("_IDGenButtonadds").setEnabled(true); */

                const sValue = (oEvent.getSource().getValue() || "").trim();
                this.storageLocation = sValue;

                // this.getView().byId("idAddButton").setEnabled(!!this.storageLocation);
                this.getView().byId("_IDGenSearchField").setEnabled(!!this.storageLocation);
                // this.getView().byId("fileUploader").setEnabled(!!this.storageLocation);
                // this.getView().byId("_IDGenButtonsno").setEnabled(!!this.storageLocation);
                // this.getView().byId("_IDGenButtonadds").setEnabled(!!this.storageLocation);
            },

            onLifingSelectChange: function (oEvent) {
                var sSelectedKey = oEvent.getSource().getSelectedKey();
                var oSaveNewRunButton = this.getView().byId("_IDGenButtonsnr");
                var oInstallationButton = this.getView().byId("_IDGenButtoninst");
                var oReplaceButton = this.getView().byId("_IDGenButtonreplace");
                if (sSelectedKey === "Yes") {
                    // Enable Save New Run button and set parameter to "L"
                    this.lifingParameter = "L";
                    if (oSaveNewRunButton) {
                        oSaveNewRunButton.setEnabled(true);
                    }
                    if (oInstallationButton) {
                        oInstallationButton.setEnabled(false);
                    }
                    if (oReplaceButton) {
                        oReplaceButton.setEnabled(false);
                    }
                } else if (sSelectedKey === "No") {
                    // Disable Save New Run button and set parameter to "F"
                    this.lifingParameter = "F";
                    if (oSaveNewRunButton) {
                        oSaveNewRunButton.setEnabled(false);
                    }
                    if (oInstallationButton) {
                        oInstallationButton.setEnabled(true);
                    }
                    if (oReplaceButton) {
                        oReplaceButton.setEnabled(this._isSingleChildSelected());
                    }
                }
            },

            _isSingleChildSelected: function () {
                if (!this.oTable) {
                    return false;
                }
                var aSelectedIndices = this.oTable.getSelectedIndices();
                if (aSelectedIndices.length !== 1) {
                    return false;
                }
                var oCtx = this.oTable.getContextByIndex(aSelectedIndices[0]);
                var oRow = oCtx ? oCtx.getObject() : null;
                return !!(oRow && oRow.Father);
            },

            onInstallationPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this._pInstallationPopover) {
                    this._pInstallationPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.InstallationPopover",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }

                this._pInstallationPopover.then(function (oPopover) {
                    this.byId("idInstallationMatInput")?.setValue("");
                    this.byId("idInstallationStorageInput")?.setValue("");
                    oPopover.openBy(oButton);
                }.bind(this));
            },

            handleInstallationSearchPress: function () {
                var sMaterial = (this.byId("idInstallationMatInput")?.getValue() || "").trim();
                var sStorageLocation = (this.byId("idInstallationStorageInput")?.getValue() || "").trim();

                if (!sMaterial || !sStorageLocation) {
                    MessageBox.error("Material and Storage Location are mandatory.");
                    return;
                }

                if (this._pInstallationPopover) {
                    this._pInstallationPopover.then(function (oPopover) {
                        oPopover.close();
                    });
                }

                this.byId("idInstallationMatInput")?.setValue("");
                this.byId("idInstallationStorageInput")?.setValue("");

                var oDataModel = this.getOwnerComponent().getModel("fifthModel");
                var that = this;
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "Imatnr",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMaterial
                        }),
                        new sap.ui.model.Filter({
                            path: "Ilager",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sStorageLocation
                        }),
                        new sap.ui.model.Filter({
                            path: "IParam",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "L"
                        })
                    ],
                    and: true
                });

                this.getView().setBusy(true);
                oDataModel.read("/ZLIFING5Set", {
                    filters: [oFilter],
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        if (oResponse.results && oResponse.results.length && oResponse.results[0].Zreturn === "OK") {
                            that.getView().getModel("snumberList").setData(oResponse.results);
                            that._matListSource = "installation";
                            that.openMatListDialog();
                        } else {
                            MessageBox.show(oResponse.results?.[0]?.ZreturnMsg || "No equipment found.");
                        }
                    },
                    error: function () {
                        that.getView().setBusy(false);
                        MessageBox.error("Failed to retrieve equipment list.");
                    }
                });
            },

            onReplacePress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();

                if (!this._pReplacePopover) {
                    this._pReplacePopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.ReplacePopover",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }

                this._pReplacePopover.then(function (oPopover) {
                    this.byId("idReplaceMatInput")?.setValue("");
                    this.byId("idReplaceSourceStorageInput")?.setValue("");
                    this.byId("idReplaceDestinationStorageInput")?.setValue("");
                    oPopover.openBy(oButton);
                }.bind(this));
            },

            handleReplaceSearchPress: function () {
                var sMaterial = (this.byId("idReplaceMatInput")?.getValue() || "").trim();
                var sSourceStorageLocation = (this.byId("idReplaceSourceStorageInput")?.getValue() || "").trim();
                var sDestinationStorageLocation = (this.byId("idReplaceDestinationStorageInput")?.getValue() || "").trim();

                if (!sMaterial || !sSourceStorageLocation || !sDestinationStorageLocation) {
                    MessageBox.error("Material, Source Storage Location and Destination Storage Location are mandatory.");
                    return;
                }

                if (this._pReplacePopover) {
                    this._pReplacePopover.then(function (oPopover) {
                        oPopover.close();
                    });
                }

                this.byId("idReplaceMatInput")?.setValue("");
                this.byId("idReplaceSourceStorageInput")?.setValue("");
                this.byId("idReplaceDestinationStorageInput")?.setValue("");

                // Keep destination storage for the next replace step.
                this._replaceDestinationStorageLocation = sDestinationStorageLocation;

                var oDataModel = this.getOwnerComponent().getModel("fifthModel");
                var that = this;
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "Imatnr",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMaterial
                        }),
                        new sap.ui.model.Filter({
                            path: "Ilager",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sSourceStorageLocation
                        }),
                        new sap.ui.model.Filter({
                            path: "IParam",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "L"
                        })
                    ],
                    and: true
                });

                this.getView().setBusy(true);
                oDataModel.read("/ZLIFING5Set", {
                    filters: [oFilter],
                    success: function (oResponse) {
                        that.getView().setBusy(false);
                        if (oResponse.results && oResponse.results.length && oResponse.results[0].Zreturn === "OK") {
                            that.getView().getModel("snumberList").setData(oResponse.results);
                            that._matListSource = "replace";
                            // that.openMatListDialog();
                            that.openReplaceMatListDialog();
                        } else {
                            MessageBox.show(oResponse.results?.[0]?.ZreturnMsg || "No equipment found.");
                        }
                    },
                    error: function () {
                        that.getView().setBusy(false);
                        MessageBox.error("Failed to retrieve equipment list.");
                    }
                });
            },

             openReplaceMatListDialog: function () {
                var oView = this.getView();
                if (!this._oReplaceMatListDialog) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.ReplaceSerialNumberSelect",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        this._oReplaceMatListDialog = oDialog;
                        this._oReplaceMatListDialog.open();
                    }.bind(this));
                } else {
                    this._oReplaceMatListDialog.open();
                }
            },

            onCloseReplaceMatListDialog: function () {
                if (this._oReplaceMatListDialog) {
                    this._oReplaceMatListDialog.close();
                }
            },

            onSelectReplaceSerialNumberPress: function () {
                const oSelectTable = this.byId("idReplaceSerialNoSelect");
                const aSelectedItems = oSelectTable ? oSelectTable.getSelectedItems() : [];
                if (!aSelectedItems.length) {
                    MessageBox.error("Select one Equipment to continue.");
                    return;
                }

                const sItem = aSelectedItems[0];
                const sDestinationStorageLocation = (this._replaceDestinationStorageLocation || "").trim();
                if (!sDestinationStorageLocation) {
                    MessageBox.error("Destination Storage Location is mandatory for replacement.");
                    return;
                }

                const oModel = this.getView().getModel("mList");
                const aRoot = oModel.getData().root || [];
                if (!aRoot.length || !aRoot[0].Equipment) {
                    MessageBox.error("Parent Equipment not found in first row.");
                    return;
                }

                //

                const aSelectedMainRows = this.oTable ? this.oTable.getSelectedIndices() : [];
                if (!aSelectedMainRows.length) {
                    MessageBox.error("Select one row in main table to replace.");
                    return;
                }
                const oSelectedMainCtx = this.oTable.getContextByIndex(aSelectedMainRows[0]);
                const sSelectedMainPath = oSelectedMainCtx ? oSelectedMainCtx.getPath() : "";
                const oSelectedMainRow = oSelectedMainCtx ? oSelectedMainCtx.getObject() : null;
                if (!oSelectedMainRow || !oSelectedMainRow.Equipment || !oSelectedMainRow.Father || sSelectedMainPath.indexOf("/children/") === -1) {
                    MessageBox.error("Select one installed child row in main table to replace.");
                    return;
                }
//

                const oItemData = sItem.getBindingContext("snumberList").getObject();
                const sParentEq = aRoot[0].Equipment;
                const sSonEq = oItemData.Zequnr;
                const oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "IEQUIPPARENT",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sParentEq
                        }),
                        new sap.ui.model.Filter({
                            path: "IPARAM",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "R"
                        }),
                        new sap.ui.model.Filter({
                            path: "ILGORT",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sDestinationStorageLocation
                        }),
                        new sap.ui.model.Filter({
                            path: "IEQUISON",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sSonEq
                        })
                    ],
                    and: true
                });

                const that = this;
                this.getView().setBusy(true);

                this.getOwnerComponent().getModel("thirdModel").read("/ZLIFING3SET", {
                    filters: [oFilter],
                    success: function (oResponse) {
                        const aResults = oResponse.results || [];
                        const oBackendRes = aResults.find((oRes) => oRes.EEQUIPSON === sSonEq) || aResults[0];
                        if (!oBackendRes || oBackendRes.ZRETURN !== "OK") {
                            that.getView().setBusy(false);
                            MessageBox.error(oBackendRes?.ZRETURN_MSG || oBackendRes?.ZRETURNMSG || oBackendRes?.ERETURNMESSAGE || "Replacement failed.");
                            return;
                        }

                        const oParentNode = oModel.getData().root[0];
                        oParentNode.children = oParentNode.children || [];

                        // Dismantle currently selected old child (main table selection)
                        const sOldEq = oSelectedMainRow.Equipment;
                        const sParentPath = sSelectedMainPath.substring(0, sSelectedMainPath.lastIndexOf("/children/"));
                        const aParentChildren = oModel.getProperty(sParentPath + "/children") || [];
                        const iOldChildIndex = parseInt(sSelectedMainPath.split("/").pop(), 10);
                        if (!isNaN(iOldChildIndex) && iOldChildIndex > -1 && iOldChildIndex < aParentChildren.length) {
                            const oOldChild = aParentChildren[iOldChildIndex];
                            const oOldChildCopy = JSON.parse(JSON.stringify(oOldChild));
                            oOldChildCopy.fb = "DISM";
                            oOldChildCopy.fbMessage = "Dismantled";
                            aParentChildren.splice(iOldChildIndex, 1);
                            oModel.setProperty(sParentPath + "/children", aParentChildren);

                            const iExistingRootIndex = aRoot.findIndex((r) => r.Equipment === sOldEq);
                            if (iExistingRootIndex > -1) {
                                aRoot[iExistingRootIndex].fb = "DISM";
                                aRoot[iExistingRootIndex].fbMessage = "Dismantled";
                            } else {
                                aRoot.push(oOldChildCopy);
                            }
                        }
                        //

                        const bExistsAsChild = oParentNode.children.some((c) => c.Equipment === sSonEq);
                        if (!bExistsAsChild) {
                            const oNode = that._mapSnumberItemToNode(sItem);
                            oNode.Father = sParentEq;
                            oNode.fb = "REPL";
                            oNode.fbMessage = "Installed";
                            oParentNode.children.push(oNode);
                        }

                        oModel.updateBindings();
                        that.getView().setBusy(false);
                        if (that._oReplaceMatListDialog) {
                            that._oReplaceMatListDialog.close();
                        }
                        MessageToast.show("Replacement completed.");
                    },
                    error: function () {
                        that.getView().setBusy(false);
                        MessageBox.error("Replacement failed.");
                    }
                });

                // const sItem = aSelectedItems[0];
                // var data = sItem.getBindingContext("snumberList").getObject();
                // this.getView().getModel("mList").getData().root.push(this._mapSnumberItemToNode(sItem));
                // this.getView().getModel("mList").updateBindings();

                if (this._oReplaceMatListDialog) {
                    this._oReplaceMatListDialog.close();
                }
            },

            onSearch: function (oEvent) {
                // var matSelected = oEvent.getSource().getValue();
                // oEvent.getSource().setValue("");

                var oSource = oEvent.getSource && oEvent.getSource();
                var matSelected = oSource?.getValue ? oSource.getValue() : oEvent.query;

                // Clear SearchField only when it is a real UI SearchField
                if (oSource?.setValue) {
                    oSource.setValue("");
                }

                if (!this.LifingManagement) {
                    var Param = "B";
                    // var matSelected = "IMATNR_1";
                    // this.storageLocation = "I_1"; 
                    // var Param = "1";
                    var that = this;
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: 'IPARAMETER',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: Param
                            }),
                            new sap.ui.model.Filter({
                                path: 'IMATNR',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: matSelected
                            }),
                            new sap.ui.model.Filter({
                                path: 'ISTORLOCATION',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: this.storageLocation
                            })
                        ],
                        and: true
                    })
                    this.getView().setBusy(true);
                    var odataCall = "/ZLIFING1SET";
                    oDataModel.read(odataCall, {
                        filters: [oFilter],
                        success: function (oresponse) {
                            console.log(oresponse.results[0]);
                            var resultData = oresponse.results;
                            var matList = [];
                            resultData.forEach((data, index) => {
                                if (data.ERETURNCODE == "OK") {
                                    // var level = "";
                                    // if(data.EMATNR == matSelected) {
                                    //     level = 1;
                                    // } else {
                                    //     level = "";
                                    // }
                                    var matObj = {
                                        level: data.ELEVEL,
                                        fg: "",
                                        Material: data.EMATNR,
                                        MaterialDescription: data.EMATDESC,
                                        sNo: "",
                                        km: "",
                                        Revisione: data.EKMREVISION,
                                        min: data.EKMMIN,
                                        max: data.EKMMAX,
                                        children: []
                                    };
                                    matList.push(matObj);
                                    //For grouping and sorting
                                    if (typeof that.mGroupData[matObj.fg] === "undefined") {
                                        that.mGroupData[matObj.fg] = [];
                                        that.mGroupData[matObj.fg].push(matObj);
                                        that.mGroupData[matObj.fg].sort((a, b) => a.level - b.level);
                                    } else {
                                        that.mGroupData[matObj.fg].push(matObj);
                                        that.mGroupData[matObj.fg].sort((a, b) => a.level - b.level);
                                    }
                                } else if (data.ERETURNCODE == "KO") {
                                    MessageBox.show("No Data Found");
                                }
                            });
                            var mergedData = [...that.getView().getModel("mList").getData().root, ...matList];
                            that.getView().byId("_IDGenSearchField").setValue();
                            console.log("Merged data to be set:", mergedData);
                            that.getView().getModel("mList").setData({ root: mergedData });
                            // that.getView().getModel("mList").getData().root = mergedData;
                            // that.getView().getModel("mList").updateBindings();
                            //    that.sortTableData();
                            that.getView().setBusy(false);
                        },
                        error: function (oerror) {
                            console.log(oerror)
                        }
                    });
                } else {
                    var oDataModel = this.getOwnerComponent().getModel("fourthModel");
                    var odataCall = "/ZLIFING4Set";
                    var that = this;
                    this.bStructure = false;

                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            // new sap.ui.model.Filter({
                            //     path: 'IMatnr',
                            //     operator: sap.ui.model.FilterOperator.EQ,
                            //     value1: matSelected
                            // }),
                            new sap.ui.model.Filter({
                                path: 'ISernr',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: matSelected
                            }),
                            new sap.ui.model.Filter({
                                path: 'ILgort',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: this.storageLocation
                            }),
                            new sap.ui.model.Filter({
                                path: 'IParameter',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: this.lifingParameter || 'L'
                                // value1: 'L'
                            })
                        ],
                        and: true
                    });

                    oDataModel.read(odataCall, {
                        filters: [oFilter],
                        success: function (oresponse) {
                            var oMListModel = that.getView().getModel("mList");
                            var aExisting = oMListModel.getData().root || [];
                            var aNew = oresponse.results;

                            if (aNew && aNew.length > 0) {
                                var oFirstResult = aNew[0];
                                var sReturnCode = oFirstResult.ReturnCode || oFirstResult.ERETURNCODE;
                                if (sReturnCode === "KO") {
                                    var sErrorMessage = oFirstResult.ReturnMessage || oFirstResult.ERETURNMESSAGE || "An error occurred while processing the request.";
                                    sap.m.MessageBox.error(sErrorMessage);
                                    that.getView().setBusy(false);
                                    return;
                                }
                            }

                            // Step 1: Index records by Equipment
                            const mByEquip = new Map();
                            aNew.forEach(rec => {
                                rec.children = []; // Initialize for nesting
                                mByEquip.set(rec.Equipment, rec);
                            });

                            // Step 2: Build hierarchy by linking children to parents
                            const aTopLevel = [];
                            aNew.forEach(rec => {
                                if (rec.Father) {
                                    const oParent = mByEquip.get(rec.Father);
                                    if (oParent) {
                                        oParent.children.push(rec);
                                    } else {
                                        // orphan record → treat as root
                                        aTopLevel.push(rec);
                                    }
                                } else {
                                    // No Father → root node
                                    aTopLevel.push(rec);
                                }
                            });

                            // Step 3: Remove empty children arrays to avoid ghost rows
                            function cleanTree(nodes) {
                                return nodes.map(node => {
                                    const oCleaned = { ...node };
                                    if (Array.isArray(oCleaned.children)) {
                                        if (oCleaned.children.length > 0) {
                                            oCleaned.children = cleanTree(oCleaned.children);
                                        } else {
                                            delete oCleaned.children;
                                        }
                                    }
                                    return oCleaned;
                                });
                            }



                            function remapFields(node) {

                                // const kmValue =
                                //     (node.RevisionNumber && Number(node.RevisionNumber) > 0)
                                //         ? Number(node.RevisionKm || 0)
                                //         : Number(node.Km || 0);

                                // const kmMin = Number(node.KmMin || node.min || 0);
                                // const kmMax = Number(node.KmMax || node.max || 0);

                                // const normalize = v => Number(String(v).replace(" km", "").replace(/\./g, "")) || 0;
                                const normalize = v => {
                                    if (v == null || v === "") return 0;

                                    // remove unit + trim, keep decimal separator
                                    const s = String(v)
                                        .replace(/ km/i, "")
                                        .trim()
                                        .replace(",", ".");   // if backend ever sends "400,00"

                                    return Number(s) || 0;
                                };

                                const kmValue = normalize(
                                    node.RevisionNumber > 0 ? node.RevisionKm : node.Km
                                );

                                const kmMin = normalize(node.KmMin || node.min);
                                const kmMax = normalize(node.KmMax || node.max);


                                // --- traffic light logic ---
                                // let traffic = "G"; // default

                                // if (kmValue < kmMin) {
                                //     traffic = "G"; // Green
                                // } else if (kmValue >= kmMin && kmValue < kmMax) {
                                //     traffic = "Y"; // Yellow
                                // } else if (kmValue >= kmMax) {
                                //     traffic = "R"; // Red
                                // }

                                // let trafficIcon = "sap-icon://status-positive";
                                // let trafficColor = "Positive";

                                // if (traffic === "Y") {
                                //     trafficIcon = "sap-icon://status-critical";
                                //     trafficColor = "Critical";
                                // } else if (traffic === "R") {
                                //     trafficIcon = "sap-icon://status-negative";
                                //     trafficColor = "Negative";
                                // }
                                const kmAlert = that._getKmAlertValue();
                                const kmAfterLastRevision = normalize(node.KmRevisione);
                                const { traffic, icon: trafficIcon, color: trafficColor } =
                                    that._computeTraffic({
                                        revisionNumber: node.RevisionNumber,
                                        max: kmMax,
                                        min: kmMin,
                                        km: normalize(node.Km),
                                        revisionKm: normalize(node.RevisionKm),
                                        kmAfterLastRevision,
                                        kmAlert
                                    });
                                return {
                                    fg: node.FunctionalGroup || node.fg || "",
                                    level: node.Position || '',
                                    Equipment: node.Equipment || '',
                                    Material: node.Material || '',
                                    MaterialDescription: node.MaterialDescription || '',
                                    sNo: node.SerialNumber || "",
                                    Note: node.Note || "",
                                    KmRevisione: node.KmRevisione || '',
                                    RevisionNumber: node.RevisionNumber || '',
                                    RevisionKm: node.RevisionKm || '',
                                    min: node.KmMin || "",
                                    max: node.KmMax || "",
                                    Km: node.Km,
                                    NextRun: node.NextRun,
                                    KmNextRun: node.KmNextRun,
                                    TrafficLight: traffic,
                                    TrafficIcon: trafficIcon,       // new
                                    TrafficColor: trafficColor,
                                    Father: node.Father || node.father || "",
                                    children: node.children ? node.children.map(remapFields) : []
                                };
                            }

                            const aCleanedTree = cleanTree(aTopLevel);

                            // Step 4: Merge with existing root nodes
                            const aMerged = aExisting.concat(aCleanedTree);
                            const aRemapped = aMerged.map(remapFields);
                            // Step 5: Update the model
                            oMListModel.setData({ root: aRemapped });
                            oMListModel.updateBindings();

                            console.log("Merged Tree Data (fourthModel):", aMerged);
                        },
                        error: function (oError) {
                            that.getView().setBusy(false);
                            console.error("Error while reading ZLIFING4Set:", oError);
                        }
                    });
                }

            },

            handleUploadPress: function (oEvent) {
                var file = oEvent.getParameter("files")[0]; // Get selected file
                var sFileName = file.name;

                if (oEvent.getSource && oEvent.getSource().setValue) {
                    oEvent.getSource().setValue(sFileName);
                    this.getView().getModel("app").setProperty("/selectedFileName", sFileName);
                }

                // Check extension
                var sExtension = sFileName.split('.').pop().toLowerCase();
                var aAllowedExtensions = ["csv"];
                if (!aAllowedExtensions.includes(sExtension)) {
                    MessageToast.show("Invalid file type. Please upload a CSV file.");
                    this.getView().byId("fileUploader").clear();
                    return;
                }
                var reader = new FileReader();
                var that = this;
                var matList = [];
                var saveError = false;
                reader.onload = function (e) {
                    // var data = new Uint8Array(e.target.result);
                    // var workbook = XLSX.read(data, { type: 'array' });
                    // console.log(workbook);
                    var fileData = e.target.result; // Read file content as string
                    // Parse data based on file format (e.g., CSV, Excel) [4, 5, 7]
                    var parsedData = that.parseCSVData(fileData); // Example function
                    for (var i = 1; i < parsedData.length; i++) {
                        if (parsedData[i].length) {
                            var matData = {
                                fg: parsedData[i][0],
                                level: parsedData[i][1],
                                Material: parsedData[i][2],
                                sNo: parsedData[i][3].trim()
                            }
                            matData.children = [];
                            if (matData.level == 1) {
                                that.getView().getModel("mList").getData().root.forEach((mObject, i) => {
                                    if (mObject.level == 1) {
                                        saveError = true;
                                        MessageBox.show("Material with position 1 is already present. Please change the position");
                                    }
                                });
                            }
                            if (!saveError) {
                                matList.push(matData);
                                //For grouping and sorting
                                if (typeof that.mGroupData[matData.fg] === "undefined") {
                                    that.mGroupData[matData.fg] = [];
                                    that.mGroupData[matData.fg].push(matData);
                                    that.mGroupData[matData.fg].sort((a, b) => a.level - b.level);
                                } else {
                                    that.mGroupData[matData.fg].push(matData);
                                    that.mGroupData[matData.fg].sort((a, b) => a.level - b.level);
                                }
                            }
                        }
                    }
                    if (!saveError) {
                        var mergedData = [...that.getView().getModel("mList").getData().root, ...matList];
                        that.onMatCheck(mergedData);
                        that.getView().getModel("mList").getData().root = mergedData;
                        that.getView().getModel("mList").updateBindings();
                        // that.getView().getModel("mList").setData(matList);
                        that.sortTableData();
                        // that.getView().byId("fileUploader").setValue();
                        // // Create a JSON model and set data
                        // var oModel = new sap.ui.model.json.JSONModel(parsedData);
                        // that.getView().setModel(oModel); [3, 6, 8]
                    }
                }
                reader.readAsText(file);
                // that.getView().byId("fileUploader").setValue();
            },

            parseCSVData: function (csvString) {
                var rows = csvString.split("\n");
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].length) {
                        data.push(rows[i].split(","));
                    }
                }
                return data;
            },

            // onFgSelect: function(oEvent){
            //     var fgValue = oEvent.getSource().getValue();
            //     var levelCount = 2;
            //     for(var i in this.oTable.getItems()) {
            //         if(this.oTable.getItems()[i].getBindingContext("mList").getObject().fg == fgValue){
            //             levelCount ++;
            //         }
            //     }
            //     this.getView().getModel("material").setProperty("/level",levelCount);
            // },

            OnAddMaterial: function (oEvent) {
                // var oTable =  this.getView().byId("idscratchCreateTable");
                if (!this.getView().byId("idscratchCreateTable").getBinding("rows").getLength()) {
                    var oMaterialModel = new sap.ui.model.json.JSONModel({
                        level: 1,
                        fg: "",
                        Material: ""
                    });
                } else {
                    var oMaterialModel = new sap.ui.model.json.JSONModel({
                        level: "",
                        fg: "",
                        Material: ""
                    });
                }
                this.getView().setModel(oMaterialModel, "material");
                // create a fragment with dialog, and pass the selected data
                var oView = this.getView();
                if (!this._oDialog) {
                    Fragment.load({
                        id: oView.getId(),  // Ensure unique ID
                        name: "com.piaggio.sap.lifing.lifing.view.AddMaterial", // Fragment path
                        controller: this // Bind the controller
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog); // Add dialog to view
                        if (!this.getView().byId("idscratchCreateTable").getBinding("rows").getLength()) {
                            this.byId("idFgrp").setEnabled(false);
                            this.byId("idLevel").setEnabled(false);
                        } else {
                            this.byId("idFgrp").setEnabled(true);
                            this.byId("idLevel").setEnabled(true);
                        }
                        this._oDialog = oDialog; // Store for reuse
                        this._oDialog.open(); // Open dialog
                    }.bind(this));
                } else {
                    if (!this.getView().byId("idscratchCreateTable").getBinding("rows").getLength()) {
                        this.byId("idFgrp").setEnabled(false);
                        this.byId("idLevel").setEnabled(false);
                    } else {
                        this.byId("idFgrp").setEnabled(true);
                        this.byId("idLevel").setEnabled(true);
                    }
                    this._oDialog.open();
                }
            },

            // OnDeleteMaterial: function (oEvent) {
            //     // var oTable =  this.getView().byId("idscratchCreateTable");
            //     var dMatList = this.oTable.getSelectedIndices();
            //     var delConfirm = true;
            //     var that = this;
            //     for (var i in dMatList) {
            //         if (this.oTable.getContextByIndex(dMatList[i]).getPath()?.includes("children")) {
            //             var parentPath = this.oTable.getContextByIndex(dMatList[i]).getPath().split("children")[0];
            //             var childIndex = this.oTable.getContextByIndex(dMatList[i]).getPath().split("/").pop();
            //             this.getView().getModel("mList").getProperty(parentPath).children.splice(childIndex, 1);
            //             this.getView().getModel("mList").updateBindings();
            //         }
            //         else if (this.oTable.getContextByIndex(dMatList[i]).getObject().children.length) {
            //             MessageBox.confirm("Selected Item has children material, would you like to delete including children", {
            //                 title: "Delete Confirmation",
            //                 actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            //                 onClose: function (sButton) {
            //                     if (sButton === MessageBox.Action.YES) {
            //                         var parentPath = "/" + this.oTable.getContextByIndex(dMatList[i]).getPath().split("/")[1];
            //                         var childIndex = this.oTable.getContextByIndex(dMatList[i]).getPath().split("/").pop();
            //                         this.getView().getModel("mList").getProperty(parentPath).splice(childIndex, 1);
            //                         this.getView().getModel("mList").updateBindings();
            //                     } else if (sButton === MessageBox.Action.NO) {
            //                         delConfirm = false;
            //                     }
            //                 }.bind(this)
            //             });
            //         } else {
            //             var parentPath = "/" + this.oTable.getContextByIndex(dMatList[i]).getPath().split("/")[1];
            //             var childIndex = this.oTable.getContextByIndex(dMatList[i]).getPath().split("/").pop();
            //             var groupRemoveIndex = this.mGroupData[this.oTable.getContextByIndex(dMatList[i]).getObject().fg].findIndex((obj) => obj.Material == this.oTable.getContextByIndex(dMatList[i]).getObject().Material && obj.level == this.oTable.getContextByIndex(dMatList[i]).getObject().level);
            //             this.mGroupData[this.oTable.getContextByIndex(dMatList[i]).getObject().fg].splice(groupRemoveIndex, 1);
            //             this.getView().getModel("mList").getProperty(parentPath).splice(childIndex, 1);
            //             this.getView().getModel("mList").updateBindings();
            //         }
            //     }
            //     this.oTable.clearSelection();
            //     this.oTable.fireRowSelectionChange();
            // },

            OnDeleteMaterial: function (oEvent) {
                var dMatList = this.oTable.getSelectedIndices();
                dMatList.sort((a, b) => b - a);
                var that = this;

                if (!dMatList.length) {
                    return;
                }

                for (let rowIndex of dMatList) {
                    let oContext = this.oTable.getContextByIndex(rowIndex);
                    if (!oContext) continue; // safety net

                    let sPath = oContext.getPath();
                    let oObj = oContext.getObject();

                    // Check if Equipment is part of a structure
                    // if ((sPath.includes("children") || oObj.Father)) {
                    if ((sPath.includes("children"))) {
                        MessageBox.error("It is not possible to delete an Equipment that is part of a structure");
                        this.oTable.clearSelection();
                        this.oTable.fireRowSelectionChange();
                        return;
                    }
                }

                for (let rowIndex of dMatList) {
                    let oContext = this.oTable.getContextByIndex(rowIndex);
                    if (!oContext) continue; // safety net

                    let sPath = oContext.getPath();
                    let oObj = oContext.getObject();

                    // Case 1: It’s a child (path contains "children")
                    if (sPath.includes("children")) {
                        var parentPath = sPath.split("children")[0];
                        var childIndex = sPath.split("/").pop();
                        var aParent = this.getView().getModel("mList").getProperty(parentPath).children;
                        aParent.splice(childIndex, 1);
                        this.getView().getModel("mList").updateBindings();
                    }

                    // Case 2: Parent node WITH children → ask before deleting
                    else if (oObj.children && oObj.children.length) {
                        MessageBox.confirm(
                            "Selected Item has children material, would you like to delete including children?",
                            {
                                title: "Delete Confirmation",
                                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                onClose: function (sButton) {
                                    if (sButton === sap.m.MessageBox.Action.YES) {
                                        var parentPath = "/" + sPath.split("/")[1]; // root array path
                                        var childIndex = sPath.split("/").pop();
                                        var aRoot = that.getView().getModel("mList").getProperty(parentPath);
                                        aRoot.splice(childIndex, 1);
                                        that.getView().getModel("mList").updateBindings();
                                        var aRootAfterDelete = that.getView().getModel("mList").getData().root;
                                        if (!aRootAfterDelete || aRootAfterDelete.length === 0) {
                                            that.getView().byId("_IDGenComboBox1").setEnabled(true);
                                        }
                                    }
                                }
                            }
                        );
                    }

                    // Case 3: Parent node WITHOUT children → simple delete
                    else {
                        var parentPath = "/" + sPath.split("/")[1]; // "/root"
                        var childIndex = sPath.split("/").pop();

                        // also remove from mGroupData if applicable
                        if (oObj.fg && that.mGroupData[oObj.fg]) {
                            var groupRemoveIndex = that.mGroupData[oObj.fg].findIndex(
                                (obj) =>
                                    obj.Material === oObj.Material &&
                                    obj.level === oObj.level
                            );
                            if (groupRemoveIndex > -1) {
                                that.mGroupData[oObj.fg].splice(groupRemoveIndex, 1);
                            }
                        }

                        var aRoot = that.getView().getModel("mList").getProperty(parentPath);
                        aRoot.splice(childIndex, 1);
                        that.getView().getModel("mList").updateBindings();
                    }
                }

                // Cleanup selection
                this.oTable.clearSelection();
                this.oTable.fireRowSelectionChange();

                var aRoot = this.getView().getModel("mList").getData().root;
                if (!aRoot || aRoot.length === 0) {
                    this.getView().byId("_IDGenComboBox1").setEnabled(true);
                }
            },

            _getKmAlertValue: function () {
                const v = parseInt(this.getView().getModel("app")?.getProperty("/kmAlert"), 10);
                return Number.isFinite(v) && v > 0 ? v : 500;
            },


            materialCheck: function (matData) {
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel();
                var odataCall = "/ZLIFING1SET";
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'IPARAMETER',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "S"
                        }),
                        new sap.ui.model.Filter({
                            path: 'IMATNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: matData.Material
                        }),
                        new sap.ui.model.Filter({
                            path: 'ISTORLOCATION',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.storageLocation
                        })
                    ],
                    and: true
                });
                oDataModel.read(odataCall, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        if (oresponse.results[0].ERETURNCODE == "OK") {
                            var ind = that.getView().getModel("mList").getData().root.length - 1;
                            // var ind = Math.max(0, that.getView().getModel("mList").getData().root.length - 1);
                            that.getView().getModel("mList").getData().root[ind].MaterialDescription = oresponse.results[0].EMATDESC;
                            that.getView().getModel("mList").getData().root[ind].sNo = "";
                            // that.getView().getModel("mList").getData().root[ind].isNo = that.getView().getModel("mList").getData().root[ind].isNo ? that.getView().getModel("mList").getData().root[ind].isNo : "";
                            that.getView().getModel("mList").getData().root[ind].km = that.getView().getModel("mList").getData().root[ind].km ? that.getView().getModel("mList").getData().root[ind].km : "";
                            that.getView().getModel("mList").getData().root[ind].Revisione = oresponse.results[0].EKMREVISION;
                            that.getView().getModel("mList").getData().root[ind].min = oresponse.results[0].EKMMIN;
                            that.getView().getModel("mList").getData().root[ind].max = oresponse.results[0].EKMMAX;
                            that.getView().getModel("mList").updateBindings();
                            // var oData = that.getView().getModel("mList").getData();
                            // var oMListModel = that.getView().getModel("mList");
                            // var existingIndex = oData.root.findIndex(obj => obj.Material === matData.Material);
                            //                 if (existingIndex === -1) {
                            //                     oData.root.push(matData);
                            //                     existingIndex = oData.root.length - 1;
                            //                 }
                            //                 var oTarget = oData.root[existingIndex];
                            //                             //  var oTarget = oData.root[ind];
                            //         oTarget.MaterialDescription = oresponse.results[0].EMATDESC;
                            //         oTarget.sNo = "";
                            //         oTarget.km = oTarget.km || "";
                            //         oTarget.Revisione = oresponse.results[0].EKMREVISION;
                            //         oTarget.min = oresponse.results[0].EKMMIN;
                            //         oTarget.max = oresponse.results[0].EKMMAX;

                            //         //Re-set the root to trigger model refresh
                            //         oMListModel.setProperty("/root", oData.root);

                            that.oTable.clearSelection();
                            that.oTable.fireRowSelectionChange();
                            // that.sortTableData();
                        } else if (oresponse.results[0].ERETURNCODE == "KO") {
                            MessageBox.show(oresponse.results[0].ERETURNMESSAGE);
                            var oMListModel = that.getView().getModel("mList");
                            var oData = oMListModel.getData();
                            var idx = oData.root.findIndex(obj =>
                                obj.Material === matData.Material && obj.level === matData.level
                            );
                            if (idx > -1) {
                                oData.root.splice(idx, 1);
                                oMListModel.setProperty("/root", oData.root);
                                oMListModel.updateBindings();

                                for (const fgKey in that.mGroupData) {
                                    if (Array.isArray(that.mGroupData[fgKey])) {
                                        const grpIdx = that.mGroupData[fgKey].findIndex(
                                            (obj) => obj.Material === matData.Material
                                        );
                                        if (grpIdx > -1) {
                                            console.log(`Removed stale Material ${matData.Material} from mGroupData group ${fgKey}`);
                                            that.mGroupData[fgKey].splice(grpIdx, 1);
                                        }
                                    }
                                }


                            }
                        }
                    },
                    error: function (oerror) {
                        console.log(oerror)
                    }
                });

            },

            _flattenRows: function (aNodes, aFlat = []) {
                aNodes.forEach(n => {
                    aFlat.push(n);
                    if (n.children && n.children.length) {
                        this._flattenRows(n.children, aFlat);
                    }
                });
                return aFlat;
            },

            _updateNodeRecursive: function (nodeList, equipment, backend) {
                if (!nodeList) return;

                nodeList.forEach(node => {

                    if (node.Equipment === equipment) {
                        if (!backend || backend.ERETURNCODE === "KO") {
                            node.fb = "KO";
                            node.fbMessage = backend?.ERETURNMESSAGE || "Service error";
                        } else {
                            node.RevisionNumber = backend.ERevisionNo;
                            node.RevisionKm = backend.ERevisionKm;
                            node.fb = "OK";
                            node.fbMessage = "";
                        }
                    }


                    if (node.children && node.children.length > 0) {
                        this._updateNodeRecursive(node.children, equipment, backend);
                    }
                });
            },



            onSaveNewRun: function () {
                // var oTable =  this.getView().byId("idscratchCreateTable");
                // console.log(this.getView().getModel("mList").getData().root);
                var aAllRows = this.getView().getModel("mList").getData().root;
                const aRows = this._flattenRows(aAllRows);
                var oDataModel = this.getOwnerComponent().getModel("sixthModel");

                const aRequests = aRows.map(row => {

                    const eq = row.Equipment || "";
                    const nr = row.NextRun || "";

                    return new Promise(resolve => {
                        const sKey =
                            "/RUN_CONFIRMSet(IEquipment='" +
                            encodeURIComponent(eq) +
                            "',INextrun='" +
                            encodeURIComponent(nr) +
                            "')";

                        oDataModel.read(sKey, {
                            success: oResp => resolve({ row, data: oResp }),
                            error: () => resolve({ row, data: null, error: true })
                        });
                    });


                });

                Promise.all(aRequests).then((results) => {

                    // const aAllRows = this._flattenRows(this.getView().getModel("mList").getData().root);
                    const oData = this.getView().getModel("mList").getData();
                    results.forEach(res => {
                        // if (!res || !res.row) return;


                        const oRow = aAllRows.find(r => r.Equipment === res.row.Equipment);

                        // if (!oRow) return;

                        // if (res.error) {
                        //     oRow.fb = "KO";
                        //     oRow.fbMessage = "Service error";
                        // }
                        // else if (res.data) {

                        //     oRow.RevisionNumber = res.data.ERevisionNo;
                        //     oRow.RevisionKm = res.data.ERevisionKm;
                        //     oRow.fb = "OK";
                        //     oRow.fbMessage = "";
                        // } 

                        const equipment = res?.row?.Equipment;
                        const backend = res?.data;

                        if (!equipment) return;

                        // Call simple recursive updater
                        this._updateNodeRecursive(oData.root, equipment, backend);
                    });


                    this.getView().getModel("mList").updateBindings();
                    const aRoot = this.getView().getModel("mList").getData().root;
                    if (aRoot.length > 0) {
                        // const sSerial = aRoot[0].sNo;
                        const sSerial = aRoot[0].sNo;
                        this.byId("_IDGenSearchField").setValue(sSerial);

                        this.getView().getModel("mList").setData({ root: [] });
                        this.getView().getModel("mList").updateBindings();

                        this.byId("_IDGenSearchField").fireSearch({ query: sSerial });

                        // this.onSearch({
                        //     query: sSerial,
                        //     getSource: () => null
                        // });
                    }
                });

                // var oFirstRow = this.getView().getModel("mList").getData().root[0];
                // var sSerial = oFirstRow?.sNo || "";
                // this.onSearch({
                //     getSource: () => ({
                //         getValue: () => sSerial
                //     })
                // });

            },


            // onMaterialCheck: function (matList) {
            //     // var oTable =  this.getView().byId("idscratchCreateTable");
            //     var aRequests = [];
            //     for (var i in matList) {
            //         // var oMatObj =sMatList[i].getBindingContext("mList").getObject()
            //         var that = this;
            //         var oDataModel = this.getOwnerComponent().getModel();
            //         // var index = this.oTable.getSelectedIndices()[i];
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
            //                     value1: matList[i].Material
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ISTORLOCATION',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: this.storageLocation
            //                 })
            //             ],
            //             and: true
            //         })
            //         //   if(!sMatList.getContextByIndex(index).getObject().Description){
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
            //         //   }
            //     }

            //     // Execute all OData reads in parallel
            //     var mListData = this.getView().getModel("mList").getData().root;
            //     var saveErr = false;
            //     Promise.all(aRequests).then((aResponses) => {
            //         aResponses.forEach((aData, index) => {
            //             if (aData.ERETURNCODE == "OK") {
            //                 // var ind = that.getView().getModel("mList").getData().root.findIndex(mat => mat.Material == aData.IMATNR && mat.level == aData.ELEVEL);
            //                 that.getView().getModel("mList").getData().root[index].Description = aData.EMATDESC;
            //                 //that.getView().getModel("mList").getData().root[index].sNo = "";
            //                 // that.getView().getModel("mList").getData().root[index].isNo = that.getView().getModel("mList").getData().root[index].isNo ? that.getView().getModel("mList").getData().root[index].isNo : "";
            //                 that.getView().getModel("mList").getData().root[index].km = that.getView().getModel("mList").getData().root[index].km ? that.getView().getModel("mList").getData().root[index].km : "";
            //                 that.getView().getModel("mList").getData().root[index].Revisione = aData.EKMREVISION;
            //                 that.getView().getModel("mList").getData().root[index].min = aData.EKMMIN;
            //                 that.getView().getModel("mList").getData().root[index].max = aData.EKMMAX;
            //             } else if (aData.ERETURNCODE == "KO") {
            //                 saveErr = true;
            //             }
            //         });
            //         that.getView().getModel("mList").updateBindings();
            //         that.oTable.clearSelection();
            //         that.oTable.fireRowSelectionChange();
            //         that.getView().setBusy(false);
            //     }).catch((oError) => {
            //         console.error("Error loading data:", oError);
            //     });
            //     if (saveErr) MessageBox.show("One or more of the selected materials check failed");

            // },

            onMatCheck: function (matList) {
                var aRequests = [];
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel();
                var oMListModel = that.getView().getModel("mList");
                var oData = oMListModel.getData();
                // Set view to busy while waiting for backend calls
                that.getView().setBusy(true);

                for (var i in matList) {
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: 'IPARAMETER',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: "S"
                            }),
                            new sap.ui.model.Filter({
                                path: 'IMATNR',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: matList[i].Material
                            }),
                            new sap.ui.model.Filter({
                                path: 'ISTORLOCATION',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: this.storageLocation
                            })
                        ],
                        and: true
                    });

                    var oRequest = new Promise((resolve, reject) => {
                        oDataModel.read("/ZLIFING1SET", {
                            filters: [oFilter],
                            success: function (oresponse) {
                                resolve(oresponse.results[0]);
                            },
                            error: function (oerror) {
                                // It's important to resolve with an error object here
                                // so Promise.all doesn't fail on the first error
                                resolve({ ERETURNCODE: "KO", EMESSAGE: "Network or server error" });
                            }
                        });
                    });
                    aRequests.push(oRequest);
                }

                var saveErr = false;
                Promise.all(aRequests).then((aResponses) => {
                    // aResponses.forEach((aData, index) => {
                    //     let materialData = that.getView().getModel("mList").getData().root[index];
                    //     if (aData.ERETURNCODE === "OK") {
                    //         // Update with successful data
                    //         materialData.MaterialDescription = aData.EMATDESC;
                    //         materialData.Revisione = aData.EKMREVISION;
                    //         materialData.min = aData.EKMMIN;
                    //         materialData.max = aData.EKMMAX;
                    //         materialData.fb = "OK";
                    //         materialData.fbMessage = "";
                    //     } else if (aData.ERETURNCODE === "KO") {
                    //         saveErr = true;
                    //         // Update with error feedback
                    //         materialData.fb = "KO";
                    //         materialData.fbMessage = aData.ERETURNMESSAGE || "Material check failed."; // Use the message from the backend, or a default
                    //     }
                    // });
                    aResponses.forEach((aData) => {
                        oData.root.forEach((row, idx) => {
                            if (row.Material === aData.IMATNR) {
                                if (aData.ERETURNCODE === "OK") {

                                    row.MaterialDescription = aData.EMATDESC;
                                    row.Revisione = aData.EKMREVISION;
                                    row.min = aData.EKMMIN;
                                    row.max = aData.EKMMAX;
                                    row.fb = "OK";
                                    row.fbMessage = "";
                                } else if (aData.ERETURNCODE === "KO") {

                                    row.fb = "KO";
                                    row.fbMessage = aData.ERETURNMESSAGE || "Material validation failed.";

                                    // Remove the failed row from model
                                    // oData.root.splice(idx, 1);
                                }
                            }
                        });
                    });

                    that.getView().getModel("mList").updateBindings();
                    that.oTable.clearSelection();
                    that.oTable.fireRowSelectionChange();
                    that.getView().setBusy(false);

                    if (saveErr) {
                        sap.m.MessageBox.show("One or more of the selected materials check failed");
                    }
                }).catch((oError) => {
                    console.error("Error loading data:", oError);
                    that.getView().setBusy(false);
                });
            },

            onMaterialCheck: function (matList) {
                var aRequests = [];
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel();
                // var oMListModel = that.getView().getModel("mList");
                // var oData = oMListModel.getData();
                // Set view to busy while waiting for backend calls
                that.getView().setBusy(true);

                for (var i in matList) {
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: 'IPARAMETER',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: "S"
                            }),
                            new sap.ui.model.Filter({
                                path: 'IMATNR',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: matList[i].Material
                            }),
                            new sap.ui.model.Filter({
                                path: 'ISTORLOCATION',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: this.storageLocation
                            })
                        ],
                        and: true
                    });

                    var oRequest = new Promise((resolve, reject) => {
                        oDataModel.read("/ZLIFING1SET", {
                            filters: [oFilter],
                            success: function (oresponse) {
                                resolve(oresponse.results[0]);
                            },
                            error: function (oerror) {
                                // It's important to resolve with an error object here
                                // so Promise.all doesn't fail on the first error
                                resolve({ ERETURNCODE: "KO", EMESSAGE: "Network or server error" });
                            }
                        });
                    });
                    aRequests.push(oRequest);
                }

                var saveErr = false;
                Promise.all(aRequests).then((aResponses) => {
                    aResponses.forEach((aData, index) => {
                        let materialData = that.getView().getModel("mList").getData().root[index];
                        if (aData.ERETURNCODE === "OK") {
                            // Update with successful data
                            materialData.MaterialDescription = aData.EMATDESC;
                            materialData.Revisione = aData.EKMREVISION;
                            materialData.min = aData.EKMMIN;
                            materialData.max = aData.EKMMAX;
                            materialData.fb = "OK";
                            materialData.fbMessage = "";
                        } else if (aData.ERETURNCODE === "KO") {
                            saveErr = true;
                            // Update with error feedback
                            materialData.fb = "KO";
                            materialData.fbMessage = aData.ERETURNMESSAGE || "Material check failed."; // Use the message from the backend, or a default
                        }
                    });

                    that.getView().getModel("mList").updateBindings();
                    that.oTable.clearSelection();
                    that.oTable.fireRowSelectionChange();
                    that.getView().setBusy(false);

                    if (saveErr) {
                        sap.m.MessageBox.show("One or more of the selected materials check failed");
                    }
                }).catch((oError) => {
                    console.error("Error loading data:", oError);
                    that.getView().setBusy(false);
                });
            },

            // onEquipmentCreation: function (oEvent) {
            //     var sMatList = this.oTable.getBinding("rows");
            //     var aRequests = [];
            //     this.getView().setBusy(true);
            //     // this.getView().byId("_IDGenButtonsave").setEnabled(true);     
            //     // var that = this;         
            //     for (var i in this.oTable.getSelectedIndices()) {
            //         // var oMatObj =sMatList[i].getBindingContext("mList").getObject()
            //         var index = this.oTable.getSelectedIndices()[i];
            //         var oRow = sMatList.getContextByIndex(index)?.getObject();
            //         var that = this;
            //         var oDataModel = this.getOwnerComponent().getModel("secondModel");
            //         var serNum = sMatList.getContextByIndex(index).getObject().sNo;
            //         if (sMatList.getContextByIndex(index).getObject().MaterialDescription.trim() == "") {
            //             return;
            //         }
            //         if (!oRow.level || String(oRow.level).trim() === "") {
            //             this.getView().setBusy(false);
            //             sap.m.MessageBox.error("Position is missing for one or more records.");
            //             return;
            //         }
            //         var oFilter = new sap.ui.model.Filter({
            //             filters: [
            //                 new sap.ui.model.Filter({
            //                     path: 'IMATNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: sMatList.getContextByIndex(index).getObject().Material
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'IINVNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: (() => {
            //                         const kmVal = sMatList.getContextByIndex(index).getObject().Note;
            //                         // return (kmVal === undefined || kmVal === null || String(kmVal).trim() === "") ? null : kmVal;
            //                         return (kmVal === undefined || kmVal === null || String(kmVal).trim() === "")
            //                             ? ""
            //                             : kmVal;
            //                     })()
            //                     // value1: sMatList.getContextByIndex(index).getObject().km
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'IGROES',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: sMatList.getContextByIndex(index).getObject().level
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ISERNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: serNum
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ITIDNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: sMatList.getContextByIndex(index).getObject().fg
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ILAGER',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: this.storageLocation
            //                 }),
            //             ],
            //             and: true
            //         })
            //         // var oObj = sMatList.getContextByIndex(index).getObject();
            //         // var sEquip = oObj?.equipment;   // may be undefined
            //         // if (sEquip && sEquip !== "") {
            //         if (sMatList.getContextByIndex(index)?.getObject()?.Equipment !== "" && sMatList.getContextByIndex(index)?.getObject()?.Equipment !== undefined) {
            //             MessageBox.show("Equipment already exists");
            //         } else {
            //             var odataCall = "/ZLIFING2SET";
            //             var oRequest = new Promise((resolve, reject) => {
            //                 oDataModel.read(odataCall, {
            //                     filters: [oFilter],
            //                     success: function (oresponse) {
            //                         resolve(oresponse.results[0]);
            //                     },
            //                     error: function (oerror) {
            //                         console.log(oerror)
            //                     }
            //                 });
            //             });
            //             aRequests.push(oRequest);
            //         }
            //     }
            //     // Execute all OData reads in parallel
            //     var mListData = this.getView().getModel("mList").getData();
            //     var saveErr = false;
            //     Promise.all(aRequests).then((aResponses) => {
            //         aResponses.forEach((aData, index) => {
            //             // var ind = that.oTable.getSelectedIndices()[index];
            //             // var oRoot = that.getView().getModel("mList").getData().root[ind];
            //             var ctx = sMatList.getContextByIndex(that.oTable.getSelectedIndices()[index]);
            //             var oRow = ctx.getObject();

            //             if (aData.ERETURNCODE == "OK") {
            //                 /* var ind = that.oTable.getSelectedIndices()[index];
            //                  that.getView().getModel("mList").getData().root[ind].Equipment = aData.EEQUIPMENT;
            //                  that.getView().getModel("mList").getData().root[ind].km = aData.IINVNR;
            //                  that.getView().getModel("mList").getData().root[ind].level = aData.IGROES;
            //                  that.getView().getModel("mList").getData().root[ind].sNo = aData.ISERNR;
            //                  that.getView().getModel("mList").updateBindings(); */
            //                 // //that.getView().byId("_IDGenColumnec").setVisible(true);
            //                 oRow.Equipment = aData.EEQUIPMENT;
            //                 // oRoot.km = aData.IINVNR;
            //                 oRow.Note = aData.IINVNR;
            //                 oRow.level = aData.IGROES;
            //                 oRow.sNo = aData.ISERNR;
            //                 oRow.fb = "OK";
            //                 oRow.fbMessage = aData.ERETURNMESSAGE;
            //             }
            //             else if (aData.ERETURNCODE == "KO") {
            //                 saveErr = true;
            //                 oRow.fb = "KO";
            //                 oRow.fbMessage = aData.ERETURNMESSAGE || "Equipment creation failed.";
            //             }
            //         });
            //         that.getView().getModel("mList").updateBindings();
            //         that.oTable.clearSelection();
            //         that.oTable.fireRowSelectionChange();
            //         that.getView().setBusy(false);
            //     }).catch((oError) => {
            //         console.error("Error loading data:", oError);
            //     });
            //     if (saveErr) MessageBox.show("Equipment creation failed for one or more materials");
            // },

            // onEquipmentCreation: function (oEvent) {
            //     var sMatList = this.oTable.getBinding("rows");
            //     var aRequests = [];
            //     this.getView().setBusy(true);
            //     var that = this;
            //     var oDataModel = this.getOwnerComponent().getModel("secondModel");

            //     // Temporarily disable batching to force separate network calls
            //     oDataModel.setUseBatch(false);

            //     var aSelectedIndices = this.oTable.getSelectedIndices();

            //     console.log("Total selected records:", aSelectedIndices.length);

            //     // Store the actual data objects with their paths
            //     var aSelectedRows = [];

            //     for (var i = 0; i < aSelectedIndices.length; i++) {
            //         var index = aSelectedIndices[i];
            //         var oContext = sMatList.getContextByIndex(index);

            //         if (!oContext) {
            //             console.log("No context for index:", index);
            //             continue;
            //         }

            //         var oRow = oContext.getObject();
            //         var sPath = oContext.getPath(); // Get the binding path

            //         console.log("Processing row", i + 1, "- Table Index:", index, "Path:", sPath, "Material:", oRow.Material);

            //         // Check for empty MaterialDescription
            //         if (oRow.MaterialDescription.trim() === "") {
            //             this.getView().setBusy(false);
            //             oDataModel.setUseBatch(true);
            //             sap.m.MessageBox.error("Material Description is missing for one or more records.");
            //             return;
            //         }

            //         // Check for missing level
            //         if (!oRow.level || String(oRow.level).trim() === "") {
            //             this.getView().setBusy(false);
            //             oDataModel.setUseBatch(true);
            //             sap.m.MessageBox.error("Position is missing for one or more records.");
            //             return;
            //         }

            //         // Check if Equipment already exists
            //         if (oRow.Equipment && oRow.Equipment !== "") {
            //             this.getView().setBusy(false);
            //             oDataModel.setUseBatch(true);
            //             sap.m.MessageBox.show("Equipment already exists for material: " + oRow.Material);
            //             return;
            //         }

            //         // Store the row info
            //         aSelectedRows.push({
            //             tableIndex: index,
            //             path: sPath,
            //             data: oRow
            //         });

            //         // Build filters
            //         var noteValue = (oRow.Note === undefined || oRow.Note === null || String(oRow.Note).trim() === "") ? "" : oRow.Note;

            //         var oFilter = new sap.ui.model.Filter({
            //             filters: [
            //                 new sap.ui.model.Filter({
            //                     path: 'IMATNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: oRow.Material
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'IINVNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: noteValue
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'IGROES',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: oRow.level
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ISERNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: oRow.sNo
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ITIDNR',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: oRow.fg
            //                 }),
            //                 new sap.ui.model.Filter({
            //                     path: 'ILAGER',
            //                     operator: sap.ui.model.FilterOperator.EQ,
            //                     value1: this.storageLocation
            //                 }),
            //             ],
            //             and: true
            //         });

            //         console.log("Creating request", i + 1, "with filters:", {
            //             Material: oRow.Material,
            //             Note: noteValue,
            //             Level: oRow.level,
            //             SerialNo: oRow.sNo,
            //             FG: oRow.fg,
            //             Storage: this.storageLocation
            //         });

            //         var odataCall = "/ZLIFING2SET";

            //         // Create promise with closure to capture current index
            //         (function (requestIndex, rowInfo) {
            //             var oRequest = new Promise((resolve, reject) => {
            //                 console.log("Starting OData call", requestIndex + 1, "for path:", rowInfo.path);

            //                 oDataModel.read(odataCall, {
            //                     filters: [oFilter],
            //                     success: function (oresponse) {
            //                         console.log("OData SUCCESS for request", requestIndex + 1, "Path:", rowInfo.path, "Response:", oresponse);
            //                         resolve({
            //                             requestIndex: requestIndex,
            //                             rowInfo: rowInfo,
            //                             data: oresponse.results && oresponse.results.length > 0
            //                                 ? oresponse.results[0]
            //                                 : { ERETURNCODE: "KO", ERETURNMESSAGE: "No data returned" }
            //                         });
            //                     },
            //                     error: function (oerror) {
            //                         console.error("OData ERROR for request", requestIndex + 1, "Path:", rowInfo.path, oerror);
            //                         resolve({
            //                             requestIndex: requestIndex,
            //                             rowInfo: rowInfo,
            //                             data: { ERETURNCODE: "KO", ERETURNMESSAGE: "Network or server error: " + (oerror.message || "") }
            //                         });
            //                     }
            //                 });
            //             });
            //             aRequests.push(oRequest);
            //         })(i, aSelectedRows[i]);
            //     }

            //     console.log("Total requests created:", aRequests.length);

            //     // Check if any requests were created
            //     if (aRequests.length === 0) {
            //         this.getView().setBusy(false);
            //         oDataModel.setUseBatch(true);
            //         return;
            //     }

            //     // Execute all OData reads in parallel
            //     var saveErr = false;
            //     var mListModel = this.getView().getModel("mList");

            //     Promise.all(aRequests).then((aResponses) => {
            //         console.log("All promises resolved. Total responses:", aResponses.length);

            //         aResponses.forEach((oResponse, idx) => {
            //             console.log("Processing response", idx + 1, "for path:", oResponse.rowInfo.path);

            //             var rowInfo = oResponse.rowInfo;
            //             var aData = oResponse.data;

            //             console.log("Response data:", aData);

            //             if (aData.ERETURNCODE === "OK") {
            //                 console.log("Success - Equipment:", aData.EEQUIPMENT);

            //                 // Update using the model's setProperty method with the path
            //                 mListModel.setProperty(rowInfo.path + "/Equipment", aData.EEQUIPMENT);
            //                 mListModel.setProperty(rowInfo.path + "/Note", aData.IINVNR);
            //                 mListModel.setProperty(rowInfo.path + "/level", aData.IGROES);
            //                 mListModel.setProperty(rowInfo.path + "/sNo", aData.ISERNR);
            //                 mListModel.setProperty(rowInfo.path + "/fb", "OK");
            //                 mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE);

            //                 console.log("Updated model at path:", rowInfo.path);
            //             }
            //             else if (aData.ERETURNCODE === "KO") {
            //                 console.log("Failure - Message:", aData.ERETURNMESSAGE);
            //                 saveErr = true;

            //                 mListModel.setProperty(rowInfo.path + "/fb", "KO");
            //                 mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE || "Equipment creation failed.");
            //             }
            //         });

            //         // Refresh the model
            //         mListModel.refresh(true);

            //         that.oTable.clearSelection();
            //         that.getView().setBusy(false);
            //         oDataModel.setUseBatch(true);

            //         if (saveErr) {
            //             sap.m.MessageBox.error("Equipment creation failed for one or more materials");
            //         } else {
            //             sap.m.MessageBox.success("Equipment created successfully for all selected materials");
            //         }

            //         console.log("Model update complete");
            //     }).catch((oError) => {
            //         console.error("Error in Promise.all:", oError);
            //         that.getView().setBusy(false);
            //         oDataModel.setUseBatch(true);
            //         sap.m.MessageBox.error("An error occurred during equipment creation");
            //     });
            // },

            onEquipmentCreation: function (oEvent) {
                var sMatList = this.oTable.getBinding("rows");
                this.getView().setBusy(true);
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel("secondModel");

                // Disable batching
                oDataModel.setUseBatch(false);

                var aSelectedIndices = this.oTable.getSelectedIndices();
                console.log("Total selected records:", aSelectedIndices.length);

                // Collect all selected rows with validation
                var aSelectedRows = [];

                for (var i = 0; i < aSelectedIndices.length; i++) {
                    var index = aSelectedIndices[i];
                    var oContext = sMatList.getContextByIndex(index);

                    if (!oContext) {
                        console.log("No context for index:", index);
                        continue;
                    }

                    var oRow = oContext.getObject();
                    var sPath = oContext.getPath();

                    // Validation checks
                    if (oRow.MaterialDescription.trim() === "") {
                        this.getView().setBusy(false);
                        oDataModel.setUseBatch(true);
                        sap.m.MessageBox.error("Material Description is missing for one or more records.");
                        return;
                    }

                    if (!oRow.level || String(oRow.level).trim() === "") {
                        this.getView().setBusy(false);
                        oDataModel.setUseBatch(true);
                        sap.m.MessageBox.error("Position is missing for one or more records.");
                        return;
                    }

                     if (!oRow.sNo || String(oRow.sNo).trim() === "") {
                        this.getView().setBusy(false);
                        oDataModel.setUseBatch(true);
                        sap.m.MessageBox.error("Serial Number is mandatory for all selected rows. Please provide Serial Number information for Material: " + (oRow.Material || "N/A"));
                        return;
                    }

                    if (oRow.Equipment && oRow.Equipment !== "") {
                        this.getView().setBusy(false);
                        oDataModel.setUseBatch(true);
                        sap.m.MessageBox.show("Equipment already exists for material: " + oRow.Material);
                        return;
                    }

                    // Store row info
                    aSelectedRows.push({
                        tableIndex: index,
                        path: sPath,
                        data: oRow
                    });

                    console.log("Row", i + 1, "- Material:", oRow.Material, "Serial:", oRow.sNo, "Path:", sPath);
                }

                if (aSelectedRows.length === 0) {
                    this.getView().setBusy(false);
                    oDataModel.setUseBatch(true);
                    return;
                }

                // Process requests SEQUENTIALLY to ensure each gets unique equipment
                this._processEquipmentSequentially(aSelectedRows, oDataModel, sMatList, 0, []);
            },

            _processEquipmentSequentially: function (aSelectedRows, oDataModel, sMatList, currentIndex, aResults) {
                var that = this;

                // Base case: all rows processed
                if (currentIndex >= aSelectedRows.length) {
                    this._handleAllEquipmentResults(aResults, oDataModel, sMatList);
                    return;
                }

                var rowInfo = aSelectedRows[currentIndex];
                var oRow = rowInfo.data;

                console.log("Processing row", currentIndex + 1, "of", aSelectedRows.length);

                // Build filters
                var noteValue = (oRow.Note === undefined || oRow.Note === null || String(oRow.Note).trim() === "") ? "" : oRow.Note;

                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'IMATNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oRow.Material
                        }),
                        new sap.ui.model.Filter({
                            path: 'IINVNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: noteValue
                        }),
                        new sap.ui.model.Filter({
                            path: 'IGROES',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oRow.level
                        }),
                        new sap.ui.model.Filter({
                            path: 'ISERNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oRow.sNo
                        }),
                        new sap.ui.model.Filter({
                            path: 'ITIDNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: oRow.fg
                        }),
                        new sap.ui.model.Filter({
                            path: 'ILAGER',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.storageLocation
                        }),
                    ],
                    and: true
                });

                var odataCall = "/ZLIFING2SET";

                // Make the OData call
                oDataModel.read(odataCall, {
                    filters: [oFilter],
                    urlParameters: {
                        "_seq": currentIndex,  // Sequential identifier
                        "_ts": new Date().getTime()  // Timestamp for uniqueness
                    },
                    success: function (oResponse) {
                        console.log("Success for row", currentIndex + 1, "Response:", oResponse);

                        var result = {
                            rowInfo: rowInfo,
                            data: oResponse.results && oResponse.results.length > 0
                                ? oResponse.results[0]
                                : { ERETURNCODE: "KO", ERETURNMESSAGE: "No data returned" }
                        };

                        aResults.push(result);

                        // Process next row after a small delay to ensure backend processes sequentially
                        setTimeout(function () {
                            that._processEquipmentSequentially(aSelectedRows, oDataModel, sMatList, currentIndex + 1, aResults);
                        }, 200);  // 200ms delay between requests
                    },
                    error: function (oError) {
                        console.error("Error for row", currentIndex + 1, oError);

                        var result = {
                            rowInfo: rowInfo,
                            data: {
                                ERETURNCODE: "KO",
                                ERETURNMESSAGE: "Network or server error: " + (oError.message || oError.statusText || "Unknown error")
                            }
                        };

                        aResults.push(result);

                        // Continue with next row even if this one failed
                        setTimeout(function () {
                            that._processEquipmentSequentially(aSelectedRows, oDataModel, sMatList, currentIndex + 1, aResults);
                        }, 200);
                    }
                });
            },

            _handleAllEquipmentResults: function (aResults, oDataModel, sMatList) {
                var that = this;
                var mListModel = this.getView().getModel("mList");
                var saveErr = false;
                var successCount = 0;
                var failCount = 0;
                var esCount = 0;
                var aESRows = [];

                console.log("All requests completed. Processing", aResults.length, "results");

                // Update all rows with results
                aResults.forEach(function (oResult, idx) {
                    var rowInfo = oResult.rowInfo;
                    var aData = oResult.data;

                    console.log("Updating row", idx + 1, "Path:", rowInfo.path);

                    if (aData.ERETURNCODE === "OK") {
                        console.log("Success - Equipment:", aData.EEQUIPMENT);
                        successCount++;

                        mListModel.setProperty(rowInfo.path + "/Equipment", aData.EEQUIPMENT);
                        mListModel.setProperty(rowInfo.path + "/Note", aData.IINVNR);
                        mListModel.setProperty(rowInfo.path + "/level", aData.IGROES);
                        mListModel.setProperty(rowInfo.path + "/sNo", aData.ISERNR);
                        mListModel.setProperty(rowInfo.path + "/fb", "OK");
                        mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE || "Equipment created successfully");
                    }
                    else if (aData.ERETURNCODE === "ES") {
                        console.log("ES Return Code - Equipment:", aData.EEQUIPMENT || rowInfo.data.Equipment);
                        esCount++;
                        successCount++;
                        // saveErr = true;
                        // failCount++;

                        // Store Equipment for LIFING7 call
                        var sEquipment = aData.EEQUIPMENT || rowInfo.data.Equipment || "";
                        aESRows.push({
                            equipment: sEquipment,
                            rowInfo: rowInfo,
                            data: aData
                        });
                        mListModel.setProperty(rowInfo.path + "/Equipment", sEquipment);
                        mListModel.setProperty(rowInfo.path + "/fb", "ES");
                        mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE || "Equipment creation returned ES code");
                    }
                    else if (aData.ERETURNCODE === "KO") {
                        console.log("Failure - Message:", aData.ERETURNMESSAGE);
                        saveErr = true;
                        failCount++;

                        mListModel.setProperty(rowInfo.path + "/fb", "KO");
                        mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE || "Equipment creation failed");
                    }
                    else {
                        // For any other return code, treat as success (not an error)
                        console.log("Other Return Code - Code:", aData.ERETURNCODE, "Message:", aData.ERETURNMESSAGE);
                        successCount++;

                        if (aData.EEQUIPMENT) {
                            mListModel.setProperty(rowInfo.path + "/Equipment", aData.EEQUIPMENT);
                        }
                        mListModel.setProperty(rowInfo.path + "/fb", aData.ERETURNCODE || "OK");
                        mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE || "Equipment creation completed");
                    }
                    // else {
                    //     console.log("Failure - Message:", aData.ERETURNMESSAGE);
                    //     saveErr = true;
                    //     failCount++;

                    //     mListModel.setProperty(rowInfo.path + "/fb", "KO");
                    //     mListModel.setProperty(rowInfo.path + "/fbMessage", aData.ERETURNMESSAGE || "Equipment creation failed");
                    // }
                });

                // Refresh model and UI
                mListModel.refresh(true);
                this.oTable.clearSelection();
                this.getView().setBusy(false);
                oDataModel.setUseBatch(true);

                if (aESRows.length > 0) {
                    console.log("Calling LIFING7 for", aESRows.length, "row(s) with ES return code");
                    this._callLIFING7ForESRows(aESRows);
                }


                // Show appropriate message
                if (failCount === 0) {
                    sap.m.MessageBox.success(
                        "Equipment created successfully for all " + successCount + " selected material(s)."
                    );
                } else if (successCount === 0) {
                    sap.m.MessageBox.error(
                        "Equipment creation failed for all " + failCount + " selected material(s)."
                    );
                } else {
                    sap.m.MessageBox.warning(
                        "Equipment creation completed with mixed results:\n" +
                        "- Success: " + successCount + "\n" +
                        "- Failed: " + failCount
                    );
                }

                console.log("Equipment creation process completed");
            },
            _callLIFING7ForESRows: function (aESRows) {
                var that = this;
                var oLIFING7Model = this.getOwnerComponent().getModel("seventhModel");
                
                // Get Storage Location from input field, use "X" if empty
                var sStorageLocation = this.storageLocation && this.storageLocation.trim() !== "" 
                    ? this.storageLocation.trim() 
                    : "X";

                // Process each ES row
                aESRows.forEach(function (oESRow, index) {
                    var sEquipment = oESRow.equipment;
                    
                    if (!sEquipment || sEquipment === "") {
                        console.warn("Skipping LIFING7 call - Equipment is empty for row", index + 1);
                        return;
                    }

                    // Build OData call for LIFING7
                    // var odataCall = "/ZLIFING7Set(IEquipment='" + sEquipment + 
                    //     "',IStoragelocation='" + sStorageLocation + "')";

                    // var odataCall = "/ZLIFING7Set(IEquipment='" + encodeURIComponent(sEquipment) + 
                    //     "',IStoragelocation='" + encodeURIComponent(sStorageLocation) + "')";

                    var oRowData = oESRow.rowInfo.data;
                    var oResponseData = oESRow.data;
                    
                    // Extract values - use response data if available, otherwise use original row data
                    var sNote = (oResponseData && oResponseData.IINVNR !== undefined) ? oResponseData.IINVNR : (oRowData.Note || "");
                    var sPosition = (oResponseData && oResponseData.IGROES !== undefined) ? oResponseData.IGROES : (oRowData.level || "");
                    var sFunctionGroup = (oResponseData && oResponseData.ITIDNR !== undefined) ? oResponseData.ITIDNR : (oRowData.fg || "");
                    var sSerialNumber = (oResponseData && oResponseData.ISERNR !== undefined) ? oResponseData.ISERNR : (oRowData.sNo || "");

                    // Build OData call for LIFING7 with all parameters
                    var odataCall = "/ZLIFING7Set(IEquipment='" + encodeURIComponent(sEquipment) +
                        "',INote='" + encodeURIComponent(sNote) +
                        "',IPosition='" + encodeURIComponent(sPosition) +
                        "',IFunctiongroup='" + encodeURIComponent(sFunctionGroup) +
                        "',ISerialNumber='" + encodeURIComponent(sSerialNumber) +
                        "',IStoragelocation='" + encodeURIComponent(sStorageLocation) + "')";



                    console.log("Calling LIFING7 for Equipment:", sEquipment, "Storage Location:", sStorageLocation);

                    // Make the OData call
                    oLIFING7Model.read(odataCall, {
                        success: function (oResponse) {
                            console.log("LIFING7 success for Equipment:", sEquipment, "Response:", oResponse);
                            // Handle success if needed (e.g., update row feedback)
                            if (oResponse.results && oResponse.results.length > 0) {
                                var oResult = oResponse.results[0];
                                if (oResult.ERETURNCODE === "OK") {
                                    console.log("LIFING7 completed successfully for Equipment:", sEquipment);
                                } else {
                                    console.warn("LIFING7 returned code:", oResult.ERETURNCODE, "for Equipment:", sEquipment);
                                }
                            }
                        },
                        error: function (oError) {
                            console.error("LIFING7 error for Equipment:", sEquipment, "Error:", oError);
                        }
                    });
                });
            },
            OnEditMaterial: function (oEvent) {
                var eMaterial = oEvent.getSource().getBindingContext("mList").getObject();
                this.edit_path = oEvent.getSource().getBindingContext("mList").getPath();
                var eMaterialModel = new sap.ui.model.json.JSONModel({
                    level: eMaterial.level,
                    fg: eMaterial.fg,
                    Material: eMaterial.Material,
                    km: eMaterial.Note,
                    sno: eMaterial.sNo
                });
                this.getView().setModel(eMaterialModel, "ematerial");
                // create a fragment with dialog, and pass the selected data
                var oView = this.getView();
                if (!this._oEditDialog) {
                    Fragment.load({
                        id: oView.getId(),  // Ensure unique ID
                        name: "com.piaggio.sap.lifing.lifing.view.EditMaterial", // Fragment path
                        controller: this // Bind the controller
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog); // Add dialog to view
                        this._oEditDialog = oDialog; // Store for reuse
                        this._oEditDialog.open(); // Open dialog
                    }.bind(this));
                } else {
                    this._oEditDialog.open();
                }
            },

            onSave: function (oEvent) {
                console.log("save button clicked");
                // var oTable =  this.getView().byId("idscratchCreateTable");
                var saveError = false;
                var matData = this.getView().getModel("material").getData();
                var oPositionInput = sap.ui.core.Fragment.byId(this.getView().getId(), "idLevel");
                var oMaterialInput = sap.ui.core.Fragment.byId(this.getView().getId(), "idMaterial");
                var oFgInput = sap.ui.core.Fragment.byId(this.getView().getId(), "idFgrp");

                // Reset previous error states
                if (oPositionInput) {
                    oPositionInput.setValueState(sap.ui.core.ValueState.None);
                    oPositionInput.setValueStateText("");
                }
                if (oMaterialInput) {
                    oMaterialInput.setValueState(sap.ui.core.ValueState.None);
                    oMaterialInput.setValueStateText("");
                }

                if (!matData.level || String(matData.level).trim() === "") {
                    if (oPositionInput) {
                        oPositionInput.setValueState(sap.ui.core.ValueState.Error);
                        oPositionInput.setValueStateText("Position is mandatory");
                    }
                    MessageBox.error("Please enter Position");
                    return; // stop execution
                }

                if (!matData.Material || matData.Material.trim() === "") {
                    if (oMaterialInput) {
                        oMaterialInput.setValueState(sap.ui.core.ValueState.Error);
                        oMaterialInput.setValueStateText("Material is mandatory");
                    }
                    MessageBox.error("Please enter Material");
                    return; // stop execution
                }
                matData.children = [];
                if (matData.level == 1) {
                    this.getView().getModel("mList").getData().root.forEach((mObject, i) => {
                        if (mObject.level == 1) {
                            saveError = true;
                            MessageBox.show("Material with position 1 is already present. Please change the position");
                        }
                    });
                }
                if (!saveError) {
                    // var oMaterials = {
                    //     root: []
                    // }
                    if (!this.mGroupData) {
                        this.mGroupData = {}; // initialize if undefined
                    }

                    // Defensive cleanup: if model root is empty, reset mGroupData
                    if (this.getView().getModel("mList").getData().root.length === 0) {
                        this.mGroupData = {};
                    }

                    // Instead of overwriting the entire model, just push to the existing array
                    var oMListModel = this.getView().getModel("mList");
                    var aRoot = oMListModel.getData().root || [];
                    aRoot.push(matData);
                    oMListModel.setProperty("/root", aRoot);
                    oMListModel.updateBindings();


                    // oMaterials.root = [...this.getView().getModel("mList").getData().root, ...[matData]];
                    // this.getView().getModel("mList").setData(oMaterials);
                    // this.getView().getModel("mList").getData().push(matData);
                    this.getView().getModel("mList").updateBindings();
                    // var mListData = this.getView().getModel("mList").getData();
                    // mGroupData[mListData[i].fg] = [];
                    if (typeof this.mGroupData[matData.fg] === "undefined") {
                        this.mGroupData[matData.fg] = [];
                        this.mGroupData[matData.fg].push(matData);
                        this.mGroupData[matData.fg].sort((a, b) => a.level - b.level);
                    } else {
                        this.mGroupData[matData.fg].push(matData);
                        this.mGroupData[matData.fg].sort((a, b) => a.level - b.level);
                    }
                    // this.getView().getModel("mList").updateBindings();
                    // this.getView().getModel("mList").getData().sort((a, b) => a.level - b.level);
                    // this.getView().getModel("mList").setData([this.getView().getModel("material").getData()]);
                    // this.oTable.getItems()[this.oTable.getItems().length - 1].setSelected(true);
                    this._oDialog.close();
                    this.materialCheck(matData);
                    // this.sortTableData();
                }
            },

            sortTableData: function () {
                var matList = {};
                matList.root = [];
                for (const key in this.mGroupData) {
                    if (this.mGroupData.hasOwnProperty(key)) {
                        const childObject = this.mGroupData[key];
                        console.log(`Looping in ${key}`);
                        for (const childKey in childObject) {
                            if (childObject.hasOwnProperty(childKey)) {
                                console.log(`  ${childKey}: ${childObject[childKey]}`);
                                matList.root.push(childObject[childKey]);
                            }
                        }
                    }
                }
                this.getView().getModel("mList").setData(matList);
                // this.oTable.fireSelectionChange();
            },

            onEditSave: function (oEvent) {
                console.log("edit save button clicked");
                var matData = this.getView().getModel("ematerial").getData();
                if (matData.km === undefined || matData.km === null) {
                    matData.km = '';
                }
                // var path = parseInt(this.edit_path.split('/')[1]);
                var oldData = JSON.parse(JSON.stringify(this.getView().getModel("mList").getProperty(this.edit_path)));
                var oDataModel = this.getOwnerComponent().getModel("seventhModel");
                var equ = this.getView().getModel("mList").getProperty(this.edit_path).Equipment ? this.getView().getModel("mList").getProperty(this.edit_path).Equipment : "";
                // var odataCall = "/ZLIFING7Set(IEquipment='" + equ +
                //     "',INote='" + matData.km + "',IPosition='" + matData.level + "',IFunctiongroup='" + matData.fg + "',ISerialNumber='" + matData.sno +
                //     "',IStoragelocation='" + this.storageLocation + "')";

                var odataCall =
                    "/ZLIFING7Set(IEquipment='" + equ +
                    "',INote='" + matData.km +
                    "',IPosition='" + matData.level +
                    "',IFunctiongroup='" + matData.fg +
                    "',ISerialNumber=''," +
                    "IStoragelocation='" + this.storageLocation + "')";


                var that = this;
                this.bSerialNumberCall = false;
                // var oFilter = new sap.ui.model.Filter({
                //     filters: [
                //         new sap.ui.model.Filter({
                //             path: 'IEquipment',
                //             operator: sap.ui.model.FilterOperator.EQ,
                //             value1: this.getView().getModel("mList").getProperty(this.edit_path).equipment
                //         }),
                //         new sap.ui.model.Filter({
                //             path: 'INote',
                //             operator: sap.ui.model.FilterOperator.EQ,
                //             value1: this.getView().getModel("mList").getProperty(this.edit_path).km
                //         }),
                //         new sap.ui.model.Filter({
                //             path: 'IPosition',
                //             operator: sap.ui.model.FilterOperator.EQ,
                //             value1: this.getView().getModel("mList").getProperty(this.edit_path).level
                //         }),
                //         new sap.ui.model.Filter({
                //             path: 'IFunctiongroup',
                //             operator: sap.ui.model.FilterOperator.EQ,
                //             value1: this.getView().getModel("mList").getProperty(this.edit_path).fg
                //         }),
                //         new sap.ui.model.Filter({
                //             path: 'ISerialNumber',
                //             operator: sap.ui.model.FilterOperator.EQ,
                //             value1: this.getView().getModel("mList").getProperty(this.edit_path).sNo
                //         }),
                //         new sap.ui.model.Filter({
                //             path: 'IStoragelocation',
                //             operator: sap.ui.model.FilterOperator.EQ,
                //             value1: this.storageLocation
                //         })
                //     ],
                //     and: true
                // })
                oDataModel.read(odataCall, {
                    success: function (oresponse) {
                        console.log(oresponse);
                        if (oresponse.ReturnCode == "KO") {
                            MessageBox.show("Material update failed");
                            oresponse = {};
                        } else {
                            // that.getView().getModel("snumberList").setData(oresponse.results);
                            // that.openMatListDialog();  
                            that.getView().getModel("mList").getProperty(that.edit_path).level = oresponse.IPosition;
                            that.getView().getModel("mList").getProperty(that.edit_path).fg = oresponse.IFunctiongroup;
                            that.getView().getModel("mList").getProperty(that.edit_path).Material = matData.Material;
                            // that.getView().getModel("mList").getProperty(that.edit_path).km = oresponse.INote;
                            that.getView().getModel("mList").getProperty(that.edit_path).Note = oresponse.INote;
                            that.getView().getModel("mList").getProperty(that.edit_path).sNo = oresponse.ISerialNumber || matData.sno;
                            that.getView().getModel("mList").updateBindings();
                            // Sorting and grouping after edit
                            that.mGroupData = {}
                            for (var i in that.getView().getModel("mList").getData().root) {
                                matData = that.getView().getModel("mList").getData().root[i];
                                if (typeof that.mGroupData[matData.fg] === "undefined") {
                                    that.mGroupData[matData.fg] = [];
                                    that.mGroupData[matData.fg].push(matData);
                                    that.mGroupData[matData.fg].sort((a, b) => a.level - b.level);
                                } else {
                                    that.mGroupData[matData.fg].push(matData);
                                    that.mGroupData[matData.fg].sort((a, b) => a.level - b.level);
                                }
                            }
                            // this.getView().getModel("mList").setData([this.getView().getModel("material").getData()]);
                            // this.oTable.getItems()[this.oTable.getItems().length - 1].setSelected(true);
                            that._oEditDialog.close();
                            that.sortTableData();
                        }
                    }
                });
            },

            onTableSelection: function (oEvent) {
                var seleItems = this.oTable.getSelectedIndices();
                var eqEnabled = true;
                var saveEnabled = true;
                var dismantleEnabled = false;
                var oReplaceButton = this.getView().byId("_IDGenButtonreplace");
                var bIsLifingManagement = this.getView().getModel("app").getProperty("/isLifingManagement");
                var sLifingSelectKey = this.getView().byId("_IDGenSelectLifing").getSelectedKey();
                // var snoEnabled = false;
                // if(seleItems.length == 1){
                //     snoEnabled = true;
                // }
                // this.getView().byId("_IDGenButtonsno").setEnabled(snoEnabled);
                if (seleItems.length) {
                    // this.getView().byId("_IDGenButton1").setEnabled(true);
                    this.getView().byId("idDelButton").setEnabled(true);
                    for (var i in seleItems) {
                        if (!this.oTable.getContextByIndex(seleItems[i]).getObject().MaterialDescription ||
                            this.oTable.getContextByIndex(seleItems[i]).getObject().MaterialDescription.trim() == ""
                            // !this.oTable.getContextByIndex(seleItems[i]).getObject().Position ||
                            // this.oTable.getContextByIndex(seleItems[i]).getObject().Position.trim() == ""
                        ) {
                            eqEnabled = false;
                        }
                        if (!this.oTable.getContextByIndex(seleItems[i]).getObject().Equipment ||
                            this.oTable.getContextByIndex(seleItems[i]).getObject().Equipment.trim() == "") {
                            saveEnabled = false;
                        }
                        if (seleItems.length == 1 && this.oTable.getContextByIndex(seleItems[i]).getObject().children.length) {
                            dismantleEnabled = true;
                        }
                    }
                    if (!(seleItems.length > 1)) {
                        saveEnabled = false;
                    }
                    this.getView().byId("_IDGenButtonec").setEnabled(eqEnabled);
                    this.getView().byId("_IDGenButtonsave").setEnabled(saveEnabled);
                    this.getView().byId("_IDGenButtondis").setEnabled(dismantleEnabled);
                } else {
                    // this.getView().byId("_IDGenButton1").setEnabled(false);
                    this.getView().byId("_IDGenButtonec").setEnabled(false);
                    this.getView().byId("_IDGenButtondis").setEnabled(false);
                    this.getView().byId("_IDGenButtonsave").setEnabled(false);
                }
                if (oReplaceButton && bIsLifingManagement) {
                    oReplaceButton.setEnabled(sLifingSelectKey === "No" && this._isSingleChildSelected());
                }
            },

            onSaveEquipment: function (oEvent) {
                var aMatList = this.oTable.getSelectedIndices();
                var sMatList = this.oTable.getBinding("rows");
                var aEquList = [];
                aMatList.forEach((index) => {
                    sMatList.getContextByIndex(index).getObject().itemPath = sMatList.getContextByIndex(index).getPath();
                    aEquList.push(sMatList.getContextByIndex(index).getObject());
                });
                // var mergedData = [...this.getView().getModel("eList").getData(), ...[aEquList]];
                this.getView().getModel("eList").setData(aEquList);
                var oView = this.getView();
                if (!this._oEquipDialog) {
                    Fragment.load({
                        id: oView.getId(),  // Ensure unique ID
                        name: "com.piaggio.sap.lifing.lifing.view.Material", // Fragment path
                        controller: this // Bind the controller
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog); // Add dialog to view
                        this._oEquipDialog = oDialog; // Store for reuse
                        // this.byId("idStorageLocInputEq")?.setValue("");
                        this._oEquipDialog.open(); // Open dialog
                    }.bind(this));
                } else {
                    // this.byId("idStorageLocInputEq")?.setValue("");
                    this._oEquipDialog.open();
                }
            },

            oncloseDialog: function (oEvent) {
                this._oDialog.close();
            },

            onEditClose: function (oEvent) {
                this._oEditDialog.close();
            },

            // oneqSave: function (oEvent) {
            //     var EquParent = this.byId("idequCreateTable").getSelectedItem().getBindingContext("eList").getObject().Equipment;
            //     var ParentIndex = parseInt(this.byId("idequCreateTable").getSelectedItem().getBindingContext("eList").getPath().substring(1));
            //     var childrenItemPaths = [];
            //     //    var iParentItemIndex = ""
            //     var aItems = [...this.byId("idequCreateTable").getItems()];
            //     aItems.splice(ParentIndex, 1);
            //     var sonFilterArray = [];
            //     //parent item index
            //     this.iParentItemPath = this.byId("idequCreateTable").getSelectedItem().getBindingContext("eList").getObject().itemPath;
            //     aItems.forEach((equ, i) => {
            //         childrenItemPaths.push(equ.getBindingContext("eList").getObject().itemPath);
            //         sonFilterArray.push(
            //             new sap.ui.model.Filter({
            //                 path: 'IEQUISON',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: equ.getBindingContext("eList").getObject().Equipment
            //             })
            //         );
            //     });
            //     var sonFilter = new sap.ui.model.Filter({
            //         filters: sonFilterArray,
            //         and: false
            //     });
            //     var oFilter = new sap.ui.model.Filter({
            //         filters: [
            //             new sap.ui.model.Filter({
            //                 path: 'IEQUIPPARENT',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: EquParent
            //             }),
            //             new sap.ui.model.Filter({
            //                 path: 'IPARAM',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: 'S'
            //             }),
            //             sonFilter],
            //         and: true
            //     })
            //     this.getView().setBusy(true);
            //     var oDataModel = this.getOwnerComponent().getModel("thirdModel");
            //     var odataCall = "/ZLIFING3SET";
            //     var that = this;
            //     oDataModel.read(odataCall, {
            //         filters: [oFilter],
            //         success: function (oresponse) {
            //             oresponse.results.forEach((oEqu, index) => {
            //                 for (var i in that.getView().getModel("mList").getData().root) {
            //                     if (that.getView().getModel("mList").getData().root[i].Equipment === oEqu.EEQUIPSON) {
            //                         that.getView().getModel("mList").getData().root[i].fb = oEqu.ZRETURN;
            //                         that.getView().getModel("mList").getData().root[i].fbMessage = oEqu.ZRETURN_MSG;
            //                     }
            //                 }
            //             });
            //             //add children index data array to parent index data
            //             // var parentObj = that.getView().getModel("mList").getData().root[that.iParentItemIndex];
            //             for (var i in childrenItemPaths) {
            //                 that.getView().getModel("mList").getProperty(that.iParentItemPath).children.push(
            //                     that.getView().getModel("mList").getProperty(childrenItemPaths[i])
            //                 )
            //             }
            //             // Sort numerically
            //             childrenItemPaths.sort((a, b) => {
            //                 var numA = parseInt(a.match(/\d+$/)[0], 10); // Extract number from path
            //                 var numB = parseInt(b.match(/\d+$/)[0], 10);
            //                 return numB - numA; // Descending order
            //             });
            //             for (var i in childrenItemPaths) {
            //                 // Rearrange the mgroup data
            //                 var groupRemoveIndex = that.mGroupData[that.getView().getModel("mList").getProperty(childrenItemPaths[i]).fg].findIndex((obj) => obj.Equipment == that.getView().getModel("mList").getProperty(childrenItemPaths[i]).Equipment);
            //                 that.mGroupData[that.getView().getModel("mList").getProperty(childrenItemPaths[i]).fg].splice(groupRemoveIndex, 1);
            //                 //Remove the children from root
            //                 var aParentArray = that.getView().getModel("mList").getData();
            //                 var aPathParts = childrenItemPaths[i].split('/');
            //                 for (var j = 1; j < aPathParts.length - 1; j++) {
            //                     if (aPathParts[j] == "children") {
            //                         aParentArray = aParentArray.children;
            //                     } else {
            //                         aParentArray = aParentArray[aPathParts[j]];
            //                     }
            //                 }
            //                 // Remove the selected node
            //                 var iIndexToRemove = parseInt(aPathParts[aPathParts.length - 1], 10);
            //                 aParentArray.splice(iIndexToRemove, 1);
            //                 var aParentArray = that.getView().getModel("mList").getData();
            //             }

            //             that.getView().getModel("mList").updateBindings();
            //             that.getView().byId("_IDGenColumnfb").setVisible(true);
            //             that.oTable.clearSelection();
            //             that.oTable.fireRowSelectionChange();
            //             that.getView().setBusy(false);
            //         },
            //         error: function (oerror) {
            //             console.log(oerror)
            //         }
            //     });
            //     this._oEquipDialog.close();
            // },

            oneqSave: function () {

                const oView = this.getView();
                const oTable = this.byId("idequCreateTable");
                const oModel = oView.getModel("mList");

                const oData = oModel.getData();
                const aRoots = oData.root;

                const selItem = oTable.getSelectedItem();
                if (!selItem) {
                    sap.m.MessageBox.error("Select a parent row first");
                    return;
                }

                // Selected EQUIPMENT (parent node)
                const parentCtx = selItem.getBindingContext("eList");
                const parentObj = parentCtx.getObject();
                const parentEq = parentObj.Equipment;
                const parentPath = parentObj.itemPath;  // model path to the parent

                // All items except the parent = these will become children
                let aItems = [...oTable.getItems()];
                const parentIndex = parseInt(parentCtx.getPath().substring(1)); // row index in temp list

                aItems.splice(parentIndex, 1); // remove parent

                // Build filter for children
                const childFilterArray = aItems.map(item =>
                    new sap.ui.model.Filter({
                        path: "IEQUISON",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: item.getBindingContext("eList").getObject().Equipment
                    })
                );

                const sonFilter = new sap.ui.model.Filter({
                    filters: childFilterArray,
                    and: false
                });

                const sEqStorageLoc = (this.byId("idStorageLocInputEq")?.getValue() || "").trim() || (this.storageLocation || "");

                // ZLIFING3 filter
                const oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "IEQUIPPARENT",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: parentEq
                        }),
                        new sap.ui.model.Filter({
                            path: "IPARAM",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "S"
                        }),
                        new sap.ui.model.Filter({
                            path: "ILGORT",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sEqStorageLoc
                        }),
                        sonFilter
                    ],
                    and: true
                });

                oView.setBusy(true);
                const oSrv = this.getOwnerComponent().getModel("thirdModel");
                const sCall = "/ZLIFING3SET";
                const that = this;

                oSrv.read(sCall, {
                    filters: [oFilter],
                    success: function (oResp) {

                        /** STEP 1 — UPDATE FEEDBACK on affected children */
                        oResp.results.forEach(res => {
                            const eqSon = res.EEQUIPSON;
                            that._updateChildFeedback(eqSon, res.ZRETURN, res.ZRETURN_MSG);
                        });

                        /** STEP 2 — MERGE CHILDREN INTO SELECTED PARENT 
                        const parentNode = oModel.getProperty(parentPath);
                        const childrenItemPaths = [];
                        aItems.forEach(item => {
                            const childPath = item.getBindingContext("eList").getObject().itemPath;
                            const childData = oModel.getProperty(childPath);
                            parentNode.children = parentNode.children || [];
                            parentNode.children.push(childData);
                            childrenItemPaths.push(childPath);
                        }); */

                        const parentNode = oModel.getProperty(parentPath);
                        const childrenItemPaths = [];
                        const aInstalledChildren = [];
                        aItems.forEach((item) => {
                            const childPath = item.getBindingContext("eList").getObject().itemPath;
                            const childData = oModel.getProperty(childPath);
                            
                            parentNode.children = parentNode.children || [];
                            parentNode.children.push(childData);
                            childrenItemPaths.push(childPath);
                            
                            // Set "Installed" feedback directly when linking child to parent
                            const childResponse = oResp.results.find(res => res.EEQUIPSON === childData.Equipment);
                            if (childResponse && childResponse.ZRETURN === "OK") {
                                const childIndex = parentNode.children.length - 1;
                                const newChildPath = parentPath + "/children/" + childIndex;
                                oModel.setProperty(newChildPath + "/fb", "INST");
                                oModel.setProperty(newChildPath + "/fbMessage", "Installed");
                                aInstalledChildren.push(childData.Equipment);
                            }
                        });

                        /** STEP 3 — REMOVE CHILDREN FROM ROOT LEVEL */
                        // aItems.forEach(item => {
                        //     const childPath = item.getBindingContext("eList").getObject().itemPath;
                        //     that._removeNodeFromRoot(childPath);
                        // });
                        // childrenItemPaths.forEach(childPath => {
                        //     // Remove from root array
                        //     that._removeNodeFromRoot(childPath);
                        // });

                        // Collect equipment IDs of children to remove
                        const childEquipmentIds = childrenItemPaths.map(path => {
                            const childNode = oModel.getProperty(path);
                            return childNode ? childNode.Equipment : null;
                        }).filter(eq => eq !== null);

                        // Remove children from root by finding and removing by Equipment ID
                        // This approach is more reliable than using paths which can shift
                        const removeByEquipment = (arr, equipmentId) => {
                            for (let i = arr.length - 1; i >= 0; i--) {
                                if (arr[i].Equipment === equipmentId) {
                                    arr.splice(i, 1);
                                    return true;
                                }
                                // Also check children recursively
                                if (arr[i].children && arr[i].children.length > 0) {
                                    if (removeByEquipment(arr[i].children, equipmentId)) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                        const rootData = oModel.getData();
                        childEquipmentIds.forEach(eqId => {
                            removeByEquipment(rootData.root, eqId);
                        });
                        
                        // Update bindings immediately after removal to reflect changes in UI
                        oModel.updateBindings();

                        /** STEP 4 — FIND THE ROOT TREE OF THIS EQUIPMENT */
                        const topNode = that._findRootForEquipment(parentEq, aRoots);
                        if (!topNode) {
                            console.error("NO ROOT TREE FOUND for", parentEq);
                            oView.setBusy(false);
                            return;
                        }

                        /** IMPORTANT:
                                     * we refresh subtree by ROOT SERIAL ONLY ⬇️
                                                  * FG1 / FG2 / FG3 remain isolated
                                                               */
                        const rootSerial = topNode.sNo;
// Check if serial number is empty
                        if (!rootSerial || rootSerial.trim() === "") {
                            console.log("Serial number is empty, using equipment arrangement without backend reload.");
                            
                            // Get the updated tree structure from model (includes changes from steps 1-3)
                            const updatedNode = oModel.getProperty(parentPath);
                            
                            // Replace the root tree with the updated node
                            that._replaceRootTree(topNode.Equipment, topNode);
                            
                            oModel.updateBindings();
                            oView.setBusy(false);
                            sap.m.MessageToast.show("Structure saved successfully");
                            
                        } else {
                            const aInstalledToRestore = [...aInstalledChildren];
                        that._reloadSubtreeBySerial(rootSerial,topNode.Material)
                            .then(newTree => {

                                // Replace only that root group
                                that._replaceRootTree(topNode.Equipment, newTree);

                                if (aInstalledToRestore.length > 0) {
                                    const rootData = oModel.getData();
                                    const updatedRoot = rootData.root.find(r => r.Equipment === topNode.Equipment);
                                    if (updatedRoot) {
                                        const findAndUpdateFeedback = (node, basePath) => {
                                            if (aInstalledToRestore.includes(node.Equipment)) {
                                                oModel.setProperty(basePath + "/fb", "INST");
                                                oModel.setProperty(basePath + "/fbMessage", "Installed");
                                            }
                                            if (node.children && node.children.length > 0) {
                                                node.children.forEach((child, index) => {
                                                    findAndUpdateFeedback(child, basePath + "/children/" + index);
                                                });
                                            }
                                        };
                                        const rootIndex = rootData.root.findIndex(r => r.Equipment === topNode.Equipment);
                                        if (rootIndex >= 0) {
                                            findAndUpdateFeedback(updatedRoot, "/root/" + rootIndex);
                                        }
                                    }
                                }

                                oModel.updateBindings();
                                oView.setBusy(false);

                                sap.m.MessageToast.show("Structure saved successfully");
                            })
                            .catch(err => {
                                console.error("ZLIFING4 refresh failed:", err);
                                oView.setBusy(false);
                            });
                        }
                    },
                    error: function (err) {
                        console.error("ZLIFING3 ERROR:", err);
                        oView.setBusy(false);
                    }
                });

                this._oEquipDialog.close();
            },

            _mapLifingTree: function (records) {

                // 1) Build a quick map by equipment
                const mNodes = new Map();
                records.forEach(r => {
                    r.children = [];
                    mNodes.set(r.Equipment, r);
                });

                // 2) Build parent → children hierarchy
                const roots = [];
                records.forEach(r => {
                    if (r.Father && mNodes.has(r.Father)) {
                        mNodes.get(r.Father).children.push(r);
                    } else {
                        roots.push(r);
                    }
                });

                // 3) Recursively remap
                const cleanTree = nodes => nodes.map(this._remapNodeFields.bind(this));

                return cleanTree(roots)[0]; // return only the single root
            },

            // _remapNodeFields: function (node) {

            //     // parse KM safely (handles "1.000 km")
            //     const normalizeKm = val => {
            //         if (!val) return 0;
            //         return Number(String(val).replace(/[^\d]/g, "")) || 0;
            //     };

            //     const kmVal = node.RevisionNumber > 0
            //         ? normalizeKm(node.RevisionKm)
            //         : normalizeKm(node.Km);

            //     const kmMin = normalizeKm(node.KmMin || node.min);
            //     const kmMax = normalizeKm(node.KmMax || node.max);

            //     // traffic light
            //     let traffic = "G";
            //     if (kmVal < kmMin) traffic = "G";
            //     else if (kmVal >= kmMin && kmVal < kmMax) traffic = "Y";
            //     else traffic = "R";

            //     return {
            //         fg: node.FunctionalGroup || node.fg || "",
            //         level: node.Position || node.level || '',
            //         Equipment: node.Equipment || "",
            //         Material: node.Material || "",
            //         MaterialDescription: node.MaterialDescription || node.Description || "",
            //         sNo: node.SerialNumber || node.sNo || "",
            //         Note: node.Note || "",
            //         RevisionNumber: node.RevisionNumber || "",
            //         RevisionKm: node.RevisionKm || "",
            //         Km: normalizeKm(node.Km),
            //         KmMin: kmMin,
            //         KmMax: kmMax,
            //         NextRun: node.NextRun,
            //         KmNextRun: normalizeKm(node.KmNextRun),
            //         TrafficLight: traffic,
            //         TrafficIcon: "sap-icon://status-circle",
            //         TrafficColor: traffic === "G" ? "Success" : traffic === "Y" ? "Critical" : "Error",
            //         Father: node.Father || "",
            //         children: node.children?.map(this._remapNodeFields.bind(this)) || []
            //     };
            // },

            _remapNodeFields: function (node) {

                /** Safely parse numeric KM values
                 * Handles formats like:
                 * "2.000 km"
                 * "160 km"
                 * "150km"
                 * "1000"
                 * null/undefined
                 */
                // const toNumber = val =>
                //     Number(String(val || "").replace(/[^\d]/g, "")) || 0;

                const toNumber = val => {
                    if (val == null || val === "") return 0;
                    return Number(
                        String(val)
                            .replace(/ km/i, "")
                            .replace(",", ".")
                            .trim()
                    ) || 0;
                };


                const kmVal = Number(node.RevisionNumber) > 0
                    ? toNumber(node.RevisionKm)
                    : toNumber(node.Km);



                const kmMin = toNumber(node.KmMin ?? node.min);
                const kmMax = toNumber(node.KmMax ?? node.max);



                // let traffic = "G";
                // if (kmVal < kmMin) traffic = "G";
                // else if (kmVal >= kmMin && kmVal < kmMax) traffic = "Y";
                // else traffic = "R";

                const { traffic, icon, color } = this._computeTraffic({
                    revisionNumber: node.RevisionNumber,
                    max: kmMax,
                    min: kmMin,
                    km: toNumber(node.Km),
                    revisionKm: toNumber(node.RevisionKm),
                    kmAfterLastRevision,
                    kmAlert
                });


                return {
                    /** original UI fields preserved 1-to-1 */
                    fg: node.FunctionalGroup || node.fg || "",
                    level: node.Position || node.level || '',
                    Equipment: node.Equipment || "",
                    Material: node.Material || "",
                    MaterialDescription: node.MaterialDescription || node.Description || "",
                    sNo: node.SerialNumber || node.sNo || "",
                    Note: node.Note || "",

                    RevisionNumber: node.RevisionNumber || "",
                    RevisionKm: toNumber(node.RevisionKm),  // numeric

                    /** Field for displaying in UI (unchanged string) */
                    min: node.min ?? node.KmMin ?? "",
                    max: node.max ?? node.KmMax ?? "",

                    /** Internal numeric versions for logic & next run calc */
                    Km: toNumber(node.Km),
                    KmMin: kmMin,
                    KmMax: kmMax,

                    NextRun: node.NextRun,
                    KmNextRun: toNumber(node.KmNextRun),

                    /** Traffic Indicator */
                    TrafficLight: traffic,
                    // TrafficIcon: "sap-icon://status-circle",
                    // TrafficColor: traffic === "G" ? "Success" :
                    //     traffic === "Y" ? "Critical" : "Error",
                    TrafficIcon: icon,
                    TrafficColor: color,

                    Father: node.Father || "",

                    children: (node.children || []).map(this._remapNodeFields.bind(this))
                };
            },

            _computeTraffic: function ({
                revisionNumber,
                max,
                min,
                km,
                revisionKm,
                kmAfterLastRevision,
                kmAlert
            }) {
                // Returns statusCode: 0..5 and a CSS color string
                let colorCode = 0;
                const revNo = String(revisionNumber ?? "").trim();

                const nMax = Number(max) || 0;
                const nMin = Number(min) || 0;
                const nKm = Number(km) || 0;
                const nRevKm = Number(revisionKm) || 0;
                const nKmAfter = Number(kmAfterLastRevision) || 0;
                const nAlert = Number(kmAlert) || 500;

                const betweenInclusive = (x, a, b) => x >= a && x <= b;

                if (revNo === "000") {
                    if (nMax === 0 && nRevKm === 0) colorCode = 0;
                    if (nMax > 0 && nKm < nMax && colorCode <= 1) colorCode = 1;
                    if (nRevKm > 0 && nKmAfter < nRevKm && colorCode <= 1) colorCode = 1;
                    if (nMin > 0 && nKm < nMin && colorCode <= 1) colorCode = 2;
                    if (nRevKm > 0 && betweenInclusive(nKmAfter, nRevKm - nAlert, nRevKm) && colorCode <= 2) colorCode = 3;
                    if (nMax > 0 && betweenInclusive(nKm, nMax - nAlert, nMax) && colorCode <= 3) colorCode = 4;
                    if (nMax > 0 && nKm >= nMax && colorCode <= 4) colorCode = 5;
                    if (nRevKm > 0 && nKmAfter >= nRevKm && colorCode <= 4) colorCode = 5;
                } else {
                    if (nMax === 0 && nRevKm === 0) colorCode = 0;
                    if (nMax > 0 && nKmAfter < nMax && colorCode <= 1) colorCode = 1;
                    if (nRevKm > 0 && nKmAfter < nRevKm && colorCode <= 1) colorCode = 1;
                    if (nMin > 0 && nKmAfter < nMin && colorCode <= 1) colorCode = 2;
                    if (nRevKm > 0 && betweenInclusive(nKmAfter, nRevKm - nAlert, nRevKm) && colorCode <= 2) colorCode = 3;
                    if (nMax > 0 && betweenInclusive(nKmAfter, nMax - nAlert, nMax) && colorCode <= 3) colorCode = 4;
                    if (nMax > 0 && nKmAfter >= nMax && colorCode <= 4) colorCode = 5;
                    if (nRevKm > 0 && nKmAfter >= nRevKm && colorCode <= 4) colorCode = 5;
                }

                const colorMap = {
                    0: "#8a8a8a", // gray
                    1: "#107e3e", // green
                    2: "#800080", // purple
                    3: "#f0ab00", // yellow
                    4: "#e9730c", // orange
                    5: "#bb0000"  // red
                };

                return {
                    traffic: colorCode,
                    icon: "sap-icon://circle-task-2",
                    color: colorMap[colorCode] || colorMap[0]
                };
            },

            onKmAlertChange: function (oEvent) {
                const oInput = oEvent.getSource();
                const sVal = (oInput.getValue() || "").trim();
                let iVal = parseInt(sVal, 10);

                if (!Number.isFinite(iVal) || iVal <= 0) {
                    iVal = 500;
                    oInput.setValue(String(iVal));
                    MessageToast.show("KM Allert must be a positive number. Reset to 500.");
                }

                this.getView().getModel("app").setProperty("/kmAlert", iVal);
                this._recalculateTrafficIndicators();
            },

            _getKmAlertValue: function () {
                const v = parseInt(this.getView().getModel("app")?.getProperty("/kmAlert"), 10);
                return Number.isFinite(v) && v > 0 ? v : 500;
            },

             _recalculateTrafficIndicators: function () {
                const oModel = this.getView().getModel("mList");
                const oData = oModel?.getData();
                if (!oData || !Array.isArray(oData.root)) return;

                const kmAlert = this._getKmAlertValue();
                const toNumber = (v) => {
                    if (v == null || v === "") return 0;
                    const s = String(v).replace(/ km/i, "").trim().replace(/\./g, "").replace(",", ".");
                    return Number(s) || 0;
                };

                const walk = (arr) => {
                    arr.forEach(node => {
                        if (!node) return;
                        const res = this._computeTraffic({
                            revisionNumber: node.RevisionNumber,
                            max: toNumber(node.KmMax ?? node.max),
                            min: toNumber(node.KmMin ?? node.min),
                            km: toNumber(node.Km),
                            revisionKm: toNumber(node.RevisionKm),
                            kmAfterLastRevision: toNumber(node.KmRevisione),
                            kmAlert
                        });

                        node.TrafficLight = res.traffic;
                        node.TrafficIcon = res.icon;
                        node.TrafficColor = res.color;

                        if (Array.isArray(node.children) && node.children.length) walk(node.children);
                    });
                };

                walk(oData.root);
                oModel.updateBindings(true);

                const oBinding = this.oTable?.getBinding("rows");
                if (oBinding) {
                    oBinding.refresh(true);
                }
            },


            _updateChildFeedback: function (equipment, fb, fbMsg) {
                const oModel = this.getView().getModel("mList");
                const walk = (arr) => {
                    arr.forEach(node => {
                        if (node.Equipment === equipment) {
                               node.fb = fb;
                               node.fbMessage = fbMsg;
                        }
                        if (node.children) walk(node.children);
                    });
                };
                walk(oModel.getData().root);
            },
            
            _removeNodeFromRoot: function (itemPath) {

                const oData = this.getView().getModel("mList").getData();
                let ref = oData;
                const parts = itemPath.split("/");

                for (let i = 1; i < parts.length - 1; i++) {
                    ref = parts[i] === "children"
                        ? ref.children
                        : ref[parts[i]];
                }

                const idx = parseInt(parts.at(-1), 10);
                ref.splice(idx, 1);
            },

            _findRootForEquipment: function (eq, roots) {
                return roots.find(r => r.Equipment === eq || this._containsEq(r, eq));
            },

            _containsEq: function (node, eq) {
                if (node.Equipment === eq) return true;
                return node.children?.some(c => this._containsEq(c, eq)) || false;
            },
            _reloadSubtreeBySerial: function (serial,material) {
                return new Promise((resolve, reject) => {

                    const oSrv = this.getOwnerComponent().getModel("fourthModel");
// this.storageLocation
                    const oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({ path: "ISernr", operator: "EQ", value1: serial }),
                            new sap.ui.model.Filter({ path: "ILgort", operator: "EQ", value1: 'ARTT' }),
                            new sap.ui.model.Filter({ path: "IParameter", operator: "EQ", value1: "B" }),
                            new sap.ui.model.Filter({ path: "IMatnr", operator: "EQ", value1: material })
                        ],
                        and: true
                    });

                    oSrv.read("/ZLIFING4Set", {
                        filters: [oFilter],
                        success: resp => resolve(this._mapLifingTree(resp.results)),
                        error: reject
                    });
                });
            },
            _replaceRootTree: function (rootEq, newRoot) {
                const model = this.getView().getModel("mList");
                const data = model.getData();

                const idx = data.root.findIndex(r => r.Equipment === rootEq);
                if (idx === -1) {
                    console.warn("Root not found while replacing:", rootEq);
                    return;
                }

                data.root[idx] = newRoot;

                model.updateBindings();
            },

            // _replaceRootTree: function (rootEq, newRoot) {
            //     const m = this.getView().getModel("mList").getData();
            //     const idx = m.root.findIndex(r => r.Equipment === rootEq);
            //     if (idx >= 0) m.root[idx] = newRoot;
            // },


            onPressDismantle: function (oEvent) {
                var peqIndex = this.oTable.getSelectedIndices();
                this.parentEquipment = this.oTable.getContextByIndex(peqIndex[0]).getObject();
                var childModel = new sap.ui.model.json.JSONModel(this.parentEquipment.children);
                this.getView().setModel(childModel, "ChildList");
                var oStorageInput = this.getView().byId("idDismantleStorageInput");
                if (oStorageInput) {
                    oStorageInput.setValue("");
                    oStorageInput.setValueState("None");
                }
                var oView = this.getView();
                if (!this._oChildEquipDialog) {
                    Fragment.load({
                        id: oView.getId(),  // Ensure unique ID
                        name: "com.piaggio.sap.lifing.lifing.view.ChildMaterial", // Fragment path
                        controller: this // Bind the controller
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog); // Add dialog to view
                        this._oChildEquipDialog = oDialog; // Store for reuse
                        this._oChildEquipDialog.open(); // Open dialog
                    }.bind(this));
                } else {
                    this._oChildEquipDialog.open();
                }
            },

            // onDismantleConfirmation: function (oEvent) {
            //     var sonFilterArray = [];
            //     var selectedChildren = this.getView().byId("idChildEquTable").getSelectedItems();
            //     selectedChildren.forEach((childEq, i) => {
            //         sonFilterArray.push(
            //             new sap.ui.model.Filter({
            //                 path: 'IEQUISON',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: childEq.getBindingContext("ChildList").getObject().Equipment
            //             }));
            //     });
            //     var sonFilter = new sap.ui.model.Filter({
            //         filters: sonFilterArray,
            //         and: false
            //     });
            //     var oFilter = new sap.ui.model.Filter({
            //         filters: [
            //             new sap.ui.model.Filter({
            //                 path: 'IEQUIPPARENT',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: this.parentEquipment.Equipment
            //             }),
            //             new sap.ui.model.Filter({
            //                 path: 'IPARAM',
            //                 operator: sap.ui.model.FilterOperator.EQ,
            //                 value1: 'D'
            //             }),
            //             sonFilter],
            //         and: true
            //     });
            //     var oDataModel = this.getOwnerComponent().getModel("thirdModel");
            //     var odataCall = "/ZLIFING3SET";
            //     var that = this;
            //     var removedIndex;
            //     oDataModel.read(odataCall, {
            //         filters: [oFilter],
            //         success: function (oresponse) {
            //             console.log(oresponse.results);
            //             oresponse.results.forEach((res, index) => {
            //                 if (res.ZRETURN == "OK") {
            //                     removedIndex = that.parentEquipment.children.findIndex(eqObj => eqObj.Equipment == res.EEQUIPSON);
            //                     that.getView().getModel("mList").getData().root.push(that.parentEquipment.children[removedIndex]);
            //                     that.parentEquipment.children[removedIndex].fb = "";
            //                     that.parentEquipment.children[removedIndex].fbMessage = "";
            //                     // that.mGroupData[that.parentEquipment.children[removedIndex].fg].push(that.parentEquipment.children[removedIndex]);
            //                     var child = that.parentEquipment.children[removedIndex];
            //                     var childCopy = JSON.parse(JSON.stringify(child));
                                
            //                     // Set "Dismantled" feedback on the copy
            //                     childCopy.fb = "DISM";
            //                     childCopy.fbMessage = "Dismantled";
                                
            //                     // Remove from parent's children first
            //                     that.parentEquipment.children.splice(removedIndex, 1);
                                
            //                     // Add copy to root
            //                     var oModel = that.getView().getModel("mList");
            //                     var rootData = oModel.getData();
            //                     rootData.root.push(childCopy);
                                
            //                     // Update feedback on the root node using setProperty
            //                     var rootIndex = rootData.root.length - 1;
            //                     oModel.setProperty("/root/" + rootIndex + "/fb", "DISM");
            //                     oModel.setProperty("/root/" + rootIndex + "/fbMessage", "Dismantled");
                                
            //                     var fgKey = childCopy.fg;

            //                     if (!that.mGroupData[fgKey]) {
            //                         that.mGroupData[fgKey] = [];
            //                     }

            //                     that.mGroupData[fgKey].push(childCopy);

            //                     oModel.updateBindings();
            //                     that._oChildEquipDialog.close();
            //                     // that._oChildEquipDialog.close();
            //                     // that.sortTableData();
            //                 } else if (res.ZRETURN == "KO") {
            //                     MessageBox.show("Dismantle failed");
            //                 }
            //             });
            //         }
            //     });
            // },

            onDismantleConfirmation: function (oEvent) {
                var sonFilterArray = [];
                var selectedChildren = this.getView().byId("idChildEquTable").getSelectedItems();
                var oStorageInput = this.getView().byId("idDismantleStorageInput");
                var bIsLifingManagement = this.getView().getModel("app").getProperty("/isLifingManagement");
                var sDismantleParam = bIsLifingManagement ? "T" : "D";

                var sStorageLocation = oStorageInput ? oStorageInput.getValue().trim() : "";
                selectedChildren.forEach((childEq, i) => {
                    sonFilterArray.push(
                        new sap.ui.model.Filter({
                            path: 'IEQUISON',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: childEq.getBindingContext("ChildList").getObject().Equipment
                        }));
                });
                var sonFilter = new sap.ui.model.Filter({
                    filters: sonFilterArray,
                    and: false
                });
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'IEQUIPPARENT',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.parentEquipment.Equipment
                        }),
                        new sap.ui.model.Filter({
                            path: 'IPARAM',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sDismantleParam
                        }),
                        new sap.ui.model.Filter({
                            path: 'ILGORT',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sStorageLocation
                        }),
                        sonFilter],
                    and: true
                });
                var oDataModel = this.getOwnerComponent().getModel("thirdModel");
                var odataCall = "/ZLIFING3SET";
                var that = this;
                var removedIndex;
                oDataModel.read(odataCall, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        console.log(oresponse.results);
                        var oModel = that.getView().getModel("mList");
                        var rootData = oModel.getData();
                        var aProcessedEquipment = []; // Track processed equipment to avoid duplicates
                        
                        oresponse.results.forEach((res, index) => {
                            if (res.ZRETURN == "OK") {
                                // Skip if this equipment was already processed
                                if (aProcessedEquipment.includes(res.EEQUIPSON)) {
                                    console.warn("Equipment already processed:", res.EEQUIPSON);
                                    return;
                                }
                                
                                removedIndex = that.parentEquipment.children.findIndex(eqObj => eqObj.Equipment == res.EEQUIPSON);
                                if (removedIndex === -1) {
                                    console.warn("Child equipment not found in parent's children:", res.EEQUIPSON);
                                    return;
                                }
                                
                                // Check if equipment already exists in root
                                var existingIndex = rootData.root.findIndex(r => r.Equipment === res.EEQUIPSON);
                                if (existingIndex !== -1) {
                                    console.warn("Equipment already exists in root:", res.EEQUIPSON);
                                    // Update existing entry with Dismantled feedback
                                    oModel.setProperty("/root/" + existingIndex + "/fb", "DISM");
                                    oModel.setProperty("/root/" + existingIndex + "/fbMessage", "Dismantled");
                                    // Remove from parent's children
                                    that.parentEquipment.children.splice(removedIndex, 1);
                                    aProcessedEquipment.push(res.EEQUIPSON);
                                    return;
                                }
                                
                                // Create a deep copy of the child to avoid reference issues
                                var child = that.parentEquipment.children[removedIndex];
                                var childCopy = JSON.parse(JSON.stringify(child));
                                
                                // Set "Dismantled" feedback on the copy
                                childCopy.fb = "DISM";
                                childCopy.fbMessage = "Dismantled";
                                
                                // Remove from parent's children first
                                that.parentEquipment.children.splice(removedIndex, 1);
                                
                                // Add copy to root
                                rootData.root.push(childCopy);
                                
                                // Update feedback on the root node using setProperty
                                var rootIndex = rootData.root.length - 1;
                                oModel.setProperty("/root/" + rootIndex + "/fb", "DISM");
                                oModel.setProperty("/root/" + rootIndex + "/fbMessage", "Dismantled");
                                
                                var fgKey = childCopy.fg;

                                if (!that.mGroupData[fgKey]) {
                                    that.mGroupData[fgKey] = [];
                                }

                                // Check if not already in mGroupData before adding
                                var existsInGroup = that.mGroupData[fgKey].some(item => item.Equipment === childCopy.Equipment);
                                if (!existsInGroup) {
                                    that.mGroupData[fgKey].push(childCopy);
                                }

                                aProcessedEquipment.push(res.EEQUIPSON);
                            } else if (res.ZRETURN == "KO") {
                                MessageBox.show("Dismantle failed");
                            }
                        });
                        
                        oModel.updateBindings();
                        that._oChildEquipDialog.close();
                    }
                });
            },
            
            oncloseeqDialog: function (oEvent) {
                // this._oChildEquipDialog.close();
                this._oEquipDialog.close();
            },
            oncloseeeqDialog: function (oEvent) {
                this._oChildEquipDialog.close();
                // this._oEquipDialog.close();
            },
            onCloseMatListDialog: function (oEvent) {
                if (this._oMatListDialog) {
                    this._oMatListDialog.close();
                }
            },

            openMatListDialog: function (oEvent) {
                var oView = this.getView();
                if (!this._oMatListDialog) {
                    Fragment.load({
                        id: oView.getId(),  // Ensure unique ID
                        name: "com.piaggio.sap.lifing.lifing.view.SerialNumberSelect", // Fragment path
                        controller: this // Bind the controller
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog); // Add dialog to view
                        this._oMatListDialog = oDialog; // Store for reuse
                        this._oMatListDialog.open(); // Open dialog
                    }.bind(this));
                } else {
                    this._oMatListDialog.open();
                }
            },

            handleSearchPress: function (oEvent) {
                var material = this.getView().byId("idmatinput").getValue();
                var sno = this.getView().byId("idsnoinput").getValue();
                var storageLocation = this.getView().byId("idStorageLocInput") ? this.getView().byId("idStorageLocInput").getValue() : "";
                var storageLocationStruct = this.getView().byId("idStorageLocInputStruct") ? this.getView().byId("idStorageLocInputStruct").getValue() : "";
                
                this.getView().byId("idmatinput").setValue("");
                this.getView().byId("idsnoinput").setValue("");
                if (this.getView().byId("idStorageLocInput")) {
                    this.getView().byId("idStorageLocInput").setValue("");
                }

                if (this.getView().byId("idStorageLocInputStruct")) {
                    this.getView().byId("idStorageLocInputStruct").setValue("");
                }

                this._pPopover.then(function (oPopover) {
                    oPopover.close();
                });
                if (this.bSerialNumberCall) {
                    var oDataModel = this.getOwnerComponent().getModel("fifthModel");
                    var odataCall = "/ZLIFING5Set";
                    var that = this;
                    this.bSerialNumberCall = false;
                    var sStorageLoc = (storageLocation && storageLocation.trim() !== "") 
                        ? storageLocation.trim() 
                        : (this.storageLocation || "");

                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: 'Imatnr',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: material
                            }),
                            new sap.ui.model.Filter({
                                path: 'Ilager',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: sStorageLoc
                            }),
                            new sap.ui.model.Filter({
                                path: 'IParam',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: 'S'
                            }),
                        ],
                        and: true
                    })
                    oDataModel.read(odataCall, {
                        filters: [oFilter],
                        success: function (oresponse) {
                            console.log(oresponse.results);
                            if (oresponse.results[0].Zreturn == "OK") {
                                // oresponse.results = [];
                                that.getView().getModel("snumberList").setData(oresponse.results);
                                that._matListSource = "serialNumber";
                                that.openMatListDialog();
                            } else {
                                MessageBox.show(oresponse.results[0].ZreturnMsg);
                            }

                        }
                    });
                } else if (this.bStructure) {
                    var oDataModel = this.getOwnerComponent().getModel("fourthModel");
                    var odataCall = "/ZLIFING4Set";
                    var that = this;
                    this.bStructure = false;
                    var sStorageLoc = (storageLocationStruct && storageLocationStruct.trim() !== "") 
                        ? storageLocationStruct.trim() 
                        : (this.storageLocation || "");
                    var oFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter({
                                path: 'IMatnr',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: material
                            }),
                            new sap.ui.model.Filter({
                                path: 'ISernr',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: sno
                            }),
                            new sap.ui.model.Filter({
                                path: 'ILgort',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: sStorageLoc
                            }),
                            new sap.ui.model.Filter({
                                path: 'IParameter',
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: 'B'
                            }),
                        ],
                        and: true
                    })
                    oDataModel.read(odataCall, {
                        filters: [oFilter],
                        // success: function (oresponse) {
                        //     var oMListModel = that.getView().getModel("mList");
                        //     var aExisting = oMListModel.getData().root || [];

                        //     // Merge existing + new results
                        //     var aFlatNew = that._flatten(oresponse.results, []);
                        //     var aMerged = aExisting.concat(aFlatNew);

                        //     // Update model
                        //     oMListModel.setData({ root: aMerged });
                        //     // oMListModel.setData({ aMerged });
                        //     oMListModel.updateBindings();
                        //     console.log(oresponse.results[0]);
                        // }
                        // success: function (oresponse) {
                        //     var oMListModel = that.getView().getModel("mList");
                        //     var aExisting = oMListModel.getData().root || [];

                        //     var aResults = oresponse.results;

                        //     // Index by Equipment
                        //     var mByEquipment = {};
                        //     aResults.forEach(function (rec) {
                        //         mByEquipment[rec.Equipment] = rec;
                        //         rec.children = []; // prepare empty array
                        //     });

                        //     // Build parent/child relationships
                        //     var aTree = [];
                        //     aResults.forEach(function (rec) {
                        //         if (rec.Father && mByEquipment[rec.Father]) {
                        //             // It's a child, attach to its parent
                        //             mByEquipment[rec.Father].children.push(rec);
                        //         } else {
                        //             // It's a parent (no Father), push to root
                        //             aTree.push(rec);
                        //         }
                        //     });

                        //     // Merge with existing root
                        //     var aMerged = aExisting.concat(aTree);

                        //     // Update model
                        //     oMListModel.setData({ root: aMerged });
                        //     oMListModel.updateBindings();

                        //     console.log("Tree built:", aMerged);
                        // }

                        // success: function (oresponse) {
                        //     var oMListModel = that.getView().getModel("mList");
                        //     var aExisting = oMListModel.getData().root || [];

                        //     var aResults = oresponse.results;

                        //     // Index by Equipment
                        //     var mByEquip = {};
                        //     aResults.forEach(function (rec) {
                        //         rec.children = []; // always initialize
                        //         mByEquip[rec.Equipment] = rec;
                        //     });

                        //     // Recursively attach children
                        //     function buildTree(node) {
                        //         aResults.forEach(function (rec) {
                        //             if (rec.Father === node.Equipment) {
                        //                 node.children.push(rec);
                        //                 buildTree(rec); // handle grandchildren
                        //             }
                        //         });
                        //     }

                        //     // Collect top-level parents
                        //     var aTree = [];
                        //     aResults.forEach(function (rec) {
                        //         if (!rec.Father) { // Father is blank
                        //             buildTree(rec);
                        //             aTree.push(rec);
                        //         }
                        //     });

                        //     // Merge with existing data
                        //     var aMerged = aExisting.concat(aTree);

                        //     oMListModel.setData({ root: aMerged });
                        //     oMListModel.updateBindings();

                        //     console.log("Tree built:", aMerged);
                        // }

                        // success: function (oresponse) {
                        //     var oMListModel = that.getView().getModel("mList");
                        //     var aExisting = oMListModel.getData().root || [];

                        //     var aResults = oresponse.results;

                        //     // Map for quick lookup
                        //     var mByEquip = {};
                        //     aResults.forEach(function (rec) {
                        //         rec.children = []; // always initialize
                        //         mByEquip[rec.Equipment] = rec;
                        //     });

                        //     // Attach children recursively
                        //     aResults.forEach(function (rec) {
                        //         if (rec.Father && mByEquip[rec.Father]) {
                        //             mByEquip[rec.Father].children.push(rec);
                        //         }
                        //     });

                        //     // Collect only top-level parents
                        //     var aTree = aResults.filter(function (rec) {
                        //         return !rec.Father; // parent has no Father
                        //     });

                        //     // Merge with existing
                        //     var aMerged = aExisting.concat(aTree);

                        //     oMListModel.setData({ root: aMerged });
                        //     oMListModel.updateBindings();
                        // }
                        success: function (oresponse) {
                            var oMListModel = that.getView().getModel("mList");
                            var aExisting = oMListModel.getData().root || [];
                            if (oresponse.results && oresponse.results.length > 0 && oresponse.results[0].ReturnCode === "KO") {
                                MessageBox.error(oresponse.results[0].ReturnMessage || "Error in processing material");

                                // --- Remove last added row safely ---
                                // if (aExisting.length > 0) {
                                //     aExisting.pop(); // remove last item from root array
                                //     oMListModel.setData({ root: aExisting });
                                //     oMListModel.updateBindings();
                                // }

                                that.getView().setBusy(false);
                                return;
                            }
                            var aNew = oresponse.results;

                            // Step 1: Index records by Equipment
                            const mByEquip = new Map();
                            aNew.forEach(rec => {
                                rec.children = []; // Initialize for nesting
                                mByEquip.set(rec.Equipment, rec);
                            });

                            // Step 2: Build hierarchy by linking children to parents
                            const aTopLevel = [];
                            aNew.forEach(rec => {
                                if (rec.Father) {
                                    const oParent = mByEquip.get(rec.Father);
                                    if (oParent) {
                                        oParent.children.push(rec);
                                    } else {
                                        // orphan record (invalid Father), treat as root
                                        aTopLevel.push(rec);
                                    }
                                } else {
                                    // No Father → it's a root node
                                    aTopLevel.push(rec);
                                }
                            });

                            // Step 3: Remove empty children arrays to avoid ghost rows
                            function cleanTree(nodes) {
                                return nodes.map(node => {
                                    const oCleaned = { ...node }; // shallow copy

                                    if (Array.isArray(oCleaned.children)) {
                                        if (oCleaned.children.length > 0) {
                                            oCleaned.children = cleanTree(oCleaned.children); // recursive clean
                                        } else {
                                            delete oCleaned.children; // remove ghost-inducing empty array
                                        }
                                    }
                                    return oCleaned;
                                });
                            }


                            function remapFields(node) {
                                return {
                                    fg: node.FunctionalGroup || node.fg || "",
                                    level: node.Position || node.level || '',
                                    Equipment: node.Equipment || '',
                                    Material: node.Material || '',
                                    MaterialDescription: node.MaterialDescription || '',
                                    sNo: node.SerialNumber || node.sNo || "",
                                    Note: node.Note || "",
                                    KmRevisione: node.KmRevisione || '',
                                    Revisione: node.KmRevisione || '',
                                    RevisionNumber: node.RevisionNumber || '',
                                    RevisionKm: node.RevisionKm || '',
                                    min: node.KmMin || "",
                                    max: node.KmMax || "",
                                    Father: node.Father || node.father || "",
                                    children: node.children ? node.children.map(remapFields) : []
                                };
                            }


                            const aCleanedTree = cleanTree(aTopLevel);

                            // Step 4: Merge with existing root nodes if needed
                            const aMerged = aExisting.concat(aCleanedTree);
                            const aRemapped = aMerged.map(remapFields);
                            // Step 5: Update the model
                            oMListModel.setData({ root: aRemapped });
                            oMListModel.updateBindings();

                            // Optional debug
                            console.log("Merged Tree Data:", aRemapped);
                        }



                    });
                }
            },
            _flatten: function (aNodes, aFlat) {
                aNodes.forEach(node => {
                    let { children, ...flatNode } = node;
                    aFlat.push(flatNode);
                    if (children && children.length) {
                        this._flatten(children, aFlat);
                    }
                });
                return aFlat;
            },
            onPressSno: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
                this.bStructure = false;
                this.bSerialNumberCall = true;
                this._matListSource = "serialNumber";
                this.getView().getModel("popOver").setProperty("/popOverSource", false);
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.Popover",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
                // this.getView().byId("_IDGenLabel1Sno").setVisible(false);
                // this.getView().byId("idsnoinput").setVisible(false);
            },

            onPressStructure: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
                this.bSerialNumberCall = false;
                this.bStructure = true;
                this.getView().getModel("popOver").setProperty("/popOverSource", true);
                // create popover
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "com.piaggio.sap.lifing.lifing.view.Popover",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        // oPopover.bindElement("/ProductCollection/0");
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                });
                // this.getView().byId("_IDGenLabel1Sno").setVisible(true);
                // this.getView().byId("idsnoinput").setVisible(true);            
            },

            OnRevisionPress: function (oEvent) {
                var eMaterial = oEvent.getSource().getBindingContext("mList").getObject();
                var oDataModel = this.getOwnerComponent().getModel("eighthModel");
                var odataCall = "/ZLIFING8SET";
                var that = this;

                const currentRev = Number(eMaterial.RevisionNumber) || 0;
                const newRev = currentRev + 1;

                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'EQUIPMENT',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: eMaterial.Equipment
                        }),
                        new sap.ui.model.Filter({
                            path: 'REVISIONNUMBER',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: newRev
                        }),
                        new sap.ui.model.Filter({
                            path: 'REVISIONKM',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: '0' //eMaterial.RevisionKm
                        })
                    ],
                    and: true
                })
                oDataModel.read(odataCall, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        console.log(oresponse.results[0]);
                        if (oresponse && oresponse.results && oresponse.results.length > 0) {
                            const res = oresponse.results[0];

                            var oMListModel = that.getView().getModel("mList");
                            var oData = oMListModel.getData();

                            // Find record in model by Equipment
                            // var record = oData.root.find(r => r.Equipment === eMaterial.Equipment);
                            const record = that._findNodeByEquipment(oData.root, eMaterial.Equipment);
                            if (record) {
                                record.RevisionNumber = res.REVISIONNUMBER;
                                record.RevisionKm = res.REVISIONKM || record.RevisionKm;
                                record.KmRevisione = res.KMREVISIONE || record.KmRevisione;
                                // const normalizeKm = val => {
                                //                     if (!val) return 0;
                                //                     return Number(String(val).replace(/[^\d]/g, "")) || 0;
                                //                 };
                                const normalizeKm = val => {
                                    if (!val) return 0;

                                    // remove spaces and "km"
                                    let clean = String(val)
                                        .replace(/\s+/g, "")
                                        .replace(/km/i, "");

                                    // convert to number (decimal point remains correct)
                                    return parseFloat(clean);
                                };

                                const kmValue = record.RevisionNumber > 0
                                    ? normalizeKm(record.RevisionKm)
                                    : normalizeKm(record.Km);

                                const kmMin = normalizeKm(record.min || record.KmMin);
                                const kmMax = normalizeKm(record.max || record.KmMax);

                                let state = "G";
                                if (kmValue < kmMin) {
                                    state = "G";
                                } else if (kmValue >= kmMin && kmValue < kmMax) {
                                    state = "Y";
                                } else {
                                    state = "R";
                                }

                                record.TrafficLight = state;

                                switch (state) {
                                    case "G":
                                        record.TrafficIcon = "sap-icon://circle-task-2";
                                        record.TrafficColor = sap.ui.core.IconColor.Positive;
                                        break;
                                    case "Y":
                                        record.TrafficIcon = "sap-icon://circle-task-2";
                                        record.TrafficColor = sap.ui.core.IconColor.Critical;
                                        break;
                                    default:
                                        record.TrafficIcon = "sap-icon://circle-task-2";
                                        record.TrafficColor = sap.ui.core.IconColor.Negative;
                                        break;
                                }

                                // record.TrafficLight = "G";
                                // record.TrafficIcon  = "sap-icon://circle-task-2";
                                // record.TrafficColor = "Positive";
                            }

                            oMListModel.updateBindings();
                            sap.m.MessageToast.show("Revision details updated successfully");
                        }
                    }
                });
            },

            _findNodeByEquipment: function (arr, equipment) {
                for (const node of arr) {
                    if (node.Equipment === equipment) return node;
                    if (node.children && node.children.length) {
                        const child = this._findNodeByEquipment(node.children, equipment);
                        if (child) return child;
                    }
                }
                return null;
            },


            onSelectSerialNumberPress: function (oEvent) {

                 if (this._matListSource === "installation") {
                    this._handleInstallationSelection();
                    return;
                }

                this._oMatListDialog.close();
                // this.getView().byId("idserialNoSelect").getSelectedItems().forEach((sItem, i) => {
                //     this.getView().getModel("mList").getData().root.push({
                //         Equipment: sItem.getBindingContext("snumberList").getObject().Zequnr,
                //         MaterialDescription: sItem.getBindingContext("snumberList").getObject().Zmaktx,
                //         Material: sItem.getBindingContext("snumberList").getObject().Zmatnr,
                //         sNo: sItem.getBindingContext("snumberList").getObject().Zsernr,
                //         fg: sItem.getBindingContext("snumberList").getObject().ZfunctionalGroup || "",
                //         level: sItem.getBindingContext("snumberList").getObject().Zposition || "",
                //         Note: sItem.getBindingContext("snumberList").getObject().Note || "",
                //         km: sItem.getBindingContext("snumberList").getObject().Zkm2 || "",
                //         RevisionNumber: sItem.getBindingContext("snumberList").getObject().ZrevisionNumber || "",
                //         RevisionKm: sItem.getBindingContext("snumberList").getObject().ZrevisionKm || "",
                //         max: sItem.getBindingContext("snumberList").getObject().ZkmMax || "",
                //         min: sItem.getBindingContext("snumberList").getObject().ZkmMin || "",
                //     });
                // });
                // this.getView().getModel("mList").updateBindings();
                this.getView().byId("idserialNoSelect").getSelectedItems().forEach((sItem) => {
                    this.getView().getModel("mList").getData().root.push(this._mapSnumberItemToNode(sItem));
                });
                this.getView().getModel("mList").updateBindings();
            },
            _mapSnumberItemToNode: function (sItem) {
                const oItem = sItem.getBindingContext("snumberList").getObject();
                return {
                    Equipment: oItem.Zequnr,
                    MaterialDescription: oItem.Zmaktx,
                    Material: oItem.Zmatnr,
                    sNo: oItem.Zsernr,
                    fg: oItem.ZfunctionalGroup || "",
                    level: oItem.Zposition || "",
                    Note: oItem.Note || "",
                    km: oItem.Zkm2 || "",
                    RevisionNumber: oItem.ZrevisionNumber || "",
                    RevisionKm: oItem.ZrevisionKm || "",
                    Revisione:oItem.ZkmRevisione || "",
                    max: oItem.ZkmMax || "",
                    min: oItem.ZkmMin || "",
                    children: []
                };
            },

             _handleInstallationSelection: function () {
                const oSelectTable = this.byId("idserialNoSelect");
                const aSelectedItems = oSelectTable ? oSelectTable.getSelectedItems() : [];
                if (!aSelectedItems.length) {
                    MessageBox.error("Select at least one Equipment to install.");
                    return;
                }

                const oModel = this.getView().getModel("mList");
                const aRoot = oModel.getData().root || [];
                if (!aRoot.length || !aRoot[0].Equipment) {
                    MessageBox.error("Parent Equipment not found in first row.");
                    return;
                }

                const sParentEq = aRoot[0].Equipment;
                const sMainStorageLocation = (this.storageLocation || "").trim();
                if (!sMainStorageLocation) {
                    MessageBox.error("Main view Storage Location is mandatory for installation.");
                    return;
                }

                const aChildFilters = aSelectedItems.map((sItem) => {
                    const oData = sItem.getBindingContext("snumberList").getObject();
                    return new sap.ui.model.Filter({
                        path: "IEQUISON",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: oData.Zequnr
                    });
                });

                const oSonFilter = new sap.ui.model.Filter({
                    filters: aChildFilters,
                    and: false
                });

                const oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: "IEQUIPPARENT",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sParentEq
                        }),
                        new sap.ui.model.Filter({
                            path: "IPARAM",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: "L"
                        }),
                        new sap.ui.model.Filter({
                            path: "ILGORT",
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMainStorageLocation
                        }),
                        oSonFilter
                    ],
                    and: true
                });

                const that = this;
                this.getView().setBusy(true);
                this.getOwnerComponent().getModel("thirdModel").read("/ZLIFING3SET", {
                    filters: [oFilter],
                    success: function (oResponse) {
                        const aResults = oResponse.results || [];
                        const mResultBySon = {};
                        aResults.forEach((oRes) => {
                            mResultBySon[oRes.EEQUIPSON] = oRes;
                        });

                        const oParentNode = oModel.getData().root[0];
                        oParentNode.children = oParentNode.children || [];

                        aSelectedItems.forEach((sItem) => {
                            const oItemData = sItem.getBindingContext("snumberList").getObject();
                            const sSonEq = oItemData.Zequnr;
                            const oBackendRes = mResultBySon[sSonEq];
                            if (!oBackendRes || oBackendRes.ZRETURN !== "OK") {
                                return;
                            }

                            const bExistsAsChild = oParentNode.children.some((c) => c.Equipment === sSonEq);
                            if (bExistsAsChild) {
                                return;
                            }

                            const oNode = that._mapSnumberItemToNode(sItem);
                            oNode.Father = sParentEq;
                            oNode.fb = "INST";
                            oNode.fbMessage = "Installed";
                            oParentNode.children.push(oNode);
                        });

                        oModel.updateBindings();
                        that.getView().setBusy(false);
                        that._oMatListDialog.close();
                        MessageToast.show("Installation completed.");
                    },
                    error: function () {
                        that.getView().setBusy(false);
                        MessageBox.error("Installation failed.");
                    }
                });
            }           

        });
    });
