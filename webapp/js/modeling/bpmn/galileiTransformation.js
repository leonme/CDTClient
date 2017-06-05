namespace("sap.modeling.cdt");

(function() {
sap.modeling.cdt.Bpmn2GalileiTransformation = sap.galilei.core.defineClass({
        fullClassName: "sap.modeling.cdt.Bpmn2GalileiTransformation",
        initialize: function(oParam) {
            this.set(oParam);
            this.sourceIdentifier = "id";
            this.targetIdentifier = "objectId";
            this.reader = new sap.modeling.bpmn.ui.XmlAdapter({
                identifier: this.sourceIdentifier
            });
            this.writer = new sap.modeling.bpmn.ui.GalileiAdapter();
            this.context = new sap.modeling.bpmn.ui.TransformContext();
            this.typeMapping = {
                participant: "sap.modeling.bpmn.Participant",
                lane: "sap.modeling.bpmn.Lane",
                task: "sap.modeling.bpmn.Task",
                serviceTask: "sap.modeling.bpmn.Task",
                userTask: "sap.modeling.bpmn.Task",
                manualTask: "sap.modeling.bpmn.Task",
                businessRuleTask: "sap.modeling.bpmn.Task",
                scriptTask: "sap.modeling.bpmn.Task",
                sendTask: "sap.modeling.bpmn.Task",
                receiveTask: "sap.modeling.bpmn.Task",
                subProcess: "sap.modeling.bpmn.SubProcess",
                adHocSubProcess: "sap.modeling.bpmn.SubProcess",
                transaction: "sap.modeling.bpmn.SubProcess",
                callActivity: "sap.modeling.bpmn.CallActivity",
                exclusiveGateway: "sap.modeling.bpmn.Gateway",
                complexGateway: "sap.modeling.bpmn.Gateway",
                inclusiveGateway: "sap.modeling.bpmn.Gateway",
                parallelGateway: "sap.modeling.bpmn.Gateway",
                eventBasedGateway: "sap.modeling.bpmn.Gateway",
                intermediateCatchEvent: "sap.modeling.bpmn.IntermediateCatchEvent",
                intermediateThrowEvent: "sap.modeling.bpmn.IntermediateThrowEvent",
                startEvent: "sap.modeling.bpmn.StartEvent",
                endEvent: "sap.modeling.bpmn.EndEvent",
                boundaryEvent: "sap.modeling.bpmn.BoundaryEvent",
                sequenceFlow: "sap.modeling.bpmn.SequenceFlow",
                messageFlow: "sap.modeling.bpmn.MessageFlow",
                message: "sap.modeling.bpmn.Message",
                dataStore: "sap.modeling.bpmn.DataStore",
                dataStoreReference: "sap.modeling.bpmn.DataStoreReference",
                dataObject: "sap.modeling.bpmn.DataObject",
                dataObjectReference: "sap.modeling.bpmn.DataObjectReference",
                dataInput: "sap.modeling.bpmn.DataInput",
                dataOutput: "sap.modeling.bpmn.DataOutput",
                globalTask: "sap.modeling.bpmn.Task",
                globalUserTask: "sap.modeling.bpmn.Task",
                globalScriptTask: "sap.modeling.bpmn.Task",
                globalManualTask: "sap.modeling.bpmn.Task",
                globalBusinessRuleTask: "sap.modeling.bpmn.Task",
                textAnnotation: "sap.modeling.bpmn.Annotation",
                association: "sap.modeling.bpmn.Association",
                property: "sap.modeling.bpmn.Property",
                scrap: "sap.modeling.bpmn.Scrap",
                hold: "sap.modeling.bpmn.Hold",
                done: "sap.modeling.bpmn.Done"
            };
            this.propertyMapping = {
                participant: {
                    name: "name",
                    comment: this.setComment,
                    isMultiple: this.setParticipantIsMultiple
                },
                lane: {
                    name: "name",
                    comment: this.setComment
                },
                task: {
                    name: "name",
                    comment: this.setComment,
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    model:"model",
                    isSelect:"isSelected"
                },
                serviceTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'service'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    implementation: "implementation"
                },
                userTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'user'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    implementation: "implementation"
                },
                manualTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'manual'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification
                },
                businessRuleTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'businessRule'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    implementation: "implementation"
                },
                scriptTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'script'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    implementation: "implementation",
                    script: this.setScript,
                    scriptFormat: "scriptFormat"
                },
                sendTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'send'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    implementation: "implementation"
                },
                receiveTask: {
                    name: "name",
                    comment: this.setComment,
                    type: "'receive'",
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    implementation: "implementation",
                    instantiate: "instantiate"
                },
                globalTask: "task",
                globalUserTask: "userTask",
                globalScriptTask: "scriptTask",
                globalManualTask: "manualTask",
                globalBusinessRuleTask: "businessRuleTask",
                subProcess: {
                    name: "name",
                    type: this.setSubProcessType,
                    comment: this.setComment,
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    isEventBased: "triggeredByEvent"
                },
                adHocSubProcess: "subProcess",
                transaction: "subProcess",
                callActivity: {
                    name: "name",
                    comment: this.setComment,
                    startQuantity: "startQuantity",
                    completionQuantity: "completionQuantity",
                    isForCompensation: "isForCompensation",
                    loopType: this.setLoopType,
                    defaultFlow: "default",
                    ioSpecification: this.setIoSpecification,
                    calledObject: this.setCalledObject
                },
                exclusiveGateway: {
                    name: "name",
                    type: "'exclusive'",
                    comment: this.setComment,
                    direction: "gatewayDirection",
                    defaultFlow: "default"
                },
                complexGateway: {
                    name: "name",
                    type: "'complex'",
                    comment: this.setComment,
                    direction: "gatewayDirection",
                    defaultFlow: "default",
                    expression: "activationCondition"
                },
                parallelGateway: {
                    name: "name",
                    type: "'parallel'",
                    comment: this.setComment,
                    direction: "gatewayDirection",
                    defaultFlow: "default",
                    instantiate: "instantiate"
                },
                inclusiveGateway: {
                    name: "name",
                    type: "'inclusive'",
                    comment: this.setComment,
                    direction: "gatewayDirection",
                    defaultFlow: "default"
                },
                eventBasedGateway: {
                    name: "name",
                    type: this.setEventGatewayType,
                    comment: this.setComment,
                    direction: "gatewayDirection",
                    defaultFlow: "default"
                },
                startEvent: {
                    name: "name",
                    comment: this.setComment,
                    isParallel: "parallelMultiple",
                    isInterrupting: "isInterrupting",
                    eventType: this.setEventDefinitions,
                    ioSpecification: this.setDataOutputs
                },
                boundaryEvent: {
                    name: "name",
                    comment: this.setComment,
                    isParallel: "parallelMultiple",
                    isCancel: "cancelActivity",
                    attachedTo: "attachedToRef",
                    eventType: this.setEventDefinitions,
                    ioSpecification: this.setDataOutputs
                },
                intermediateCatchEvent: {
                    name: "name",
                    comment: this.setComment,
                    isParallel: "parallelMultiple",
                    eventType: this.setEventDefinitions,
                    ioSpecification: this.setDataOutputs
                },
                intermediateThrowEvent: {
                    name: "name",
                    comment: this.setComment,
                    eventType: this.setEventDefinitions,
                    ioSpecification: this.setDataInputs
                },
                endEvent: {
                    name: "name",
                    comment: this.setComment,
                    eventType: this.setEventDefinitions,
                    ioSpecification: this.setDataInputs
                },
                sequenceFlow: {
                    name: "name",
                    comment: this.setComment,
                    source: "sourceRef",
                    target: "targetRef",
                    isImmediate: "isImmediate",
                    condition: "condition"
                },
                messageFlow: {
                    name: "name",
                    comment: this.setComment,
                    source: "sourceRef",
                    target: "targetRef",
                    message: "messageRef"
                },
                message: {
                    name: "name"
                },
                dataStore: {
                    name: "name",
                    comment: this.setComment,
                    capacity: "capacity",
                    isUnlimited: "isUnlimited"
                },
                dataStoreReference: {
                    name: "name",
                    comment: this.setComment,
                    dataStore: "dataStoreRef"
                },
                dataObject: {
                    name: "name",
                    comment: this.setComment,
                    isCollection: "isCollection"
                },
                dataObjectReference: {
                    name: "name",
                    comment: this.setComment,
                    state: this.setDataState,
                    dataObject: "dataObjectRef"
                },
                dataInput: {
                    name: "name",
                    comment: this.setComment,
                    isCollection: "isCollection"
                },
                dataOutput: {
                    name: "name",
                    comment: this.setComment,
                    isCollection: "isCollection"
                },
                textAnnotation: {
                    text: this.setAnnotationText,
                    textFormat: "textFormat"
                },
                association: {
                    source: "sourceRef",
                    target: "targetRef"
                },
                property: {
                    name: "name",
                    comment: this.setComment
                },
                BPMNDiagram: {
                    name: "name",
                    comment: "documentation"
                },
                scrap: {
                    name: "name",
                    comment: this.setComment
                },
                hold: {
                    name: "name",
                    comment: this.setComment
                },
                done: {
                    name: "name",
                    comment: this.setComment
                }
            };
            this.symbolTypeMapping = {
                participant: "sap.modeling.bpmn.ui.PoolSymbol",
                lane: "sap.modeling.bpmn.ui.LaneSymbol",
                task: "sap.modeling.bpmn.ui.TaskSymbol",
                serviceTask: "sap.modeling.bpmn.ui.TaskSymbol",
                userTask: "sap.modeling.bpmn.ui.TaskSymbol",
                manualTask: "sap.modeling.bpmn.ui.TaskSymbol",
                businessRuleTask: "sap.modeling.bpmn.ui.TaskSymbol",
                scriptTask: "sap.modeling.bpmn.ui.TaskSymbol",
                sendTask: "sap.modeling.bpmn.ui.TaskSymbol",
                receiveTask: "sap.modeling.bpmn.ui.TaskSymbol",
                subProcess: "sap.modeling.bpmn.ui.SubProcessSymbol",
                adHocSubProcess: "sap.modeling.bpmn.ui.SubProcessSymbol",
                transaction: "sap.modeling.bpmn.ui.SubProcessSymbol",
                callActivity: "sap.modeling.bpmn.ui.CallActivitySymbol",
                exclusiveGateway: "sap.modeling.bpmn.ui.GatewaySymbol",
                complexGateway: "sap.modeling.bpmn.ui.GatewaySymbol",
                inclusiveGateway: "sap.modeling.bpmn.ui.GatewaySymbol",
                parallelGateway: "sap.modeling.bpmn.ui.GatewaySymbol",
                eventBasedGateway: "sap.modeling.bpmn.ui.GatewaySymbol",
                intermediateCatchEvent: "sap.modeling.bpmn.ui.IntermediateCatchEventSymbol",
                intermediateThrowEvent: "sap.modeling.bpmn.ui.IntermediateThrowEventSymbol",
                startEvent: "sap.modeling.bpmn.ui.StartEventSymbol",
                boundaryEvent: "sap.modeling.bpmn.ui.BoundaryEventSymbol",
                endEvent: "sap.modeling.bpmn.ui.EndEventSymbol",
                sequenceFlow: "sap.modeling.bpmn.ui.SequenceFlowSymbol",
                messageFlow: "sap.modeling.bpmn.ui.MessageFlowSymbol",
                dataInputAssociation: "sap.modeling.bpmn.ui.DataAssociationSymbol",
                dataOutputAssociation: "sap.modeling.bpmn.ui.DataAssociationSymbol",
                dataStoreReference: "sap.modeling.bpmn.ui.DataStoreReferenceSymbol",
                dataObject: "sap.modeling.bpmn.ui.DataObjectSymbol",
                dataObjectReference: "sap.modeling.bpmn.ui.DataObjectReferenceSymbol",
                dataInput: "sap.modeling.bpmn.ui.DataInputSymbol",
                dataOutput: "sap.modeling.bpmn.ui.DataOutputSymbol",
                textAnnotation: "sap.modeling.bpmn.ui.AnnotationSymbol",
                association: "sap.modeling.bpmn.ui.AssociationSymbol",
                scrap: "sap.modeling.bpmn.ui.ScrapSymbol",
                hold: "sap.modeling.bpmn.ui.HoldSymbol",
                done: "sap.modeling.bpmn.ui.DoneSymbol"
            };
            this.constants = {
                SYMBOL_RESOLUTON: 72,
                DIAGRAM_OBJECT: "sap.modeling.bpmn.ui.Diagram",
                POOL_SYMBOL: "sap.modeling.bpmn.ui.PoolSymbol",
                LANE_SYMBOL: "sap.modeling.bpmn.ui.LaneSymbol",
                GATEWAY_SYMBOL: "sap.modeling.bpmn.ui.GatewaySymbol",
                TASK_SYMBOL: "sap.modeling.bpmn.ui.TaskSymbol",
                SUBPROCESS_SYMBOL: "sap.modeling.bpmn.ui.SubProcessSymbol",
                CALL_ACTIVITY_SYMBOL: "sap.modeling.bpmn.ui.CallActivitySymbol",
                LANE_OBJECT: "sap.modeling.bpmn.Lane",
                EVENT_DEFINITION_OBJECT: "sap.modeling.bpmn.EventDefinition",
                DATA_ASSOCIATION_OBJECT: "sap.modeling.bpmn.DataAssociation",
                TARGET_ITEM_PROPERTY: "targetItem",
                SOURCE_ITEMS_REFERENCE: "sourceItems",
                LINK_OBJECT_SOURCE: "source",
                LINK_OBJECT_TARGET: "target",
                COMMENT_PROPERTY: "comment",
                IS_MULTIPLE_PROPERTY: "isMultiple",
                LOOP_TYPE_PROPERTY: "loopType",
                LOOP_TYPE_VALUE_LOOP: sap.modeling.bpmn.LoopTypes.loop,
                LOOP_TYPE_VALUE_MULTI_SEQUENTIAL: sap.modeling.bpmn.LoopTypes.sequence,
                LOOP_TYPE_VALUE_MULTI_PARALLEL: sap.modeling.bpmn.LoopTypes.parallel,
                SUBPROCESS_TYPE_PROPERTY: "type",
                SUBPROCESS_TYPE_VALUE_ADHOC: sap.modeling.bpmn.SubProcessTypes.adhoc,
                SUBPROCESS_TYPE_VALUE_TRANSACTION: sap.modeling.bpmn.SubProcessTypes.transaction,
                SUBPROCESS_TYPE_VALUE_EVENT: sap.modeling.bpmn.SubProcessTypes.event,
                GATEWAY_TYPE_PROPERTY: "type",
                GATEWAY_TYPE_VALUE_DEFAULT: sap.modeling.bpmn.GatewayTypes.DEFAULT,
                GATEWAY_TYPE_VALUE_EVENT: sap.modeling.bpmn.GatewayTypes.eventBased,
                GATEWAY_TYPE_VALUE_PARALLEL_EVENT: sap.modeling.bpmn.GatewayTypes.parallelEventBased,
                GATEWAY_TYPE_VALUE_EXCLUSIVE_EVENT: sap.modeling.bpmn.GatewayTypes.exclusiveEventBased,
                GATEWAY_TYPE_VALUE_EXCLUSIVE: sap.modeling.bpmn.GatewayTypes.exclusive,
                EVENT_DEFINITION_TYPE_PROPERTY: "type",
                DATA_STATE_PROPERTY: "state",
                DATA_STORE_PROPERTY: "dataStore",
                DATA_OBJECT_PROPERTY: "dataObject",
                MESSAGE_PROPERTY: "message",
                ORIENTATION_PROPERTY: "orientation",
                DEFAULT_SWIMLANE_HEADER_SIZE: 30,
                BPMN2_NO_BOUNDARY: "boundaryNotVisibleProperty",
                SUBPROCESS_TYPE_VALUE_DEFAULT: undefined,
                OBJECT_REFERENCE_QUALIFIED: "sap.galilei.ui.diagram.Symbol.object",
                BPMN2_FLOW_NODES: ["task", "serviceTask", "userTask", "manualTask", "businessRuleTask", "scriptTask", "sendTask", "receiveTask", "subProcess", "adHocSubProcess", "transaction", "callActivity", "exclusiveGateway", "complexGateway", "inclusiveGateway", "parallelGateway", "eventBasedGateway", "intermediateCatchEvent", "intermediateThrowEvent", "startEvent", "endEvent", "boundaryEvent", "textAnnotation"],
                BPMN2_COMPOSITE_FLOW_NODES: ["subProcess", "adHocSubProcess", "transaction"],
                BPMN2_FLOWS: ["sequenceFlow", "messageFlow", "dataInputAssociation", "dataOutputAssociation", "association"],
                BPMN2_DATA_AS_FLOW_NODES: ["dataObject", "dataObjectReference", "dataStoreReference"],
                BPMN2_EVENT_DEFINITIONS: ["messageEventDefinition", "timerEventDefinition", "errorEventDefinition", "escalationEventDefinition", "cancelEventDefinition", "compensateEventDefinition", "conditionalEventDefinition", "linkEventDefinition", "signalEventDefinition", "terminateEventDefinition"],
                BPMN2_GLOBAL_OBJECTS: ["dataStore", "message", "globalTask", "globalUserTask", "globalScriptTask", "globalManualTask", "globalBusinessRuleTask"],
                BPMN2_DATA_ASSOCIATIONS: ["dataInputAssociation", "dataOutputAssociation"],
                SCRAP_SYMBOL: "sap.modeling.bpmn.ui.ScrapSymbol",
                HOLD_SYMBOL: "sap.modeling.bpmn.ui.HoldSymbol",
                DONE_SYMBOL: "sap.modeling.bpmn.ui.DoneSymbol"
            }
        },
        properties: {
            reader: undefined,
            writer: undefined,
            sourceIdentifier: undefined,
            targetIdentifier: undefined,
            context: undefined,
            typeMapping: undefined,
            propertyMapping: undefined,
            symbolTypeMapping: undefined,
            constants: undefined
        },
        methods: {
            _removeInvalidCharacters: function(sXml) {
                if (sXml) {
                    var oRegExp = new RegExp(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFF]+/g);
                    sXml = sXml.replace(oRegExp, "")
                }
                return sXml
            },
            preTransform: function(sXml) {
                var oObject, aStack = [],
                sFeature,
                sId,
                sObjectId,
                i,
                j,
                oDefinitions,
                aReference,
                aDiagrams,
                oObjectSymbolMap = {},
                oElementTypeMap = {},
                oObjectParentMap = {},
                aDiagramsInfo = [],
                aShapes,
                aEdges,
                sDiagramId,
                sShapeId,
                oPlane,
                bHorizontal,
                sKey;
                sXml = this._removeInvalidCharacters(sXml);
                if (this.reader.parse(sXml)) {
                    if (this.reader.rootObject) {
                        oDefinitions = this.getSourceObject(this.reader.rootObject, "definitions");
                        if (oDefinitions) {
                            sId = this.getSourceId(oDefinitions);
                            if (sId) {
                                this.context.addSourceObject(sId, oDefinitions);
                                oElementTypeMap[sId] = "definitions"
                            }
                            aStack.push(oDefinitions);
                            while (aStack.length > 0) {
                                oObject = aStack.pop();
                                sObjectId = this.getSourceId(oObject);
                                for (sFeature in oObject) {
                                    aReference = this.getSourceReference(oObject, sFeature);
                                    if (aReference) {
                                        for (i = 0; i < aReference.length; i++) {
                                            if (aReference[i] instanceof Object) {
                                                sId = this.getSourceId(aReference[i]);
                                                if (sId) {
                                                    this.context.addSourceObject(sId, aReference[i]);
                                                    oElementTypeMap[sId] = sFeature;
                                                    oObjectParentMap[sId] = sObjectId
                                                }
                                                aStack.push(aReference[i])
                                            }
                                        }
                                    }
                                }
                            }
                            aDiagrams = this.getSourceReference(oDefinitions, "BPMNDiagram");
                            if (aDiagrams) {
                                for (i = 0; i < aDiagrams.length; i++) {
                                    sDiagramId = this.getSourceId(aDiagrams[i]);
                                    oPlane = this.getSourceObject(aDiagrams[i], "BPMNPlane");
                                    if (oPlane) {
                                        aDiagramsInfo.push({
                                            diagram: sDiagramId,
                                            bpmnElement: this.getSourceProperty(oPlane, "bpmnElement")
                                        });
                                        aShapes = this.getSourceReference(oPlane, "BPMNShape");
                                        aEdges = this.getSourceReference(oPlane, "BPMNEdge");
                                        if (aShapes && aEdges) {
                                            aShapes = aShapes.concat(aEdges)
                                        }
                                        if (aShapes) {
                                            for (j = 0; j < aShapes.length; j++) {
                                                sShapeId = this.getSourceId(aShapes[j]);
                                                sObjectId = this.getSourceProperty(aShapes[j], "bpmnElement");
                                                if (sObjectId) {
                                                    sKey = sObjectId + "-" + sDiagramId;
                                                    if (oObjectSymbolMap[sKey]) {
                                                        oObjectSymbolMap[sKey].push(sShapeId)
                                                    } else {
                                                        oObjectSymbolMap[sKey] = [sShapeId]
                                                    }
                                                }
                                                if (bHorizontal === undefined) {
                                                    if (this.getSourceProperty(aShapes[j], "isHorizontal") === "true") {
                                                        bHorizontal = true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return {
                        diagrams: aDiagramsInfo,
                        symbolMap: oObjectSymbolMap,
                        typeMap: oElementTypeMap,
                        parentMap: oObjectParentMap,
                        isHorizontal: bHorizontal
                    }
                } else {
                    throw "Failed to parse the bpmn2 file."
                }
            },
            transformDiagram: function(sXml, oModel, oDiagram) {
                var i, j, oPreTransformInfo, oDefinitions, oCollaboration, aParticipants, sParticipantId, sProcessId, aMessageFlows, aProcesses, sFeature, aReference, aDiagrams, oPlane, sDiagramId, oTargetContainer, oTargetModel, oDiagramPropertyMap, aShapes, aEdges, nResolution, oTargetSymbol, aTargetSymbols = [],
                aProperties,
                aDelayedJobs,
                fnJob,
                oTargetObjects,
                oTargetObject,
                aSymbols,
                sKey;
                this.context.reset();
                oPreTransformInfo = this.preTransform(sXml);
                if (!oPreTransformInfo) {
                    return false
                }
                this.context.additionalInfo = oPreTransformInfo;
                if (this.reader.rootObject && oModel && oDiagram) {
                    oTargetContainer = oDiagram.container || oModel;
                    oTargetModel = oTargetContainer;
                    console.log("IMPORT: BPMN2 import started.");
                    oDefinitions = this.getSourceObject(this.reader.rootObject, "definitions");
                    if (oDefinitions) {
                        this.context.pushTargetObjectContainer(oTargetModel);
                        oCollaboration = this.getSourceObject(oDefinitions, "collaboration");
                        if (oCollaboration) {
                            aParticipants = this.getSourceReference(oCollaboration, "participant");
                            if (aParticipants) {
                                this.context.additionalInfo.processPoolMap = {};
                                this.context.additionalInfo.poolProcessMap = {};
                                for (i = 0; i < aParticipants.length; i++) {
                                    sParticipantId = this.getSourceId(aParticipants[i]);
                                    sProcessId = this.getSourceProperty(aParticipants[i], "processRef");
                                    if (sParticipantId && sProcessId) {
                                        this.context.additionalInfo.processPoolMap[sProcessId] = sParticipantId;
                                        this.context.additionalInfo.poolProcessMap[sParticipantId] = sProcessId
                                    }
                                    this.transformObject(aParticipants[i], "participant")
                                }
                            }
                        }
                        for (sFeature in oDefinitions) {
                            if (this.constants.BPMN2_GLOBAL_OBJECTS.indexOf(sFeature) >= 0) {
                                aReference = this.getSourceReference(oDefinitions, sFeature);
                                if (aReference) {
                                    for (j = 0; j < aReference.length; j++) {
                                        if (aReference[j] instanceof Object) {
                                            this.transformObject(aReference[j], sFeature)
                                        }
                                    }
                                }
                            }
                        }
                        this.context.pushTargetObjectContainer(oTargetContainer);
                        aProcesses = this.getSourceReference(oDefinitions, "process");
                        if (aProcesses) {
                            for (i = 0; i < aProcesses.length; i++) {
                                sProcessId = this.getSourceId(aProcesses[i]);
                                aProperties = this.getSourceReference(aProcesses[i], "property");
                                if (aProperties) {
                                    for (j = 0; j < aProperties.length; j++) {
                                        if (this.getSourceProperty(aProperties[j], "name") === this.constants.BPMN2_NO_BOUNDARY) {
                                            this.context.additionalInfo.processNoBoundaryMap = this.context.additionalInfo.processNoBoundaryMap || {};
                                            this.context.additionalInfo.processNoBoundaryMap[sProcessId] = true
                                        }
                                    }
                                }
                                this.setIoSpecification(oTargetContainer, aProcesses[i]);
                                this.context.pushTargetObjectContainer(oTargetModel);
                                this.transformLaneSets(aProcesses[i], sProcessId);
                                this.context.popTargetObjectContainer();
                                for (sFeature in aProcesses[i]) {
                                    if (sFeature === "laneSet") {
                                        continue
                                    } else {
                                        aReference = this.getSourceReference(aProcesses[i], sFeature);
                                        if (aReference) {
                                            for (j = 0; j < aReference.length; j++) {
                                                if (aReference[j] instanceof Object) {
                                                    this.transformFlowElement(aReference[j], sFeature)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        this.context.popTargetObjectContainer();
                        if (oCollaboration) {
                            aMessageFlows = this.getSourceReference(oCollaboration, "messageFlow");
                            if (aMessageFlows) {
                                for (i = 0; i < aMessageFlows.length; i++) {
                                    this.transformObject(aMessageFlows[i], "messageFlow")
                                }
                            }
                        }
                        aDiagrams = this.getSourceReference(oDefinitions, "BPMNDiagram");
                        if (aDiagrams) {
                            i = 0;
                            if (aDiagrams[i]) {
                                sDiagramId = this.getSourceId(aDiagrams[i]);
                                if (!sDiagramId) {
                                    sDiagramId = "undefined"
                                }
                                oDiagramPropertyMap = this.propertyMapping.BPMNDiagram;
                                this.setMappedTargetProperties(oDiagram, aDiagrams[i], "BPMNDiagram", oDiagramPropertyMap);
                                nResolution = parseFloat(this.getSourceProperty(aDiagrams[i], "resolution"));
                                if (nResolution > 0) {
                                    this.context.symbolResolution = nResolution
                                } else {
                                    this.context.symbolResolution = this.constants.SYMBOL_RESOLUTON
                                }
                                this.context.pushTargetSymbolContainer(oDiagram);
                                oPlane = this.getSourceObject(aDiagrams[i], "BPMNPlane");
                                if (oPlane) {
                                    aShapes = this.getSourceReference(oPlane, "BPMNShape");
                                    if (aShapes) {
                                        for (j = 0; j < aShapes.length; j++) {
                                            oTargetSymbol = this.transformSymbol(aShapes[j], "BPMNShape", sDiagramId);
                                            if (oTargetSymbol) {
                                                aTargetSymbols.push([aShapes[j], oTargetSymbol, sDiagramId])
                                            }
                                        }
                                    }
                                    this.createDefaultSymbols(oModel, oDiagram, sDiagramId);
                                    aEdges = this.getSourceReference(oPlane, "BPMNEdge");
                                    if (aEdges) {
                                        for (j = 0; j < aEdges.length; j++) {
                                            oTargetSymbol = this.transformSymbol(aEdges[j], "BPMNEdge", sDiagramId);
                                            if (oTargetSymbol) {
                                                aTargetSymbols.push([aEdges[j], oTargetSymbol, sDiagramId])
                                            }
                                        }
                                    }
                                    for (j = 0; j < aTargetSymbols.length; j++) {
                                        this.postTransformSymbol.apply(this, aTargetSymbols[j])
                                    }
                                }
                                this.context.popTargetSymbolContainer()
                            }
                            aDelayedJobs = this.context.delayedJobs;
                            if (aDelayedJobs) {
                                this.context.inDelayMode = true;
                                for (i = 0; i < aDelayedJobs.length; i++) {
                                    fnJob = this[aDelayedJobs[i].job];
                                    if (fnJob instanceof Function) {
                                        fnJob.apply(this, aDelayedJobs[i].params)
                                    }
                                }
                                this.context.inDelayMode = false
                            }
                        }
                        this.context.popTargetObjectContainer();
                        oTargetObjects = this.context.targetObjects;
                        if (oTargetObjects) {
                            for (sKey in oTargetObjects) {
                                oTargetObject = oTargetObjects[sKey];
                                if (!this.validateObject(oTargetObject)) {
                                    aSymbols = oTargetObject.classDefinition.getReverseReference(oTargetObject, this.constants.OBJECT_REFERENCE_QUALIFIED);
                                    if (aSymbols && aSymbols.values) {
                                        for (j = 0; j < aSymbols.values.length; j++) {
                                            aSymbols.values[j].deleteObject()
                                        }
                                    }
                                    oTargetObject.deleteObject()
                                }
                            }
                        }
                        console.log("BPMN2 import complete.");
                        return true
                    }
                }
            },
            createDefaultSymbols: function(oModel, oDiagram, sDiagramId) {
                var bHorizontal, index, oBoundaryEvent, oParentSymbol, aPoint, oSymbol;
                if (oModel && oDiagram) {
                    bHorizontal = this.context.additionalInfo.isHorizontal;
                    for (index = 0; index < oModel.resource.objects.length; index++) {
                        oBoundaryEvent = oModel.resource.objects.get(index);
                        if (oBoundaryEvent.classDefinition.qualifiedName === this.typeMapping.boundaryEvent) {
                            if (oBoundaryEvent.relatedSymbols.length === 0) {
                                if (oBoundaryEvent && oBoundaryEvent.attachedTo && oBoundaryEvent.attachedTo.relatedSymbols.length > 0) {
                                    oParentSymbol = oBoundaryEvent.attachedTo.relatedSymbols.get(0);
                                    if (bHorizontal) {
                                        aPoint = oParentSymbol.getBBox().getPoint(sap.galilei.ui.common.DockPosition.right);
                                        aPoint[1] -= 16
                                    } else {
                                        aPoint = oParentSymbol.getBBox().getPoint(sap.galilei.ui.common.DockPosition.bottom);
                                        aPoint[0] -= 16
                                    }
                                    oSymbol = this.createTargetObject(oParentSymbol, this.symbolTypeMapping.boundaryEvent, undefined, {
                                        object: oBoundaryEvent,
                                        x: aPoint[0],
                                        y: aPoint[1]
                                    })
                                }
                            }
                        }
                    }
                }
            },
            postTransformDiagram: function(oModel, oDiagram, oEditor) {
                if (oDiagram) {
                    var aSymbols = oDiagram.getAllSymbols(),
                    index,
                    oSymbol,
                    aPoint1,
                    aPoint2,
                    oBBox,
                    bLayoutLink,
                    bPreserveLinkPoints;
                    for (index = 0; index < aSymbols.length; index++) {
                        oSymbol = aSymbols[index];
                        if (oSymbol.isComposite) {
                            oSymbol.updateBoundarySymbols(undefined, undefined, true, oEditor ? oEditor.viewer: undefined)
                        }
                    }
                    for (index = 0; index < aSymbols.length; index++) {
                        oSymbol = aSymbols[index];
                        if (oSymbol.isLinkSymbol) {
                            bLayoutLink = false;
                            bPreserveLinkPoints = true;
                            if (!oSymbol.points || oSymbol.points.length < 2) {
                                bLayoutLink = true;
                                bPreserveLinkPoints = false
                            } else {
                                if (oEditor) {
                                    aPoint1 = oSymbol.points[0];
                                    aPoint2 = oSymbol.points[oSymbol.points.length - 1];
                                    aPoint1 = oEditor.viewer.viewPointToClientPoint(aPoint1);
                                    aPoint2 = oEditor.viewer.viewPointToClientPoint(aPoint2);
                                    if (!oEditor.checkIsPointInSymbol(oSymbol.sourceSymbol, aPoint1[0], aPoint1[1])) {
                                        oBBox = oSymbol.sourceSymbol.getBBox();
                                        if (oBBox) {
                                            aPoint1 = oBBox.getCenter();
                                            oSymbol.points[0][0] = aPoint1[0];
                                            oSymbol.points[0][1] = aPoint1[1]
                                        }
                                        bLayoutLink = true
                                    }
                                    if (!oEditor.checkIsPointInSymbol(oSymbol.targetSymbol, aPoint2[0], aPoint2[1])) {
                                        oBBox = oSymbol.targetSymbol.getBBox();
                                        if (oBBox) {
                                            aPoint2 = oBBox.getCenter();
                                            oSymbol.points[oSymbol.points.length - 1][0] = aPoint2[0];
                                            oSymbol.points[oSymbol.points.length - 1][1] = aPoint2[1]
                                        }
                                        bLayoutLink = true
                                    }
                                }
                            }
                            if (bLayoutLink) {
                                oSymbol.isAutomaticRouting = true;
                                oSymbol.updateLinkRouting(bPreserveLinkPoints, oEditor.viewer)
                            }
                        }
                    }
                    for (index = 0; index < oDiagram.symbols.length; index++) {
                        oSymbol = oDiagram.symbols.get(index);
                        if (oSymbol && oSymbol.isRootSwimlaneSymbol) {
                            oSymbol.layoutSwimlanes(oSymbol.isVertical ? sap.galilei.ui.symbol.LayoutSwimlaneDirection.axis: sap.galilei.ui.symbol.LayoutSwimlaneDirection.antiAxis, oEditor.viewer)
                        }
                    }
                }
            },
            transformFlowElement: function(oSourceObject, sSourceType) {
                var i, sFeature, aReference, oTarget, aDataInputAssociations, aDataOutputAssociations;
                switch (sSourceType) {
                case "dataStoreReference":
                    oTarget = this.transformDataStoreReference(oSourceObject, sSourceType);
                    break;
                case "boundaryEvent":
                    oTarget = this.transformBoundaryEvent(oSourceObject, sSourceType);
                    break;
                case "startEvent":
                    oTarget = this.transformStartEvent(oSourceObject, sSourceType);
                    break;
                case "endEvent":
                    oTarget = this.transformEndEvent(oSourceObject, sSourceType);
                    break;
                default:
                    oTarget = this.transformObject(oSourceObject, sSourceType);
                    break
                }
                if (oTarget) {
                    aDataInputAssociations = this.getSourceReference(oSourceObject, "dataInputAssociation");
                    if (aDataInputAssociations) {
                        for (i = 0; i < aDataInputAssociations.length; i++) {
                            this.transformDataAssociation(aDataInputAssociations[i], "dataInputAssociation")
                        }
                    }
                    aDataOutputAssociations = this.getSourceReference(oSourceObject, "dataOutputAssociation");
                    if (aDataOutputAssociations) {
                        for (i = 0; i < aDataOutputAssociations.length; i++) {
                            this.transformDataAssociation(aDataOutputAssociations[i], "dataOutputAssociation")
                        }
                    }
                    if (this.constants.BPMN2_COMPOSITE_FLOW_NODES.indexOf(sSourceType) >= 0) {
                        this.context.pushTargetObjectContainer(oTarget);
                        for (sFeature in oSourceObject) {
                            aReference = this.getSourceReference(oSourceObject, sFeature);
                            if (aReference) {
                                for (i = 0; i < aReference.length; i++) {
                                    if (aReference[i] instanceof Object) {
                                        this.transformFlowElement(aReference[i], sFeature)
                                    }
                                }
                            }
                        }
                        this.context.popTargetObjectContainer()
                    }
                    return oTarget
                }
            },
            transformObject: function(oSourceObject, sSourceType) {
                var sTargetType = this.typeMapping[sSourceType],
                sId,
                oTargetObject,
                oTargetContainer = this.context.targetObjectContainer,
                oPropertiesMap;
                sId = this.getSourceId(oSourceObject);
                if (sTargetType && oTargetContainer) {
                    oTargetObject = this.createTargetObject(oTargetContainer, sTargetType);
                    if (oTargetObject) {
                        if (sId) {
                            this.context.mapObjects(sId, this.getTargetId(oTargetObject))
                        }
                        oPropertiesMap = this.propertyMapping[sSourceType];
                        if (oPropertiesMap) {
                            this.setMappedTargetProperties(oTargetObject, oSourceObject, sSourceType, oPropertiesMap)
                        }
                        return oTargetObject
                    } else {
                        console.log("Cannot create object for " + sSourceType + " (" + sId + ").")
                    }
                }
            },
            transformSymbol: function(oSourceSymbol, sSourceType, sSourceDiagramId) {
                var oBounds, x, y, width, height, sId, sSourceObjectId, oSourceObject, sSourceObjectType, oTargetSymbol, sTargetSymbolType, sLinkSourceId, sLinkTargetId, oLinkSourceSymbol, oLinkTargetSymbol, sLinkSourceObjectId, sLinkTargetObjectId, oTargetObject, oPoints, aWayPoints, i, nRatio = 1,
                aSymbols;
                if (oSourceSymbol) {
                    sId = this.getSourceId(oSourceSymbol);
                    oSourceObject = this.getSourceSymbolObject(oSourceSymbol);
                    if (oSourceObject) {
                        sSourceObjectId = this.getSourceId(oSourceObject);
                        if (this.context.additionalInfo && this.context.additionalInfo.typeMap) {
                            sSourceObjectType = this.context.additionalInfo.typeMap[sSourceObjectId]
                        }
                        sTargetSymbolType = this.symbolTypeMapping[sSourceObjectType];
                        if (sTargetSymbolType) {
                            oTargetSymbol = this.createTargetObject(this.context.targetSymbolContainer, sTargetSymbolType)
                        }
                    }
                    if (oTargetSymbol) {
                        this.context.mapObjects(sId, this.getTargetId(oTargetSymbol));
                        this.setTargetProperty(oTargetSymbol, "object", oSourceObject);
                        if (sSourceType === "BPMNShape") {
                            oBounds = this.getSourceObject(oSourceSymbol, "Bounds");
                            x = this.getSourceProperty(oBounds, "x");
                            y = this.getSourceProperty(oBounds, "y");
                            x = sap.galilei.core.validateNumeric(parseFloat(x), 0, false);
                            y = sap.galilei.core.validateNumeric(parseFloat(y), 0, false);
                            this.setTargetProperty(oTargetSymbol, "x", x * nRatio);
                            this.setTargetProperty(oTargetSymbol, "y", y * nRatio);
                            if (!oTargetSymbol.isKeepSize) {
                                width = this.getSourceProperty(oBounds, "width");
                                height = this.getSourceProperty(oBounds, "height");
                                width = sap.galilei.core.validateNumeric(parseFloat(width));
                                height = sap.galilei.core.validateNumeric(parseFloat(height));
                                this.setTargetProperty(oTargetSymbol, "width", width * nRatio);
                                this.setTargetProperty(oTargetSymbol, "height", height * nRatio);
                                oTargetSymbol.isAdjustToContent = false
                            }
                        } else {
                            if (sSourceType === "BPMNEdge") {
                                sLinkSourceId = this.getSourceProperty(oSourceSymbol, "sourceElement");
                                sLinkTargetId = this.getSourceProperty(oSourceSymbol, "targetElement");
                                if (!sLinkSourceId) {
                                    if (sSourceObjectType === "dataOutputAssociation") {
                                        if (this.context.additionalInfo && this.context.additionalInfo.parentMap) {
                                            sLinkSourceObjectId = this.context.additionalInfo.parentMap[sSourceObjectId]
                                        }
                                    } else {
                                        sLinkSourceObjectId = this.getSourceProperty(oSourceObject, "sourceRef") || this.reader.getText(this.getSourceObject(oSourceObject, "sourceRef"))
                                    }
                                    if (sLinkSourceObjectId && this.context.additionalInfo && this.context.additionalInfo.symbolMap) {
                                        aSymbols = this.context.additionalInfo.symbolMap[sLinkSourceObjectId + "-" + sSourceDiagramId];
                                        sLinkSourceId = aSymbols && aSymbols[0]
                                    }
                                }
                                oLinkSourceSymbol = sLinkSourceId && this.context.getSourceObject(sLinkSourceId);
                                if (!sLinkTargetId) {
                                    if (sSourceObjectType === "dataInputAssociation") {
                                        if (this.context.additionalInfo && this.context.additionalInfo.parentMap) {
                                            sLinkTargetObjectId = this.context.additionalInfo.parentMap[sSourceObjectId]
                                        }
                                    } else {
                                        sLinkTargetObjectId = this.getSourceProperty(oSourceObject, "targetRef") || this.reader.getText(this.getSourceObject(oSourceObject, "targetRef"))
                                    }
                                    if (sLinkTargetObjectId && this.context.additionalInfo && this.context.additionalInfo.symbolMap) {
                                        aSymbols = this.context.additionalInfo.symbolMap[sLinkTargetObjectId + "-" + sSourceDiagramId];
                                        sLinkTargetId = aSymbols && aSymbols[0]
                                    }
                                }
                                oLinkTargetSymbol = sLinkTargetId && this.context.getSourceObject(sLinkTargetId);
                                if (!oLinkSourceSymbol || !oLinkTargetSymbol) {
                                    if (oTargetSymbol.object) {
                                        oSourceObject = oTargetSymbol.object[this.constants.LINK_OBJECT_SOURCE];
                                        oTargetObject = oTargetSymbol.object[this.constants.LINK_OBJECT_TARGET];
                                        if (oSourceObject && oSourceObject.relatedSymbols.length > 0) {
                                            oLinkSourceSymbol = oSourceObject.relatedSymbols.get(0)
                                        }
                                        if (oTargetObject && oTargetObject.relatedSymbols.length > 0) {
                                            oLinkTargetSymbol = oTargetObject.relatedSymbols.get(0)
                                        }
                                    }
                                }
                                if (!oLinkSourceSymbol || !oLinkTargetSymbol) {
                                    console.log("Cannot transform BPMNEdge (" + sId + ") without source or target extremities.");
                                    oTargetSymbol.deleteObject();
                                    return
                                }
                                this.setTargetProperty(oTargetSymbol, "sourceSymbol", oLinkSourceSymbol);
                                this.setTargetProperty(oTargetSymbol, "targetSymbol", oLinkTargetSymbol);
                                if ((oTargetSymbol.sourceSymbol && oTargetSymbol.sourceSymbol.isLinkSymbol) || (oTargetSymbol.targetSymbol && oTargetSymbol.targetSymbol.isLinkSymbol)) {
                                    console.log("Link symbol (" + sId + ") between link symbols is not supported.");
                                    oTargetSymbol.deleteObject();
                                    return
                                }
                                oPoints = new sap.galilei.ui.common.Points();
                                aWayPoints = this.getSourceReference(oSourceSymbol, "waypoint");
                                if (aWayPoints && aWayPoints.length >= 2) {
                                    for (i = 0; i < aWayPoints.length; i++) {
                                        x = this.getSourceProperty(aWayPoints[i], "x");
                                        y = this.getSourceProperty(aWayPoints[i], "y");
                                        x = sap.galilei.core.validateNumeric(parseFloat(x), 0, false);
                                        y = sap.galilei.core.validateNumeric(parseFloat(y), 0, false);
                                        x *= nRatio;
                                        y *= nRatio;
                                        oPoints.push([x, y])
                                    }
                                    this.setTargetProperty(oTargetSymbol, "points", oPoints)
                                }
                            }
                        }
                        this.onSetTargetSymbolProperties(oTargetSymbol, oSourceSymbol, sSourceType);
                        return oTargetSymbol
                    }
                }
            },
            getSourceSymbolObject: function(oSourceSymbol) {
                var sSourceObjectId = this.getSourceProperty(oSourceSymbol, "bpmnElement");
                if (sSourceObjectId && this.context) {
                    return this.context.getSourceObject(sSourceObjectId)
                }
                return undefined
            },
            onSetTargetSymbolProperties: function(oTargetSymbol, oSourceSymbol, sSourceType) {
                this.defaultOnSetTargetSymbolProperties(oTargetSymbol, oSourceSymbol, sSourceType)
            },
            defaultOnSetTargetSymbolProperties: function(oTargetSymbol, oSourceSymbol, sSourceType) {
                var sHorizontal, sMarkerVisible;
                if (oTargetSymbol && oSourceSymbol) {
                    switch (oTargetSymbol.classDefinition.qualifiedName) {
                    case this.constants.POOL_SYMBOL:
                    case this.constants.LANE_SYMBOL:
                        this.setTargetProperty(oTargetSymbol, this.constants.ORIENTATION_PROPERTY, this.context.additionalInfo.isHorizontal ? sap.galilei.ui.symbol.Orientation.horizontal: sap.galilei.ui.symbol.Orientation.vertical);
                        break;
                    case this.constants.GATEWAY_SYMBOL:
                        if (oTargetSymbol.object && this.writer.getProperty(oTargetSymbol.object, this.constants.GATEWAY_TYPE_PROPERTY) === this.constants.GATEWAY_TYPE_VALUE_EXCLUSIVE) {
                            sMarkerVisible = this.getSourceProperty(oSourceSymbol, "isMarkerVisible");
                            if (sMarkerVisible !== "true") {
                                if (oTargetSymbol.object) {
                                    this.setTargetProperty(oTargetSymbol.object, this.constants.GATEWAY_TYPE_PROPERTY, this.constants.GATEWAY_TYPE_VALUE_DEFAULT)
                                }
                            }
                        }
                        break
                    }
                }
            },
            changeTargetSymbolContainer: function(oTargetSymbol, oContainer) {
                var oParentBBox, aCenter;
                if (oTargetSymbol && oContainer) {
                    if ((oContainer instanceof sap.galilei.ui.diagram.Symbol) && !oTargetSymbol.isBoundarySymbol) {
                        oParentBBox = oContainer.getBBox();
                        aCenter = oTargetSymbol.getCenter();
                        if (!oParentBBox.isPointInRect(aCenter)) {
                            return false
                        }
                    }
                    if (this.removeTargetReference(oTargetSymbol.container, oTargetSymbol)) {
                        this.addTargetReference(oContainer, oTargetSymbol);
                        return true
                    }
                }
                return false
            },
            validateObject: function(oTargetObject) {
                return true
            },
            validateSymbol: function(oSourceSymbol, oTargetSymbol, sSourceDiagramId) {
                if (oTargetSymbol) {
                    if (!oTargetSymbol.object) {
                        oTargetSymbol.deleteObject();
                        console.log("BPMNShape (" + this.getSourceId(oSourceSymbol) + ") cannot be transformed.");
                        return false
                    }
                    if (oTargetSymbol.isLinkSymbol) {
                        if (!oTargetSymbol.sourceSymbol || !oTargetSymbol.targetSymbol) {
                            oTargetSymbol.deleteObject();
                            console.log("BPMNEdge (" + this.getSourceId(oSourceSymbol) + ") cannot be transformed.");
                            return false
                        }
                    }
                }
                return true
            },
            postTransformSymbol: function(oSourceSymbol, oTargetSymbol, sSourceDiagramId) {
                var sSourceObjectId, i, j, sId, sParentId, sSourceType, aPoolSymbolIds, aParentSymbolIds, oParentSymbol, oPoolSymbol, aLaneSymbolIds, oLaneSymbol, oFlowNodeMap, aLaneIds, sLaneId, sParentLaneId, sPoolId, sProcessId, oSourceParentSymbol, bPreserve, oLinkSourceSymbol, oLinkTargetSymbol, aPt, oRect, oBoundary, sAttachedTo, aActivitySymbolIds, oActivitySymbol, oInfo = this.context.additionalInfo;
                if (oSourceSymbol && oTargetSymbol && oInfo) {
                    if (!this.validateSymbol(oSourceSymbol, oTargetSymbol, sSourceDiagramId)) {
                        return
                    }
                    sSourceObjectId = this.getSourceProperty(oSourceSymbol, "bpmnElement");
                    if (sSourceObjectId && oInfo.typeMap) {
                        sSourceType = oInfo.typeMap[sSourceObjectId];
                        if (sSourceType === "participant") {
                            if (oInfo.poolProcessMap) {
                                sProcessId = oInfo.poolProcessMap[sSourceObjectId];
                                if (sProcessId && oInfo.processNoBoundaryMap && oInfo.processNoBoundaryMap[sProcessId]) {
                                    oTargetSymbol.deleteObject()
                                }
                            }
                        } else {
                            if (sSourceType === "lane") {
                                if (oInfo.parentMap) {
                                    sId = sSourceObjectId;
                                    sParentId = oInfo.parentMap[sId];
                                    while (sParentId) {
                                        if (oInfo.typeMap[sParentId] === "process") {
                                            sProcessId = sParentId;
                                            break
                                        } else {
                                            if (!sParentLaneId && oInfo.typeMap[sParentId] === "lane") {
                                                sParentLaneId = sParentId
                                            }
                                        }
                                        sParentId = oInfo.parentMap[sParentId]
                                    }
                                    if (sProcessId) {
                                        if (oInfo.processNoBoundaryMap && oInfo.processNoBoundaryMap[sProcessId]) {
                                            oTargetSymbol.deleteObject()
                                        } else {
                                            if (sParentLaneId) {
                                                aLaneSymbolIds = oInfo.symbolMap[sParentLaneId + "-" + sSourceDiagramId];
                                                if (aLaneSymbolIds) {
                                                    for (i = 0; i < aLaneSymbolIds.length; i++) {
                                                        oLaneSymbol = this.context.getMappedObject(aLaneSymbolIds[i]);
                                                        if (this.changeTargetSymbolContainer(oTargetSymbol, oLaneSymbol)) {
                                                            oTargetSymbol.orientation = oLaneSymbol.orientation;
                                                            return
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (oInfo.processPoolMap) {
                                                    sPoolId = oInfo.processPoolMap[sParentId];
                                                    if (sPoolId && oInfo.symbolMap) {
                                                        aPoolSymbolIds = oInfo.symbolMap[sPoolId + "-" + sSourceDiagramId];
                                                        if (aPoolSymbolIds) {
                                                            for (i = 0; i < aPoolSymbolIds.length; i++) {
                                                                oPoolSymbol = this.context.getMappedObject(aPoolSymbolIds[i]);
                                                                if (this.changeTargetSymbolContainer(oTargetSymbol, oPoolSymbol)) {
                                                                    oTargetSymbol.orientation = oPoolSymbol.orientation;
                                                                    return
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (sSourceType === "boundaryEvent") {
                                    oBoundary = this.context.getSourceObject(sSourceObjectId);
                                    if (oBoundary) {
                                        sAttachedTo = this.getSourceProperty(oBoundary, "attachedToRef");
                                        if (sAttachedTo) {
                                            aActivitySymbolIds = oInfo.symbolMap[sAttachedTo + "-" + sSourceDiagramId];
                                            if (aActivitySymbolIds) {
                                                for (i = 0; i < aActivitySymbolIds.length; i++) {
                                                    oActivitySymbol = this.context.getMappedObject(aActivitySymbolIds[i]);
                                                    if (oActivitySymbol && this.changeTargetSymbolContainer(oTargetSymbol, oActivitySymbol)) {
                                                        return
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (this.constants.BPMN2_FLOW_NODES.indexOf(sSourceType) >= 0 || this.constants.BPMN2_DATA_AS_FLOW_NODES.indexOf(sSourceType) >= 0) {
                                        if (oInfo.parentMap) {
                                            sParentId = oInfo.parentMap[sSourceObjectId];
                                            if (oInfo.typeMap[sParentId] === "process") {
                                                if (oInfo.flowNodeRefMap) {
                                                    oFlowNodeMap = oInfo.flowNodeRefMap[sParentId];
                                                    if (oFlowNodeMap) {
                                                        sLaneId = oFlowNodeMap[sSourceObjectId]
                                                    }
                                                }
                                                if (sLaneId) {
                                                    aLaneIds = [sLaneId]
                                                } else {
                                                    if (oInfo.processLaneMap && oInfo.processLaneMap[sParentId] && oInfo.processLaneMap[sParentId].length > 0) {
                                                        aLaneIds = oInfo.processLaneMap[sParentId]
                                                    }
                                                }
                                                if (oInfo.processPoolMap) {
                                                    sPoolId = oInfo.processPoolMap[sParentId]
                                                }
                                                if (aLaneIds) {
                                                    for (i = 0; i < aLaneIds.length; i++) {
                                                        sLaneId = aLaneIds[i];
                                                        aLaneSymbolIds = oInfo.symbolMap[sLaneId + "-" + sSourceDiagramId];
                                                        if (aLaneSymbolIds) {
                                                            for (j = 0; j < aLaneSymbolIds.length; j++) {
                                                                oLaneSymbol = this.context.getMappedObject(aLaneSymbolIds[j]);
                                                                if (this.changeTargetSymbolContainer(oTargetSymbol, oLaneSymbol)) {
                                                                    return
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (sPoolId) {
                                                        aPoolSymbolIds = oInfo.symbolMap[sPoolId + "-" + sSourceDiagramId];
                                                        if (aPoolSymbolIds) {
                                                            for (i = 0; i < aPoolSymbolIds.length; i++) {
                                                                oPoolSymbol = this.context.getMappedObject(aPoolSymbolIds[i]);
                                                                if (oPoolSymbol) {
                                                                    if (this.changeTargetSymbolContainer(oTargetSymbol, oPoolSymbol)) {
                                                                        return
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (this.constants.BPMN2_COMPOSITE_FLOW_NODES.indexOf(oInfo.typeMap[sParentId]) >= 0) {
                                                    aParentSymbolIds = oInfo.symbolMap[sParentId + "-" + sSourceDiagramId];
                                                    if (aParentSymbolIds) {
                                                        for (i = 0; i < aParentSymbolIds.length; i++) {
                                                            oSourceParentSymbol = this.context.getSourceObject(aParentSymbolIds[i]);
                                                            if (oSourceParentSymbol) {
                                                                if (this.getSourceProperty(oSourceParentSymbol, "isExpanded") === "true") {
                                                                    oParentSymbol = this.context.getMappedObject(aParentSymbolIds[i]);
                                                                    if (this.changeTargetSymbolContainer(oTargetSymbol, oParentSymbol)) {
                                                                        return
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        oTargetSymbol.deleteObject()
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (this.constants.BPMN2_FLOWS.indexOf(sSourceType) >= 0 && oTargetSymbol.isLinkSymbol) {
                                            oTargetSymbol.updateOwner();
                                            bPreserve = true;
                                            if (oTargetSymbol.points && oTargetSymbol.points.length >= 2) {
                                                oLinkSourceSymbol = oTargetSymbol.sourceSymbol;
                                                oLinkTargetSymbol = oTargetSymbol.targetSymbol;
                                                if (oLinkSourceSymbol) {
                                                    if (oLinkSourceSymbol.isKeepSize) {
                                                        bPreserve = false
                                                    } else {
                                                        oRect = oLinkSourceSymbol.getBBox();
                                                        aPt = oTargetSymbol.points[0];
                                                        if (!oRect.isPointInRect(aPt)) {
                                                            bPreserve = false
                                                        }
                                                    }
                                                }
                                                if (oLinkTargetSymbol) {
                                                    if (oLinkTargetSymbol.isKeepSize) {
                                                        bPreserve = false
                                                    } else {
                                                        oRect = oLinkTargetSymbol.getBBox();
                                                        aPt = oTargetSymbol.points[oTargetSymbol.points.length - 1];
                                                        if (!oRect.isPointInRect(aPt)) {
                                                            bPreserve = false
                                                        }
                                                    }
                                                }
                                            }
                                            oTargetSymbol.updateLinkRouting(bPreserve)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            transformDataStoreReference: function(oSourceObject, sSourceType) {
                return this.transformObject(oSourceObject, sSourceType)
            },
            transformBoundaryEvent: function(oSourceObject, sSourceType) {
                return this.transformObject(oSourceObject, sSourceType)
            },
            transformStartEvent: function(oSourceObject, sSourceType) {
                return this.transformObject(oSourceObject, sSourceType)
            },
            transformEndEvent: function(oSourceObject, sSourceType) {
                return this.transformObject(oSourceObject, sSourceType)
            },
            transformLaneSets: function(oSourceContainer, sProcessId) {
                var i, j, k, sContainerId = this.getSourceId(oSourceContainer),
                aLaneSet,
                sLaneId,
                aLanes,
                sFlowNodeId,
                aFlowNodeRefs;
                aLaneSet = this.getSourceReference(oSourceContainer, "laneSet") || this.getSourceReference(oSourceContainer, "childLaneSet");
                if (aLaneSet) {
                    this.context.additionalInfo.flowNodeRefMap = this.context.additionalInfo.flowNodeRefMap || {};
                    this.context.additionalInfo.flowNodeRefMap[sProcessId] = this.context.additionalInfo.flowNodeRefMap[sProcessId] || {};
                    this.context.additionalInfo.processLaneMap = this.context.additionalInfo.processLaneMap || {};
                    this.context.additionalInfo.processLaneMap[sProcessId] = this.context.additionalInfo.processLaneMap[sProcessId] || [];
                    for (i = 0; i < aLaneSet.length; i++) {
                        aLanes = this.getSourceReference(aLaneSet[i], "lane");
                        if (aLanes) {
                            for (j = 0; j < aLanes.length; j++) {
                                sLaneId = this.getSourceId(aLanes[j]);
                                if (sLaneId) {
                                    this.context.additionalInfo.processLaneMap[sProcessId].push(sLaneId);
                                    aFlowNodeRefs = this.getSourceReference(aLanes[j], "flowNodeRef");
                                    if (aFlowNodeRefs) {
                                        for (k = 0; k < aFlowNodeRefs.length; k++) {
                                            sFlowNodeId = this.reader.getText(aFlowNodeRefs[k]);
                                            if (sFlowNodeId) {
                                                this.context.additionalInfo.flowNodeRefMap[sProcessId][sFlowNodeId] = sLaneId
                                            }
                                        }
                                    }
                                    if (this.context.additionalInfo.parentMap && !this.context.additionalInfo.parentMap[sLaneId]) {
                                        this.context.additionalInfo.parentMap[sLaneId] = sContainerId
                                    }
                                }
                                this.transformObject(aLanes[j], "lane");
                                this.transformLaneSets(aLanes[j], sProcessId)
                            }
                        }
                    }
                }
            },
            transformDataAssociation: function(oSourceObject, sSourceType) {
                var i, oTarget, sTargetItem, sParent, sSourceRef, sTargetRef, sSourceItem, aSourceItems, oTargetSourceItem;
                if (sSourceType === "dataInputAssociation") {
                    oTarget = this.createTargetObject(this.context.targetObjectContainer, this.constants.DATA_ASSOCIATION_OBJECT);
                    if (oTarget) {
                        this.context.mapObjects(this.getSourceId(oSourceObject), this.getTargetId(oTarget));
                        sSourceRef = this.reader.getText(this.getSourceObject(oSourceObject, "sourceRef"));
                        if (sSourceRef) {
                            this.setTargetProperty(oTarget, this.constants.LINK_OBJECT_SOURCE, this.context.getSourceObject(sSourceRef))
                        }
                        if (this.context.additionalInfo && this.context.additionalInfo.parentMap) {
                            sParent = this.context.additionalInfo.parentMap[this.getSourceId(oSourceObject)];
                            if (sParent) {
                                this.setTargetProperty(oTarget, this.constants.LINK_OBJECT_TARGET, this.context.getSourceObject(sParent))
                            }
                        }
                        sTargetItem = this.reader.getText(this.getSourceObject(oSourceObject, "targetRef"));
                        if (sTargetItem) {
                            this.setTargetProperty(oTarget, this.constants.TARGET_ITEM_PROPERTY, this.context.getSourceObject(sTargetItem))
                        }
                    }
                } else {
                    if (sSourceType === "dataOutputAssociation") {
                        oTarget = this.createTargetObject(this.context.targetObjectContainer, this.constants.DATA_ASSOCIATION_OBJECT);
                        if (oTarget) {
                            this.context.mapObjects(this.getSourceId(oSourceObject), this.getTargetId(oTarget));
                            if (this.context.additionalInfo && this.context.additionalInfo.parentMap) {
                                sParent = this.context.additionalInfo.parentMap[this.getSourceId(oSourceObject)];
                                if (sParent) {
                                    this.setTargetProperty(oTarget, this.constants.LINK_OBJECT_SOURCE, this.context.getSourceObject(sParent))
                                }
                            }
                            sTargetRef = this.reader.getText(this.getSourceObject(oSourceObject, "targetRef"));
                            if (sTargetRef) {
                                this.setTargetProperty(oTarget, this.constants.LINK_OBJECT_TARGET, this.context.getSourceObject(sTargetRef))
                            }
                            aSourceItems = this.getSourceReference(oSourceObject, "sourceRef");
                            if (aSourceItems) {
                                for (i = 0; i < aSourceItems.length; i++) {
                                    sSourceItem = this.reader.getText(aSourceItems[i]);
                                    if (sSourceItem) {
                                        oTargetSourceItem = this.context.getMappedObject(sSourceItem);
                                        if (oTargetSourceItem) {
                                            this.addTargetReference(oTarget, oTargetSourceItem, this.constants.SOURCE_ITEMS_REFERENCE)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            getSourceReference: function(oSourceContainer, sReference) {
                if (this.reader.isReference(sReference)) {
                    return this.reader.getReference(oSourceContainer, sReference)
                }
            },
            getSourceObject: function(oSourceContainer, sReference, sId) {
                var i, aReference, sSourceId;
                if (sId) {
                    aReference = this.reader.getReference(oSourceContainer, sReference);
                    if (aReference) {
                        for (i = 0; i < aReference.length; i++) {
                            sSourceId = this.reader.getProperty(aReference[i], this.sourceIdentifier);
                            if (sSourceId === sId) {
                                return aReference[i]
                            }
                        }
                    }
                } else {
                    return this.reader.getObject(oSourceContainer, sReference)
                }
            },
            getSourceId: function(oSource) {
                return this.reader.getProperty(oSource, this.sourceIdentifier)
            },
            getSourceProperty: function(oSource, sProperty, vDefaultValue) {
                return this.reader.getProperty(oSource, sProperty, vDefaultValue)
            },
            getTargetId: function(oTarget) {
                return this.writer.getProperty(oTarget, this.targetIdentifier)
            },
            createTargetObject: function(oTargetContainer, sType, sReference, oProperties, nIndex) {
                var oTarget, sTargetId;
                if (oTargetContainer) {
                    oTarget = this.writer.createObject(oTargetContainer.resource, sType, oProperties);
                    if (oTarget) {
                        if (!this.writer.addReference(oTargetContainer, oTarget, sReference, nIndex)) {
                            oTarget.deleteObject();
                            return
                        }
                        sTargetId = this.getTargetId(oTarget);
                        if (sTargetId) {
                            this.context.addTargetObject(sTargetId, oTarget)
                        }
                        return oTarget
                    }
                }
            },
            addTargetReference: function(oTargetContainer, oTarget, sReference, nIndex) {
                return this.writer.addReference(oTargetContainer, oTarget, sReference, nIndex)
            },
            removeTargetReference: function(oTargetContainer, oTarget, sReference) {
                return this.writer.removeReference(oTargetContainer, oTarget, sReference)
            },
            delayedAddTargetReference: function(oSource, sMappingId, oTarget, sReference, nIndex) {
                var oTargetContainer = this.context.getMappedObject(this.getSourceId(oSource), sMappingId);
                if (oTargetContainer) {
                    this.addTargetReference(oTargetContainer, oTarget, sReference, nIndex)
                } else {
                    if (!this.context.inDelayMode) {
                        this.context.addDelayedJob("delayedAddTargetReference", [oSource, sMappingId, oTarget, sReference, nIndex])
                    }
                }
            },
            setTargetProperty: function(oTarget, sProperty, vValue) {
                this.defaultSetTargetProperty(oTarget, sProperty, vValue)
            },
            defaultSetTargetProperty: function(oTarget, sProperty, vValue) {
                var sId, oSource, oMapped;
                if (oTarget && sProperty) {
                    if (typeof vValue === "string" && this.writer.isReference(oTarget, sProperty)) {
                        oSource = this.context.getSourceObject(vValue);
                        if (oSource) {
                            vValue = oSource
                        }
                    }
                    if ((vValue instanceof Object) && !(vValue instanceof sap.galilei.model.Object) && this.getSourceId(vValue)) {
                        sId = this.getSourceId(vValue);
                        oMapped = this.context.getMappedObject(sId);
                        if (oMapped) {
                            this.writer.setProperty(oTarget, sProperty, oMapped)
                        } else {
                            if (!this.context.inDelayMode) {
                                this.context.addDelayedJob("setTargetProperty", [oTarget, sProperty, vValue])
                            }
                        }
                    } else {
                        this.writer.setProperty(oTarget, sProperty, vValue)
                    }
                }
            },
            setMappedTargetProperties: function(oTarget, oSource, sSourceType, oPropertyMap) {
                var sProperty, vProperty, vDefault;
                if (oTarget && oSource && oPropertyMap) {
                    if (typeof oPropertyMap === "string") {
                        oPropertyMap = this.propertyMapping[oPropertyMap];
                        this.setMappedTargetProperties(oTarget, oSource, sSourceType, oPropertyMap)
                    } else {
                        for (sProperty in oPropertyMap) {
                            vProperty = oPropertyMap[sProperty];
                            if (vProperty instanceof Function) {
                                vProperty.call(this, oTarget, oSource, sSourceType)
                            } else {
                                if (vProperty === true || vProperty === false || !isNaN(vProperty)) {} else {
                                    if (typeof vProperty === "string" && vProperty.length > 2 && vProperty[0] === "'" && vProperty[vProperty.length - 1] === "'") {
                                        vProperty = vProperty.substr(1, vProperty.length - 2)
                                    } else {
                                        vDefault = oTarget[sProperty];
                                        vProperty = this.getSourceProperty(oSource, vProperty, vDefault)
                                    }
                                }
                                this.setTargetProperty(oTarget, sProperty, vProperty)
                            }
                        }
                    }
                }
            },
            setComment: function(oTarget, oSource, sSourceType) {
                var i, aDocumentation, sValue, sComment = "";
                aDocumentation = this.getSourceReference(oSource, "documentation");
                if (aDocumentation) {
                    for (i = 0; i < aDocumentation.length; i++) {
                        sValue = this.reader.getText(aDocumentation[i]) || this.reader.getProperty(aDocumentation[i], "text");
                        if (sValue) {
                            sComment += sValue
                        }
                    }
                    if (sComment) {
                        this.setTargetProperty(oTarget, this.constants.COMMENT_PROPERTY, sComment)
                    }
                }
            },
            setParticipantIsMultiple: function(oTarget, oSource, sSourceType) {
                var oMultiplicity = this.getSourceObject(oSource, "participantMultiplicity");
                if (oMultiplicity) {
                    this.setTargetProperty(oTarget, this.constants.IS_MULTIPLE_PROPERTY, true)
                }
            },
            setLoopType: function(oTarget, oSource, sSourceType) {
                var oLoop = this.getSourceObject(oSource, "standardLoopCharacteristics"),
                oMultiLoop = this.getSourceObject(oSource, "multiInstanceLoopCharacteristics"),
                sIsSequential;
                if (oLoop) {
                    this.setTargetProperty(oTarget, this.constants.LOOP_TYPE_PROPERTY, this.constants.LOOP_TYPE_VALUE_LOOP)
                } else {
                    if (oMultiLoop) {
                        sIsSequential = this.getSourceProperty(oMultiLoop, "isSequential");
                        this.setTargetProperty(oTarget, this.constants.LOOP_TYPE_PROPERTY, sIsSequential === "true" ? this.constants.LOOP_TYPE_VALUE_MULTI_SEQUENTIAL: this.constants.LOOP_TYPE_VALUE_MULTI_PARALLEL)
                    }
                }
            },
            setIoSpecification: function(oTarget, oSource, sSourceType) {
                var oSpec = this.getSourceObject(oSource, "ioSpecification"),
                i,
                aInput,
                aOutput;
                if (oSpec) {
                    this.context.pushTargetObjectContainer(oTarget);
                    aInput = this.getSourceReference(oSpec, "dataInput");
                    if (aInput) {
                        for (i = 0; i < aInput.length; i++) {
                            this.transformObject(aInput[i], "dataInput")
                        }
                    }
                    aOutput = this.getSourceReference(oSpec, "dataOutput");
                    if (aOutput) {
                        for (i = 0; i < aOutput.length; i++) {
                            this.transformObject(aOutput[i], "dataOutput")
                        }
                    }
                    this.context.popTargetObjectContainer()
                }
            },
            setDataInputs: function(oTarget, oSource, sSourceType) {
                var i, aInput = this.getSourceReference(oSource, "dataInput");
                if (aInput) {
                    this.context.pushTargetObjectContainer(oTarget);
                    for (i = 0; i < aInput.length; i++) {
                        this.transformObject(aInput[i], "dataInput")
                    }
                    this.context.popTargetObjectContainer()
                }
            },
            setDataOutputs: function(oTarget, oSource, sSourceType) {
                var i, aOutput = this.getSourceReference(oSource, "dataOutput");
                if (aOutput) {
                    this.context.pushTargetObjectContainer(oTarget);
                    for (i = 0; i < aOutput.length; i++) {
                        this.transformObject(aOutput[i], "dataOutput")
                    }
                    this.context.popTargetObjectContainer()
                }
            },
            setSubProcessType: function(oTarget, oSource, sSourceType) {
                var sEvent;
                switch (sSourceType) {
                case "adHocSubProcess":
                    this.setTargetProperty(oTarget, this.constants.SUBPROCESS_TYPE_PROPERTY, this.constants.SUBPROCESS_TYPE_VALUE_ADHOC);
                    break;
                case "transaction":
                    this.setTargetProperty(oTarget, this.constants.SUBPROCESS_TYPE_PROPERTY, this.constants.SUBPROCESS_TYPE_VALUE_TRANSACTION);
                    break;
                default:
                    sEvent = this.getSourceProperty(oSource, "triggeredByEvent");
                    if (sEvent === "true") {
                        this.setTargetProperty(oTarget, this.constants.SUBPROCESS_TYPE_PROPERTY, this.constants.SUBPROCESS_TYPE_VALUE_EVENT)
                    } else {
                        this.setTargetProperty(oTarget, this.constants.SUBPROCESS_TYPE_PROPERTY, this.constants.SUBPROCESS_TYPE_VALUE_DEFAULT)
                    }
                    break
                }
            },
            setCalledObject: function(oTarget, oSource, sSourceType) {},
            setEventGatewayType: function(oTarget, oSource, sSourceType) {
                var sType = this.getSourceProperty(oSource, "eventGatewayType"),
                sInstantiate = this.getSourceProperty(oSource, "instantiate"),
                sTargetType;
                if (sInstantiate === "true") {
                    sTargetType = (sType === "Exclusive") ? this.constants.GATEWAY_TYPE_VALUE_EXCLUSIVE_EVENT: this.constants.GATEWAY_TYPE_VALUE_PARALLEL_EVENT
                } else {
                    sTargetType = this.constants.GATEWAY_TYPE_VALUE_EVENT
                }
                this.setTargetProperty(oTarget, this.constants.GATEWAY_TYPE_PROPERTY, sTargetType)
            },
            setEventDefinitions: function(oTarget, oSource, sSourceType) {
                var i, sFeature, oTargetDef, aDefs;
                for (sFeature in oSource) {
                    if (this.constants.BPMN2_EVENT_DEFINITIONS.indexOf(sFeature) >= 0) {
                        aDefs = this.getSourceReference(oSource, sFeature);
                        if (aDefs) {
                            for (i = 0; i < aDefs.length; i++) {
                                oTargetDef = this.createTargetObject(oTarget, this.constants.EVENT_DEFINITION_OBJECT);
                                if (oTargetDef) {
                                    this.setTargetProperty(oTargetDef, this.constants.EVENT_DEFINITION_TYPE_PROPERTY, sFeature.replace("EventDefinition", ""))
                                }
                            }
                        }
                    }
                }
            },
            setDataState: function(oTarget, oSource, sSourceType) {
                var oDataState = this.getSourceObject(oSource, "dataState"),
                sValue;
                if (oDataState) {
                    sValue = this.getSourceProperty(oDataState, "name");
                    if (sValue) {
                        this.setTargetProperty(oTarget, this.constants.DATA_STATE_PROPERTY, sValue)
                    }
                }
            },
            setAnnotationText: function(oTarget, oSource, sSourceType) {
                var sText = this.getSourceProperty(oSource, "text") || this.reader.getText(this.getSourceObject(oSource, "text"));
                if (sText) {
                    this.setTargetProperty(oTarget, "text", sText)
                }
            }
        }
    });
	
	
sap.modeling.cdt.GalileiBpmn2Transformation = sap.galilei.core.defineClass({
        fullClassName: "sap.modeling.cdt.GalileiBpmn2Transformation",
        initialize: function(oParam) {
            this.set(oParam);
            this.sourceIdentifier = "objectId";
            this.targetIdentifier = "id";
            this.context = new sap.modeling.bpmn.ui.TransformContext();
            this.reader = new sap.modeling.bpmn.ui.GalileiAdapter();
            this.writer = new sap.modeling.bpmn.ui.XmlAdapter({
                xmlNamespaces: {
                    xsi: "http://www.w3.org/2001/XMLSchema-instance",
                    bpmn2: "http://www.omg.org/spec/BPMN/20100524/MODEL",
                    bpmndi: "http://www.omg.org/spec/BPMN/20100524/DI",
                    di: "http://www.omg.org/spec/DD/20100524/DI",
                    dc: "http://www.omg.org/spec/DD/20100524/DC"
                },
                identifier: this.targetIdentifier
            });
            this.typeMapping = {
                "sap.modeling.bpmn.Participant": "bpmn2.participant",
                "sap.modeling.bpmn.Lane": "bpmn2.lane",
                "sap.modeling.bpmn.ui.Diagram": "bpmndi.BPMNDiagram",
                "sap.modeling.bpmn.StartEvent": "bpmn2.startEvent",
                "sap.modeling.bpmn.IntermediateCatchEvent": "bpmn2.intermediateCatchEvent",
                "sap.modeling.bpmn.IntermediateThrowEvent": "bpmn2.intermediateThrowEvent",
                "sap.modeling.bpmn.EndEvent": "bpmn2.endEvent",
                "sap.modeling.bpmn.BoundaryEvent": "bpmn2.boundaryEvent",
                "sap.modeling.bpmn.EventDefinition": {
                    type: {
                        message: "bpmn2.messageEventDefinition",
                        timer: "bpmn2.timerEventDefinition",
                        error: "bpmn2.errorEventDefinition",
                        escalation: "bpmn2.escalationEventDefinition",
                        cancel: "bpmn2.cancelEventDefinition",
                        compensation: "bpmn2.compensateEventDefinition",
                        conditional: "bpmn2.conditionalEventDefinition",
                        link: "bpmn2.linkEventDefinition",
                        signal: "bpmn2.signalEventDefinition",
                        terminate: "bpmn2.terminateEventDefinition"
                    }
                },
                "sap.modeling.bpmn.Task": {
                    type: {
                        "": "bpmn2.task",
                        user: "bpmn2.userTask",
                        script: "bpmn2.scriptTask",
                        manual: "bpmn2.manualTask",
                        service: "bpmn2.serviceTask",
                        businessRule: "bpmn2.businessRuleTask",
                        send: "bpmn2.sendTask",
                        receive: "bpmn2.receiveTask"
                    }
                },
                "sap.modeling.bpmn.SubProcess": {
                    type: {
                        "": "bpmn2.subProcess",
                        event: "bpmn2.subProcess",
                        adhoc: "bpmn2.adHocSubProcess",
                        transaction: "bpmn2.transaction"
                    }
                },
                "sap.modeling.bpmn.CallActivity": "bpmn2.callActivity",
                "sap.modeling.bpmn.Gateway": {
                    type: {
                        "": "bpmn2.exclusiveGateway",
                        complex: "bpmn2.complexGateway",
                        inclusive: "bpmn2.inclusiveGateway",
                        exclusive: "bpmn2.exclusiveGateway",
                        parallel: "bpmn2.parallelGateway",
                        eventBased: "bpmn2.eventBasedGateway",
                        exclusiveEventBased: "bpmn2.eventBasedGateway",
                        parallelEventBased: "bpmn2.eventBasedGateway"
                    }
                },
                "sap.modeling.bpmn.DataStore": "bpmn2.dataStore",
                "sap.modeling.bpmn.DataStoreReference": "bpmn2.dataStoreReference",
                "sap.modeling.bpmn.DataObject": "bpmn2.dataObject",
                "sap.modeling.bpmn.DataObjectReference": "bpmn2.dataObjectReference",
                "sap.modeling.bpmn.DataInput": "bpmn2.dataInput",
                "sap.modeling.bpmn.DataOutput": "bpmn2.dataOutput",
                "sap.modeling.bpmn.SequenceFlow": "bpmn2.sequenceFlow",
                "sap.modeling.bpmn.MessageFlow": "bpmn2.messageFlow",
                "sap.modeling.bpmn.Message": "bpmn2.message",
                "sap.modeling.bpmn.Annotation": "bpmn2.textAnnotation",
                "sap.modeling.bpmn.Association": "bpmn2.association",
                "sap.modeling.bpmn.Property": "bpmn2.property",
                "sap.modeling.bpmn.Scrap": "bpmn2.scrap",
                "sap.modeling.bpmn.Hold": "bpmn2.hold",
                "sap.modeling.bpmn.Done": "bpmn2.done"
            };
            this.propertyMapping = {
                "sap.modeling.bpmn.Participant": {
                    name: "name",
                    documentation: this.setDocumentation,
                    participantMultiplicity: this.setParticipantMultiplicity
                },
                "sap.modeling.bpmn.Lane": {
                    name: "name",
                    documentation: this.setDocumentation
                },
                "sap.modeling.bpmn.StartEvent": {
                    name: "name",
                    parallelMultiple: "isParallel",
                    isInterrupting: "isInterrupting",
                    documentation: this.setDocumentation,
                    eventDefinitions: this.setEventDefinitions,
                    ioSpecification: this.setDataOutputs,
                    properties: this.setProperties
                },
                "sap.modeling.bpmn.BoundaryEvent": {
                    name: "name",
                    parallelMultiple: "isParallel",
                    cancelActivity: "isCancel",
                    documentation: this.setDocumentation,
                    eventDefinitions: this.setEventDefinitions,
                    ioSpecification: this.setDataOutputs,
                    attachedToRef: this.setAttachedTo,
                    properties: this.setProperties
                },
                "sap.modeling.bpmn.IntermediateCatchEvent": {
                    name: "name",
                    parallelMultiple: "isParallel",
                    documentation: this.setDocumentation,
                    eventDefinitions: this.setEventDefinitions,
                    ioSpecification: this.setDataOutputs,
                    properties: this.setProperties
                },
                "sap.modeling.bpmn.IntermediateThrowEvent": {
                    name: "name",
                    documentation: this.setDocumentation,
                    eventDefinitions: this.setEventDefinitions,
                    ioSpecification: this.setDataInputs,
                    properties: this.setProperties
                },
                "sap.modeling.bpmn.EndEvent": {
                    name: "name",
                    documentation: this.setDocumentation,
                    eventDefinitions: this.setEventDefinitions,
                    ioSpecification: this.setDataInputs,
                    properties: this.setProperties
                },
                "sap.modeling.bpmn.Task": {
                    typeProperty: "type",
                    typedMapping: {
                        "": {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            model:"model",
                            isSelect:"isSelected"
                        },
                        manual: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification
                        },
                        user: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            implementation: "implementation"
                        },
                        script: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            script: this.setScript,
                            scriptFormat: "scriptFormat"
                        },
                        service: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            implementation: "implementation"
                        },
                        businessRule: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            implementation: "implementation"
                        },
                        send: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            implementation: "implementation"
                        },
                        receive: {
                            name: "name",
                            documentation: this.setDocumentation,
                            loopCharacteristics: this.setLoopCharacteristics,
                            startQuantity: "startQuantity",
                            completionQuantity: "completionQuantity",
                            isForCompensation: "isForCompensation",
                            "default": this.setDefaultFlow,
                            properties: this.setProperties,
                            ioSpecification: this.setIoSpecification,
                            implementation: "implementation",
                            instantiate: "instantiate"
                        }
                    }
                },
                "sap.modeling.bpmn.SubProcess": {
                    properties: {
                        name: "name",
                        documentation: this.setDocumentation,
                        loopCharacteristics: this.setLoopCharacteristics,
                        startQuantity: "startQuantity",
                        completionQuantity: "completionQuantity",
                        isForCompensation: "isForCompensation",
                        "default": this.setDefaultFlow,
                        triggeredByEvent: "isEventBased",
                        properties: this.setProperties,
                        ioSpecification: this.setIoSpecificationWithSymbol
                    }
                },
                "sap.modeling.bpmn.CallActivity": {
                    properties: {
                        name: "name",
                        documentation: this.setDocumentation,
                        loopCharacteristics: this.setLoopCharacteristics,
                        startQuantity: "startQuantity",
                        completionQuantity: "completionQuantity",
                        isForCompensation: "isForCompensation",
                        "default": this.setDefaultFlow,
                        properties: this.setProperties,
                        ioSpecification: this.setIoSpecification
                    }
                },
                "sap.modeling.bpmn.Gateway": {
                    typeProperty: "type",
                    typedMapping: {
                        "": {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction"
                        },
                        complex: {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction",
                            activationCondition: "expression",
                            "default": this.setDefaultFlow
                        },
                        inclusive: {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction",
                            "default": this.setDefaultFlow
                        },
                        exclusive: {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction",
                            "default": this.setDefaultFlow
                        },
                        eventBased: {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction",
                            eventGatewayType: this.setEventGatewayType
                        },
                        exclusiveEventBased: {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction",
                            eventGatewayType: this.setEventGatewayType
                        },
                        parallelEventBased: {
                            name: "name",
                            documentation: this.setDocumentation,
                            gatewayDirection: "direction",
                            eventGatewayType: this.setEventGatewayType
                        }
                    }
                },
                "sap.modeling.bpmn.DataStore": {
                    name: "name",
                    documentation: this.setDocumentation,
                    capacity: "capacity",
                    isUnlimited: "isUnlimited"
                },
                "sap.modeling.bpmn.DataStoreReference": {
                    name: "name",
                    documentation: this.setDocumentation,
                    dataStoreRef: "dataStore"
                },
                "sap.modeling.bpmn.DataObject": {
                    name: "name",
                    documentation: this.setDocumentation,
                    isCollection: "isCollection"
                },
                "sap.modeling.bpmn.DataObjectReference": {
                    name: "name",
                    documentation: this.setDocumentation,
                    dataState: this.setDataState,
                    dataObjectRef: this.setDataObject
                },
                "sap.modeling.bpmn.DataInput": {
                    name: "name",
                    documentation: this.setDocumentation,
                    isCollection: "isCollection"
                },
                "sap.modeling.bpmn.DataOutput": {
                    name: "name",
                    documentation: this.setDocumentation,
                    isCollection: "isCollection"
                },
                "sap.modeling.bpmn.SequenceFlow": {
                    name: "name",
                    documentation: this.setDocumentation,
                    sourceRef: this.setLinkSource,
                    targetRef: this.setLinkTarget,
                    isImmediate: "isImmediate",
                    condition: "condition"
                },
                "sap.modeling.bpmn.MessageFlow": {
                    name: "name",
                    documentation: this.setDocumentation,
                    sourceRef: this.setLinkSource,
                    targetRef: this.setLinkTarget
                },
                "sap.modeling.bpmn.ui.Diagram": {
                    name: "name",
                    documentation: "comment",
                    resolution: this.setResolution
                },
                "sap.modeling.bpmn.Message": {
                    name: "name"
                },
                "sap.modeling.bpmn.Annotation": {
                    text: this.setAnnotationText,
                    textFormat: "textFormat"
                },
                "sap.modeling.bpmn.Association": {
                    sourceRef: this.setLinkSource,
                    targetRef: this.setLinkTarget
                },
                "sap.modeling.bpmn.Property": {
                    name: "name",
                    documentation: this.setDocumentation
                },
                "sap.modeling.bpmn.Scrap": {
                    name: "name",
                    documentation: this.setDocumentation
                },
                "sap.modeling.bpmn.Hold": {
                    name: "name",
                    documentation: this.setDocumentation
                },
                "sap.modeling.bpmn.Done": {
                    name: "name",
                    documentation: this.setDocumentation
                }
            };
            this.constants = {
                DATA_STORE_OBJECT: "sap.modeling.bpmn.DataStore",
                DATA_STORE_SYMBOL: "sap.modeling.bpmn.ui.DataStoreReferenceSymbol",
                DATA_INPUT_OBJECT: "sap.modeling.bpmn.DataInput",
                DATA_INPUT_SYMBOL: "sap.modeling.bpmn.ui.DataInputSymbol",
                DATA_OUTPUT_OBJECT: "sap.modeling.bpmn.DataOutput",
                DATA_OUTPUT_SYMBOL: "sap.modeling.bpmn.ui.DataOutputSymbol",
                DATA_ASSOCIATION_OBJECT: "sap.modeling.bpmn.DataAssociation",
                DATA_ASSOCIATION_SYMBOL: "sap.modeling.bpmn.ui.DataAssociationSymbol",
                ASSOCIATION_SYMBOL: "sap.modeling.bpmn.ui.AssociationSymbol",
                ANNOTATION_SYMBOL: "sap.modeling.bpmn.ui.AnnotationSymbol",
                BOUNDARY_EVENT_SYMBOL: "sap.modeling.bpmn.ui.BoundaryEventSymbol",
                POOL_SYMBOL: "sap.modeling.bpmn.ui.PoolSymbol",
                TASK_SYMBOL: "sap.modeling.bpmn.ui.TaskSymbol",
                LANE_SYMBOL: "sap.modeling.bpmn.ui.LaneSymbol",
                SUBPROCESS_SYMBOL: "sap.modeling.bpmn.ui.SubProcessSymbol",
                MESSAGE_FLOW_SYMBOL: "sap.modeling.bpmn.ui.MessageFlowSymbol",
                SEQUENCE_FLOW_SYMBOL: "sap.modeling.bpmn.ui.SequenceFlowSymbol",
                PROPERTY_OBJECT: "sap.modeling.bpmn.Property",
                COMMENT_PROPERTY: "comment",
                POOL_ISMULTIPLE_PROPERTY: "isMultiple",
                LINK_OBJECT_SOURCE: "source",
                LINK_OBJECT_TARGET: "target",
                LOOP_TYPE_PROPERTY: "loopType",
                SUBPROCESS_TYPE_PROPERTY: "type",
                SOURCE_SYMBOL_PROPERTY: "sourceSymbol",
                TARGET_SYMBOL_PROPERTY: "targetSymbol",
                EVENT_DEFINITIONS_REFERENCE: "eventDefinitions",
                GATEWAY_TYPE_PROPERTY: "type",
                GATEWAY_TYPE_VALUE_EVENT_PARALLEL: sap.modeling.bpmn.GatewayTypes.parallelEventBased,
                GATEWAY_TYPE_VALUE_EVENT_EXCLUSIVE: sap.modeling.bpmn.GatewayTypes.exclusiveEventBased,
                GATEWAY_TYPE_VALUE_EVENT: sap.modeling.bpmn.GatewayTypes.eventBased,
                DATA_STATE_PROPERTY: "state",
                DATA_REFERENCE: "data",
                DATA_STORE_PROPERTY: "dataStore",
                SOURCE_ITEMS_REFERENCE: "sourceItems",
                TARGET_ITEM_REFERENCE: "targetItem",
                TARGET_NAMESPACE: "http://www.sap.com/bpmn2/",
                DIAGRAM_NAME_PROPERTY: "name",
                NAME_PROPERTY: "name",
                MESSAGE_PROPERTY: "message",
                SCRIPT_PROPERTY: "script",
                DEFAULT_FLOW_PROPERTY: "defaultFlow",
                DATA_OBJECT_PROPERTY: "dataObject",
                BPMN2_NO_BOUNDARY: "boundaryNotVisibleProperty",
                FLOW_NODE_SYMBOLS: ["sap.modeling.bpmn.ui.TaskSymbol", "sap.modeling.bpmn.ui.SubProcessSymbol", "sap.modeling.bpmn.ui.CallActivitySymbol", "sap.modeling.bpmn.ui.StartEventSymbol", "sap.modeling.bpmn.ui.BoundaryEventSymbol", "sap.modeling.bpmn.ui.IntermediateCatchEventSymbol", "sap.modeling.bpmn.ui.IntermediateThrowEventSymbol", "sap.modeling.bpmn.ui.GatewaySymbol", "sap.modeling.bpmn.ui.EndEventSymbol", "sap.modeling.bpmn.ui.AnnotationSymbol"],
                DATA_SYMBOLS: ["sap.modeling.bpmn.ui.DataObjectSymbol", "sap.modeling.bpmn.ui.DataObjectReferenceSymbol", "sap.modeling.bpmn.ui.DataStoreReferenceSymbol", "sap.modeling.bpmn.ui.DataInputSymbol", "sap.modeling.bpmn.ui.DataOutputSymbol"],
                SCRAP_SYMBOL: "sap.modeling.bpmn.ui.ScrapSymbol",
                HOLD_SYMBOL: "sap.modeling.bpmn.ui.HoldSymbol",
                DONE_SYMBOL: "sap.modeling.bpmn.ui.DoneSymbol"
            }
        },
        properties: {
            context: undefined,
            reader: undefined,
            writer: undefined,
            sourceIdentifier: undefined,
            targetIdentifier: undefined,
            typeMapping: undefined,
            propertyMapping: undefined,
            constants: undefined
        },
        methods: {
            _removeInvalidCharacters: function(sXml) {
                if (sXml) {
                    var oRegExp = new RegExp(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFF]+/g);
                    sXml = sXml.replace(oRegExp, "")
                }
                return sXml
            },
            transformDiagram: function(oModel, oDiagram) {
                var i, j, k, oSymbol, sSymbolClass, oDefinitions, aPools = [],
                aFlowElements = [],
                aMessageFlows = [],
                oSequenceFlows = {},
                aSequenceFlows,
                oRootPool,
                bCreateDefaultProcess,
                sCollaborationId,
                sModelName,
                oCollaboration,
                oTargetDiagram,
                oTargetPlane,
                sProcessId,
                oProcess,
                oParticipant,
                oPoolSymbol,
                sPoolId,
                oSubSymbol,
                oLaneSymbol,
                oFlowSymbol,
                oDataSymbol,
                aDataInputs = [],
                aDataOutputs = [],
                aDelayedJobs,
                fnJob,
                oSpec,
                bAddNoBoundaryProperty = true,
                aProperties,
                aPoolProcesses = {};
                this.context.reset();
                if (oDiagram) {
                    console.log("Export diagram started.");
                    if (oModel) {
                        oDefinitions = this.createTargetObject(undefined, "bpmn2.definitions", this.getSourceId(oDiagram));
                        if (oDefinitions) {
                            sModelName = this.getSourceFeature(oDiagram, this.constants.DIAGRAM_NAME_PROPERTY);
                            this.setTargetProperty(oDefinitions, "name", sModelName);
                            this.setDocumentation(oDefinitions, oDiagram);
                            this.setTargetNamespace(oDefinitions, oDiagram);
                            this.context.pushTargetObjectContainer(oDefinitions);
                            for (i = 0; i < oDiagram.symbols.length; i++) {
                                oSymbol = oDiagram.symbols.get(i);
                                sSymbolClass = oSymbol.classDefinition.qualifiedName;
                                if (sSymbolClass === this.constants.POOL_SYMBOL) {
                                    aPools.push(oSymbol)
                                } else {
                                    if (sSymbolClass === this.constants.MESSAGE_FLOW_SYMBOL) {
                                        aMessageFlows.push(oSymbol)
                                    } else {
                                        if (sSymbolClass === this.constants.SEQUENCE_FLOW_SYMBOL) {
                                            oRootPool = sap.galilei.ui.diagram.SwimlaneSymbol.getRootSwimlaneSymbol(oSymbol.sourceSymbol);
                                            if (oRootPool) {
                                                if (oSequenceFlows[oRootPool.objectId] === undefined) {
                                                    oSequenceFlows[oRootPool.objectId] = []
                                                }
                                                oSequenceFlows[oRootPool.objectId].push(oSymbol)
                                            } else {
                                                if (oSequenceFlows[oDiagram.objectId] === undefined) {
                                                    oSequenceFlows[oDiagram.objectId] = []
                                                }
                                                oSequenceFlows[oDiagram.objectId].push(oSymbol)
                                            }
                                        } else {
                                            aFlowElements.push(oSymbol);
                                            if (this.constants.FLOW_NODE_SYMBOLS.indexOf(sSymbolClass) >= 0 || this.constants.DATA_SYMBOLS.indexOf(sSymbolClass) >= 0) {
                                                bCreateDefaultProcess = true
                                            }
                                        }
                                    }
                                }
                            }
                            if (aPools.length > 0) {
                                sCollaborationId = "collaboration-" + this.getSourceId(oDiagram);
                                oCollaboration = this.createTargetObject(oDefinitions, "bpmn2.collaboration", sCollaborationId);
                                if (oCollaboration) {
                                    this.context.pushTargetObjectContainer(oCollaboration);
                                    for (i = 0; i < aPools.length; i++) {
                                        oPoolSymbol = aPools[i];
                                        if (oPoolSymbol.object) {
                                            sPoolId = this.getSourceId(oPoolSymbol);
                                            oParticipant = this.transformObject(oPoolSymbol.object, sPoolId, sPoolId, {
                                                sourceSymbol: oPoolSymbol
                                            });
                                            if (oParticipant && oPoolSymbol.symbols.length > 0) {
                                                sProcessId = "process-" + sPoolId;
                                                oProcess = this.createTargetObject(oDefinitions, "bpmn2.process", sProcessId);
                                                if (oProcess) {
                                                    this.setTargetProperty(oParticipant, "processRef", sProcessId);
                                                    aPoolProcesses[sPoolId] = oProcess
                                                }
                                            }
                                        }
                                    }
                                    for (i = 0; i < aMessageFlows.length; i++) {
                                        oFlowSymbol = aMessageFlows[i];
                                        if (oFlowSymbol.object) {
                                            this.transformMessageFlow(oFlowSymbol)
                                        }
                                    }
                                    this.context.popTargetObjectContainer();
                                    oTargetDiagram = this.transformObject(oDiagram, "diagram-" + this.getSourceId(oDiagram));
                                    oTargetPlane = this.createTargetObject(oTargetDiagram, "bpmndi.BPMNPlane");
                                    if (oTargetPlane) {
                                        this.setTargetProperty(oTargetPlane, "bpmnElement", sCollaborationId);
                                        this.context.pushTargetSymbolContainer(oTargetPlane);
                                        for (i = 0; i < aPools.length; i++) {
                                            oPoolSymbol = aPools[i];
                                            if (!this.validateSymbol(oPoolSymbol)) {
                                                continue
                                            }
                                            this.transformSymbol(oPoolSymbol);
                                            if (oPoolSymbol.object) {
                                                oProcess = aPoolProcesses[this.getSourceId(oPoolSymbol)];
                                                if (oProcess) {
                                                    this.context.pushTargetObjectContainer(oProcess);
                                                    aDataInputs = [];
                                                    aDataOutputs = [];
                                                    for (j = 0; j < oPoolSymbol.symbols.length; j++) {
                                                        oLaneSymbol = oPoolSymbol.symbols.get(j);
                                                        if (oLaneSymbol) {
                                                            for (k = 0; k < oLaneSymbol.symbols.length; k++) {
                                                                oDataSymbol = oLaneSymbol.symbols.get(k);
                                                                switch (oDataSymbol.classDefinition.qualifiedName) {
                                                                case this.constants.DATA_INPUT_SYMBOL:
                                                                    aDataInputs.push({
                                                                        sourceObject:
                                                                        oDataSymbol.object,
                                                                        targetId: this.getSourceId(oDataSymbol),
                                                                        mappingId: this.getSourceId(oDataSymbol)
                                                                    });
                                                                    break;
                                                                case this.constants.DATA_OUTPUT_SYMBOL:
                                                                    aDataOutputs.push({
                                                                        sourceObject:
                                                                        oDataSymbol.object,
                                                                        targetId: this.getSourceId(oDataSymbol),
                                                                        mappingId: this.getSourceId(oDataSymbol)
                                                                    });
                                                                    break
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (aDataInputs.length > 0 || aDataOutputs.length > 0) {
                                                        oSpec = this.createTargetObject(oProcess, "bpmn2.ioSpecification");
                                                        if (oSpec) {
                                                            this.transformIoSpecification(oSpec, aDataInputs, aDataOutputs)
                                                        }
                                                    }
                                                    for (j = 0; j < oPoolSymbol.symbols.length; j++) {
                                                        oSubSymbol = oPoolSymbol.symbols.get(j);
                                                        if (oSubSymbol && oSubSymbol.isSwimlaneSymbol) {
                                                            this.transformLane(oPoolSymbol.symbols.get(j))
                                                        } else {
                                                            this.transformFlowElement(oSubSymbol)
                                                        }
                                                    }
                                                    aSequenceFlows = oSequenceFlows[oPoolSymbol.objectId];
                                                    if (aSequenceFlows) {
                                                        for (j = 0; j < aSequenceFlows.length; j++) {
                                                            this.transformFlowElement(aSequenceFlows[j])
                                                        }
                                                    }
                                                    this.context.popTargetObjectContainer()
                                                }
                                            }
                                        }
                                        for (i = 0; i < aMessageFlows.length; i++) {
                                            oFlowSymbol = aMessageFlows[i];
                                            if (oFlowSymbol.object && this.context.getMappedId(this.getSourceId(oFlowSymbol.object), this.getSourceId(oFlowSymbol))) {
                                                this.transformSymbol(oFlowSymbol)
                                            }
                                        }
                                        this.context.popTargetSymbolContainer()
                                    }
                                }
                            }
                            if (bCreateDefaultProcess) {
                                sProcessId = "process-" + this.getSourceId(oDiagram);
                                oProcess = this.createTargetObject(oDefinitions, "bpmn2.process", sProcessId);
                                this.setTargetProperty(oProcess, "name", sModelName);
                                if (!oTargetDiagram) {
                                    oTargetDiagram = this.transformObject(oDiagram, "diagram-" + this.getSourceId(oDiagram));
                                    oTargetPlane = this.createTargetObject(oTargetDiagram, "bpmndi.BPMNPlane");
                                    this.setTargetProperty(oTargetPlane, "bpmnElement", sProcessId)
                                }
                                this.context.pushTargetObjectContainer(oProcess);
                                this.context.pushTargetSymbolContainer(oTargetPlane);
                                this.setProperties(oProcess, oModel);
                                aProperties = this.getSourceFeature(oModel, this.constants.DATA_REFERENCE);
                                if (aProperties) {
                                    for (i = 0; i < aProperties.length; i++) {
                                        if (this.getSourceFeature(aProperties.get(i), this.constants.NAME_PROPERTY) === this.constants.BPMN2_NO_BOUNDARY) {
                                            bAddNoBoundaryProperty = false;
                                            break
                                        }
                                    }
                                }
                                if (bAddNoBoundaryProperty) {
                                    this.createTargetObject(oProcess, "bpmn2.property", uuid.v4(), {
                                        name: this.constants.BPMN2_NO_BOUNDARY
                                    })
                                }
                                aDataInputs = [];
                                aDataOutputs = [];
                                for (i = 0; i < aFlowElements.length; i++) {
                                    oDataSymbol = aFlowElements[i];
                                    switch (oDataSymbol.classDefinition.qualifiedName) {
                                    case this.constants.DATA_INPUT_SYMBOL:
                                        aDataInputs.push({
                                            sourceObject:
                                            oDataSymbol.object,
                                            targetId: this.getSourceId(oDataSymbol),
                                            mappingId: this.getSourceId(oDataSymbol)
                                        });
                                        break;
                                    case this.constants.DATA_OUTPUT_SYMBOL:
                                        aDataOutputs.push({
                                            sourceObject:
                                            oDataSymbol.object,
                                            targetId: this.getSourceId(oDataSymbol),
                                            mappingId: this.getSourceId(oDataSymbol)
                                        });
                                        break
                                    }
                                }
                                if (aDataInputs.length > 0 || aDataOutputs.length > 0) {
                                    oSpec = this.createTargetObject(oProcess, "bpmn2.ioSpecification");
                                    if (oSpec) {
                                        this.transformIoSpecification(oSpec, aDataInputs, aDataOutputs)
                                    }
                                }
                                for (i = 0; i < aFlowElements.length; i++) {
                                    this.transformFlowElement(aFlowElements[i])
                                }
                                aSequenceFlows = oSequenceFlows[oDiagram.objectId];
                                if (aSequenceFlows) {
                                    for (j = 0; j < aSequenceFlows.length; j++) {
                                        this.transformFlowElement(aSequenceFlows[j])
                                    }
                                }
                                this.context.popTargetSymbolContainer();
                                this.context.popTargetObjectContainer()
                            }
                            this.context.popTargetObjectContainer();
                            aDelayedJobs = this.context.delayedJobs;
                            if (aDelayedJobs) {
                                this.context.inDelayMode = true;
                                for (i = 0; i < aDelayedJobs.length; i++) {
                                    fnJob = this[aDelayedJobs[i].job];
                                    if (fnJob instanceof Function) {
                                        fnJob.apply(this, aDelayedJobs[i].params)
                                    }
                                }
                                this.context.inDelayMode = false
                            }
                            console.log("Export diagram completed.");
                            return this._removeInvalidCharacters(this.writer.serialize())
                        }
                    }
                }
                return undefined
            },
            transformLane: function(oSourceSymbol) {
                var i, sLanesetId, oLaneset, oLane, oSubSymbol;
                if (this.validateSymbol(oSourceSymbol)) {
                    sLanesetId = "laneset-" + this.getSourceId(oSourceSymbol.parentSymbol);
                    oLaneset = this.context.getTargetObject(sLanesetId);
                    if (!oLaneset) {
                        oLaneset = this.createTargetObject(this.context.targetObjectContainer, "bpmn2.laneSet", sLanesetId)
                    }
                    if (oLaneset) {
                        this.context.pushTargetObjectContainer(oLaneset);
                        oLane = this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                            sourceSymbol: oSourceSymbol
                        });
                        this.context.popTargetObjectContainer()
                    }
                    this.transformSymbol(oSourceSymbol);
                    for (i = 0; i < oSourceSymbol.symbols.length; i++) {
                        oSubSymbol = oSourceSymbol.symbols.get(i);
                        this.transformFlowElement(oSubSymbol);
                        if (oLane && oSubSymbol.object && this.constants.FLOW_NODE_SYMBOLS.indexOf(oSubSymbol.classDefinition.qualifiedName) >= 0) {
                            this.addTargetReference(oLane, "bpmn2.flowNodeRef", oSubSymbol.object, this.getSourceId(oSubSymbol))
                        }
                    }
                }
            },
            transformDataStore: function(oSourceSymbol) {
                var sId, oDataStore;
                if (this.validateSymbol(oSourceSymbol)) {
                    oDataStore = this.getSourceFeature(oSourceSymbol.object, this.constants.DATA_STORE_PROPERTY);
                    if (oDataStore) {
                        sId = this.getSourceId(oDataStore);
                        if (!this.context.getMappedObject(sId)) {
                            this.context.pushTargetObjectContainer(this.context.rootTargetObjectContainer);
                            this.transformObject(oDataStore, this.getSourceId(oDataStore));
                            this.context.popTargetObjectContainer()
                        }
                    }
                    this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                        sourceSymbol: oSourceSymbol
                    });
                    this.transformSymbol(oSourceSymbol)
                }
            },
            transformFlowElement: function(oSourceSymbol) {
                var i, oSubSymbol, oTarget, oOldContainer, sSymbolClass = oSourceSymbol.classDefinition.qualifiedName;
                if (oSourceSymbol.isLinkSymbol) {
                    switch (sSymbolClass) {
                    case this.constants.DATA_ASSOCIATION_SYMBOL:
                        this.transformDataAssociation(oSourceSymbol);
                        break;
                    case this.constants.SEQUENCE_FLOW_SYMBOL:
                        this.transformSequenceFlow(oSourceSymbol);
                        break;
                    case this.constants.ASSOCIATION_SYMBOL:
                        this.transformAssociation(oSourceSymbol);
                        break;
                    default:
                        if (this.validateSymbol(oSourceSymbol)) {
                            this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                                sourceSymbol: oSourceSymbol
                            });
                            this.transformSymbol(oSourceSymbol)
                        }
                        break
                    }
                } else {
                    switch (sSymbolClass) {
                    case this.constants.DATA_STORE_SYMBOL:
                        oTarget = this.transformDataStore(oSourceSymbol);
                        break;
                    case this.constants.DATA_INPUT_SYMBOL:
                    case this.constants.DATA_OUTPUT_SYMBOL:
                        this.transformSymbol(oSourceSymbol);
                        break;
                    case this.constants.TASK_SYMBOL:
                        oTarget = this.transformTask(oSourceSymbol);
                        break;
                    case this.constants.ANNOTATION_SYMBOL:
                        this.transformAnnotation(oSourceSymbol);
                        break;
                    case this.constants.BOUNDARY_EVENT_SYMBOL:
                        if (this.validateSymbol(oSourceSymbol)) {
                            oOldContainer = this.context.targetObjectContainer;
                            this.context.popTargetObjectContainer();
                            oTarget = this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                                sourceSymbol: oSourceSymbol
                            });
                            this.transformSymbol(oSourceSymbol);
                            this.context.pushTargetObjectContainer(oOldContainer)
                        }
                        break;
                    case this.constants.SCRAP_SYMBOL:
                    case this.constants.HOLD_SYMBOL:
                    case this.constants.DONE_SYMBOL:
                        oTarget = this.transformTask(oSourceSymbol);
                        break;
                    default:
                        if (this.validateSymbol(oSourceSymbol)) {
                            oTarget = this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                                sourceSymbol: oSourceSymbol
                            });
                            this.transformSymbol(oSourceSymbol)
                        }
                        break
                    }
                    if (oTarget) {
                        this.context.pushTargetObjectContainer(oTarget);
                        for (i = 0; i < oSourceSymbol.symbols.length; i++) {
                            oSubSymbol = oSourceSymbol.symbols.get(i);
                            this.transformFlowElement(oSubSymbol)
                        }
                        this.context.popTargetObjectContainer()
                    }
                }
            },
            transformObject: function(oSourceObject, sTargetId, sMappingId, oAdditionalInfo) {
                if (oSourceObject && oSourceObject.classDefinition) {
                    var sClass = oSourceObject.classDefinition.qualifiedName,
                    vTypeMapping = this.typeMapping[sClass],
                    sType,
                    sName,
                    sProperty,
                    sPropertyValue,
                    oPropertyMapping,
                    oTarget;
                    if (vTypeMapping) {
                        if (typeof vTypeMapping === "string") {
                            sType = vTypeMapping
                        } else {
                            if (vTypeMapping instanceof Object) {
                                for (sName in vTypeMapping) {
                                    sPropertyValue = this.getSourceFeature(oSourceObject, sName) || "";
                                    if (vTypeMapping[sName]) {
                                        sType = vTypeMapping[sName][sPropertyValue]
                                    }
                                }
                            }
                        }
                        if (sType) {
                            if (this.validateObject(oSourceObject)) {
                                oTarget = this.createTargetObject(this.context.targetObjectContainer, sType, sTargetId);
                                oPropertyMapping = this.propertyMapping[sClass];
                                if (oTarget) {
                                    if (sTargetId) {
                                        this.context.mapObjects(this.getSourceId(oSourceObject), sTargetId, sMappingId)
                                    }
                                    if (oPropertyMapping) {
                                        if (oPropertyMapping.typedMapping) {
                                            sProperty = oPropertyMapping.typeProperty;
                                            if (sProperty) {
                                                sPropertyValue = this.getSourceFeature(oSourceObject, sProperty) || "";
                                                this.setMappedTargetProperties(oTarget, oSourceObject, sMappingId, oPropertyMapping.typedMapping[sPropertyValue], oAdditionalInfo)
                                            }
                                        } else {
                                            this.setMappedTargetProperties(oTarget, oSourceObject, sMappingId, oPropertyMapping, oAdditionalInfo)
                                        }
                                    }
                                    return oTarget
                                }
                            }
                        }
                    }
                    if (!sType) {
                        console.log(sClass + " is not mapped.")
                    }
                }
            },
            transformTask: function(oSourceSymbol) {
                var oTarget;
                if (this.validateSymbol(oSourceSymbol)) {
                    oTarget = this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                        sourceSymbol: oSourceSymbol
                    });
                    this.transformSymbol(oSourceSymbol)
                }
                return oTarget
            },
            transformAnnotation: function(oSourceSymbol) {
                var oTarget;
                if (this.validateSymbol(oSourceSymbol)) {
                    oTarget = this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                        sourceSymbol: oSourceSymbol
                    });
                    this.transformSymbol(oSourceSymbol)
                }
                return oTarget
            },
            transformAssociation: function(oSourceSymbol) {
                var oTarget;
                if (this.validateSymbol(oSourceSymbol)) {
                    oTarget = this.transformObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), this.getSourceId(oSourceSymbol), {
                        sourceSymbol: oSourceSymbol
                    });
                    this.transformSymbol(oSourceSymbol)
                }
                return oTarget
            },
            transformSequenceFlow: function(oSourceLinkSymbol) {
                var oTargetObject, sTargetId, oFlowSource, oFlowSourceSymbol, oFlowTarget, oFlowTargetSymbol;
                if (this.validateSymbol(oSourceLinkSymbol) && this.validateObject(oSourceLinkSymbol.object)) {
                    sTargetId = this.getSourceId(oSourceLinkSymbol);
                    oTargetObject = this.transformObject(oSourceLinkSymbol.object, sTargetId, sTargetId, {
                        sourceSymbol: oSourceLinkSymbol
                    });
                    if (oTargetObject) {
                        oFlowSource = this.getSourceFeature(oSourceLinkSymbol.object, this.constants.LINK_OBJECT_SOURCE);
                        oFlowSourceSymbol = this.getSourceFeature(oSourceLinkSymbol, this.constants.SOURCE_SYMBOL_PROPERTY);
                        this.delayedAddTargetReference(oFlowSource, this.getSourceId(oFlowSourceSymbol), "bpmn2.outgoing", sTargetId);
                        oFlowTarget = this.getSourceFeature(oSourceLinkSymbol.object, this.constants.LINK_OBJECT_TARGET);
                        oFlowTargetSymbol = this.getSourceFeature(oSourceLinkSymbol, this.constants.TARGET_SYMBOL_PROPERTY);
                        this.delayedAddTargetReference(oFlowTarget, this.getSourceId(oFlowTargetSymbol), "bpmn2.incoming", sTargetId)
                    }
                    this.transformSymbol(oSourceLinkSymbol);
                    return oTargetObject
                }
            },
            transformDataAssociation: function(oSourceLinkSymbol) {
                var i, sId, sSymbolId, oSourceSymbol, oTargetSymbol, aSourceItems, oTargetItem;
                if (this.validateSymbol(oSourceLinkSymbol) && this.validateObject(oSourceLinkSymbol.object)) {
                    sId = this.getSourceId(oSourceLinkSymbol.object);
                    sSymbolId = this.getSourceId(oSourceLinkSymbol);
                    oSourceSymbol = this.getSourceFeature(oSourceLinkSymbol, this.constants.SOURCE_SYMBOL_PROPERTY);
                    oTargetSymbol = this.getSourceFeature(oSourceLinkSymbol, this.constants.TARGET_SYMBOL_PROPERTY);
                    if (oSourceSymbol && oTargetSymbol) {
                        if (this.constants.FLOW_NODE_SYMBOLS.indexOf(oSourceSymbol.classDefinition.qualifiedName) >= 0) {
                            aSourceItems = this.getSourceFeature(oSourceLinkSymbol.object, this.constants.SOURCE_ITEMS_REFERENCE);
                            this.delayedCreateTargetObject(oSourceSymbol.object, this.getSourceId(oSourceSymbol), "bpmn2.dataOutputAssociation", sId, sSymbolId, sSymbolId);
                            if (aSourceItems) {
                                for (i = 0; i < aSourceItems.length; i++) {
                                    this.delayedAddTargetReference(oSourceLinkSymbol.object, sSymbolId, "bpmn2.sourceRef", aSourceItems.get(i), this.getSourceId(oSourceSymbol))
                                }
                            }
                            this.delayedAddTargetReference(oSourceLinkSymbol.object, this.getSourceId(oSourceLinkSymbol), "bpmn2.targetRef", oTargetSymbol.object, this.getSourceId(oTargetSymbol))
                        } else {
                            if (this.constants.FLOW_NODE_SYMBOLS.indexOf(oTargetSymbol.classDefinition.qualifiedName) >= 0) {
                                oTargetItem = this.getSourceFeature(oSourceLinkSymbol.object, this.constants.TARGET_ITEM_REFERENCE);
                                this.delayedCreateTargetObject(oTargetSymbol.object, this.getSourceId(oTargetSymbol), "bpmn2.dataInputAssociation", sId, sSymbolId, sSymbolId);
                                this.delayedAddTargetReference(oSourceLinkSymbol.object, this.getSourceId(oSourceLinkSymbol), "bpmn2.sourceRef", oSourceSymbol.object, this.getSourceId(oSourceSymbol));
                                if (oTargetItem) {
                                    this.delayedAddTargetReference(oSourceLinkSymbol.object, this.getSourceId(oSourceLinkSymbol), "bpmn2.targetRef", oTargetItem, this.getSourceId(oTargetSymbol))
                                }
                            }
                        }
                    }
                    this.transformSymbol(oSourceLinkSymbol)
                }
            },
            transformMessageFlow: function(oSourceLinkSymbol) {
                var oTargetObject, sId, sTargetMessageId;
                if (this.validateSymbol(oSourceLinkSymbol) && this.validateObject(oSourceLinkSymbol.object)) {
                    sId = this.getSourceId(oSourceLinkSymbol);
                    oTargetObject = this.transformObject(oSourceLinkSymbol.object, sId, sId, {
                        sourceSymbol: oSourceLinkSymbol
                    });
                    if (oTargetObject) {
                        sTargetMessageId = this.getOrTransformMessage(oSourceLinkSymbol.object, this.constants.MESSAGE_PROPERTY);
                        if (sTargetMessageId) {
                            this.setTargetProperty(oTargetObject, "messageRef", sTargetMessageId)
                        }
                    }
                }
            },
            getOrTransformMessage: function(oSourceContainer, sMessageReference) {
                var oSourceMessage, sSourceMessageId, sTargetMessageId, oTargetMessage;
                if (oSourceContainer && sMessageReference) {
                    oSourceMessage = this.getSourceFeature(oSourceContainer, sMessageReference);
                    if (oSourceMessage) {
                        sSourceMessageId = this.getSourceId(oSourceMessage);
                        sTargetMessageId = this.context.getMappedId(sSourceMessageId);
                        if (!sTargetMessageId) {
                            sTargetMessageId = uuid.v4();
                            this.context.pushTargetObjectContainer(this.context.rootTargetObjectContainer);
                            oTargetMessage = this.transformObject(oSourceMessage, sTargetMessageId);
                            if (!oTargetMessage) {
                                sTargetMessageId = undefined
                            }
                            this.context.popTargetObjectContainer()
                        }
                        return sTargetMessageId
                    }
                }
            },
            transformIoSpecification: function(oTarget, aDataInputs, aDataOutputs) {
                var i, sId, sTargetId, oDataInput, oDataOutput, oTargetInput, oTargetOutput, oTargetInputSet, oTargetOutputSet, oInputMapping, oOutputMapping;
                if (aDataInputs !== undefined) {
                    oTargetInputSet = this.createTargetObject(oTarget, "bpmn2.inputSet");
                    if (aDataInputs.length > 0) {
                        oInputMapping = this.propertyMapping[this.constants.DATA_INPUT_OBJECT];
                        if (oTargetInputSet) {
                            for (i = 0; i < aDataInputs.length; i++) {
                                oDataInput = aDataInputs[i];
                                sId = this.getSourceId(oDataInput.sourceObject);
                                sTargetId = oDataInput.targetId || uuid.v4();
                                oTargetInput = this.createTargetObject(oTarget, "bpmn2.dataInput", sTargetId);
                                if (oTargetInput) {
                                    this.context.mapObjects(sId, sTargetId, oDataInput.mappingId);
                                    if (oInputMapping) {
                                        this.setMappedTargetProperties(oTargetInput, oDataInput.sourceObject, oDataInput.mappingId, oInputMapping)
                                    }
                                    this.addTargetReference(oTargetInputSet, "bpmn2.dataInputRefs", sTargetId)
                                }
                            }
                        }
                    }
                }
                if (aDataOutputs !== undefined) {
                    oTargetOutputSet = this.createTargetObject(oTarget, "bpmn2.outputSet");
                    if (aDataOutputs.length > 0) {
                        oOutputMapping = this.propertyMapping[this.constants.DATA_OUTPUT_OBJECT];
                        if (oTargetOutputSet) {
                            for (i = 0; i < aDataOutputs.length; i++) {
                                oDataOutput = aDataOutputs[i];
                                sId = this.getSourceId(oDataOutput.sourceObject);
                                sTargetId = oDataOutput.targetId || uuid.v4();
                                oTargetOutput = this.createTargetObject(oTarget, "bpmn2.dataOutput", sTargetId);
                                if (oTargetOutput) {
                                    this.context.mapObjects(sId, sTargetId, oDataOutput.mappingId);
                                    if (oOutputMapping) {
                                        this.setMappedTargetProperties(oTargetOutput, oDataOutput.sourceObject, oDataOutput.mappingId, oOutputMapping)
                                    }
                                    this.addTargetReference(oTargetOutputSet, "bpmn2.dataOutputRefs", sTargetId)
                                }
                            }
                        }
                    }
                }
            },
            transformSymbol: function(oSourceSymbol) {
                var oShape, oEdge, oBound, oPoint, aPoints, i, sId = this.getSourceId(oSourceSymbol),
                sTargetId = "symbol-" + sId;
                if (!oSourceSymbol.isLinkSymbol) {
                    oShape = this.createTargetObject(this.context.targetSymbolContainer, "bpmndi.BPMNShape", sTargetId);
                    if (oShape) {
                        this.context.mapObjects(sId, sTargetId);
                        if (oSourceSymbol.object) {
                            this.setTargetProperty(oShape, "bpmnElement", oSourceSymbol.object, sId)
                        }
                        oBound = this.createTargetObject(oShape, "dc.Bounds");
                        this.setTargetProperty(oBound, "x", oSourceSymbol.x);
                        this.setTargetProperty(oBound, "y", oSourceSymbol.y);
                        this.setTargetProperty(oBound, "width", oSourceSymbol.width);
                        this.setTargetProperty(oBound, "height", oSourceSymbol.height);
                        this.createTargetObject(oShape, "bpmndi.BPMNLabel");
                        this.onSetSymbolProperties(oShape, oSourceSymbol);
                        return oShape
                    }
                } else {
                    oEdge = this.createTargetObject(this.context.targetSymbolContainer, "bpmndi.BPMNEdge", sTargetId);
                    if (oEdge) {
                        this.context.mapObjects(sId, sTargetId);
                        if (oSourceSymbol.object) {
                            this.setTargetProperty(oEdge, "bpmnElement", oSourceSymbol.object, sId)
                        }
                        this.setTargetProperty(oEdge, "sourceElement", this.getSourceFeature(oSourceSymbol, this.constants.SOURCE_SYMBOL_PROPERTY));
                        this.setTargetProperty(oEdge, "targetElement", this.getSourceFeature(oSourceSymbol, this.constants.TARGET_SYMBOL_PROPERTY));
                        aPoints = oSourceSymbol.getLinkPoints(false);
                        if (aPoints && aPoints.length >= 2) {
                            for (i = 0; i < aPoints.length; i++) {
                                oPoint = this.createTargetObject(oEdge, "di.waypoint");
                                this.setTargetProperty(oPoint, "x", aPoints[i][0]);
                                this.setTargetProperty(oPoint, "y", aPoints[i][1])
                            }
                        }
                        this.createTargetObject(oEdge, "bpmndi.BPMNLabel");
                        return oEdge
                    }
                }
            },
            onSetSymbolProperties: function(oTargetSymbol, oSourceSymbol) {
                var sGatewayType;
                if (oSourceSymbol) {
                    switch (oSourceSymbol.classDefinition.qualifiedName) {
                    case this.constants.GATEWAY_SYMBOL:
                        if (oSourceSymbol.object) {
                            sGatewayType = this.getSourceFeature(oSourceSymbol.object, this.constants.GATEWAY_TYPE_PROPERTY);
                            if (sGatewayType === "exclusive") {
                                this.setTargetProperty(oTargetSymbol, "isMarkerVisible", "true")
                            }
                        }
                        break;
                    case this.constants.POOL_SYMBOL:
                    case this.constants.LANE_SYMBOL:
                        if (oSourceSymbol.isVertical) {
                            this.setTargetProperty(oTargetSymbol, "isHorizontal", "false")
                        } else {
                            this.setTargetProperty(oTargetSymbol, "isHorizontal", "true")
                        }
                        break;
                    case this.constants.SUBPROCESS_SYMBOL:
                        if (oSourceSymbol.isExpanded) {
                            this.setTargetProperty(oTargetSymbol, "isExpanded", "true")
                        }
                        break
                    }
                }
            },
            validateObject: function(oSourceObject) {
                return true
            },
            validateSymbol: function(oSourceSymbol) {
                if (oSourceSymbol) {
                    if (!oSourceSymbol.object || !oSourceSymbol.object.classDefinition) {
                        console.log("Symbol should be attached to an object.");
                        return false
                    }
                    if (oSourceSymbol.isLinkSymbol) {
                        if (!oSourceSymbol.sourceSymbol || !oSourceSymbol.targetSymbol) {
                            console.log("Link symbol must have source and target extremities.");
                            return false
                        }
                    }
                }
                return true
            },
            getSourceId: function(oSource) {
                return this.reader.getProperty(oSource, this.sourceIdentifier)
            },
            getSourceFeature: function(oSource, sFeature) {
                return this.reader.getFeature(oSource, sFeature)
            },
            getSourceProperty: function(oSource, sProperty) {
                return this.reader.getFeature(oSource, sProperty)
            },
            createTargetObject: function(oTargetContainer, sReference, sId, oProperties) {
                var oTarget = this.writer.createObject(oTargetContainer, sReference, sId),
                sName;
                if (oTarget) {
                    this.context.addTargetObject(sId, oTarget);
                    if (oProperties) {
                        for (sName in oProperties) {
                            this.setTargetProperty(oTarget, sName, oProperties[sName])
                        }
                    }
                }
                return oTarget
            },
            delayedCreateTargetObject: function(oSourceContainer, sContainerMappingId, sReference, sSourceId, sTargetId, sMappingId, oProperties) {
                var oTargetContainer = this.context.getMappedObject(this.getSourceId(oSourceContainer), sContainerMappingId),
                oTarget;
                if (oTargetContainer) {
                    oTarget = this.createTargetObject(oTargetContainer, sReference, sTargetId, oProperties);
                    if (oTarget) {
                        this.context.mapObjects(sSourceId, sTargetId, sMappingId)
                    }
                } else {
                    if (!this.context.inDelayMode) {
                        this.context.addDelayedJob("delayedCreateTargetObject", [oSourceContainer, sContainerMappingId, sReference, sSourceId, sTargetId, sMappingId, oProperties])
                    }
                }
            },
            setMappedTargetProperties: function(oTarget, oSource, sMappingId, oPropertyMap, oAdditionalInfo) {
                var sTargetProperty, sSourceProperty;
                if (oPropertyMap) {
                    for (sTargetProperty in oPropertyMap) {
                        sSourceProperty = oPropertyMap[sTargetProperty];
                        if (sSourceProperty instanceof Function) {
                            sSourceProperty.call(this, oTarget, oSource, sMappingId, oAdditionalInfo)
                        } else {
                            this.setTargetProperty(oTarget, sTargetProperty, this.getSourceFeature(oSource, sSourceProperty))
                        }
                    }
                }
            },
            setTargetProperty: function(oTarget, sProperty, vValue, sValueMappingId) {
                var sTargetId;
                if (vValue instanceof Object) {
                    sTargetId = this.context.getMappedId(this.getSourceId(vValue), sValueMappingId);
                    if (sTargetId) {
                        this.writer.setProperty(oTarget, sProperty, sTargetId)
                    } else {
                        if (!this.context.inDelayMode) {
                            this.context.addDelayedJob("setTargetProperty", [oTarget, sProperty, vValue, sValueMappingId])
                        }
                    }
                } else {
                    this.writer.setProperty(oTarget, sProperty, vValue)
                }
            },
            delayedSetTargetProperty: function(oSource, sMappingId, sProperty, vValue, sValueMappingId) {
                var oTarget = this.context.getMappedObject(this.getSourceId(oSource), sMappingId);
                if (oTarget) {
                    this.setTargetProperty(oTarget, sProperty, vValue, sValueMappingId)
                } else {
                    if (!this.context.inDelayMode) {
                        this.context.addDelayedJob("delayedSetTargetProperty", [oSource, sMappingId, sProperty, vValue, sValueMappingId])
                    }
                }
            },
            addTargetReference: function(oTargetContainer, sReference, vObject, sObjectMappingId) {
                var sTargetId;
                if (vObject instanceof Object) {
                    sTargetId = this.context.getMappedId(this.getSourceId(vObject), sObjectMappingId);
                    if (sTargetId) {
                        this.writer.addReference(oTargetContainer, sReference, sTargetId)
                    } else {
                        if (!this.context.inDelayMode) {
                            this.context.addDelayedJob("addTargetReference", [oTargetContainer, sReference, vObject, sObjectMappingId])
                        }
                    }
                } else {
                    this.writer.addReference(oTargetContainer, sReference, vObject)
                }
            },
            delayedAddTargetReference: function(oSource, sMappingId, sReference, vObject, sObjectMappingId) {
                var oTarget = this.context.getMappedObject(this.getSourceId(oSource), sMappingId);
                if (oTarget) {
                    this.addTargetReference(oTarget, sReference, vObject, sObjectMappingId)
                } else {
                    if (!this.context.inDelayMode) {
                        this.context.addDelayedJob("delayedAddTargetReference", [oSource, sMappingId, sReference, vObject, sObjectMappingId])
                    }
                }
            },
            setDocumentation: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var sComment = oSource[this.constants.COMMENT_PROPERTY],
                oDocument;
                if (sComment) {
                    oDocument = this.createTargetObject(oTarget, "bpmn2.documentation");
                    if (oDocument) {
                        this.setTargetProperty(oDocument, "text", sComment)
                    }
                }
            },
            setTargetNamespace: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                this.setTargetProperty(oTarget, "targetNamespace", this.constants.TARGET_NAMESPACE)
            },
            setParticipantMultiplicity: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var isMultiple = this.getSourceFeature(oSource, this.constants.POOL_ISMULTIPLE_PROPERTY);
                if (isMultiple && isMultiple.toString && isMultiple.toString() === "true") {
                    this.createTargetObject(oTarget, "bpmn2.participantMultiplicity")
                }
            },
            setLoopCharacteristics: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var loopType = this.getSourceFeature(oSource, this.constants.LOOP_TYPE_PROPERTY),
                oLoop;
                switch (loopType) {
                case "loop":
                    this.createTargetObject(oTarget, "bpmn2.standardLoopCharacteristics");
                    break;
                case "parallel":
                    oLoop = this.createTargetObject(oTarget, "bpmn2.multiInstanceLoopCharacteristics");
                    if (oLoop) {
                        this.setTargetProperty(oLoop, "isSequential", "false")
                    }
                    break;
                case "sequence":
                    oLoop = this.createTargetObject(oTarget, "bpmn2.multiInstanceLoopCharacteristics");
                    if (oLoop) {
                        this.setTargetProperty(oLoop, "isSequential", "true")
                    }
                    break
                }
            },
            setEventDefinitions: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, aDefs = this.getSourceFeature(oSource, this.constants.EVENT_DEFINITIONS_REFERENCE);
                if (aDefs && aDefs.length > 0) {
                    this.context.pushTargetObjectContainer(oTarget);
                    for (i = 0; i < aDefs.length; i++) {
                        this.transformObject(aDefs.get(i))
                    }
                    this.context.popTargetObjectContainer()
                }
            },
            setEventGatewayType: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var sType = this.getSourceFeature(oSource, this.constants.GATEWAY_TYPE_PROPERTY);
                switch (sType) {
                case this.constants.GATEWAY_TYPE_VALUE_EVENT_PARALLEL:
                    this.setTargetProperty(oTarget, "instantiate", "true");
                    break;
                case this.constants.GATEWAY_TYPE_VALUE_EVENT_EXCLUSIVE:
                    this.setTargetProperty(oTarget, "instantiate", "true");
                    this.setTargetProperty(oTarget, "eventGatewayType", "Exclusive");
                    break
                }
            },
            setDataState: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var oState, sState = this.getSourceFeature(oSource, this.constants.DATA_STATE_PROPERTY);
                if (sState) {
                    oState = this.createTargetObject(oTarget, "bpmn2.dataState");
                    if (oState) {
                        this.setTargetProperty(oState, "name", sState)
                    }
                }
            },
            setIoSpecificationWithSymbol: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, oSubSymbol, aHandled = [],
                aData,
                aDataInputs = [],
                aDataOutputs = [],
                oData,
                sDataClass,
                oSpec;
                if (oAdditionalInfo && oAdditionalInfo.sourceSymbol) {
                    for (i = 0; i < oAdditionalInfo.sourceSymbol.symbols.length; i++) {
                        oSubSymbol = oAdditionalInfo.sourceSymbol.symbols.get(i);
                        if (oSubSymbol && oSubSymbol.object && oSubSymbol.object.classDefinition) {
                            switch (oSubSymbol.classDefinition.qualifiedName) {
                            case this.constants.DATA_INPUT_SYMBOL:
                                aDataInputs.push({
                                    sourceObject:
                                    oSubSymbol.object,
                                    mappingId: this.getSourceId(oSubSymbol),
                                    targetId: this.getSourceId(oSubSymbol)
                                });
                                aHandled.push(this.getSourceId(oSubSymbol.object));
                                break;
                            case this.constants.DATA_OUTPUT_SYMBOL:
                                aDataOutputs.push({
                                    sourceObject:
                                    oSubSymbol.object,
                                    mappingId: this.getSourceId(oSubSymbol),
                                    targetId: this.getSourceId(oSubSymbol)
                                });
                                aHandled.push(this.getSourceId(oSubSymbol.object));
                                break
                            }
                        }
                    }
                }
                aData = this.getSourceFeature(oSource, this.constants.DATA_REFERENCE);
                if (aData) {
                    for (i = 0; i < aData.length; i++) {
                        oData = aData.get(i);
                        if (oData && oData.classDefinition) {
                            if (aHandled.indexOf(this.getSourceId(oData)) >= 0) {
                                continue
                            }
                            sDataClass = oData.classDefinition.qualifiedName;
                            if (sDataClass === this.constants.DATA_INPUT_OBJECT) {
                                aDataInputs.push({
                                    sourceObject: oData,
                                    mappingId: sSourceMappingId
                                })
                            } else {
                                if (sDataClass === this.constants.DATA_OUTPUT_OBJECT) {
                                    aDataOutputs.push({
                                        sourceObject: oData,
                                        mappingId: sSourceMappingId
                                    })
                                }
                            }
                        }
                    }
                }
                if (aDataInputs.length > 0 || aDataOutputs.length > 0) {
                    oSpec = this.createTargetObject(oTarget, "bpmn2.ioSpecification");
                    if (oSpec) {
                        this.transformIoSpecification(oSpec, aDataInputs, aDataOutputs)
                    }
                }
            },
            setIoSpecification: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, aData, aDataInputs = [],
                aDataOutputs = [],
                oData,
                sDataClass,
                oSpec;
                aData = this.getSourceFeature(oSource, this.constants.DATA_REFERENCE);
                if (aData) {
                    for (i = 0; i < aData.length; i++) {
                        oData = aData.get(i);
                        if (oData && oData.classDefinition) {
                            sDataClass = oData.classDefinition.qualifiedName;
                            if (sDataClass === this.constants.DATA_INPUT_OBJECT) {
                                aDataInputs.push({
                                    sourceObject: oData,
                                    mappingId: sSourceMappingId
                                })
                            } else {
                                if (sDataClass === this.constants.DATA_OUTPUT_OBJECT) {
                                    aDataOutputs.push({
                                        sourceObject: oData,
                                        mappingId: sSourceMappingId
                                    })
                                }
                            }
                        }
                    }
                }
                if (aDataInputs.length > 0 || aDataOutputs.length > 0) {
                    oSpec = this.createTargetObject(oTarget, "bpmn2.ioSpecification");
                    if (oSpec) {
                        this.transformIoSpecification(oSpec, aDataInputs, aDataOutputs)
                    }
                }
            },
            setDataOutputs: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, aData, aDataOutputs, oData, sDataClass;
                aData = this.getSourceFeature(oSource, this.constants.DATA_REFERENCE);
                if (aData) {
                    for (i = 0; i < aData.length; i++) {
                        oData = aData.get(i);
                        if (oData && oData.classDefinition) {
                            sDataClass = oData.classDefinition.qualifiedName;
                            if (sDataClass === this.constants.DATA_OUTPUT_OBJECT) {
                                aDataOutputs = aDataOutputs || [];
                                aDataOutputs.push({
                                    sourceObject: oData,
                                    mappingId: sSourceMappingId
                                })
                            }
                        }
                    }
                }
                this.transformIoSpecification(oTarget, undefined, aDataOutputs)
            },
            setDataInputs: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, aData, aDataInputs, oData, sDataClass;
                aData = this.getSourceFeature(oSource, this.constants.DATA_REFERENCE);
                if (aData) {
                    for (i = 0; i < aData.length; i++) {
                        oData = aData.get(i);
                        if (oData && oData.classDefinition) {
                            sDataClass = oData.classDefinition.qualifiedName;
                            if (sDataClass === this.constants.DATA_INPUT_OBJECT) {
                                aDataInputs = aDataInputs || [];
                                aDataInputs.push({
                                    sourceObject: oData,
                                    mappingId: sSourceMappingId
                                })
                            }
                        }
                    }
                }
                this.transformIoSpecification(oTarget, aDataInputs, undefined)
            },
            setResolution: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                this.setTargetProperty(oTarget, "resolution", "96.0")
            },
            setScript: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var sScript = this.getSourceFeature(oSource, this.constants.SCRIPT_PROPERTY);
                if (sScript) {
                    this.addTargetReference(oTarget, "bpmn2.script", sScript)
                }
            },
            setLinkSource: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var sMappingId, oLinkSource = this.getSourceFeature(oSource, this.constants.LINK_OBJECT_SOURCE),
                oLinkSourceSymbol;
                if (oLinkSource) {
                    if (oAdditionalInfo && oAdditionalInfo.sourceSymbol) {
                        oLinkSourceSymbol = this.getSourceFeature(oAdditionalInfo.sourceSymbol, this.constants.SOURCE_SYMBOL_PROPERTY);
                        if (oLinkSourceSymbol) {
                            sMappingId = this.getSourceId(oLinkSourceSymbol)
                        }
                    }
                    this.setTargetProperty(oTarget, "sourceRef", oLinkSource, sMappingId)
                }
            },
            setLinkTarget: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var sMappingId, oLinkTarget = this.getSourceFeature(oSource, this.constants.LINK_OBJECT_TARGET),
                oLinkTargetSymbol;
                if (oLinkTarget) {
                    if (oAdditionalInfo && oAdditionalInfo.sourceSymbol) {
                        oLinkTargetSymbol = this.getSourceFeature(oAdditionalInfo.sourceSymbol, this.constants.TARGET_SYMBOL_PROPERTY);
                        if (oLinkTargetSymbol) {
                            sMappingId = this.getSourceId(oLinkTargetSymbol)
                        }
                    }
                    this.setTargetProperty(oTarget, "targetRef", oLinkTarget, sMappingId)
                }
            },
            setDefaultFlow: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, aLinkSymbols, oDefault = this.getSourceFeature(oSource, this.constants.DEFAULT_FLOW_PROPERTY),
                oDefaultSymbol,
                sFlowMappingId;
                if (oDefault) {
                    if (oAdditionalInfo && oAdditionalInfo.sourceSymbol) {
                        aLinkSymbols = oAdditionalInfo.sourceSymbol.getLinkSymbols(true, false);
                        for (i = 0; i < aLinkSymbols.length; i++) {
                            if (aLinkSymbols[i].object.objectId === oDefault.objectId) {
                                oDefaultSymbol = aLinkSymbols[i];
                                sFlowMappingId = this.getSourceId(oDefaultSymbol);
                                break
                            }
                        }
                    }
                    this.setTargetProperty(oTarget, "default", oDefault, sFlowMappingId)
                }
            },
            setDataObject: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, j, oSymbol, sMappingId, oParent, oData = this.getSourceFeature(oSource, this.constants.DATA_OBJECT_PROPERTY),
                oRootSwimlane,
                aSwimlanes = [];
                if (oData) {
                    if (oAdditionalInfo && oAdditionalInfo.sourceSymbol) {
                        oParent = oAdditionalInfo.sourceSymbol.container;
                        if (oParent) {
                            if (oParent.isSwimlaneSymbol) {
                                oRootSwimlane = sap.galilei.ui.diagram.SwimlaneSymbol.getRootSwimlaneSymbol(oParent);
                                if (oRootSwimlane) {
                                    oRootSwimlane.getLeafSwimlanes(aSwimlanes);
                                    if (aSwimlanes.length > 0) {
                                        for (i = 0; i < aSwimlanes.length; i++) {
                                            for (j = 0; j < aSwimlanes[i].symbols.length; j++) {
                                                oSymbol = aSwimlanes[i].symbols.get(j);
                                                if (oSymbol && oSymbol.object && oSymbol.object.objectId === oData.objectId) {
                                                    sMappingId = this.getSourceId(oSymbol);
                                                    break
                                                }
                                            }
                                            if (sMappingId) {
                                                break
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (j = 0; j < oParent.symbols.length; j++) {
                                    oSymbol = oParent.symbols.get(j);
                                    if (oSymbol && oSymbol.object && oSymbol.object.objectId === oData.objectId) {
                                        sMappingId = this.getSourceId(oSymbol);
                                        break
                                    }
                                }
                            }
                        }
                    }
                    this.setTargetProperty(oTarget, "dataObjectRef", oData, sMappingId)
                }
            },
            setAttachedTo: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {},
            setAnnotationText: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var sText = this.getSourceFeature(oSource, "text");
                if (sText) {
                    this.addTargetReference(oTarget, "bpmn2.text", sText)
                }
            },
            setProperties: function(oTarget, oSource, sSourceMappingId, oAdditionalInfo) {
                var i, oProperty, aData = this.getSourceFeature(oSource, this.constants.DATA_REFERENCE);
                if (aData && aData.length > 0) {
                    this.context.pushTargetObjectContainer(oTarget);
                    for (i = 0; i < aData.length; i++) {
                        oProperty = aData.get(i);
                        if (oProperty && oProperty.classDefinition && oProperty.classDefinition.qualifiedName === this.constants.PROPERTY_OBJECT) {
                            this.transformObject(oProperty, uuid.v4(), sSourceMappingId, oAdditionalInfo)
                        }
                    }
                    this.context.popTargetObjectContainer()
                }
            }
        }
    })
}());