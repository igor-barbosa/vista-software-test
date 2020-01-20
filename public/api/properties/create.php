<?php
    require_once(__DIR__."/../../../backend/config.php");

    $Properties = new Properties();
    $PropertiesService = new PropertiesService();

    $data = $PropertiesService->createOrEditRequestPropertiesValidation($_POST);
    $PropertiesService->createOrEditRequestPropertiesCustomValidation($data);
     
    $created = $Properties->createProperty($data);

    requestResponse($created);
