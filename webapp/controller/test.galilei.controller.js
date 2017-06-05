var oResource = new sap.galilei.model.Resource(),
    oModel,
    oDiagram,
    oEditor,
    oStart,
    oTask,
    oEnd,
    oFlow1,
    oFlow2,
    oStartSymbol,
    oTaskSymbol,
    oEndSymbol,
    oFlow1Symbol,
    oFlow2Symbol,
	oSubProcess,
	oSubProcessSymbol,
	oFlowsub1,
	oFlowsub1Symbol,
	oFlowsub2,
	oFlowsub2Symbol,
	oStartsub,
	oStartSymbolsub,
	oEndsub,
	oEndSymbolsub;

/**
 * Helper for creating objects
 * @param {string} sClassName The qualified class name
 * @param {object} oParam The object creation parameters
 * @returns {Object} The created galilei object.
 */
function createObject (sClassName, oParam) {
    var oClass = sap.galilei.model.getClass(sClassName);
    if (oClass) {
        return oClass.create(oResource, oParam);
    }
    return undefined;
}

/**
 * This function creates a diagram editor under a parent node.
 * The parent node is identified by its selector.
 * @param {string} sContainerSelector The parent node selector. Example: "#svgContainer".
 */
function createDiagramEditor(containerSelector) {

    // Creates a model
oModel =  new sap.modeling.bpmn.Model(oResource, {
    name: "BPMN_1",
displayName: "BPMN Model 1"
});

// Creates a diagram
oDiagram =  new sap.modeling.bpmn.ui.Diagram(oResource);
oModel.diagrams.push(oDiagram);

// Creates a StartEvent object
oStart = createObject("sap.modeling.bpmn.StartEvent", {
name: "Start 1"
});
oModel.startEvents.push(oStart);

// Creates a SubProcess object
oSubProcess = createObject("sap.modeling.bpmn.SubProcess", {
name: "SubProcess",
type: "user"
});
oModel.subprocesses.push(oSubProcess);

// Creates a EndEvent object
oEnd = createObject("sap.modeling.bpmn.EndEvent", {
name: "End 1"
});
oModel.endEvents.push(oEnd);

// Create a StartEvent object of the Sub Process
oStartsub = createObject("sap.modeling.bpmn.StartEvent", {
name: "Start 1 of SP"
});
oSubProcess.startEvents.push(oStartsub);	

// Creates a Task object of the Sub Process
oTask = createObject("sap.modeling.bpmn.Task", {
name: "Place Order",
type: "user",
loopType: "loop"
});
oSubProcess.activities.push(oTask);				

// Creates a EndEvent object of Sub Process
oEndsub = createObject("sap.modeling.bpmn.EndEvent", {
name: "End 1 of SP"
});
oSubProcess.endEvents.push(oEndsub);							

// Creates a SequenceFlow object in Main Process
oFlow1 = createObject("sap.modeling.bpmn.SequenceFlow", {
source: oStart,
destination: oSubProcess,
displayName: "a"
});
oModel.sequenceFlows.push(oFlow1);

// Creates another SequenceFlow object in Main Process
oFlow2 = createObject("sap.modeling.bpmn.SequenceFlow", {
source: oSubProcess,
destination: oEnd,
displayName: "d"
});
oModel.sequenceFlows.push(oFlow2);

// Creates a SequenceFlow object in Sub Process
oFlowsub1 = createObject("sap.modeling.bpmn.SequenceFlow", {
source: oStartsub,
destination: oTask,
displayName: "b"
});
oSubProcess.sequenceFlows.push(oFlowsub1);

// Creates another SequenceFlow object in Sub Process
oFlowsub2 = createObject("sap.modeling.bpmn.SequenceFlow", {
source: oTask,
destination: oEndsub,
displayName: "c"
});
oSubProcess.sequenceFlows.push(oFlowsub2);

// Creates a StartEvent symbol
oStartSymbol = createObject("sap.modeling.bpmn.ui.StartEventSymbol", {
    object: oStart
});
oDiagram.symbols.push(oStartSymbol);

// Creates a SubProcess symbol
oSubProcessSymbol = createObject("sap.modeling.bpmn.ui.TaskSymbol", {
    object: oSubProcess,
	isComposite: true
});
oDiagram.symbols.push(oSubProcessSymbol);

// Creates a EndEvent symbol
oEndSymbol = createObject("sap.modeling.bpmn.ui.EndEventSymbol", {
    object: oEnd
});
oDiagram.symbols.push(oEndSymbol);

// Creates a StartEvent symbol in Sub Process
oStartSymbolsub = createObject("sap.modeling.bpmn.ui.StartEventSymbol", {
    object: oStartsub
});
oSubProcessSymbol.symbols.push(oStartSymbolsub);				

// Creates a Task symbol in Sub Process
oTaskSymbol = createObject("sap.modeling.bpmn.ui.TaskSymbol", {
    object: oTask
});
oSubProcessSymbol.symbols.push(oTaskSymbol);

// Creates a EndEvent symbol in Sub Process
oEndSymbolsub = createObject("sap.modeling.bpmn.ui.EndEventSymbol", {
    object: oEndsub
});
oSubProcessSymbol.symbols.push(oEndSymbolsub);				

// Creates a SequenceFlow symbol im Main Process
oFlow1Symbol = createObject("sap.modeling.bpmn.ui.SequenceFlowSymbol", {
    object: oFlow1,
    sourceSymbol: oStartSymbol,
    targetSymbol: oSubProcessSymbol
});
oDiagram.symbols.push(oFlow1Symbol);

// Creates another SequenceFlow symbol in Main Process
oFlow2Symbol = createObject("sap.modeling.bpmn.ui.SequenceFlowSymbol", {
    object: oFlow2,
    sourceSymbol: oSubProcessSymbol,
    targetSymbol: oEndSymbol
});
oDiagram.symbols.push(oFlow2Symbol);

// Creates a SequenceFlow symbol in Sub Process
oFlowsub1Symbol = createObject("sap.modeling.bpmn.ui.SequenceFlowSymbol", {
    object: oFlowsub1,
    sourceSymbol: oStartSymbolsub,
    targetSymbol: oTaskSymbol
});
oSubProcessSymbol.symbols.push(oFlowsub1Symbol);				

// Creates another SequenceFlow symbol in Sub Process
oFlowsub2Symbol = createObject("sap.modeling.bpmn.ui.SequenceFlowSymbol", {
    object: oFlowsub2,
    sourceSymbol: oTaskSymbol,
    targetSymbol: oEndSymbolsub
});
oSubProcessSymbol.symbols.push(oFlowsub2Symbol);		

// Creates a default diagram editor with some parameters
oEditor = new sap.galilei.ui.editor.DiagramEditor(oDiagram, containerSelector, {
    // Define diagram editor extension
extension: {
    extensionClass: sap.modeling.bpmn.ui.DiagramEditorExtension
},
// Define viewer parameters
    viewer: {
        viewBorderWidth: 1,
        showGrid: false,
        showPageLimit: true,
        showZoomTools: true,
        zoomToolVerticalAlignment: sap.galilei.ui.common.HorizontalAlignment.top,
        zoomToolHorizontalAlignment: sap.galilei.ui.common.HorizontalAlignment.left
    }
});

// Uses a time to move symbols after 1s
setTimeout(moveSymbols, 1000);

// Move symbols function
function moveSymbols () {
    var oTransitionDef = undefined;

    // Move symbols action for undo/redo
function moveSymbolsAction() {
	oStartSymbolsub.moveTo(20, 30, true, oEditor.viewer, oTransitionDef);
	oTaskSymbol.moveTo(100, 21, true, oEditor.viewer, oTransitionDef);
	oEndSymbolsub.moveTo(250, 30, true, oEditor.viewer, oTransitionDef);
	oStartSymbol.moveTo(100, 100, true, oEditor.viewer, oTransitionDef);
	oSubProcessSymbol.moveTo(300, 80, true, oEditor.viewer, oTransitionDef);
	oEndSymbol.moveTo(750, 100, true, oEditor.viewer, oTransitionDef);
	// extend the boundary of SubProcessSymbol to cover its sub symbols
	oSubProcessSymbol.extendToContent(false, 15, oEditor.viewer, oTransitionDef);
	// Update the sequence symbols accordingly after we changed the size of SubProcessSymbol
	oFlow1Symbol.updateLinkRouting(false);
	oFlow2Symbol.updateLinkRouting(false);
	oFlow1Symbol.drawSymbol(oEditor.viewer);
	oFlow2Symbol.drawSymbol(oEditor.viewer);						
}

oResource.applyUndoableAction(moveSymbolsAction, "Move Symbols");
    }
}

