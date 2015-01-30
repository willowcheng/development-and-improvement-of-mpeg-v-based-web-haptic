var forceX = 0,
  forceY = 0,
  forceZ = 0;
var stifArray = new Array();
var sfricArray = new Array();
var dfricArray = new Array();
var dampArray = new Array();
var sceneType;
var spring_x = "1*x";
var spring_y = "1*y"
var spring_z = "1*z";
var physicsProxy = new GLGE.PhysicsSphere;
var proxy = new GLGE.Collada();
var onGround = false;
var onPhyCollision = false;
//////////////////////////////////////////////
// Haptics
var hl;
var haptics_is_init = false;
//
var parameters = "x,y,z";
var hd_lastPos = new Array("0", "0", "0");
var hd_pos = new Array("0", "0", "0");

// Device
var on_device = false;

function initHaptics() {
  hl = document.getElementById('pluginobj');
  if (hl.initDevice == undefined) {
    alert("There is no haptic plug in!!");
  } else {
    if (hl.initDevice() == false) {
      alert("There is no haptic device!!");
    } else {
      haptics_is_init = true;
    }
  }
}

window.onload = initHaptics();

window.onunload = function uninitHaptics() {
  if (hl && haptics_is_init)
    hl.releaseDevice();
}

function setHapticScene() {
  if (hl && haptics_is_init) {
    hl.clearEffects();
    hl.addHapticPositionFunctionEffect(spring_x, parameters, spring_y, parameters, spring_z, parameters);
  }
  hl.transferObjects();
}


function unsetHapticScene() {
  if (hl && haptics_is_init) {
    hl.clearEffects();
    hl.transferObjects();
  }
}

function startHaptics() {
    if (hl && haptics_is_init) {
      if (hl.enableDevice() == true) {
        on_device = true;
        setHapticScene();
      } else
        on_device = false;
    }
  }
  ///////// functions for adding haptic effets in the scene


function addStiffness(collada, stiffness) {
  var beneathDis = GLGE.distanceVec3(collada.getPosition, proxyPos);
  if (isCollision) {
    var stiffForce = stiffness * beneathDis;
  }
}

function addsFriction(collada, sFriction) {
  if (isCollision) {
    var sFricForce = sFriction * normalForce;
  }
}

function adddFriction(collada, dFriction) {
  if (isCollision) {
    var stiffForce = normalForce * dFriction;
  }
}

function addDamping(collada, damping) {

}





var keys = new GLGE.KeyInput();
var fileString;
var glge_script;

function loaded(evt) {
  fileString = evt.target.result;
}
$(function() {
  $("#tabs").tabs();
  $("input,button").button();
  $("#HAMLImporter").change(function(event) {
    var file = this.files[0];
    if (window.FileReader) {
      reader = new FileReader();
      reader.onloadend = loaded;
      reader.readAsText(file);

    }
  });
});



// Set for sliders
$(function() {
  // Mass vertical slider
  $("#massSlider").slider({
    min: 0,
    max: 5,
    value: 1,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pMass").val(ui.value);
      var mass = document.getElementById("pMass").value;
      physicsProxy.setMass(mass);
    }
  });
  $("#pMass").val($("#massSlider").slider("value"));

  // Frication vertical slide
  $("#fricSlider").slider({
    min: 0,
    max: 100,
    value: 10,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pFriction").val(ui.value / 100);
      var friction = document.getElementById("pFriction").value;
      physicsProxy.setFriction(friction);
    }
  });
  $("#pFriction").val($("#fricSlider").slider("value") / 100);

  // Radius vertical slide
  $("#radiusSlider").slider({
    min: 0,
    max: 30,
    value: 5,
    range: "min",
    animate: true,
    orientation: "vertical",
    slide: function(event, ui) {
      $("#pRadius").val(ui.value / 10);
      var radius = document.getElementById("pRadius").value;
      physicsProxy.setRadius(radius);
      physicsProxy.setScale(radius);
    }
  });
  $("#pRadius").val($("#radiusSlider").slider("value") / 10);
});

