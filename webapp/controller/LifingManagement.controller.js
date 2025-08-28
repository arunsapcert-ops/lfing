sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
function (Controller,Fragment,MessageBox) {
    "use strict";

    return Controller.extend("com.piaggio.sap.lifing.lifing.controller.LifingManagement", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel()
			this.getView().setModel(oModel, "storageLocation");
            var oMaterials = { 
                "root":[]
            };
            var oMaterialListModel = new sap.ui.model.json.JSONModel(oMaterials);
            this.getView().setModel(oMaterialListModel, "mList");
            this.oTable =  this.getView().byId("idlifingManagementTable");
            var oEquipmentListModel = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel(oEquipmentListModel, "eList");
            var oSerialNumberListModel = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel(oSerialNumberListModel, "snumberList");
            var popOverModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(popOverModel, "popOver");
            this.mGroupData = {};
            this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent){
            this.getView().getModel("popOver").setProperty("/popOverSource", false);
            this.oTable.clearSelection();
            this.oTable.fireRowSelectionChange();
            this.getView().getModel("mList").setData({ 
                "root":[]
            });
            this.mGroupData = {};
            this.getView().getModel("eList").setData();
            this.getView().byId("_IDGenComboBoxlm").setSelectedItem(null);
            this.getView().byId("_IDGenComboBoxlm").setEnabled(true);
        },

        onNavButtonPress: function() {
            this.oTable.clearSelection();
            this.oTable.fireRowSelectionChange();
            this.getView().getModel("mList").setData({ 
                "root":[]
            });
            this.mGroupData = {};
            this.getView().getModel("eList").setData();
            this.getView().byId("_IDGenComboBoxlm").setSelectedItem(null);
            this.getView().byId("_IDGenComboBoxlm").setEnabled(true);
            this.getView().byId("_IDGenComboBoxlm").fireSelectionChange();
            window.history.go(-1);
        },

        formatStatus: function(km, kmmin, kmmax, KmRevisione){
            km = KmRevisione > 0 ? KmRevisione : km;
            if(km < kmmin){
                return sap.ui.core.ValueState.Success;
            } else if(km < kmmax){
                return sap.ui.core.ValueState.Warning;
            } else {
                return sap.ui.core.ValueState.Error;
            }
        },

        onSelectStorageLocation: function(oEvent) {
            this.storageLocation = oEvent.getSource().getSelectedKey();
            this.getView().byId("_IDGenComboBoxlm").setEnabled(this.storageLocation?false:true);
            this.getView().byId("idAddButtonl").setEnabled(true);
            this.getView().byId("_IDGenButtonsnol").setEnabled(true);
            this.getView().byId("_IDGenButtonaddsl").setEnabled(true);
        },

        onSearch: function() {
            var sno = this.getView().byId("_IDGenSearchFieldlm").getValue();
            var oDataModel = this.getOwnerComponent().getModel("fourthModel");
            var odataCall = "/ZLIFING4Set";
            var that = this;
            var oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter({
                        path: 'IMatnr',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: ""
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
                        value1: 'L'
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
        },

        OnAddMaterial: function(oEvent){
            // var oTable =  this.getView().byId("idscratchCreateTable");
            if(!this.getView().byId("idlifingManagementTable").getBinding("rows").getLength()){
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
                    if(!this.getView().byId("idlifingManagementTable").getBinding("rows").getLength()){
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
                if(!this.getView().byId("idlifingManagementTable").getBinding("rows").getLength()){
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
            // if(!sMatList.getContextByIndex(index).getObject().equipment){
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
            //  } 
           }
            // Execute all OData reads in parallel
            var mListData = this.getView().getModel("mList").getData();
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

        onTableSelection: function(oEvent){
            var seleItems = this.oTable.getSelectedIndices();
            var eqEnabled = true;
            var saveEnabled = true;
            var dismantleEnabled = false;
            if(seleItems.length){
                // this.getView().byId("_IDGenButton1").setEnabled(true);
                this.getView().byId("idDelButtonl").setEnabled(true);
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
                this.getView().byId("_IDGenButtonecl").setEnabled(eqEnabled);
                this.getView().byId("_IDGenButtonsavel").setEnabled(saveEnabled);
                this.getView().byId("_IDGenButtondisl").setEnabled(dismantleEnabled);
            } else {
                // this.getView().byId("_IDGenButton1").setEnabled(false);
                this.getView().byId("_IDGenButtonecl").setEnabled(false);
                this.getView().byId("_IDGenButtondisl").setEnabled(false);
                this.getView().byId("_IDGenButtonsavel").setEnabled(false);
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
