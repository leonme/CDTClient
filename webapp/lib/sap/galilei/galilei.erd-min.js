namespace("sap.modeling.erd");namespace("sap.modeling.erd.ui");
(function(){var oResource,oReader,oModelDef={contents:{"Sap.Modeling.Erd.Model":{classDefinition:"sap.galilei.model.Package",displayName:"ER Model",namespaceName:"sap.modeling.erd",classifiers:{Entity:{displayName:"Entity",parent:"sap.galilei.common.NamedObject",properties:{},references:{"Entity.attributes":{name:"attributes",contentType:"sap.modeling.erd.Attribute",isMany:true,isContainment:true,isOrdered:true}}},Attribute:{displayName:"Attribute",parent:"sap.galilei.common.NamedObject",properties:{"Attribute.dataType":{name:"dataType",dataType:sap.galilei.model.dataTypes.gString,defaultValue:"string"},"Attribute.length":{name:"length",dataType:sap.galilei.model.dataTypes.gULong},"Attribute.precision":{name:"precision",dataType:sap.galilei.model.dataTypes.gUInteger},"Attribute.isIdentifier":{name:"isIdentifier",dataType:sap.galilei.model.dataTypes.gBool,defaultValue:false}}},Association:{displayName:"Association",parent:"sap.galilei.common.LinkObject",properties:{"Association.cardinality":{name:"cardinality",dataType:sap.galilei.model.dataTypes.gString,defaultValue:"0,*"}},references:{"Association.sourceAttribute":{name:"sourceAttribute",contentType:"sap.modeling.erd.Attribute",isMany:false,isContainment:false},"Association.targetAttribute":{name:"targetAttribute",contentType:"sap.modeling.erd.Attribute",isMany:false,isContainment:false}}},Model:{displayName:"Model",parent:"sap.galilei.common.Model",references:{"Model.entities":{name:"entities",contentType:"sap.modeling.erd.Entity",isMany:true,isContainment:true},"Model.associations":{name:"associations",contentType:"sap.modeling.erd.Association",isMany:true,isContainment:true}}}}}}};oResource=new sap.galilei.model.Resource();oReader=new sap.galilei.model.JSONReader();oReader.load(oResource,oModelDef)}());
(function(){var oResource,oReader,oDiagramDef={contents:{"Sap.Modeling.Erd.Diagram":{classDefinition:"sap.galilei.model.Package",displayName:"ER Diagram",namespaceName:"sap.modeling.erd.ui",classifiers:{Diagram:{displayName:"Diagram",parent:"sap.galilei.ui.diagram.Diagram"},EntitySymbol:{displayName:"Entity Symbol",parent:"sap.galilei.ui.diagram.TableSymbol",properties:{"EntitySymbol.minWidth":{name:"minWidth",defaultValue:100},"EntitySymbol.minHeight":{name:"minHeight",defaultValue:60},"EntitySymbol.stroke":{name:"stroke",defaultValue:"#B3B3B3"},"EntitySymbol.strokeWidth":{name:"strokeWidth",defaultValue:1},"EntitySymbol.fill":{name:"fill",defaultValue:"#C6E5DE"},"EntitySymbol.font":{name:"font",defaultValue:"12px Arial,sans-serif"},"EntitySymbol.textColor":{name:"textColor",defaultValue:"#333333"}},statics:{objectClass:{value:"sap.modeling.erd.Entity"},layoutTemplate:{mainShape:[{shape:"RoundedRectangle",r:3,domClass:"entity",stroke:"{stroke}",strokeWidth:"{strokeWidth}",fill:"#FFFFFF",padding:0,width:100,height:60,minWidth:60,minHeight:40,isWordWrap:true,isEllipsis:true},{shape:"Panel",shapes:[{shape:"RoundedSameSideRectangle",r:3,dockPosition:"width",height:20,stroke:"{stroke}",strokeWidth:"{strokeWidth}",fill:"{fill}"}]}],contentShape:{shape:"Stack",horizontalAlignment:"width",verticalAlignment:"top",innerAlignment:"center",padding:0,innerPadding:0,contentPosition:2,shapes:[{shape:"Stack",orientation:"horizontal",padding:2,innerPadding:2,shapes:[{shape:"Image",href:"images/Entity16.png",width:16,height:16},{shape:"Text",domClass:"entityName",text:"{object/displayName}",font:"{font}",fill:"{textColor}",horizontalAlignment:"width",verticalAlignment:"height",isWordWrap:true,isEllipsis:true}]}]},items:{path:"object/attributes",template:[{columnHeader:"Icon",shape:"Image",href:"images/Entity16.png",width:12,height:12},{columnHeader:"Name",shape:"Text",domClass:"attributeName",text:"{object/displayName}",font:"{font}",fill:"{textColor}",horizontalAlignment:"left",verticalAlignment:"middle",isWordWrap:true},{columnHeader:"Data Type",shape:"Text",domClass:"attributeName",marginLeft:8,text:"{object/dataType}",font:"{font}",fill:"{textColor}",horizontalAlignment:"left",verticalAlignment:"middle",isWordWrap:true}],rowSymbolClass:"sap.modeling.erd.ui.AttributeSymbol",paddingLeft:0,paddingRight:0,paddingTop:0,paddingBottom:0,marginLeft:4,marginRight:4,marginTop:4,marginBottom:4,columnPadding:4,rowPadding:2}}}},AttributeSymbol:{displayName:"Attribute Symbol",parent:"sap.galilei.ui.diagram.RowSymbol",properties:{"AttributeSymbol.isKeepPosition":{name:"isKeepPosition",displayName:"Keep Position",defaultValue:false},"AttributeSymbol.font":{name:"font",defaultValue:"10px Arial,sans-serif"},"AttributeSymbol.textColor":{name:"textColor",defaultValue:"#333333"}}},AssociationSymbol:{displayName:"Association Symbol",parent:"sap.galilei.ui.diagram.LinkSymbol",properties:{"AssociationSymbol.sourceArrowType":{name:"sourceArrowType",dataType:sap.galilei.model.dataTypes.gString},"AssociationSymbol.stroke":{name:"stroke",defaultValue:"#B3B3B3"},"AssociationSymbol.strokeWidth":{name:"strokeWidth",defaultValue:1},"AssociationSymbol.font":{name:"font",defaultValue:"10px Arial,sans-serif"},"AssociationSymbol.textColor":{name:"textColor",defaultValue:"#333333"}},statics:{objectClass:{value:"sap.modeling.erd.Association"},layoutTemplate:{stroke:"{stroke}",strokeWidth:"{strokeWidth}",sourceArrow:"{sourceArrowType:sourceArrowMarker}",lineStyle:"{lineStyle}",targetArrow:"Arrows.FilledEnd",sourceContent:{shape:"Text",text:"{object/cardinality}",font:"{font}",fill:"{textColor}",horizontalAlignment:"middle",verticalAlignment:"middle",isEllipsis:false,isVisible:true}},formatters:{sourceArrowMarker:{"default":"Arrows.SlashStart",condition:"Arrows.DiamondStart"}}}}}}}};oResource=new sap.galilei.model.Resource();oReader=new sap.galilei.model.JSONReader();oReader.load(oResource,oDiagramDef)}());
(function(){sap.modeling.erd.ui.DiagramEditorExtension=sap.galilei.ui.editor.defineDiagramEditorExtension({fullClassName:"sap.modeling.erd.ui.DiagramEditorExtension",properties:{ENTITY_SYMBOL:"sap.modeling.erd.ui.EntitySymbol",ATTRIBUTE_SYMBOL:"sap.modeling.erd.ui.AttributeSymbol",ASSOCIATION_SYMBOL:"sap.modeling.erd.ui.AssociationSymbol",ENTITY_OBJECT:"sap.modeling.erd.Entity",ATTRIBUTE_OBJECT:"sap.modeling.erd.Attribute",ASSOCIATION_OBJECT:"sap.modeling.erd.Association",ATTRIBUTES_REFERENCE:"attributes",ENTITY_OBJECT_PARAM:undefined,ATTRIBUTE_OBJECT_PARAM:undefined,ASSOCIATION_OBJECT_PARAM:undefined,ADD_ATTRIBUTE_COMMAND:"sap.modeling.erd.command.AddAttribute",ADD_ATTRIBUTE_ABOVE_COMMAND:"sap.modeling.erd.command.AddAttributeAbove",ADD_ATTRIBUTE_BELOW_COMMAND:"sap.modeling.erd.command.AddAttributeBelow",MOVE_ATTRIBUTE_UP_COMMAND:"sap.modeling.erd.command.MoveAttributeUp",MOVE_ATTRIBUTE_DOWN_COMMAND:"sap.modeling.erd.command.MoveAttributeDown"},methods:{onInitialize:function(){this.addLinearGradient("entityFill","#99BAE1","#D0E0F1")},addLinearGradient:function(sGradientId,sStartColor,sStopColor){var oGradient=new sap.galilei.ui.common.style.LinearGradient({id:sGradientId,stops:[{offset:"5%",color:sStartColor},{offset:"85%",color:sStopColor}]});oGradient.createGradient(this.viewer)},canInsertSymbolOnLinkSymbol:function(sSymbolClass,oCreateParam){return false},canPreserveLinkAfterDelete:function(oSymbol){return false},selectLinkSymbolDefinition:function(oSourceSymbol,oTargetSymbol){var oTool=sap.galilei.ui.editor.tool.getTool(this.ASSOCIATION_SYMBOL);if(oTool&&oTool.selectLinkSymbolDefinition){return oTool.selectLinkSymbolDefinition(oSourceSymbol,oTargetSymbol)}return{linkSymbolClass:this.ASSOCIATION_SYMBOL}},getContextButtonPad:function(oSymbol){var aButtons=[];if(oSymbol){switch(oSymbol.classDefinition.qualifiedName){case this.ENTITY_SYMBOL:aButtons.push({toolName:this.ENTITY_SYMBOL});aButtons.push({commandName:this.ADD_ATTRIBUTE_COMMAND});aButtons.push({toolName:this.ASSOCIATION_SYMBOL});break;case this.ATTRIBUTE_SYMBOL:aButtons.push({commandName:this.ADD_ATTRIBUTE_ABOVE_COMMAND});aButtons.push({commandName:this.ADD_ATTRIBUTE_BELOW_COMMAND});aButtons.push({commandName:this.MOVE_ATTRIBUTE_UP_COMMAND});aButtons.push({commandName:this.MOVE_ATTRIBUTE_DOWN_COMMAND});break}}this.addImagesFolder(aButtons);return aButtons},getToolsDefinition:function(){var self=this,oToolsDef;oToolsDef=[{name:this.ENTITY_SYMBOL,type:sap.galilei.ui.editor.tool.Types.createNodeSymbolTool,tooltip:"Create Entity",symbolClass:this.ENTITY_SYMBOL,objectParam:this.ENTITY_OBJECT_PARAM,smallIcon:"Entity16.png"},{name:this.ASSOCIATION_SYMBOL,type:sap.galilei.ui.editor.tool.Types.createLinkSymbolTool,tooltip:"Create Association",smallIcon:"Association16.png",cursor:"AssociationCursor.png",linksDefinition:[{sourceSymbol:this.ENTITY_SYMBOL,targetSymbol:this.ENTITY_SYMBOL,linkSymbolClass:this.ASSOCIATION_SYMBOL,linkObjectParam:this.ASSOCIATION_OBJECT_PARAM}]}];this.addImagesFolder(oToolsDef);return oToolsDef},getCommandsDefinition:function(){var self=this,oCommandsDef;oCommandsDef=[{name:this.ADD_ATTRIBUTE_COMMAND,className:"sap.galilei.ui.editor.command.InsertRow",tooltip:"Add an Attribute",tableClassName:this.ENTITY_OBJECT,rowClassName:this.ATTRIBUTE_OBJECT,rowsReferenceName:this.ATTRIBUTES_REFERENCE,index:-1,smallIcon:"AddRow16.png"},{name:this.ADD_ATTRIBUTE_ABOVE_COMMAND,className:"sap.galilei.ui.editor.command.InsertRow",tooltip:"Add an Attribute Above",tableClassName:this.ENTITY_OBJECT,rowClassName:this.ATTRIBUTE_OBJECT,rowsReferenceName:this.ATTRIBUTES_REFERENCE,smallIcon:"InsertRow16.png"},{name:this.ADD_ATTRIBUTE_BELOW_COMMAND,className:"sap.galilei.ui.editor.command.InsertRow",tooltip:"Add an Attribute Below",tableClassName:this.ENTITY_OBJECT,rowClassName:this.ATTRIBUTE_OBJECT,rowsReferenceName:this.ATTRIBUTES_REFERENCE,isBelow:true,smallIcon:"AddRow16.png"},{name:this.MOVE_ATTRIBUTE_UP_COMMAND,className:"sap.galilei.ui.editor.command.MoveRow",tooltip:"Move Attribute Up",rowClassName:this.ATTRIBUTE_OBJECT,rowsReferenceName:this.ATTRIBUTES_REFERENCE,direction:"up",smallIcon:"MoveRowUp16.png"},{name:this.MOVE_ATTRIBUTE_DOWN_COMMAND,className:"sap.galilei.ui.editor.command.MoveRow",tooltip:"Move Attribute Down",rowClassName:this.ATTRIBUTE_OBJECT,rowsReferenceName:this.ATTRIBUTES_REFERENCE,direction:"down",smallIcon:"MoveRowDown16.png"}];this.addImagesFolder(oCommandsDef);return oCommandsDef}}})}());
sap.galilei.ui.common.shape.Row=sap.galilei.ui.common.shape.defineShape({fullClassName:"sap.galilei.ui.common.shape.Row",shapeName:"Row",shapeCategory:"Standard",properties:{isComposite:{type:sap.galilei.core.EnumPropertyType.bitwiseEnum,field:sap.galilei.core.internal.FIELDNAME_PREFIX+"states",mask:sap.galilei.ui.common.shape.ShapeStates.COMPOSITE,value:sap.galilei.ui.common.shape.ShapeStates.COMPOSITE,writable:false,configurable:false},isDraw:false},methods:{draw:function(oViewer,d3ParentNode,oTransitionDef,insertBeforeSelector){var oShape,index;for(index=0;index<this.shapes.length;++index){oShape=this.shapes[index];oShape.draw(oViewer,d3ParentNode,oTransitionDef)}this.isDrawn=true}}});sap.galilei.ui.common.shape.Table=sap.galilei.ui.common.shape.defineShape({fullClassName:"sap.galilei.ui.common.shape.Table",shapeName:"Table",shapeCategory:"Standard",properties:{isComposite:{type:sap.galilei.core.EnumPropertyType.bitwiseEnum,field:sap.galilei.core.internal.FIELDNAME_PREFIX+"states",mask:sap.galilei.ui.common.shape.ShapeStates.COMPOSITE,value:sap.galilei.ui.common.shape.ShapeStates.COMPOSITE,writable:false,configurable:false},title:undefined,showTitle:false,isCollapsible:false,isCollapsed:false,showHeader:false,showSeparator:false,items:undefined,columns:undefined,maximumRow:undefined,isDrawn:false},methods:{computeCellSize:function(oObject,oColumn){var nWidth=0,nHeight=0,nFontHeight;if(oObject&&oColumn){if(oColumn.width!==undefined){nWidth=oColumn.width}else{if(oColumn.shape==="Text"){nWidth=100}}if(oColumn.height!==undefined){nHeight=oColumn.height}else{if(oColumn.shape==="Text"){nFontHeight=sap.galilei.ui.common.Font.getFontHeight(oColumn.font);if(nFontHeight!==0){nHeight=nFontHeight}}}}return{width:nWidth,height:nHeight}},computeRowSize:function(oObject){var nWidth=0,nHeight=14,index,oColumns,oColumn,xMargin=2,oCellSize;if(oObject&&this.columns){oColumns=this.columns;for(index=0;index<oColumns.length;index++){oColumn=oColumns[index];oCellSize=this.computeCellSize(oObject,oColumn);nWidth+=oCellSize.width+index>0?xMargin:0;nHeight=Math.max(nHeight,oCellSize.height)}}return{width:nWidth,height:nHeight}},createRow:function(y,oObject){var oColumns,index,oColumn,oParam,oRowSize,oCellSize,oRow,oShape,xMargin=2,x,yOffset;if(oObject&&this.columns){oColumns=this.columns;oRowSize=this.computeRowSize(oObject);oRow=new sap.galilei.ui.common.shape.Row();x=this.x;for(index=0;index<oColumns.length;index++){oColumn=oColumns[index];oParam={};sap.galilei.core.copyProperties(oParam,oColumn);oCellSize=this.computeCellSize(oObject,oColumn);yOffset=Math.floor((oRowSize.height-oCellSize.height)/2);oParam.x=x;oParam.y=y+yOffset;oParam.width=oCellSize.width;oParam.height=oCellSize.height;if(oParam.text&&oParam.text[0]==="{"){oParam.text=oObject.name}oShape=sap.galilei.ui.common.shape.ShapeRegistry.createShape(oParam.shape,oParam);if(oShape){oRow.shapes.add(oShape);x+=oParam.width+xMargin}}oRow.width=oRowSize.width;oRow.height=oRowSize.height}return oRow},draw:function(oViewer,d3ParentNode,oTransitionDef,insertBeforeSelector){var oRow,oShape,oItems,oValue,index,oObject,yMargin=2,y=this.y+yMargin;if(this.items&&this.columns){oItems=this.getBinding("items");if(oItems){oValue=oItems.getObjectProperty();if(oValue&&oValue.length){for(index=0;index<oValue.length;index++){oObject=oValue.get(index);oRow=this.createRow(y,oObject);if(oRow){this.shapes.add(oRow);y+=oRow.height+yMargin}}}}}for(index=0;index<this.shapes.length;++index){oShape=this.shapes[index];oShape.draw(oViewer,d3ParentNode,oTransitionDef)}this.isDrawn=true;return this.d3Node},updateDrawing:function(oViewer,oTransitionDef,aAttributes){var index,oShape;for(index=0;index<this.shapes.length;++index){oShape=this.shapes[index];oShape.updateDrawing(oViewer,oTransitionDef)}},layout:function(layoutRect,bUpdateShape){var width=100,height=100;this.layoutRect=new sap.galilei.ui.common.Rect(0,0,width,height);return this.layoutRect}}});