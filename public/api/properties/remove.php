<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $propertyId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if($propertyId === 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o imóvel desejado.']
        ], true);
    }

    $ContractsModel = new Contracts();
    $PropertiesModel = new Properties();

    if(empty($PropertiesModel->getById($propertyId)) > 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o imóvel desejado.']
        ], true);
    }

    if(count($ContractsModel->getContractsByPropertyId($propertyId)) > 0) {
        requestResponse([
            'messages' => ['Não é possível remover um imóvel vínculado a um contrato.']
        ], true);
    }

    $deleted = $PropertiesModel->delete($propertyId);
    requestResponse($deleted);
