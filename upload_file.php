<?php

foreach ($_FILES["xml"]["error"] as $key => $error) {

 /*   if (file_exists("upload/" . $_FILES["xml"]["name"]))
      {
      echo $_FILES["xml"]["name"] . " already exists. ";
      }
	  	*/

    if ($error == UPLOAD_ERR_OK) {
        $tmp_name = $_FILES["xml"]["tmp_name"][$key];
        $name = $_FILES["xml"]["name"][$key];
        move_uploaded_file($tmp_name, "uploads/$name");
    }
    else {
        echo "Invalid file";
    }
}

echo "<h4>Successfully Uploaded 3D model files</h4>";

?>
