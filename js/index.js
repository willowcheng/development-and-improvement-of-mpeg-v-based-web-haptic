GLGE.DEBUGCOORD0 = false;
var animIndex;
var typeIndex;
var modelNames = new Array();
var modelProperties = new Array();
var colladaFiles = new Array();
var textureFiles = new Array();
var textureFile = " ";

function modelProp(locx, locy, locz, rotx, roty, rotz, scaleX, scaleY, scaleZ, anim, type, mass, stif, damping, sfriction, dfriction, props) {
  this.locX = locx;
  this.locY = locy;
  this.locZ = locz;
  this.rotX = rotx;
  this.rotY = roty;
  this.rotZ = rotz;
  this.scaleX = scaleX;
  this.scaleY = scaleY;
  this.scaleZ = scaleZ;
  this.anim = anim;
  this.type = type;
  this.mass = mass;
  this.stif = stif;
  this.damping = damping;
  this.sfriction = sfriction;
  this.dfriction = dfriction;
  this.props = props;
}


$(function() {

  //$( "#accordion" ).accordion();
  $("#physicselectable").selectable();
  $("#locxSlider").slider({
    min: -20,
    max: 20,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#plocX").val(ui.value);
      set();
    }
  });
  $("#plocX").val($("#locxSlider").slider("value"));
  $("#locySlider").slider({
    min: -20,
    max: 20,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#plocY").val(ui.value);
      set();
    }
  });
  $("#plocY").val($("#locySlider").slider("value"));
  $("#loczSlider").slider({
    min: 0,
    max: 20,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#plocZ").val(ui.value);
      set();
    }
  });
  $("#plocZ").val($("#loczSlider").slider("value"));
  $("#rotxSlider").slider({
    min: -314,
    max: 314,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#protX").val(ui.value / 100);
      set();
    }
  });
  $("#protX").val($("#rotxSlider").slider("value") / 100);
  $("#rotySlider").slider({
    min: -314,
    max: 314,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#protY").val(ui.value / 100);
      set();
    }
  });
  $("#protY").val($("#rotySlider").slider("value") / 100);
  $("#rotzSlider").slider({
    min: -314,
    max: 314,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#protZ").val(ui.value / 100);
      set();
    }
  });
  $("#protZ").val($("#rotzSlider").slider("value") / 100);
  $("#scaleXSlider").slider({
    min: 0,
    max: 100,
    value: 10,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pscaleX").val(ui.value / 10);
      set();
    }
  });
  $("#pscaleX").val($("#scaleXSlider").slider("value") / 10);
  $("#scaleYSlider").slider({
    min: 0,
    max: 100,
    value: 10,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pscaleY").val(ui.value / 10);
      set();
    }
  });
  $("#pscaleY").val($("#scaleYSlider").slider("value") / 10);
  $("#scaleZSlider").slider({
    min: 0,
    max: 100,
    value: 10,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pscaleZ").val(ui.value / 10);
      set();
    }
  });
  $("#pscaleZ").val($("#scaleZSlider").slider("value") / 10);
  $("#stiffnessSlider").slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pstiffness").val(ui.value / 100);
      set();
    }
  });
  $("#pstiffness").val($("#stiffnessSlider").slider("value") / 100);
  $("#dampingSlider").slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pdamping").val(ui.value / 100);
      set();
    }
  });
  $("#pdamping").val($("#dampingSlider").slider("value") / 100);
  $("#sfrictionSlider").slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#psfrictions").val(ui.value / 100);
      set();
    }
  });
  $("#psfrictions").val($("#sfrictionSlider").slider("value") / 100);
  $("#dfrictionSlider").slider({
    min: 0,
    max: 100,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pdfrictions").val(ui.value / 100);
      set();
    }
  });
  $("#pdfrictions").val($("#dfrictionSlider").slider("value") / 100);
    // TODO
    //$("input[type=submit],input[type=file],  a, button").button();
  $("input[type=submit],input[type=file], button").button();
  $("#animselectable").selectable({
    stop: function() {
      //var result = $( "#select-result" ).empty();
      $(".ui-selected", this).each(function() {
        animIndex = $("#animselectable li").index(this);
        set();
      });
    }
  });
  $("#physicselectable").selectable({
    stop: function() {
      $(".ui-selected", this).each(function() {
        typeIndex = $("#physicselectable li").index(this);
        //console.log(typeIndex);
        switch (typeIndex) {
          case 0:
            $("#planeEditor").show();
            $("#meshEditor").hide();
            $("#sphereEditor").hide();
            $("#boxEditor").hide();
            break;
          case 1:
            $("#planeEditor").hide();
            $("#meshEditor").show();
            $("#sphereEditor").hide();
            $("#boxEditor").hide();
            break;
          case 2:
            $("#planeEditor").hide();
            $("#meshEditor").hide();
            $("#sphereEditor").show();
            $("#boxEditor").hide();
            break;
          case 3:
            $("#planeEditor").hide();
            $("#meshEditor").hide();
            $("#sphereEditor").hide();
            $("#boxEditor").show();
            break;
        }
      });
    }
  });
  //$(".ui-slider").css({"width": "1.2em", "height": "1.2em" ,"top": "-0.3em" });
  //$(".ui-widget-content").css({"margin":"-15px"});
  $("#distanceSlider").slider({
    min: 0,
    max: 10,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pDistance").val(ui.value);
      set();
    }
  });
  $("#pDistance").val($("#distanceSlider").slider("value"));
  $("#normalSlider").slider({
    min: 0,
    max: 10,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pNormal").val(ui.value);
      set();
    }
  });
  $("#pNormal").val($("#normalSlider").slider("value"));
  $("#radiusSlider").slider({
    min: 0,
    max: 10,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pRadius").val(ui.value);
      set();
    }
  });
  $("#pRadius").val($("#radiusSlider").slider("value"));
  $("#widthSlider").slider({
    min: 0,
    max: 10,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pWidth").val(ui.value);
      set();
    }
  });
  $("#pWidth").val($("#widthSlider").slider("value"));
  $("#depthSlider").slider({
    min: 0,
    max: 10,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pDepth").val(ui.value);
      set();
    }
  });
  $("#pDepth").val($("#depthSlider").slider("value"));
  $("#heightSlider").slider({
    min: 0,
    max: 10,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pHeight").val(ui.value);
      set();
    }
  });
  $("#pHeight").val($("#heightSlider").slider("value"));

  $("#massSlider").slider({
    min: 0,
    max: 20,
    value: 0,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pMass").val(ui.value);
      set();
    }
  });
  $("#pMass").val($("#massSlider").slider("value"));

  $("#sphereEditor").hide();
  $("#planeEditor").hide();
  $("#meshEditor").hide();
  $("#boxEditor").hide();
});



