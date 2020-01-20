<?php
    require_once(__DIR__."/../../../backend/config.php");

    $PropertyOwnerModel = new PropertyOwner();
    $PropertyOwnerService = new PropertyOwnerService();

    $data = $PropertyOwnerService->createOrEditPropertyOwnerRequestValidation($_POST);
    $PropertyOwnerService->createOrEditPropertyOwnerRequestValidation($data);
    
    $created = $PropertyOwnerModel->create($data);

    requestResponse($created);
