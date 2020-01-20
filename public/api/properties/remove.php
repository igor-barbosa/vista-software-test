<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertiesModel = new Properties();
    $PropertiesService = new PropertiesService();
    
    $propertyId = $PropertiesService->getUrlParamPropertyId();
    $PropertiesService->removePropertyRequestCustomValidation($propertyId);
    
    $deleted = $PropertiesModel->delete($propertyId);
    requestResponse($deleted);
