<?php
  $models = array();
  $q = $_GET["q"];
$obj = json_decode($q);
 $arr = $obj->{'models'};
foreach($arr as $value){
  $models [] = array(
  'document' => $value->{'documentation'},
  'loc_x' => $value->{'loc_x'},
  'loc_y' => $value->{'loc_y'},
  'loc_z' => $value->{'loc_z'},
  'rot_x' => $value->{'rot_x'},
  'rot_y' => $value->{'rot_y'},
  'rot_z' => $value->{'rot_z'},
  'scaleX' => $value->{'scaleX'},
  'scaleY' => $value->{'scaleY'},
  'scaleZ' => $value->{'scaleZ'},
  'name' => $value->{'name'},
  'animation' => $value->{'animation'},
	'stiffness' => $value->{'stiffness'},
	'damping' => $value->{'damping'},
	'sfrictions' => $value->{'sfrictions'},
	'dfrictions' => $value->{'dfrictions'},
	'texture' => $value->{'texture'},
  );
  }
  $doc = new DOMDocument();
  $doc->load("scene.xml");
  $doc->formatOutput = true;
  $scene = $doc->getElementsByTagName("scene");
  $colgroup = $doc->getElementsByTagname('group');
  $vwo = $doc->getElementsByTagName("VirtualObjectList");
  $type = $doc->getElementsByTagName("sceneType");
  foreach($type as $one){
  $one->appendChild(
  $doc->createTextNode("normal")
  );
  }
  $i = 1;
  foreach($models as $model)
  {
 // foreach($scene as $s){
  $collada = $doc->createElement("collada");
      $collada->setAttribute("document",$model['document']);
  $collada->setAttribute("loc_x",$model['loc_x']);
  $collada->setAttribute("loc_y",$model['loc_y']);
  $collada->setAttribute("loc_z",$model['loc_z']);
  $collada->setAttribute("rot_x",$model['rot_x']);
  $collada->setAttribute("rot_y",$model['rot_y']);
  $collada->setAttribute("rot_z",$model['rot_z']);
  $collada->setAttribute("scaleX",$model['scaleX']);
  $collada->setAttribute("scaleY",$model['scaleY']);
  $collada->setAttribute("scaleZ",$model['scaleZ']);
  if($model['animation']!='none')
  $collada->setAttribute("animation","#{$model['animation']}");
 // $s->appendChild($collada);
  $colgroup->item(1)->appendChild($collada);
 // }
  foreach($vwo as $h){
    $object = $doc->createElement("vwoc:VirtualObject");
	$object->setAttribute("xsi:type","vwoc:VirtualObjectType");
	$object->setAttribute("id","virtualObject00".$i);
	$i++;
	$vwoc = $doc->createElement("vwoc:VWOC");
	$ctrlist = $doc->createElement("vwoc:ControlList");
	$ctr = $doc->createElement("vwoc:Control");
	$ctr->setAttribute("controlID","CTRLID_".rand());
	$mfctr = $doc->createElement("vwoc:MotionFeatureControl");
	$pos = $doc->createElement("vwoc:Position");
	$posX = $doc->createElement("mpegvct:X");
	$posX->appendChild($doc->createTextNode($model['loc_x']));
	$posY = $doc->createElement("mpegvct:Y");
	$posY->appendChild($doc->createTextNode($model['loc_y']));
	$posZ = $doc->createElement("mpegvct:Z");
	$posZ->appendChild($doc->createTextNode($model['loc_z']));
	$scalefactor = $doc->createElement("vwoc:ScaleFactor");
	$scaleX = $doc->createElement("mpegvct:X");
	$scaleX->appendChild($doc->createTextNode($model['scaleX']));
	$scaleY = $doc->createElement("mpegvct:Y");
	$scaleY->appendChild($doc->createTextNode($model['scaleY']));
	$scaleZ = $doc->createElement("mpegvct:Z");
	$scaleZ->appendChild($doc->createTextNode($model['scaleZ']));
	$object->appendChild($vwoc);
	$vwoc->appendChild($ctrlist);
	$ctrlist->appendChild($ctr);
	$ctr->appendChild($mfctr);
	$mfctr->appendChild($pos);
	$pos->appendChild($posX);
	$pos->appendChild($posY);
	$pos->appendChild($posZ);
	$mfctr->appendChild($scalefactor);
	$scalefactor->appendChild($scaleX);
	$scalefactor->appendChild($scaleY);
	$scalefactor->appendChild($scaleZ);
	$appearance = $doc->createElement("vwoc:Appearance");
	$appearance->appendChild($doc->createTextNode($model['document']));
	$object->appendChild($appearance);
	$anim = $doc->createElement("vwoc:Animation");
	$motion = $doc->createElement("vwoc:Motion");
	if($model['animation'] != " "){
	$animname = $doc->createElement("vwoc:Name");
	$animname->appendChild($doc->createTextNode($model['animation']));
	$animuri = $doc->createElement("vwoc:Uri");
	if($model['animation'] == "bob")
	$animuri->appendChild($doc->createTextNode("http://voAnimationdb.com/turn_360.bvh"));
	else
	$animuri->appendChild($doc->createTextNode("http://voAnimationdb.com/turn_360.bvh"));
	$anim->appendChild($motion);
	$object->appendChild($anim);
	$motion->appendChild($animname);
	$motion->appendChild($animuri);
	}
	$haptic = $doc->createElement("vwoc:HapticProperty");
	$haptic->setAttribute("hapticID","MID_".rand());
	$object->appendChild($haptic);
	$mtr = $doc->createElement("vwoc:MaterialProperty");
	$mtr->setAttribute("stiffness",$model['stiffness']);
	$mtr->setAttribute("staticFriction",$model['sfrictions']);
	$mtr->setAttribute("dynamicFriction",$model['dfrictions']);
	$mtr->setAttribute("damping",$model['damping']);
	$mtr->setAttribute("texture",$model['texture']);
	$object->appendChild($mtr);
  $h->appendChild($object);
  }
  }
  $filename = "HAML".rand().".xml";
  echo $filename;
 $doc->save($filename);

  ?>