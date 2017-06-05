sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (jQuery, Fragment, Controller, JSONModel, Editor) {
	"use strict";
    // Defines the default parameters for the diagram editor control.
	sap.galilei.ui5.EditorSettings.showGrid = true;
	sap.galilei.ui5.EditorSettings.snapToGrid = true;
	sap.galilei.ui5.EditorSettings.viewBackgroundFill = "#FFFFFF";
	sap.galilei.ui5.EditorSettings.pageBackgroundFill = "#FFFFFF";
	sap.galilei.ui5.EditorSettings.useContextButtonPad = true;


	var CController = Controller.extend("com.sap.cdt.controller.Routing", {
        onInit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("RoutingDiagram", "reloadDiagram", this.handleReloadDiagram, this);
        },

        handleReloadDiagram: function (channel, oEvent, oData) {
            var oEditor = this.getDiagramEditor();
            var oExporter = new sap.modeling.cdt.Bpmn2GalileiTransformation();
//            oEditor.extensionClass = "sap.modeling.bpmn.ui.DiagramEditorExtension";
//            oEditor.createExtension();
            oEditor.diagram.symbols.deleteAll();
            oExporter.transformDiagram(oData.bpmn, oEditor.model, oEditor.diagram);
            oEditor.updateDiagram();
            cdt.util.Operations.autoLayout(oEditor);
        },
        // Gets the Diagram Editor UI5 control
        getDiagramEditorControl: function () {
            var oView = this.getView();
            return oView && oView.byId("routingGalileiEditor");
        },

        // Gets the DiagramEditor that is attached to the Diagram Editor UI5 control
        getDiagramEditor: function () {
            var oEditorControl = this.getDiagramEditorControl();

            return oEditorControl && oEditorControl.getInnerEditor();
        },
        // Waits the diagramEditorReady event to make sure that the Diagram Editor UI5 control is initialized and the DiagramEditor is created.
        onDiagramEditorReady: function (oEvent) {
            var oEditorControl = this.getDiagramEditorControl(),
                oResource,
                oModel,
                oDiagram,
                oEditor;

            console.log("Diagram Editor Ready");

            if (oEditorControl) {
                // Creates a resource
                oResource = new sap.galilei.model.Resource();
                // Creates a model
                oModel = new sap.modeling.bpmn.Model(oResource);
                // Creates a diagram and associate it to the model
                oDiagram = new sap.modeling.bpmn.ui.Diagram(oResource, { model: oModel});
                oEditor = this.getDiagramEditor();
//                oEditor.extensionClass = "sap.modeling.bpmn.ui.DiagramEditorExtension";
//                oEditor.createExtension();
                // Sets the current diagram in the editor control
                oEditorControl.setDiagram(oDiagram);
            }
        },

        // After the view is displayed, adds some symbols.
        onAfterRendering: function () {
            var oEditorControl = this.getDiagramEditorControl(),
                oDiagramEditor = this.getDiagramEditor(),
                oResource = oDiagramEditor && oDiagramEditor.resource,
                oTask,
                oTaskSymbol,
                oTask2,
                oTaskSymbol2,
                oSequenceFlowSymbol;

            // Calls the onResize() function if the current view changes the diagram editor control size and takes long time to render all the controls.
//                    if (oEditorControl) {
//                        oEditorControl.onResize();
//                    }

            if (oDiagramEditor) {
//                // Creates a Task object
//                oTask = new sap.modeling.bpmn.Task(oResource, { name: "Get Galilei" });
//
//                // Creates a Task symbol
//                oTaskSymbol = new sap.modeling.bpmn.ui.TaskSymbol(oResource, {
//                    object: oTask,
//                    x: 100,
//                    y: 50
//                });
//
//                // Adds the object in model.tasks collection
//                oDiagramEditor.addObject(oTask);
//
//                // Adds the symbol in diagram.symbols collection
//                oDiagramEditor.addSymbol(oTaskSymbol);
//
//                // Registers browser events so you can select the symbol
//                oDiagramEditor.registerSymbolEvents(oTaskSymbol);
//
//                // Draws the symbol
//                oDiagramEditor.drawSymbol(oTaskSymbol);
//
//                // Another way to create symbol and object, add to parents and register events at once
//                oTaskSymbol2 = oDiagramEditor.createSymbolAndObject(
//                    "sap.modeling.bpmn.ui.TaskSymbol", // Symbol class
//                    // Symbol parameters
//                    {
//                        x : 250,
//                        y : 50
//                    },
//                    undefined, // oParentSymbol
//                    undefined, //symbolIndex
//                    "sap.modeling.bpmn.Task", // Object class
//                    // Object parameters
//                    {
//                        name : "Develop"
//                    }
//                );
//                oTask2 = oTaskSymbol2.object;
//
//                // Draws the symbol
//                oDiagramEditor.drawSymbol(oTaskSymbol2);
//                // Creates a sequence flow symbol
//                oSequenceFlowSymbol = oDiagramEditor.createLinkSymbolAndObject(oTaskSymbol, oTaskSymbol2, "sap.modeling.bpmn.ui.SequenceFlowSymbol", {}, undefined,
//                        "sap.modeling.bpmn.SequenceFlow", {}, undefined, undefined);
//                oDiagramEditor.drawSymbol(oSequenceFlowSymbol);
                cdt.util.Operations.setupToolbar(oDiagramEditor);
//                cdt.util.Operations.autoLayout(oDiagramEditor);
//                $("[name*='sap.modeling.bpmn.ui.TaskSymbol']").click(function(){
//                	 alert("aaaaaaa");
//                });
            }
        }
	});
	return CController;
});