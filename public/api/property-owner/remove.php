<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertyOwnerModel = new PropertyOwner();
    $PropertyOwnerService = new PropertyOwnerService();

    $propertyOwnerId = $PropertyOwnerService->getUrlParamPropertyOwnerId();    
    $PropertyOwnerService->removePropertyOwnerRequestValidation($propertyOwnerId);

    $deleted = $PropertyOwnerModel->delete($propertyOwnerId);
    requestResponse($deleted);
