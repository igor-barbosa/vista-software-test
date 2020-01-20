<?php
    require_once(__DIR__."/../../../backend/config.php");

    $PropertyOwner = new PropertyOwner();
    $PropertyOwnerService = new PropertyOwnerService();

    $propertyOwnerId = $PropertyOwnerService->getUrlParamPropertyOwnerId();

    $data = $PropertyOwnerService->createOrEditPropertyOwnerRequestValidation($_POST);
    $PropertyOwnerService->createOrEditPropertyOwnerRequestCustomValidation($data, $propertyOwnerId);

    $updated = $PropertyOwner->update($propertyOwnerId, $data);
    
    requestResponse($updated);