// Create a diagram editor under parent node
createDiagramEditor("#svgContainer");

// For Pointer mode, select the predefined PointerTool
$("#pointer").on("click", function () {
    oEditor.selectTool(sap.galilei.ui.editor.tool.PointerTool.NAME);
});

// For Lasso mode, select the predefined LassoTool
$("#lasso").on("click", function () {
    oEditor.selectTool(sap.galilei.ui.editor.tool.LassoTool.NAME);
});

// Undo, calls the undo() function of the editor
$("#undo").on("click", function () {
    oEditor.undo();
});

// Redo, calls the redo() function of the editor
$("#redo").on("click", function () {
    oEditor.redo();
});

// Delete, calls the deleteSelectedSymbols() function of the editor
$("#delete").on("click", function () {
    oEditor.deleteSelectedSymbols();
});

// Selects the create StartEventSymbol tool
$("#startEventTool").on("mousedown", function () {
console.log("Start event tool");
oEditor.selectTool("sap.modeling.bpmn.ui.StartEventSymbol");
});

// Selects the create TaskSymbol tool
$("#taskTool").on("mousedown", function () {
console.log("Task tool");
oEditor.selectTool("sap.modeling.bpmn.ui.TaskSymbol");
});

// Selects the create GatewaySymbol tool
$("#gatewayTool").on("mousedown", function () {
console.log("Gateway tool");
oEditor.selectTool("sap.modeling.bpmn.ui.GatewaySymbol");
});

