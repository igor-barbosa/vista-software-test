<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $ClientModel = new Clients();
    $ClientsService = new ClientsService();

    $clientId = $ClientsService->getUrlParamClientId();
    $ClientsService->removeClientRequestCustomValidation($clientId);
    
    $deleted = $ClientModel->delete($clientId);
    requestResponse($deleted);
