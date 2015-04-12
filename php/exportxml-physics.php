<?php

$models = array();
$q = $_GET["q"];
$obj = json_decode($q);
$arr = $obj->{'models'};
for($i=0;$i< sizeof($arr);$i++){
  array_push($models,array(
    'document' => $arr[$i]->{'documentation'},
    'loc_x' => $arr[$i]->{'loc_x'},
    'loc_y' => $arr[$i]->{'loc_y'},
    'loc_z' => $arr[$i]->{'loc_z'},
    'rot_x' => $arr[$i]->{'rot_x'},
    'rot_y' => $arr[$i]->{'rot_y'},
    'rot_z' => $arr[$i]->{'rot_z'},
    'scaleX' => $arr[$i]->{'scaleX'},
    'scaleY' => $arr[$i]->{'scaleY'},
    'scaleZ' => $arr[$i]->{'scaleZ'},
    'name' => $arr[$i]->{'name'},
    'animation' => $arr[$i]->{'animation'},
  	'stiffness' => $arr[$i]->{'stiffness'},
  	'damping' => $arr[$i]->{'damping'},
  	'sfrictions' => $arr[$i]->{'sfrictions'},
  	'dfrictions' => $arr[$i]->{'dfrictions'},
  	'texture' => $arr[$i]->{'texture'},
  	'type' => $arr[$i]->{'type'},
  	'mass' => $arr[$i]->{'mass'},
  	"radius" => 0,
  	"distance" => 0,
  	"normal" => 0,
  	"width" => 0,
  	"depth" => 0,
  	"height" => 0
  ));
  switch ($arr[$i]->{'type'}) {
    case 0:
      $models[$i]['mass'] = $arr[$i]->{'mass'};
      $models[$i]['distance'] = $arr[$i]->{'distance'};
      $models[$i]['normal'] = $arr[$i]->{'normal'};
      break;
    case 1:
      $models[$i]['mass'] = $arr[$i]->{'mass'};
      break;
    case 2:
      $models[$i]['radius'] = $arr[$i]->{'radius'};
      $models[$i]['mass'] = $arr[$i]->{'mass'};
      break;
    case 3:
      $models[$i]['width'] = $arr[$i]->{'width'};
      $models[$i]['depth'] = $arr[$i]->{'depth'};
      $models[$i]['height'] = $arr[$i]->{'height'};
      $models[$i]['mass'] = $arr[$i]->{'mass'};
      break;
  }
  //var_dump($models);
}
$doc = new DOMDocument();
$doc->load("xml/scenePhysics.xml");
$doc->formatOutput = true;
$scene = $doc->getElementsByTagName("scene");
$colgroup = $doc->getElementsByTagname('group');
$vwo = $doc->getElementsByTagNa
e("VirtualObjectList");
$type = $doc->getElementsByTagName("sceneType");
foreach($type as $one){
  $one->appendChild(
    $doc->createTextNode("physics")
  );
}
$i = 1;
foreach($models as $model) {
  $physics;
  switch($model['type']) {
    case 0:
      $physics = $doc->createElement("physics_plane");
      $physics->setAttribute("distance",$model['distance']);
      $physics->setAttribute("normal",$model['normal']);
      $physics->setAttribute("mass",$model['mass']);
      $physics->setAttribute("id","physics".rand());
      break;
    case 1:
      $physics = $doc->createElement("physics_mesh");
      $physics->setAttribute("id","physics".rand());
      $physics->setAttribute("mass",$model['mass']);
      break;
    case 2:
      $physics = $doc->createElement("physics_sphere");
      $physics->setAttribute("radius",$model['radius']);
      $physics->setAttribute("mass",$model['mass']);
      $physics->setAttribute("id","physics".rand());
      break;
    case 3:
      $physics = $doc->createElement("physics_box");
      $physics->setAttribute("depth",$model['depth']);
      $physics->setAttribute("width",$model['width']);
      $physics->setAttribute("height",$model['height']);
      $physics->setAttribute("mass",$model['mass']);
      $physics->setAttribute("id","physics".rand());
      break;
  }
 // foreach($scene as $s){
  $collada = $doc->createElement("collada");
  $collada->setAttribute("document",$model['document']);
  $physics->setAttribute("loc_x",$model['loc_x']);
  $physics->setAttribute("loc_y",$model['loc_y']);
  $physics->setAttribute("loc_z",$model['loc_z']);
  $physics->setAttribute("rot_x",$model['rot_x']);
  $physics->setAttribute("rot_y",$model['rot_y']);
  $physics->setAttribute("rot_z",$model['rot_z']);
  $physics->setAttribute("mass",$model['mass']);
  $physics->setAttribute("friction",$model['dfrictions']);
  $collada->setAttribute("scaleX",$model['scaleX']);
  $collada->setAttribute("scaleY",$model['scaleY']);
  $collada->setAttribute("scaleZ",$model['scaleZ']);
  if($model['animation']!='none')
    $collada->setAttribute("animation","#{$model['animation']}");
 // $s->appendChild($collada);
    $colgroup->item(2)->appendChild($physics);
    $physics->appendChild($collada);
 // }
  foreach($vwo as $h) {
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
	$mtr->setAttribute("mass",$model['mass']);
	$object->appendChild($mtr);
  $h->appendChild($object);
  }
}
$filename = "MPEG-V".rand().".xml";
echo $filename;
$doc->save($filename);

?>
