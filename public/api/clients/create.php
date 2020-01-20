<?php
    require_once(__DIR__."/../../../backend/config.php");

    $ClientModel = new Clients();
    $ClientsService = new ClientsService();

    $data = $ClientsService->createOrEditClientRequestValidation($_POST);
    $data = $ClientsService->createOrEditClientRequestCustomValidation($data);

    $created = $ClientModel->create($data);
    
    requestResponse($created);
