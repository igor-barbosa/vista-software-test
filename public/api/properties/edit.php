<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertiesModel = new Properties();
    $PropertiesService = new PropertiesService();

    $propertyId = $PropertiesService->getUrlParamPropertyId();

    $data = $PropertiesService->createOrEditRequestPropertiesValidation($_POST);
    $PropertiesService->createOrEditRequestPropertiesValidation($data);
    
    $updated = $PropertiesModel->update($propertyId, $data);
    
    requestResponse($updated);