var lookAt = function(origin, point) {
  var coord = [origin[0] - point[0], origin[1] - point[1], origin[2] - point[2]];
  var zvec = GLGE.toUnitVec3(coord);
  var xvec = GLGE.toUnitVec3(GLGE.crossVec3([0, 1, 0], zvec));
  var yvec = GLGE.toUnitVec3(GLGE.crossVec3(zvec, xvec));
  return [xvec[0], yvec[0], zvec[0], 0,
    xvec[1], yvec[1], zvec[1], 0,
    xvec[2], yvec[2], zvec[2], 0,
    0, 0, 0, 1
  ];
}


var canvas = document.getElementById("canvas");


var aModel = new Array();
var bModel = new Array();
var modelCount = 0;
var doc = new GLGE.Document();
var text = document.getElementById("dragText");
var selectNumber = 0;
var selectedObject;

var dFormdata = false;
var xFormdata = false;
var iFormdata = false;
var inputXml = document.getElementById("xml");
var imageFile;
var colladaFile;

var modelList = document.getElementById("model-list");
var fileList = document.getElementById("fileList");
var imgList = document.getElementById("image-list");
var xmlRes = document.getElementById("xmlResponse");

var drag = false;
var view = false;
var rotY = 0;
var startpoint;
var cameraPos = [10, 5, 20];
var mousePos = [0, 0];
var mousestate = 0;
var mousechange = false;
canvas.onmousedown = function(e) {
  mousechange = true;
  mousestate = 1;
  if (e.button == 0) {
    view = true;
    startpoint = [e.clientX, e.clientY, cameraPos[0], cameraPos[1]];
  }
  e.preventDefault();
}
canvas.onmouseup = function(e) {
  mousechange = true;
  mousestate = 0;
  view = false;
}
canvas.onmousemove = function(e) {
  mousechange = true;
  mousePos = [e.clientX, e.clientY];
  if (view) {
    cameraPos[0] = startpoint[2] - (e.clientX - startpoint[0]) / canvas.width * 20;
    cameraPos[1] = startpoint[3] + (e.clientY - startpoint[1]) / canvas.height * 20;

    camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
    cameraOffset.setRotY(cameraPos[0] / 10);
    cameraOffset.setLocY(cameraPos[1]);
    render = true;
  }
}

