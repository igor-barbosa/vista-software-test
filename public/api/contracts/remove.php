<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $contractId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if($contractId === 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o contrato desejado.']
        ], true);
    }

    $ContractsModel = new Contracts();
    
    if(empty($ContractsModel->getById($contractId)) > 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o contrato desejado.']
        ], true);
    }

    $deleted = $ContractsModel->delete($contractId);
    requestResponse($deleted);
