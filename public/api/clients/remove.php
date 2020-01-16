<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $clientId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if($clientId === 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o cliente desejado.']
        ], true);
    }

    $ClientModel = new Clients();
    $ContractsModel = new Contracts();

    if(empty($ClientModel->getById($clientId))){
        requestResponse([
            'messages' => ['Não foi possível identificar o cliente desejado.']
        ], true);
    } 

    if(count($ContractsModel->getContractsByClientId($clientId)) > 0) {
        requestResponse([
            'messages' => ['Não é possível remover clientes vínculados a um contrato.']
        ], true);
    }

    $deleted = $ClientModel->delete($clientId);
    requestResponse($deleted);