// Use '<' and '>' to control the view distance of scene
document.addEventListener('keydown', function(event) {
  if(event.keyCode == 188) {
    var wheelData = 0.2;
    cameraPos[2] += wheelData;
    if (cameraPos[2] < 1 && cameraPos[2] > -1) cameraPos[2] = cameraPos[2] / Math.abs(cameraPos[2]);
    camera.setLocZ(cameraPos[2]);
    camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
    render = true;
  }
  else if(event.keyCode == 190) {
    var wheelData = -0.2;
    cameraPos[2] += wheelData;
    if (cameraPos[2] < 1 && cameraPos[2] > -1) cameraPos[2] = cameraPos[2] / Math.abs(cameraPos[2]);
    camera.setLocZ(cameraPos[2]);
    camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
    render = true;
  }
});

// canvas.onmousewheel = function(e) {
//   var wheelData = e.detail ? e.detail / 10 : e.wheelDelta / -300;
//   cameraPos[2] += wheelData;
//   if (cameraPos[2] < 1 && cameraPos[2] > -1) cameraPos[2] = cameraPos[2] / Math.abs(cameraPos[2]);
//   camera.setLocZ(cameraPos[2]);
//   camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
//   render = true;
// }
// canvas.addEventListener('DOMMouseScroll', canvas.onmousewheel, false);


canvas.oncontextmenu = function(e) {
  return false;
}
var renderer = new GLGE.Renderer(canvas);

var doc = new GLGE.Document();
var camera;
var cameraOffset;
var scene;
var animationVector = new Array();
var animations = new Array();
animations = ['bob', 'disappear'];

doc.onLoad = function() {
    animationVector = [0, doc.getElement("flow"),doc.getElement("circle"),doc.getElement("bob"),doc.getElement("spin"), doc.getElement("disappear")];
  scene = doc.getElement("mainscene");
  camera = doc.getElement("mainCamera");
  cameraOffset = doc.getElement("cameraOffset");
  var highlight = doc.getElement("highlight");


  camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
  cameraOffset.setRotY(cameraPos[0] / 10);
  cameraOffset.setLocY(cameraPos[1]);

  //draw grid
  var positions = [];
  for (var x = -50; x < 50; x++) {
    if (x != 0) {
      positions.push(x);
      positions.push(0);
      positions.push(-50);
      positions.push(x);
      positions.push(0);
      positions.push(50);
      positions.push(50);
      positions.push(0);
      positions.push(x);
      positions.push(-50);
      positions.push(0);
      positions.push(x);
    }
  }

  var line = (new GLGE.Object).setDrawType(GLGE.DRAW_LINES);
  line.setMesh((new GLGE.Mesh).setPositions(positions));
  line.setMaterial(doc.getElement("lines"));
  scene.addObject(line);

  var lastPick = null;
  var selectstart = null;
  //pick obj in the scene
  var picking = function() {
    if (!mousechange) return;
    var rect = canvas.getBoundingClientRect();
    x = mousePos[0] - rect.left;
    y = mousePos[1] - rect.top;
    var result = scene.pick(x, y);
    if (result && result.object.id) {

      if (!result.object.mat) result.object.mat = result.object.getMaterial();
      if (lastPick != result.object) {
        if (lastPick) lastPick.setMaterial(lastPick.mat);
        lastPick = result.object;
        canvas.style.cursor = "pointer";
        result.object.setMaterial(highlight);
      }
    } else {
      if (lastPick) lastPick.setMaterial(lastPick.mat);
      lastPick = null;
      canvas.style.cursor = "default";
    }
    if (mousestate == 1) selectstart = lastPick;
    if (lastPick && mousestate == 0 && selectstart == lastPick) {
      for (i = 0; i < bModel.length; i++) {
        if (bModel[i] == lastPick.getId()) {
          selectNumber = i;
          selectObject(aModel[i]);
        }
      }
    }
    mousechange = false;
  }


  renderer.setScene(scene);
  renderer.render();
  var lasttime;
  var render = function() {
    var now = +new Date;
    picking();
    renderer.render();

    lasttime = now;
    requestAnimationFrame(render);
    //	console.log(aModel[0].getLocX());
  };
  requestAnimationFrame(render);
}

