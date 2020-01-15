<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertiesModel = new Properties();

    requestResponse(['data' => $PropertiesModel->all()]);