// Selects the create EndEventSymbol tool
$("#endEventTool").on("mousedown", function () {
console.log("End event tool");
oEditor.selectTool("sap.modeling.bpmn.ui.EndEventSymbol");
});

// Selects the create SequenceFlowSymbol tool
$("#flowTool").on("mousedown", function () {
console.log("Flow tool");
oEditor.selectTool("sap.modeling.bpmn.ui.LinkSymbols");
});

// Zoom in, calls the zoomIn() function of the viewer.
$("#zoomIn").on("mousedown", function () {
    oEditor.viewer.zoomIn();
});

// Zoom out, calls the zoomOut() function of the viewer.
$("#zoomOut").on("mousedown", function () {
    oEditor.viewer.zoomOut();
});

// Global view, calls the showGlobalView() function of the viewer.
$("#globalView").on("mousedown", function () {
    oEditor.viewer.showGlobalView();
});

// Save, generates the JSON format and shows it in the console log
$("#save").on("mousedown", function () {
var oWriter = new sap.galilei.model.JSONWriter(), // Creates a JSON writer
oResult = oWriter.save(oResource); // Calls the save() function to generate the JSON.

// Displays the number of objects.
// The first object is the model, the second is the diagram.
// You can iterate in oResource.objects to get the model, diagram, objects and symbols.
console.log("There are " + oResource.objects.length + " objects in the resource.");
console.log("There are " + oEditor.model.startEvents.length + " start events in the model.");
console.log("There are " + oEditor.model.activities.length + " tasks in the model.");
console.log("There are " + oEditor.model.gateways.length + " gateways in the model.");
console.log("There are " + oEditor.model.endEvents.length + " end events in the model.");
console.log("There are " + oEditor.model.sequenceFlows.length + " sequence flows in the model.");
console.log("There are " + oEditor.diagram.symbols.length + " symbols in the diagram.");

// Displays the JSON
console.log("JSON of the model and diagram:");
console.log(oResult);
alert("Open the browser console to see the saved JSON of the model and diagram.", "Message");
});