doc.parseScript("glge_document");
var cusrsor = doc.getElement("cusrsor");
var selectObject = function(obj) {
  if (obj == selectedObject) return;
  selectedObject = obj;
  //selectNumber = obj.getId();
  cusrsor.blendTo({
    LocX: obj.getLocX(),
    LocZ: obj.getLocZ()
  }, 1000);
}

function set() {
  //var model = aModel[selectNumber];
  var model = selectedObject;
  var locX = document.getElementById("plocX").value;
  var locY = document.getElementById("plocY").value;
  var locZ = document.getElementById("plocZ").value;
  var scaleX = document.getElementById("pscaleX").value;
  var scaleY = document.getElementById("pscaleY").value;
  var scaleZ = document.getElementById("pscaleZ").value;
  var rotX = document.getElementById("protX").value;
  var rotY = document.getElementById("protY").value;
  var rotZ = document.getElementById("protZ").value;
  var animation = animIndex;
  var stiffness = document.getElementById("pstiffness").value;
  var damping = document.getElementById("pdamping").value;
  var sfrictions = document.getElementById("psfrictions").value;
  var dfrictions = document.getElementById("pdfrictions").value;
  var mass = document.getElementById("pMass").value;
  model.setLocY(locY);
  model.setLocX(locX);
  model.setLocZ(locZ);
  model.setScaleX(scaleX);
  model.setScaleY(scaleY);
  model.setScaleZ(scaleZ);
  model.setRotX(rotX);
  model.setRotY(rotY);
  model.setRotZ(rotZ);
  var anim = 'none';
  if (animIndex > 0) {
    model.setAnimation(animationVector[animIndex], 10000, 0);
    anim = animations[animIndex - 1];
  }
  cusrsor.blendTo({
    LocX: model.getLocX(),
    LocZ: model.getLocZ()
  }, 1000);
  var physicsArray = new Array();
  switch (typeIndex) {
    case 0:
      physicsArray.push(document.getElementById("pDistance").value);
      physicsArray.push(document.getElementById("pNormal").value);
      break;
    case 1:
      break;
    case 2:
      physicsArray.push(document.getElementById("pRadius").value);
      break;
    case 3:
      physicsArray.push(document.getElementById("pHeight").value);
      physicsArray.push(document.getElementById("pDepth").value);
      physicsArray.push(document.getElementById("pWidth").value);
      break;
  }
  var prop = new modelProp(locX, locY, locZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, anim, typeIndex, mass, stiffness, damping, sfrictions, dfrictions, physicsArray);
  modelProperties[selectNumber] = prop;
}


