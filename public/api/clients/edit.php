<?php
    require_once(__DIR__."/../../../backend/config.php");

    $ClientModel = new Clients();
    $ClientsService = new ClientsService();

    $clientId = $ClientsService->getUrlParamClientId();

    $data = $ClientsService->createOrEditClientRequestValidation($_POST);
    $data = $ClientsService->createOrEditClientRequestCustomValidation($data, $clientId);

    $updated = $ClientModel->update($clientId, $data);
    
    requestResponse($updated);