// Load a JSON format
$("#load").on("mousedown", function () {
var oJSONGraph,
    oNewResource = new sap.galilei.model.Resource(),
    oReader = new sap.galilei.model.JSONReader();

oJSONGraph = {"contents":{"1EBAED46-4D89-4A4B-B429-4DE0EB7D95FA":{"classDefinition":"sap.modeling.bpmn.Model","name":"BPMN_1","displayName":"BPMN Model 1","startEvents":{"FDDEA2EA-4E5F-471B-B799-B5D1F15C53DE":{"name":"Start 1"}},"endEvents":{"78BADD08-2E4B-4D96-91AD-12FD2B0B5402":{"name":"End 1"}},"activities":{"2C40CE51-A4D4-4C81-B64C-0D2DA1E3A4B2":{"name":"Place Order"}},"sequenceFlows":{"30F0813F-C8CC-4E48-AC89-00D6A35131C5":{},"2B7922A3-4F83-48F0-8C6A-73214B62F20C":{}},"diagrams":{"448CD337-19C0-4958-BFDF-4F60EFC09584":{}}},"448CD337-19C0-4958-BFDF-4F60EFC09584":{"classDefinition":"sap.modeling.bpmn.ui.Diagram","symbols":{"1D30E1CB-3B5E-403F-AF6A-F693E74F9F3E":{},"4B7C7575-DB5E-4E73-B091-9912DB5DB3E5":{},"3DBDFAD8-14CA-4716-B0C4-A1421B6DE775":{},"BD8A5E5B-08C2-4C8D-87B9-7B975333F129":{},"83986655-228F-4E0B-ACB9-A10CB7D9FDB5":{}}},"FDDEA2EA-4E5F-471B-B799-B5D1F15C53DE":{"classDefinition":"sap.modeling.bpmn.StartEvent","name":"Start 1","displayName":"Start 1"},"2C40CE51-A4D4-4C81-B64C-0D2DA1E3A4B2":{"classDefinition":"sap.modeling.bpmn.Task","name":"Place Order","type":"user","loopType":"loop","displayName":"Place Order"},"78BADD08-2E4B-4D96-91AD-12FD2B0B5402":{"classDefinition":"sap.modeling.bpmn.EndEvent","name":"End 1","displayName":"End 1"},"30F0813F-C8CC-4E48-AC89-00D6A35131C5":{"classDefinition":"sap.modeling.bpmn.SequenceFlow","isImmediate":false,"source":"FDDEA2EA-4E5F-471B-B799-B5D1F15C53DE"},"2B7922A3-4F83-48F0-8C6A-73214B62F20C":{"classDefinition":"sap.modeling.bpmn.SequenceFlow","isImmediate":false,"source":"2C40CE51-A4D4-4C81-B64C-0D2DA1E3A4B2"},"1D30E1CB-3B5E-403F-AF6A-F693E74F9F3E":{"classDefinition":"sap.modeling.bpmn.ui.StartEventSymbol","x":431,"y":255,"width":40,"height":40,"isKeepSize":true,"object":"FDDEA2EA-4E5F-471B-B799-B5D1F15C53DE"},"4B7C7575-DB5E-4E73-B091-9912DB5DB3E5":{"classDefinition":"sap.modeling.bpmn.ui.TaskSymbol","x":531,"y":245,"width":100,"height":60,"object":"2C40CE51-A4D4-4C81-B64C-0D2DA1E3A4B2"},"3DBDFAD8-14CA-4716-B0C4-A1421B6DE775":{"classDefinition":"sap.modeling.bpmn.ui.EndEventSymbol","x":671,"y":255,"width":40,"height":40,"isKeepSize":true,"object":"78BADD08-2E4B-4D96-91AD-12FD2B0B5402"},"BD8A5E5B-08C2-4C8D-87B9-7B975333F129":{"classDefinition":"sap.modeling.bpmn.ui.SequenceFlowSymbol","points":"451,275 581,275","sourceSymbol":"1D30E1CB-3B5E-403F-AF6A-F693E74F9F3E","targetSymbol":"4B7C7575-DB5E-4E73-B091-9912DB5DB3E5","object":"30F0813F-C8CC-4E48-AC89-00D6A35131C5"},"83986655-228F-4E0B-ACB9-A10CB7D9FDB5":{"classDefinition":"sap.modeling.bpmn.ui.SequenceFlowSymbol","points":"581,275 691,275","sourceSymbol":"4B7C7575-DB5E-4E73-B091-9912DB5DB3E5","targetSymbol":"3DBDFAD8-14CA-4716-B0C4-A1421B6DE775","object":"2B7922A3-4F83-48F0-8C6A-73214B62F20C"}}};

    oReader.load(oNewResource, oJSONGraph);

    oEditor.changeResource(oNewResource);
});