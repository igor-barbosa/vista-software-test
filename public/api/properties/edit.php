<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertiesModel = new Properties();
    $PropertiesService = new PropertiesService();

    $propertyId = $PropertiesService->getUrlParamPropertyId();

    $data = $PropertiesService->createOrEditRequestPropertiesValidation($_POST);
    $PropertiesService->createOrEditRequestPropertiesCustomValidation($data);
    
    $updated = $PropertiesModel->updateProperty($propertyId, $data);
    
    requestResponse($updated);
