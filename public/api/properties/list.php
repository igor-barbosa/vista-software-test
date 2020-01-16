<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertiesModel = new Properties();

    requestResponse($PropertiesModel->all());
