sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
function (Controller,Fragment,MessageBox) {
    "use strict";

    return Controller.extend("com.piaggio.sap.lifing.lifing.controller.SerialNumberCreate", {
        onInit: function () {
            var oMaterialListModel = new sap.ui.model.json.JSONModel([]);
            this.getView().setModel(oMaterialListModel, "matList");
            this.oTable =  this.getView().byId("idserialNoCreateTable");
            this.getOwnerComponent().getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent){
        },

        onNavButtonPress: function() {
            // this.oTable.clearSelection();
            this.getView().getModel("matList").setData();
            window.history.go(-1);
        },

        onSelectStorageLocation: function(oEvent) {
            this.storageLocation = oEvent.getSource().getSelectedKey();
            this.getView().byId("idAddButton1").setEnabled(true);
            // this.getView().byId("idCreationButton").setEnabled(true);
        },

        onSearch: function(oEvent) {
            var matSelected = oEvent.getSource().getValue();
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel("secondModel");
                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'IMATNR',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: matSelected
                        }),
                        new sap.ui.model.Filter({
                            path: 'ILAGER',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.storageLocation
                        }),
                    ],
                    and: true
                })
            this.getView().setBusy(true);
            var odataCall = "/ZLIFING2SET";
            oDataModel.read(odataCall, {
                filters: [oFilter],
                success: function (oresponse) {
                   console.log(oresponse.results[0]);
                   var resultData = oresponse.results;
                   var matList = [];
                   resultData.forEach((data, index)=>{
                    if(data.ERETURNCODE == "OK"){
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
                    }else if(data.ERETURNCODE == "KO"){
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

        OnAddSnoMaterial: function(oEvent){
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

        onSnoSave: function(oEvent) {
            var matData = this.getView().getModel("material").getData();
            var material = [...this.getView().getModel("matList").getData(), ...[matData]];
            this.getView().getModel("matList").setData(material);
            this.getView().getModel("matList").updateBindings();
            this._oDialog.close();
        },

        OnPressCreation: function(){
            var sMatList = this.oTable.getBinding("items");   
            var aRequests = [];    
            var bRequests = [];
            this.getView().setBusy(true);
            var that = this;
            this.getView().byId("_IDGenColumne").setVisible(true);
            this.getView().byId("_IDGenColumnd").setVisible(true);
            for(var i in this.oTable.getSelectedItems()){
                var that = this;
                var oDataModel = this.getOwnerComponent().getModel();
                // var index = this.oTable.;
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
                            value1: this.oTable.getSelectedItems()[i].getBindingContext("matList").getObject().Material
                        }),
                        new sap.ui.model.Filter({
                            path: 'ISTORLOCATION',
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: this.storageLocation
                        })
                    ],
                    and: true
                })
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
            }

            // Execute all OData reads in parallel
            var mListData = this.getView().getModel("matList").getData();
            Promise.all(aRequests).then((aResponses) => {
                for(var i in aResponses){
                    if(aResponses[i].ERETURNCODE == 'OK'){
                        var serNum = this.oTable.getSelectedItems()[i].getBindingContext("matList").getObject().snumber;
                        var oFilter = new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter({
                                    path: 'IMATNR',
                                    operator: sap.ui.model.FilterOperator.EQ,
                                    value1: aResponses[i].EMATNR
                                }),
                                new sap.ui.model.Filter({
                                    path: 'IINVNR',
                                    operator: sap.ui.model.FilterOperator.EQ,
                                    value1: ''
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
                                    value1: ''
                                }),
                                new sap.ui.model.Filter({
                                    path: 'ILAGER',
                                    operator: sap.ui.model.FilterOperator.EQ,
                                    value1: this.storageLocation
                                }),
                            ],
                            and: true
                        })
                        that.oTable.getSelectedItems()[i].getBindingContext("matList").getObject().Desc = aResponses[i].EMATDESC;
                        var oDataModel = this.getOwnerComponent().getModel("secondModel");
                        var odataCall = "/ZLIFING2SET";
                        var oRequest = new Promise((resolve, reject) => {
                            oDataModel.read(odataCall, {
                                filters: [oFilter],
                                success: function (oresponse) {
                                    resolve(oresponse.results[0]);
                                },
                                error: function (oerror) {
                                    console.log(oerror);
                                }    
                            });
                        });
                        bRequests.push(oRequest); 
                        Promise.all(bRequests).then((aResponses) => {
                            aResponses.forEach((data,index)=>{
                                that.oTable.getSelectedItems()[index].getBindingContext("matList").getObject().Equipment = data.EEQUIPMENT;
                            })
                            that.getView().getModel("matList").updateBindings();
                            that.getView().setBusy(false);
                        }); 
                    } else if(aData.ERETURNCODE == "KO") {
                        saveErr = true;
                    }
                }
            }).catch((oError) => {
                console.error("Error loading data:", oError);
            });
            if(saveErr) MessageBox.show("One or more of the creation failed");
        }
    });
});
