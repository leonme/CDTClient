sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button'
], function (jQuery, Fragment, Controller, JSONModel, Popover, Button) {
	"use strict";

	var CController = Controller.extend("com.sap.cdt.controller.rootApp", {
		model: new sap.ui.model.json.JSONModel(),
		data: {
			navigation: [{
				title: 'Routing',
				icon: 'sap-icon://employee',
				expanded: true,
				items: [{
					title: 'Demo Routing 1',
					key: 'routing__chuangdian',
                    bpmn: ''
				}, {
					title: 'Demo Routing 2',
					key: 'routing__2',
                    bpmn: ''
				}]
			}, {
				title: 'Operational Routing',
				icon: 'sap-icon://opportunities',
                expanded: true,
                items: []
			}, {
				title: 'Technical Routing',
				icon: 'sap-icon://user-settings',
                expanded: true,
                items: [{
				    title: 'Technical Routing 1',
                    key: 'tech-routing__1',
                    bpmn: ''
                }]
			}],
			fixedNavigation: [{
				title: 'User Account',
				icon: 'sap-icon://person-placeholder'
				}, {
					title: 'Organization',
					icon: 'sap-icon://building'
				}, {
					title: 'Help Link',
					icon: 'sap-icon://sys-help-2'
			}],
			headerItems: [
				{
					text: "File"
				}, {
					text: "Edit"
				}, {
					text: "View"
				}, {
					text: "Settings"
				}, {
					text: "Help"
				}]
		},
		onInit: function() {
			this.model.setData(this.data);
			this.getView().setModel(this.model);
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);
            this.byId("openFileMenu").attachBrowserEvent("tab keyup", function(oEvent){
                this._bKeyboard = oEvent.type == "keyup";
            }, this);
            this.byId("openEditMenu").attachBrowserEvent("tab keyup", function(oEvent){
                this._bKeyboard = oEvent.type == "keyup";
            }, this);
		},

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

        getBpmnFromData: function(oNavigation, sKey){
		    var sBpmn = '';
            oNavigation.items.forEach(function (item) {
                if(sKey === item.key) {
                    sBpmn = item.bpmn;
                }
            });
        },

        createLoadMeDialog: function () {
            var dialog = new sap.m.Dialog({
                title:'Load routing ...',
                contentWidth:'30%',
                contentHeight:'20%',
                draggable:true,

            });

            var simpleForm = new sap.ui.layout.form.SimpleForm({
                labelSpanL : 2,
                editable: true,
                layout:'ResponsiveGridLayout'
            });
            var columnNameLabel = new sap.m.Label({
                text:'Routing Name',
                textAlign:'Center',
                required:true,
            });
            var columnNameInput=  new sap.m.Input({
                id:'routingName'
            });
            columnNameLabel.setLabelFor(columnNameInput);
            simpleForm.addContent(columnNameLabel).addContent(columnNameInput);
            dialog.addContent(simpleForm);
            dialog.addButton(new sap.m.Button("OK",{text:'OK', press:function(){
                cdt.util.Operations.openCleanDiagramConfirmMsg(sap.ui.getCore().byId('routingName').getValue(), oEditor);
                dialog.close();
                dialog.destroy();

            }
            }));

            dialog.open();
        },

		onItemSelect: function(oEvent) {
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();
			var sText = oItem.getText();
			var sKeyPrefix = sKey.split(/__/)[0];
			var sKeyPostfix = sKey.split(/__/)[1];
			if(sKeyPrefix && "routing" == sKeyPrefix) {
                var oData = this.getView().getModel().getData();
                var routingRefName = sKeyPostfix;
                var oRoutingNavigation = oData.navigation[0];
                // var sBpmn = this.getBpmnFromData(oRoutingNavigation, sKey);
                var url_gettingRoutings = getBaseUrl() + '/cdt/routings/'+routingRefName.trim();
                var sBpmn = getServiceResponse(url_gettingRoutings);
                // use event bus to reload diagram
                var customData = {bpmn: sBpmn};
                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.publish("RoutingDiagram", "reloadDiagram",customData);
                // get refinable operations of selected routing
                var url_gettingOperations = getBaseUrl() + "/cdt/routings/operations/" + routingRefName.trim();
                var operations = JSON.parse(getServiceResult(url_gettingOperations));

			    var navigationTitle = oData.navigation[1].title;
			    if(navigationTitle.match(/\[(.+?)\]/g)){
                    navigationTitle = navigationTitle.replace(/\[(.+?)\]/g, "[" + sText + "]");
                } else {
                    navigationTitle += "[" + sText + "]";
                }
                oData.navigation[1].title = navigationTitle;
			    if(operations.length > 0) {
			        for(var i=0; i<operations.length; i++) {
                        var item = {"title": operations[i], "key": "op-routing__" +operations[i]};
                        oData.navigation[1].items[i] = item;
                    }
                } else {
                    oData.navigation[1].items = [];
                }
                var sViewId = this.getView().getId();
                var navigationItems =sap.ui.getCore().byId(sViewId + "--sideNavigationList");
                navigationItems.getModel().refresh(true);
            } else if(sKeyPrefix && "op-routing" == sKeyPrefix){
                // TODO: on select item event for operational raouting
            } else if(sKeyPrefix && "tech-routing" == sKeyPrefix){
                var customData = {};
                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.publish("TechRoutingDiagram", "reloadDiagram",customData);
			}
			this.getRouter().navTo(sKeyPrefix);
		},

        handleLoadMeRoutingPress: function (oEvent) {
            this.createLoadMeDialog();
            var inputRoutingName = sap.ui.getCore().byId('routingName').getValue();
            var oData = this.getView().getModel().getData();
            var oRoutingNavigation = oData.navigation[0];
            // get bpmn from backend server by routing name
            var url_gettingRoutings = getBaseUrl() + '/cdt/routings/'+inputRoutingName.trim();
            var bpmn = getServiceResponse(url_gettingRoutings);
            var newItemObj = {'title': inputRoutingName,
                                'key': 'routing__'+inputRoutingName,
                                'bpmn': bpmn};
            oRoutingNavigation.items.push(newItemObj);
        },

		handleUserNamePress: function(oEvent) {
			var oPopover = new Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content:[
					new Button({
						text: 'Feedback',
						type: sap.m.ButtonType.Transparent
					}),
					new Button({
						text: 'Help',
						type: sap.m.ButtonType.Transparent
					}),
					new Button({
						text: 'Logout',
						type: sap.m.ButtonType.Transparent
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(oEvent.getSource());
		},

		onSideNavButtonPress: function() {
			var sViewId = this.getView().getId();
			var oToolPage = sap.ui.getCore().byId(sViewId + "--sideNavigation");
			var bSideExpanded = oToolPage.getExpanded();
			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setExpanded(!oToolPage.getExpanded());
		},
        onHeaderFileButtonPress: function (oEvent) {
            var oButton = oEvent.getSource();
            // create menu only once
            if (!this._fileMenu) {
                this._fileMenu = sap.ui.xmlfragment(
                    "com.sap.cdt.fragment.FileMenu",
                    this
                );
                this.getView().addDependent(this._fileMenu);
            }

            var eDock = sap.ui.core.Popup.Dock;
            this._fileMenu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
        },
        onHeaderEditButtonPress: function (oEvent) {
            var oButton = oEvent.getSource();
            // create menu only once
            if (!this._editMenu) {
                this._editMenu = sap.ui.xmlfragment(
                    "com.sap.cdt.fragment.EditMenu",
                    this
                );
                this.getView().addDependent(this._editMenu);
            }

            var eDock = sap.ui.core.Popup.Dock;
            this._editMenu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
        },

		_setToggleButtonTooltip : function(bLarge) {
			var oToggleButton = this.getView().byId('sideNavigationToggleButton');
			if (bLarge) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		}
	});
	return CController;
});