function addModel() {
  var model = new GLGE.Collada();
  doc.getElement("mainscene").addCollada(model);
  var locX = document.getElementById("plocX").value;
  var locY = document.getElementById("plocY").value;
  var locZ = document.getElementById("plocZ").value;
  //var scale = document.getElementById("pscale").value;
  model.setLocY(locY);
  model.setLocX(locX);
  model.setLocZ(locZ);
  //model.setScale(scale);
  model.setId(modelCount);
  model.setDocument(colladaFile);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", colladaFile, false);
  xmlhttp.send(null);
  var colladaText = xmlhttp.responseText;
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(colladaText, "text/xml");
  x = xmlDoc.getElementsByTagName('geometry');
  for (i = 0; i < x.length; i++) {
    bModel[modelCount] = x[i].getAttribute('id');
  }

  aModel[modelCount] = model;
  colladaFiles[modelCount] = colladaFile;
  if (textureFiles[modelCount - 1] != textureFile) {
    textureFiles[modelCount] = textureFile;
  } else {
    textureFiles[modelCount] = " ";
  }
  selectNumber = modelCount;
  modelCount++;
  model.addEventListener("loaded", function(data) {
    selectObject(this);
  });
  set();
  addAnother();
}


function addAnother() {
  modelList.innerHTML = "";
  imgList.innerHTML = "";
  fileList.innerHTML = "";
  colladaFile = "";
  xmlRes.innerHTML = "";
  text.innerHTML = "";
}

//function reset() {
//  document.location.reload(true);
//}


function exportHaml() {
  var properties = '{"models":[';
  for (i = 0; i < aModel.length; i++) {
    var model = aModel[i];
    var locX = modelProperties[i].locX;
    var locY = modelProperties[i].locY;
    var locZ = modelProperties[i].locZ;
    var scaleX = modelProperties[i].scaleX;
    var scaleY = modelProperties[i].scaleY;
    var scaleZ = modelProperties[i].scaleZ;
    var rotX = modelProperties[i].rotX;
    var rotY = modelProperties[i].rotY;
    var rotZ = modelProperties[i].rotZ;
    var animation = modelProperties[i].anim;
    var type = modelProperties[i].type;
    var mass = modelProperties[i].mass;
    var stiffness = modelProperties[i].stif;
    var damping = modelProperties[i].damping;
    var sfrictions = modelProperties[i].sfriction;
    var dfrictions = modelProperties[i].dfriction;
    var pArray = modelProperties[i].props;
    var name = modelNames[i];

    switch (type) {
      case 0:
        if (i == aModel.length - 1) properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + ',"distance":' + pArray[0] + ',"normal":' + pArray[1] + '} ';
        else properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + ',"distance":' + pArray[0] + ',"normal":' + pArray[1] + '} ,';
        break;
      case 1:
        if (i == aModel.length - 1) properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + '} ';
        else properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + '} ,';
        break;
      case 2:
        if (i == aModel.length - 1) properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + ',"radius":' + pArray[0] + '} ';
        else properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + ',"radius":' + pArray[0] + '} ,';
        break;
      case 3:
        if (i == aModel.length - 1) properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + ',"width":' + pArray[2] + ',"depth":' + pArray[1] + ',"height":' + pArray[0] + '} ';
        else properties += '{ "loc_x":' + locX + ', "loc_y":' + locY + ',"loc_z":' + locZ + ',"rot_x":' + rotX + ',"rot_y":' + rotY + ',"rot_z":' + rotZ + ', "scaleX":' + scaleX + ', "scaleY":' + scaleY + ', "scaleZ":' + scaleZ + ',"animation":"' + animation + '","texture":"' + textureFiles[i] + '", "documentation":"' + colladaFiles[i] + '","name":"' + name + '","mass":' + mass + ',"stiffness":' + stiffness + ',"damping":' + damping + ',"sfrictions":' + sfrictions + ',"dfrictions":' + dfrictions + ',"type":' + type + ',"width":' + pArray[2] + ',"depth":' + pArray[1] + ',"height":' + pArray[0] + '} ,';
        break;
    }
  }
  properties += ']}';
  console.log(properties);
  $.ajax({
    url: "exportXml-physics.php" + "?q=" + properties,
    type: "GET",
    data: properties,
    contentType: "application/json; charset=utf-8",
    success: function(res) {
      document.getElementById("hamlResponse").innerHTML = "<a href='" + res + "'> Download </a>";
    },
    error: function(xmlhttpResponse, error) {
      alert(error);
    }
  });
  //console.log("exportXml.php"+"?q="+properties);

}