function view() {
  startHaptics();
  if (window.DOMParser) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(fileString.replace(/vwoc:MaterialProperty/g, "MaterialProperty"), "text/xml");
    glge_script = xmlDoc.getElementsByTagName("glge")[0];
    //console.log(xmlDoc.getElementsByTagName("vwoc:VirtualObject")[0].attributes);
    sceneType = xmlDoc.getElementsByTagName("sceneType")[0].childNodes[0];
    var i;
    //console.log(xmlDoc);
    var propertyList = xmlDoc.getElementsByTagName("MaterialProperty");
    for (i = 0; i < propertyList.length; i++) {
      stifArray.push(propertyList[i].attributes[0].nodeValue);
      sfricArray.push(propertyList[i].attributes[1].nodeValue);
      dfricArray.push(propertyList[i].attributes[2].nodeValue);
      dampArray.push(propertyList[i].attributes[3].nodeValue);
    }
    /*  console.log(stifArray);
    console.log(sfricArray);
    console.log(dfricArray);
    console.log(dampArray);
    */
    var text = (new XMLSerializer()).serializeToString(glge_script);
    var code = "<script id='glgedoc' type='text/xml'>";
    code = code + text;
    code = code + "</scr" + "ipt>";
    //console.log(code);
    $("head").append(code);
  }

  var canvas = document.getElementById('canvas');
  var renderer = new GLGE.Renderer(canvas);
  var doc = new GLGE.Document();
  var camera;
  var colladaGroup;
  var cameraOffset;
  var scene;
  var startpoint;
  var mousestate = 0;
  var mousechange = false;
  var drag = false;
  var view = false;
  var rotY = 0;
  var cameraPos = [10, 5, 20];
  //var v = [0,0];
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
  canvas.onmousewheel = function(e) {
    var wheelData = e.detail ? e.detail / 10 : e.wheelDelta / -300;
    cameraPos[2] += wheelData;
    if (cameraPos[2] < 1 && cameraPos[2] > -1) cameraPos[2] = cameraPos[2] / Math.abs(cameraPos[2]);
    camera.setLocZ(cameraPos[2]);
    camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
    render = true;
  }
  canvas.addEventListener('DOMMouseScroll', canvas.onmousewheel, false);


  canvas.oncontextmenu = function(e) {
    return false;
  }


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

  var cameraFollow = function(player) {
    var playerMat = player.getModelMatrix();

    // find the current target and lookat
    cameraTarget = GLGE.mulMat4Vec4(playerMat, [0, -20, 5, 1]);
    lookatTarget = [playerMat[3], playerMat[7], playerMat[11]];

    // ease into the target position and lookat
    cameraPos = GLGE.subVec3(cameraPos, GLGE.scaleVec3(GLGE.subVec3(cameraPos, cameraTarget), 1 / 20));
    lookatPos = GLGE.subVec3(cameraPos, GLGE.scaleVec3(GLGE.subVec3(lookatPos, lookatTarget), 1 / 20));

    //update the position and lookat
    camera.setLocX(cameraPos[0]).setLocY(cameraPos[1]).setLocZ(cameraPos[2]);
    camera.Lookat(lookatPos);
  }


  var doc = new GLGE.Document();
  proxy.setDocument("sphere.dae");
  proxy.setScale(0.5);
  var proxyPos = [proxy.getLocX(), proxy.getLocY(), proxy.getLocZ()];




  function checkCollision(colArray) {
    //	var a = doc.getElement("0");
    //	console.log(GLGE.distanceVec3(proxyPos,[a.getLocX(),a.getLocY(),a.getLocZ()]));
    var i;
    for (i = 0; i <= colArray.length; i++) {
      addStiffness(colArray[i], stifArray[i]);
      addsFriction(colArray[i], sfricArray[i]);
      adddFriction(colArray[i], dfricArray[i]);
      addDamping(colArray[i], dampArray[i]);
    }
  }

  var checkMove = function() {
    if (sceneType == "normal") {
      var playerMat = proxy.getModelMatrix();
      if (on_device == true) {
        hd_pos = hl.getPosition();
        console.log(hd_pos);
        var x = 10 * Number(10 * hd_pos[0]);
        var y = 10 * Number(10 * hd_pos[1]);
        var z = 10 * Number(10 * hd_pos[2]);
        proxy.setLocX(proxy.getLocY() + x);
        proxy.setLocY(proxy.getLocX() + y);
        proxy.setLocZ(proxy.getLocZ() + z);
      }
    } else {
      var playerMat = physicsProxy.getModelMatrix();
      if (keys.isKeyPressed(GLGE.KI_W)) { // move forward along the X axis
        physicsProxy.setVelocityX(-5);
        //console.log(playerMat[0]*5);
        //console.log(playerMat[1]*5);
      }
      if (keys.isKeyPressed(GLGE.KI_S)) { // move backwards along the X axis
        onRun = true;
        physicsProxy.setVelocityX(5);
        //	console.log(playerMat[0]*-5);
        //	console.log(playerMat[1]*-5);
      }
      // apply a torques when turning
      if (keys.isKeyPressed(GLGE.KI_A)) physicsProxy.setVelocityZ(5);
      if (keys.isKeyPressed(GLGE.KI_D)) physicsProxy.setVelocityZ(-5);
      if (keys.isKeyPressed(GLGE.KI_Q)) physicsProxy.setVelocityY(-5);
      if (keys.isKeyPressed(GLGE.KI_E)) physicsProxy.setVelocityY(5);
      if (on_device == true) {
        hd_pos = hl.getPosition();
        var x = 5 * Number(10 * hd_pos[0]);
        var y = 5 * Number(10 * hd_pos[1]);
        var z = 5 * Number(10 * hd_pos[2]);
        //console.log([x,y,z]);
        physicsProxy.setVelocityX(x);
        physicsProxy.setVelocityY(y);
        physicsProxy.setVelocityZ(z);
      }
    }
  }


  function updateHapticScene() {
    var playerMat = physicsProxy.getModelMatrix();
    var veloX = physicsProxy.getVelocityX();
    var veloY = physicsProxy.getVelocityY();
    var veloZ = physicsProxy.getVelocityZ();
    var mass = document.getElementById("pMass").value;
    var friction = document.getElementById("pFriction").value;
    var delta_t = 90;
    var sortedVelo = [veloX * veloX, veloY * veloY, veloZ * veloZ];

    if (onPhyCollision) {
      console.log(physicsProxy.getVelocity());
      switch (sortedVelo.sort(function(a, b) {
        return b - a
      })[0]) {
        case veloX * veloX:
          forceX = 0 - mass * veloX / (delta_t * 0.001) * 30;
          hl.clearEffects();
          hl.addHapticPositionFunctionEffect(forceX + '*x', parameters, '0', parameters, '0', parameters);
          console.log("x:" + forceX);
          hl.transferObjects();
          break;
        case veloY * veloY:
          forceY = 0 - mass * veloY / (delta_t * 0.001) * 30;
          hl.clearEffects();
          hl.addHapticPositionFunctionEffect('0', parameters, forceY + '*y', parameters, '0', parameters);
          console.log("y:" + forceY);
          hl.transferObjects();
          break;
        case veloZ * veloZ:
          forceZ = 0 - mass * veloZ / (delta_t * 0.001) * 30;
          hl.clearEffects();
          hl.addHapticPositionFunctionEffect('0', parameters, '0', parameters, forceZ + '*z', parameters);
          console.log("z:" + forceZ);
          hl.transferObjects();
          break;
      }
    } else if (onGround) {
      var sortedVeloXZ = [veloX * veloX, veloZ * veloZ];
      var v = [0, 0];
      if (friction != 0) {
        switch (sortedVeloXZ.sort()[0]) {
          case veloX * veloX:
            v[0] = 1;
            break;
          case veloZ * veloZ:
            v[1] = 1;
            break;
        }
        if (hl && haptics_is_init) {
          hl.clearEffects();
          // Spring force
          var spring_x = '0';
          var spring_y = '0';
          var spring_z = '0';
          if (v[0] != 0)
          //spring_x = "49*"+friction*v[0];
          //spring_x = "980*"+friction*v[0]+"*x";
            spring_x = friction * v[0] + '*x';
          if (v[1] != 0)
          //spring_z = "49*"+friction*v[1];
          //spring_z = "980*"+friction*v[1]+"*z";
            spring_z = friction * v[1] + '*y';
          //console.log(spring_x);
          //console.log(spring_z);
          hl.addHapticPositionFunctionEffect(spring_x, parameters, spring_y, parameters, spring_z, parameters);
        }
        hl.transferObjects();
      }
    } else
      hl.clearEffects();
  }




  doc.onLoad = function() {
    scene = doc.getElement("mainscene");
    camera = doc.getElement("mainCamera");
    cameraOffset = doc.getElement("cameraOffset");


    var positions = [];
    for (var x = -50; x < 50; x++) {
      if (x != 0) {
        positions.push(x);
        positions.push(-4);
        positions.push(-50);
        positions.push(x);
        positions.push(-4);
        positions.push(50);
        positions.push(50);
        positions.push(-4);
        positions.push(x);
        positions.push(-50);
        positions.push(-4);
        positions.push(x);
      }
    }


    camera.setRotMatrix(lookAt([0, cameraPos[1], 0], [0, 0, -cameraPos[2]]));
    cameraOffset.setRotY(cameraPos[0] / 10);
    cameraOffset.setLocY(cameraPos[1]);


    var line = (new GLGE.Object).setDrawType(GLGE.DRAW_LINES);
    line.setMesh((new GLGE.Mesh).setPositions(positions));
    line.setMaterial(doc.getElement("lines"));
    scene.addObject(line);
    camera = doc.getElement("mainCamera");
    cameraOffset = doc.getElement("cameraOffset");
    colladaGroup = doc.getElement("colladaGroup");
    //physicsGroup = doc.getElement("physicsGroup");
    var colladaArray = colladaGroup.getChildren();
    //console.log(colladaArray);
    //console.log(sceneType);
    if (sceneType == "normal")
      scene.addChild(proxy);
    else {
      var lasttime;
      scene.addChild(physicsProxy);
      physicsProxy.addObject(proxy);
      physicsProxy.setLocX(1);
      physicsProxy.setLocY(10);
      physicsProxy.setLocZ(1);
      physicsProxy.setRadius(0.5);
      physicsProxy.setScale(0.5);
      physicsProxy.setRotationalVelocityDamping([0, 0, 0]);
      physicsProxy.setFriction(0.3);
      scene.setGravity([0, -9.8, 0, 0]);

      var group = doc.getElement("colladaGroup");

      var floor = doc.getElement("floorplane");
      floor.addEventListener("collision", function(e) {
        if (e.obj == physicsProxy) {
          physicsProxy.setVelocityY(0);
          onGround = true;
        }
      });
      //add Physics collision
      for (var i = 0; i < colladaArray.length; i++) {
        colladaArray[i].addEventListener("collision", function(e) {
          if (e.obj == physicsProxy) {
            onPhyCollision = true;
          }
        });
      }
    }
    renderer.setScene(scene);
    var render = function() {
      checkMove();
      if (sceneType != "normal") {
        var now = +new Date;
        if (lasttime) scene.physicsTick((now - lasttime) / 500);
        updateHapticScene();
        lasttime = now;
        onPhyCollision = false;
        onGround = false;
        for (var i = 0; i < group.children.length; i++) {
          if (group.children[i].getLocY() <= -5)
            group.children[i].setLocY(15);
        }
        if (physicsProxy.getLocY() <= -5) {
          physicsProxy.setLocY(-4.5 + 3 * physicsProxy.getRadius());
          //console.log(physicsProxy.getLocY());
        }
        //		cameraFollow(physicsProxy);
      }
      //checkCollision(colladaArray);
      renderer.render();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }


  doc.parseScript("glgedoc");

}
