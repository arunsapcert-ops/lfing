sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
function (Controller,Fragment,MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("com.piaggio.sap.lifing.lifing.controller.ScratchCreate", {
        onInit: function () {
            //  console.log("XLSX version:", XLSX.version);
            var oModel = new sap.ui.model.json.JSONModel()
			this.getView().setModel(oModel, "storageLocation");
            var oMaterials = { 
                "root":[]
            };
            var oMaterialListModel = new sap.ui.model.json.JSONModel(oMaterials);
            this.getView().setModel(oMaterialListModel, "mList");
            this.oTable =  this.getView().byId("idscratchCreateTable");
            var oEquipmentListModel = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel(oEquipmentListModel, "eList");
            var oSerialNumberListModel = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel(oSerialNumberListModel, "snumberList");
            var popOverModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(popOverModel, "popOver");
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

        onRouteMatched: function(oEvent){
            this.getView().getModel("popOver").setProperty("/popOverSource", false);
            this.oTable.clearSelection();
            this.oTable.fireRowSelectionChange();
            this.getView().getModel("mList").setData({ 
                "root":[]
            });
            this.mGroupData = {};
            this.getView().getModel("eList").setData();
            this.getView().byId("fileUploader").clear();
            this.getView().byId("_IDGenComboBox1").setSelectedItem(null);
            this.getView().byId("_IDGenComboBox1").setEnabled(true);
            // this.getView().byId("_IDGenComboBox1").fireSelectionChange();
            if(oEvent.getParameters().name == "ScratchCreate"){
                this.getView().byId("idBomBox").setVisible(false);
                this.getView().byId("fileUploader").setVisible(true);
                this.getView().byId("_IDGenButtonsnr").setVisible(false);
            } else if(oEvent.getParameters().name == "BOMCreate") {
                this.getView().byId("idBomBox").setVisible(true);
                this.getView().byId("fileUploader").setVisible(false);
                this.getView().byId("_IDGenButtonsnr").setVisible(false);
            } else if(oEvent.getParameters().name == "LifingManagement") {
                this.getView().byId("idBomBox").setVisible(true);
                this.getView().byId("fileUploader").setVisible(false);
                this.getView().byId("_IDGenButtonsnr").setVisible(true);
            }
        },

        onNavButtonPress: function() {
            this.oTable.clearSelection();
            this.oTable.fireRowSelectionChange();
            this.getView().getModel("mList").setData({ 
                "root":[]
            });
            this.mGroupData = {};
            this.getView().getModel("eList").setData();
            this.getView().byId("fileUploader").clear();
            this.getView().byId("_IDGenComboBox1").setSelectedItem(null);
            this.getView().byId("_IDGenComboBox1").setEnabled(true);
            this.getView().byId("_IDGenComboBox1").fireSelectionChange();
            window.history.go(-1);
        },

        onSelectStorageLocation: function(oEvent) {
            this.storageLocation = oEvent.getSource().getSelectedKey();
            this.getView().byId("_IDGenComboBox1").setEnabled(this.storageLocation?false:true);
            this.getView().byId("idAddButton").setEnabled(true);
            this.getView().byId("fileUploader").setEnabled(true);
            this.getView().byId("_IDGenButtonsno").setEnabled(true);
            this.getView().byId("_IDGenButtonadds").setEnabled(true);
        },

        onSearch: function(oEvent) {
            var matSelected = oEvent.getSource().getValue();
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
                   resultData.forEach((data, index)=>{
                    if(data.ERETURNCODE == "OK"){
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
                            Description: data.EMATDESC,
                            sNo: "",
                            km: "",
                            Revisione: data.EKMREVISION,
                            min: data.EKMMIN,
                            max: data.EKMMAX,
                            children : []
                        };
                        matList.push(matObj);
                        //For grouping and sorting
                        if(typeof that.mGroupData[matObj.fg] === "undefined"){
                            that.mGroupData[matObj.fg] = [];
                            that.mGroupData[matObj.fg].push(matObj);
                            that.mGroupData[matObj.fg].sort((a, b) => a.level - b.level);
                        } else {
                            that.mGroupData[matObj.fg].push(matObj);
                            that.mGroupData[matObj.fg].sort((a, b) => a.level - b.level);
                        }
                    } else if(data.ERETURNCODE == "KO"){
                        MessageBox.show("No Data Found");
                    }
                   });
                   var mergedData = [...that.getView().getModel("mList").getData().root, ...matList];
                   that.getView().byId("_IDGenSearchField").setValue();
                   that.getView().getModel("mList").getData().root = mergedData;
                   that.getView().getModel("mList").updateBindings();
                //    that.sortTableData();
                   that.getView().setBusy(false);
                },
                error: function (oerror) {
                    console.log(oerror)
                }    
            });
        },

        handleUploadPress: function(oEvent) {
            var file = oEvent.getParameter("files")[0]; // Get selected file
            var sFileName = file.name;

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
            reader.onload = function(e) {
                // var data = new Uint8Array(e.target.result);
                // var workbook = XLSX.read(data, { type: 'array' });
                // console.log(workbook);
                var fileData = e.target.result; // Read file content as string
                // Parse data based on file format (e.g., CSV, Excel) [4, 5, 7]
                var parsedData = that.parseCSVData(fileData); // Example function
                for(var i=1; i<parsedData.length; i++){
                    if(parsedData[i].length){
                        var matData = {
                            level : parsedData[i][0] ,
                            fg : parsedData[i][1],
                            Material : parsedData[i][2]
                        }
                        matData.children = [];
                        if(matData.level == 1){
                            that.getView().getModel("mList").getData().root.forEach((mObject,i)=>{
                                if(mObject.level == 1){
                                    saveError = true;
                                    MessageBox.show("Material with position 1 is already present. Please change the position");
                                }
                            });
                        }
                    if(!saveError){
                        matList.push(matData);
                        //For grouping and sorting
                        if(typeof that.mGroupData[matData.fg] === "undefined"){
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
                if(!saveError){
                    var mergedData = [...that.getView().getModel("mList").getData().root, ...matList];
                    that.onMaterialCheck(mergedData);
                    that.getView().getModel("mList").getData().root = mergedData;
                    that.getView().getModel("mList").updateBindings();
                    // that.getView().getModel("mList").setData(matList);
                    that.sortTableData();
                    that.getView().byId("fileUploader").setValue();
                    // // Create a JSON model and set data
                    // var oModel = new sap.ui.model.json.JSONModel(parsedData);
                    // that.getView().setModel(oModel); [3, 6, 8]
                }
            }
            reader.readAsText(file);
            that.getView().byId("fileUploader").setValue();
        },

        parseCSVData: function(csvString) {
            var rows = csvString.split("\n");
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                if(rows[i].length){
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

        OnAddMaterial: function(oEvent){
            // var oTable =  this.getView().byId("idscratchCreateTable");
            if(!this.getView().byId("idscratchCreateTable").getBinding("rows").getLength()){
                var oMaterialModel = new sap.ui.model.json.JSONModel({
                    level: 1, 
                    fg: "",
                    Material:""
                });
            } else {
                var oMaterialModel = new sap.ui.model.json.JSONModel({
                    level: "", 
                    fg: "",
                    Material:""
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
                    if(!this.getView().byId("idscratchCreateTable").getBinding("rows").getLength()){
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
                if(!this.getView().byId("idscratchCreateTable").getBinding("rows").getLength()){
                    this.byId("idFgrp").setEnabled(false);
                    this.byId("idLevel").setEnabled(false);
                } else {
                    this.byId("idFgrp").setEnabled(true);
                    this.byId("idLevel").setEnabled(true);
                }
                this._oDialog.open();
            }
        },

        OnDeleteMaterial: function(oEvent){
            // var oTable =  this.getView().byId("idscratchCreateTable");
            var dMatList = this.oTable.getSelectedIndices();  
            var delConfirm = true;
            var that = this;
            for(var i in dMatList){
                if(this.oTable.getContextByIndex(dMatList[i]).getPath().includes("children")){
                    var parentPath = this.oTable.getContextByIndex(dMatList[i]).getPath().split("children")[0];
                    var childIndex = this.oTable.getContextByIndex(dMatList[i]).getPath().split("/").pop();
                    this.getView().getModel("mList").getProperty(parentPath).children.splice(childIndex, 1);
                    this.getView().getModel("mList").updateBindings();
                }
                else if(this.oTable.getContextByIndex(dMatList[i]).getObject().children.length){
                    MessageBox.confirm("Selected Item has children material, would you like to delete including children", {
                        title: "Delete Confirmation",
                        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                        onClose: function(sButton) {
                            if (sButton === MessageBox.Action.YES) {
                                var parentPath = "/"+this.oTable.getContextByIndex(dMatList[i]).getPath().split("/")[1];
                                var childIndex = this.oTable.getContextByIndex(dMatList[i]).getPath().split("/").pop();
                                this.getView().getModel("mList").getProperty(parentPath).splice(childIndex, 1);
                                this.getView().getModel("mList").updateBindings();
                            } else if (sButton === MessageBox.Action.NO) {
                                delConfirm = false;
                            }
                        }.bind(this)
                    });
                } else {
                    var parentPath = "/"+this.oTable.getContextByIndex(dMatList[i]).getPath().split("/")[1];
                    var childIndex = this.oTable.getContextByIndex(dMatList[i]).getPath().split("/").pop();
                    var groupRemoveIndex = this.mGroupData[this.oTable.getContextByIndex(dMatList[i]).getObject().fg].findIndex((obj)=>obj.Material == this.oTable.getContextByIndex(dMatList[i]).getObject().Material && obj.level == this.oTable.getContextByIndex(dMatList[i]).getObject().level);
                    this.mGroupData[this.oTable.getContextByIndex(dMatList[i]).getObject().fg].splice(groupRemoveIndex, 1);
                    this.getView().getModel("mList").getProperty(parentPath).splice(childIndex, 1);
                    this.getView().getModel("mList").updateBindings();
                }
            } 
            this.oTable.clearSelection();
            this.oTable.fireRowSelectionChange();     
        },

        materialCheck: function(matData) {
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
                    if(oresponse.results[0].ERETURNCODE == "OK"){
                        var ind = that.getView().getModel("mList").getData().root.length - 1;
                        that.getView().getModel("mList").getData().root[ind].Description = oresponse.results[0].EMATDESC;
                        that.getView().getModel("mList").getData().root[ind].sNo = "";
                        // that.getView().getModel("mList").getData().root[ind].isNo = that.getView().getModel("mList").getData().root[ind].isNo ? that.getView().getModel("mList").getData().root[ind].isNo : "";
                        that.getView().getModel("mList").getData().root[ind].km = that.getView().getModel("mList").getData().root[ind].km ? that.getView().getModel("mList").getData().root[ind].km: ""; 
                        that.getView().getModel("mList").getData().root[ind].Revisione = oresponse.results[0].EKMREVISION;
                        that.getView().getModel("mList").getData().root[ind].min = oresponse.results[0].EKMMIN;
                        that.getView().getModel("mList").getData().root[ind].max = oresponse.results[0].EKMMAX;   
                        that.getView().getModel("mList").updateBindings();
                        that.oTable.clearSelection();
                        that.oTable.fireRowSelectionChange(); 
                        that.sortTableData();
                    } else if(data.ERETURNCODE == "KO"){
                        MessageBox.show("No Data Found");
                    }
                },
                error: function (oerror) {
                    console.log(oerror)
                }    
            });

        },

        onMaterialCheck: function(matList) {
            // var oTable =  this.getView().byId("idscratchCreateTable");
            var aRequests = [];
            for(var i in matList){
            // var oMatObj =sMatList[i].getBindingContext("mList").getObject()
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel();
                // var index = this.oTable.getSelectedIndices()[i];
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
                })
            //   if(!sMatList.getContextByIndex(index).getObject().Description){
                var odataCall = "/ZLIFING1SET";
                var oRequest = new Promise((resolve, reject) => {
                    oDataModel.read(odataCall, {
                        filters: [oFilter],
                        success: function (oresponse) {
                            resolve(oresponse.results[0]);
                        },
                        error: function (oerror) {
                            console.log(oerror)
                        }    
                    });
                }); 
                aRequests.push(oRequest); 
            //   }
            }

            // Execute all OData reads in parallel
            var mListData = this.getView().getModel("mList").getData().root;
            var saveErr = false;
            Promise.all(aRequests).then((aResponses) => {
                aResponses.forEach((aData, index) => {
                    if(aData.ERETURNCODE == "OK"){
                        // var ind = that.getView().getModel("mList").getData().root.findIndex(mat => mat.Material == aData.IMATNR && mat.level == aData.ELEVEL);
                        that.getView().getModel("mList").getData().root[index].Description = aData.EMATDESC;
                        that.getView().getModel("mList").getData().root[index].sNo = "";
                        // that.getView().getModel("mList").getData().root[index].isNo = that.getView().getModel("mList").getData().root[index].isNo ? that.getView().getModel("mList").getData().root[index].isNo : "";
                        that.getView().getModel("mList").getData().root[index].km = that.getView().getModel("mList").getData().root[index].km ? that.getView().getModel("mList").getData().root[index].km: ""; 
                        that.getView().getModel("mList").getData().root[index].Revisione = aData.EKMREVISION;
                        that.getView().getModel("mList").getData().root[index].min = aData.EKMMIN;
                        that.getView().getModel("mList").getData().root[index].max = aData.EKMMAX;    
                    } else if(aData.ERETURNCODE == "KO") {
                        saveErr = true;
                    }
                });
                that.getView().getModel("mList").updateBindings();
                that.oTable.clearSelection();
                that.oTable.fireRowSelectionChange();
                that.getView().setBusy(false);
            }).catch((oError) => {
                console.error("Error loading data:", oError);
            });
            if(saveErr) MessageBox.show("One or more of the selected materials check failed");

        },

        onEquipmentCreation: function(oEvent){
            var sMatList = this.oTable.getBinding("rows");   
            var aRequests = [];  
            this.getView().setBusy(true);
            // this.getView().byId("_IDGenButtonsave").setEnabled(true);     
            // var that = this;         
            for(var i in this.oTable.getSelectedIndices()){
            // var oMatObj =sMatList[i].getBindingContext("mList").getObject()
                var index = this.oTable.getSelectedIndices()[i];
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel("secondModel");
                var serNum = sMatList.getContextByIndex(index).getObject().sNo;
                if(sMatList.getContextByIndex(index).getObject().Description.trim() == ""){
                    return;
                }
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'IMATNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMatList.getContextByIndex(index).getObject().Material
                        }),
                        new sap.ui.model.Filter({
                            path: 'IINVNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMatList.getContextByIndex(index).getObject().km
                        }),
                        new sap.ui.model.Filter({
                            path: 'IGROES',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMatList.getContextByIndex(index).getObject().level
                        }),
                        new sap.ui.model.Filter({
                            path: 'ISERNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: serNum
                        }),
                        new sap.ui.model.Filter({
                            path: 'ITIDNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sMatList.getContextByIndex(index).getObject().fg
                        }),
                        new sap.ui.model.Filter({
                            path: 'ILAGER',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.storageLocation
                        }),
                    ],
                    and: true
                })
            if(sMatList.getContextByIndex(index).getObject().equipment !== ""){
                MessageBox.show("Equipment already exists");
            } else {
                var odataCall = "/ZLIFING2SET";
                var oRequest = new Promise((resolve, reject) => {
                    oDataModel.read(odataCall, {
                        filters: [oFilter],
                        success: function (oresponse) {
                            resolve(oresponse.results[0]);
                        },
                        error: function (oerror) {
                            console.log(oerror)
                        }    
                    });
                }); 
                aRequests.push(oRequest);
             } 
           }
            // Execute all OData reads in parallel
            var mListData = this.getView().getModel("mList").getData();
            var saveErr = false;
            Promise.all(aRequests).then((aResponses) => {
                aResponses.forEach((aData, index) => {
                  if(aData.ERETURNCODE == "OK"){
                    var ind = that.oTable.getSelectedIndices()[index];
                    that.getView().getModel("mList").getData().root[ind].equipment = aData.EEQUIPMENT;
                    that.getView().getModel("mList").getData().root[ind].km = aData.IINVNR;
                    that.getView().getModel("mList").getData().root[ind].level = aData.IGROES;
                    that.getView().getModel("mList").getData().root[ind].sNo = aData.ISERNR;
                    that.getView().getModel("mList").updateBindings();
                    // that.getView().byId("_IDGenColumnec").setVisible(true);
                  } else if(aData.ERETURNCODE == "KO") {
                        saveErr = true;
                  }
                });
                that.oTable.clearSelection();
                that.oTable.fireRowSelectionChange();
                that.getView().setBusy(false);
            }).catch((oError) => {
                console.error("Error loading data:", oError);
            });
            if(saveErr) MessageBox.show("Equipment creation failed for one or more materials");
        },

        OnEditMaterial: function(oEvent) {
            var eMaterial = oEvent.getSource().getBindingContext("mList").getObject();
            this.edit_path = oEvent.getSource().getBindingContext("mList").getPath();
            var eMaterialModel = new sap.ui.model.json.JSONModel({
                level: eMaterial.level, 
                fg: eMaterial.fg,
                Material: eMaterial.Material,
                km: eMaterial.km,
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

        onSave: function(oEvent) {
            console.log("save button clicked");
            // var oTable =  this.getView().byId("idscratchCreateTable");
            var saveError = false;
            var matData = this.getView().getModel("material").getData();
            matData.children = [];
            if(matData.level == 1){
                this.getView().getModel("mList").getData().root.forEach((mObject,i)=>{
                    if(mObject.level == 1){
                        saveError = true;
                        MessageBox.show("Material with position 1 is already present. Please change the position");
                    }
                });
            }
            if(!saveError){
                var oMaterials = {
                    root : []
                }
                oMaterials.root = [...this.getView().getModel("mList").getData().root, ...[matData]];
                this.getView().getModel("mList").setData(oMaterials);
                // this.getView().getModel("mList").getData().push(matData);
                this.getView().getModel("mList").updateBindings();
                // var mListData = this.getView().getModel("mList").getData();
                // mGroupData[mListData[i].fg] = [];
                if(typeof this.mGroupData[matData.fg] === "undefined"){
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

        sortTableData: function() {
            var matList = {};
            matList.root =[];
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

        onEditSave: function(oEvent) {
            console.log("edit save button clicked");
            var matData = this.getView().getModel("ematerial").getData();
            // var path = parseInt(this.edit_path.split('/')[1]);
            var oldData = JSON.parse(JSON.stringify(this.getView().getModel("mList").getProperty(this.edit_path)));
            var oDataModel = this.getOwnerComponent().getModel("seventhModel");
            var equ = this.getView().getModel("mList").getProperty(this.edit_path).equipment ? this.getView().getModel("mList").getProperty(this.edit_path).equipment : ""; 
            var odataCall = "/ZLIFING7Set(IEquipment='" + equ +
                            "',INote='"+ matData.km + "',IPosition='" + matData.level + "',IFunctiongroup='" + matData.fg + "',ISerialNumber='" + matData.sno +
                            "',IStoragelocation='" + this.storageLocation + "')"; 
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
                    if(oresponse.ReturnCode == "KO"){
                        MessageBox.show("Material update failed");
                        oresponse = {};
                    } else {
                    // that.getView().getModel("snumberList").setData(oresponse.results);
                    // that.openMatListDialog();  
                    that.getView().getModel("mList").getProperty(that.edit_path).level = oresponse.IPosition;
                    that.getView().getModel("mList").getProperty(that.edit_path).fg = oresponse.IFunctiongroup;
                    that.getView().getModel("mList").getProperty(that.edit_path).Material = matData.Material;
                    that.getView().getModel("mList").getProperty(that.edit_path).km = oresponse.INote;
                    that.getView().getModel("mList").getProperty(that.edit_path).sNo = oresponse.ISerialNumber;
                    that.getView().getModel("mList").updateBindings();
                    // Sorting and grouping after edit
                    that.mGroupData = {}
                for(var i in that.getView().getModel("mList").getData().root){
                    matData = that.getView().getModel("mList").getData().root[i];
                    if(typeof that.mGroupData[matData.fg] === "undefined"){
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

        onTableSelection: function(oEvent){
            var seleItems = this.oTable.getSelectedIndices();
            var eqEnabled = true;
            var saveEnabled = true;
            var dismantleEnabled = false;
            // var snoEnabled = false;
            // if(seleItems.length == 1){
            //     snoEnabled = true;
            // }
            // this.getView().byId("_IDGenButtonsno").setEnabled(snoEnabled);
            if(seleItems.length){
                // this.getView().byId("_IDGenButton1").setEnabled(true);
                this.getView().byId("idDelButton").setEnabled(true);
                for(var i in seleItems){
                    if(!this.oTable.getContextByIndex(seleItems[i]).getObject().Description ||
                        this.oTable.getContextByIndex(seleItems[i]).getObject().Description.trim() == ""){
                            eqEnabled = false;
                    }
                    if(!this.oTable.getContextByIndex(seleItems[i]).getObject().equipment ||
                        this.oTable.getContextByIndex(seleItems[i]).getObject().equipment.trim() == ""){
                            saveEnabled = false;
                    }
                    if(seleItems.length == 1 && this.oTable.getContextByIndex(seleItems[i]).getObject().children.length){
                        dismantleEnabled = true;
                    }
                }
                if(!(seleItems.length > 1)){
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
        },

        onSaveEquipment: function(oEvent) {
            var aMatList = this.oTable.getSelectedIndices();
            var sMatList = this.oTable.getBinding("rows");          
            var aEquList = [];
            aMatList.forEach((index)=>{
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
                    this._oEquipDialog.open(); // Open dialog
                }.bind(this));
            } else {
                this._oEquipDialog.open();
            }            
        },

        oncloseDialog: function(oEvent) {
            this._oDialog.close();
        },

        onEditClose: function(oEvent) {
            this._oEditDialog.close();
        },

        oneqSave: function(oEvent) {
           var EquParent = this.byId("idequCreateTable").getSelectedItem().getBindingContext("eList").getObject().equipment;
           var ParentIndex = parseInt(this.byId("idequCreateTable").getSelectedItem().getBindingContext("eList").getPath().substring(1));
           var childrenItemPaths = [];
        //    var iParentItemIndex = ""
           var aItems =  [...this.byId("idequCreateTable").getItems()];
           aItems.splice(ParentIndex,1);
           var sonFilterArray = [];
           //parent item index
           this.iParentItemPath = this.byId("idequCreateTable").getSelectedItem().getBindingContext("eList").getObject().itemPath;
           aItems.forEach((equ, i) => {
                childrenItemPaths.push(equ.getBindingContext("eList").getObject().itemPath);
                sonFilterArray.push(
                    new sap.ui.model.Filter({
                        path: 'IEQUISON',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: equ.getBindingContext("eList").getObject().equipment
                    })
                );
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
                    value1: EquParent
                }),
                new sap.ui.model.Filter({
                    path: 'IPARAM',
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: 'S'
                }),
                sonFilter],
            and: true
        })
        this.getView().setBusy(true);
        var oDataModel = this.getOwnerComponent().getModel("thirdModel");
        var odataCall = "/ZLIFING3SET";
        var that = this;
        oDataModel.read(odataCall, {
            filters: [oFilter],
            success: function (oresponse) {
                oresponse.results.forEach((oEqu, index)=>{
                    for(var i in that.getView().getModel("mList").getData().root){
                        if(that.getView().getModel("mList").getData().root[i].equipment === oEqu.EEQUIPSON){
                            that.getView().getModel("mList").getData().root[i].fb = oEqu.ZRETURN;
                            that.getView().getModel("mList").getData().root[i].fbMessage = oEqu.ZRETURN_MSG;
                        }
                    }
                });
                 //add children index data array to parent index data
                // var parentObj = that.getView().getModel("mList").getData().root[that.iParentItemIndex];
                for(var i in childrenItemPaths){
                    that.getView().getModel("mList").getProperty(that.iParentItemPath).children.push(
                        that.getView().getModel("mList").getProperty(childrenItemPaths[i])
                    )
                }
                // Sort numerically
                childrenItemPaths.sort((a, b) => {
                    var numA = parseInt(a.match(/\d+$/)[0], 10); // Extract number from path
                    var numB = parseInt(b.match(/\d+$/)[0], 10);
                    return numB - numA; // Descending order
                });
                for(var i in childrenItemPaths){
                    // Rearrange the mgroup data
                    var groupRemoveIndex = that.mGroupData[that.getView().getModel("mList").getProperty(childrenItemPaths[i]).fg].findIndex((obj)=>obj.equipment == that.getView().getModel("mList").getProperty(childrenItemPaths[i]).equipment);
                    that.mGroupData[that.getView().getModel("mList").getProperty(childrenItemPaths[i]).fg].splice(groupRemoveIndex, 1);
                    //Remove the children from root
                    var aParentArray = that.getView().getModel("mList").getData();
                    var aPathParts = childrenItemPaths[i].split('/');
                    for (var j = 1; j < aPathParts.length - 1; j++) {
                        if(aPathParts[j] == "children"){
                            aParentArray = aParentArray.children; 
                        } else {
                            aParentArray = aParentArray[aPathParts[j]];
                        }
                    }
                    // Remove the selected node
                    var iIndexToRemove = parseInt(aPathParts[aPathParts.length - 1], 10);
                    aParentArray.splice(iIndexToRemove, 1);
                    var aParentArray = that.getView().getModel("mList").getData();    
                }

                that.getView().getModel("mList").updateBindings();
                that.getView().byId("_IDGenColumnfb").setVisible(true);
                that.oTable.clearSelection();
                that.oTable.fireRowSelectionChange();
                that.getView().setBusy(false);
            },
            error: function (oerror) {
                console.log(oerror)
            }    
        });
        this._oEquipDialog.close();
        },

        onPressDismantle: function(oEvent){
            var peqIndex = this.oTable.getSelectedIndices();
            this.parentEquipment = this.oTable.getContextByIndex(peqIndex[0]).getObject();
            var childModel = new sap.ui.model.json.JSONModel(this.parentEquipment.children);
            this.getView().setModel(childModel, "ChildList");
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

        onDismantleConfirmation: function(oEvent){
           var sonFilterArray = [];
           var selectedChildren = this.getView().byId("idChildEquTable").getSelectedItems();
           selectedChildren.forEach((childEq, i)=>{
                sonFilterArray.push(
                    new sap.ui.model.Filter({
                        path: 'IEQUISON',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: childEq.getBindingContext("ChildList").getObject().equipment
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
                                   value1: this.parentEquipment.equipment
                               }),
                               new sap.ui.model.Filter({
                                   path: 'IPARAM',
                                   operator: sap.ui.model.FilterOperator.EQ,
                                   value1: 'D'
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
                                oresponse.results.forEach((res, index)=>{
                                    if(res.ZRETURN == "OK"){
                                        removedIndex = that.parentEquipment.children.findIndex(eqObj => eqObj.equipment == res.EEQUIPSON);
                                        that.getView().getModel("mList").getData().root.push(that.parentEquipment.children[removedIndex]);
                                        that.parentEquipment.children[removedIndex].fb = "";
                                        that.parentEquipment.children[removedIndex].fbMessage = "";
                                        that.mGroupData[that.parentEquipment.children[removedIndex].fg].push(that.parentEquipment.children[removedIndex]);
                                        that.mGroupData[that.parentEquipment.children[removedIndex].fg].sort((a, b) => a.level - b.level);
                                        that.parentEquipment.children.splice(removedIndex, 1);
                                        that.getView().getModel("mList").updateBindings();
                                        that._oChildEquipDialog.close();
                                        that.sortTableData();
                                    } else if(res.ZRETURN == "KO"){
                                        MessageBox.show("Dismantle failed");
                                    }
                                });
                            }        
                           });
        },

        oncloseeqDialog: function(oEvent){
            this._oChildEquipDialog.close();
        },

        openMatListDialog: function(oEvent) {
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

        handleSearchPress: function(oEvent){
            var material = this.getView().byId("idmatinput").getValue();
            var sno = this.getView().byId("idsnoinput").getValue();
            this._pPopover.then(function(oPopover) {
                oPopover.close();
            });
            if(this.bSerialNumberCall){
                var oDataModel = this.getOwnerComponent().getModel("fifthModel");
                var odataCall = "/ZLIFING5Set";
                var that = this;
                this.bSerialNumberCall = false;
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
                            value1: this.storageLocation
                        }),
                    ],
                    and: true
                })
                oDataModel.read(odataCall, {
                    filters: [oFilter],
                    success: function (oresponse) {
                        console.log(oresponse.results);
                        if(oresponse.results[0].Zreturn == "KO"){
                            oresponse.results = [];
                        }
                        that.getView().getModel("snumberList").setData(oresponse.results);
                        that.openMatListDialog();
                    }
                });  
            } else if(this.bStructure){
                var oDataModel = this.getOwnerComponent().getModel("fourthModel");
                var odataCall = "/ZLIFING4Set";
                var that = this;
                this.bStructure = false;
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
                            value1: this.storageLocation
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
                success: function (oresponse) {
                    console.log(oresponse.results[0]);
                }
            });   
            } 
        },

        onPressSno: function(oEvent) {
            var oButton = oEvent.getSource(),
            oView = this.getView();
            this.bStructure = false;
            this.bSerialNumberCall = true;
            this.getView().getModel("popOver").setProperty("/popOverSource", false);
            // create popover
            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "com.piaggio.sap.lifing.lifing.view.Popover",
                    controller: this
                }).then(function(oPopover) {
                    oView.addDependent(oPopover);
                    // oPopover.bindElement("/ProductCollection/0");
                    return oPopover;
                });
            }
            this._pPopover.then(function(oPopover) {
                oPopover.openBy(oButton);
            });
            // this.getView().byId("_IDGenLabel1Sno").setVisible(false);
            // this.getView().byId("idsnoinput").setVisible(false);
        },

        onPressStructure: function(oEvent) {
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
                }).then(function(oPopover) {
                    oView.addDependent(oPopover);
                    // oPopover.bindElement("/ProductCollection/0");
                    return oPopover;
                });
            }
            this._pPopover.then(function(oPopover) {
                oPopover.openBy(oButton);
            });
            // this.getView().byId("_IDGenLabel1Sno").setVisible(true);
            // this.getView().byId("idsnoinput").setVisible(true);            
        },

        OnRevisionPress: function(oEvent){
            var eMaterial = oEvent.getSource().getBindingContext("mList").getObject();
            var oDataModel = this.getOwnerComponent().getModel("eighthModel");
            var odataCall = "/ZLIFING8SET";
            var that = this;
            var oFilter = new sap.ui.model.Filter({
                   filters: [
                        new sap.ui.model.Filter({
                            path: 'EQUIPMENT',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: eMaterial.equipment
                        }),
                        new sap.ui.model.Filter({
                            path: 'REVISIONNUMBER',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: eMaterial.RevisionNumber
                        }),
                        new sap.ui.model.Filter({
                            path: 'REVISIONKM',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: eMaterial.RevisionKm
                        })
                    ],
                    and: true
            })
            oDataModel.read(odataCall, {
                filters: [oFilter],
                success: function (oresponse) {
                    console.log(oresponse.results[0]);
                }
            });   
        },

        onSelectSerialNumberPress: function(oEvent){
            this._oMatListDialog.close();
            this.getView().byId("idserialNoSelect").getSelectedItems().forEach((sItem, i)=>{
                this.getView().getModel("mList").getData().root.push({
                    equipment : sItem.getBindingContext("snumberList").getObject().Zequnr,
                    Description : sItem.getBindingContext("snumberList").getObject().Zmaktx,
                    Material : sItem.getBindingContext("snumberList").getObject().Zmatnr,
                    sNo: sItem.getBindingContext("snumberList").getObject().Zsernr
                });
            });
            this.getView().getModel("mList").updateBindings();
        }

        });
    });
