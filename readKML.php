<?php
	$myfile = fopen("doc.kml", "r") or die("Unable to open file!");
	echo fread($myfile,filesize("doc.kml"));
	fclose($myfile);
?>