<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $ClientModel = new Clients();
    $clientId = $ClientsService->getUrlParamClientId();
    $ClientsService->removeClientRequestCustomValidation($clientId);
    $deleted = $ClientModel->delete($clientId);
    requestResponse($deleted);
