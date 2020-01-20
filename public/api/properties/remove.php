<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertiesModel = new Properties();
    $PropertiesService = new PropertiesService();
    
    $propertyId = $PropertiesService->getUrlParamPropertyId();

    $deleted = $PropertiesModel->delete($propertyId);
    requestResponse($deleted);