function addDNDListeners() {
  var container = document.getElementById("container");
  // add dragenter listener
  container.addEventListener("dragenter", function(event) {
    fileList.innerHTML = '';
    event.stopPropagation();
    event.preventDefault();
  }, false);
  // drag over event
  container.addEventListener("dragover", function(event) {
    event.stopPropagation();
    event.preventDefault();
  }, false);
  // drop event
  container.addEventListener("drop", handleDrop, false);
}
window.addEventListener("load", addDNDListeners, false);

function handleDrop(event) {
  // get drop file list
  var files = event.dataTransfer.files;
  event.stopPropagation();
  event.preventDefault();
  // show upload progress and img
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (window.FormData) {
      dFormdata = new FormData();
    }
    if (!!file.type.match(/image.*/)) {
      if (window.FileReader) {
        var img = document.createElement("image"),
          name = document.createElement("span");
        name.innerHTML = file.name;
        textureFile = file.name;
        img.width = 32;
        img.height = 32;
        reader = new FileReader();
        reader.onload = (function(aImg) {
          return function(e) {
            aImg.src = e.target.result;
          };
        })(img);
        fileList.appendChild(img);
        fileList.appendChild(name);
        reader.readAsDataURL(file);
      }
      if (dFormdata) {
        dFormdata.append("images[]", file);
      }
    }
    if (dFormdata) {
      $.ajax({
        url: "upload.php",
        type: "POST",
        data: dFormdata,
        processData: false,
        contentType: false,
        success: function(res) {
          text.innerHTML = res;
        }
      });
    }
  }
}

xFormdata = new FormData();
document.getElementById("btnXml").style.display = "none";
inputXml.addEventListener("change", function(event) {
  var i = 0,
    len = this.files.length,
    xml, reader, file;
  for (; i < len; i++) {
    file = this.files[i];
    if (window.FileReader) {
      reader = new FileReader();
      reader.onloadend = function(e) {
        var xImage = document.createElement("image"),
          li = document.createElement("li"),
          name = document.createElement("span");
        name.innerHTML = file.name;
        modelNames[modelCount] = file.name;
        colladaFile = "uploads/" + file.name;
        xImage.src = "xmlPic.png";
        xImage.width = 32;
        xImage.height = 32;
        li.appendChild(xImage);
        li.appendChild(name);
        modelList.appendChild(li);
      };
      reader.readAsDataURL(file);
    }
    if (xFormdata) {
      xFormdata.append("xml[]", file);
    }
  }

  if (xFormdata) {
    $.ajax({
      url: "upload_file.php",
      type: "POST",
      data: xFormdata,
      processData: false,
      contentType: false,
      success: function(res) {
        document.getElementById("xmlResponse").innerHTML = res;
      }
    });
  }
}, false);



(function() {
  var input = document.getElementById("images"),
    iFormdata = false;

  function showUploadedItem(source) {}

  if (window.FormData) {
    iFormdata = new FormData();
    document.getElementById("btn").style.display = "none";
  }

  input.addEventListener("change", function(evt) {
    document.getElementById("response").innerHTML = "UPLOADING"
    var i = 0,
      len = this.files.length,
      img, xml, reader, file;


    for (; i < len; i++) {
      file = this.files[i];
      if (!!file.type.match(/image.*/)) {
        if (window.FileReader) {
          img = document.createElement("img")
          fname = document.createElement("span");
          fname.innerHTML = file.name;
          textureFile = file.name;
          img.width = 32;
          img.height = 32;
          reader = new FileReader();
          reader.onload = (function(aImg) {
            return function(e) {
              aImg.src = e.target.result;
            };
          })(img);
          imgList.appendChild(img);
          imgList.appendChild(fname);
          reader.readAsDataURL(file);
        }
        if (iFormdata) {
          iFormdata.append("images[]", file);
        }
      }
    }

    if (iFormdata) {
      $.ajax({
        url: "upload.php",
        type: "POST",
        data: iFormdata,
        processData: false,
        contentType: false,
        success: function(res) {
          document.getElementById("response").innerHTML = res;
        }
      });
    }
  }, false);
}());
