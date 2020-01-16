<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $propertyOwnerId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if($propertyOwnerId === 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o proprietário desejado.']
        ], true);
    }

    $PropertyOwnerModel = new PropertyOwner();
    $ContractsModel = new Contracts();
    $PropertiesModel = new Properties();

    if(empty($PropertyOwnerModel->getById($propertyOwnerId))){
        requestResponse([
            'messages' => ['Não foi possível identificar o proprietário desejado.']
        ], true);
    } 

    if(count($ContractsModel->getContractsByPropertyOwnerId($propertyOwnerId)) > 0) {
        requestResponse([
            'messages' => ['Não é possível remover um proprietário vínculado a um contrato.']
        ], true);
    }

    if(count($PropertiesModel->getPropertiesByPropertyOwnerId($propertyOwnerId)) > 0) {
        requestResponse([
            'messages' => ['Não é possível remover um proprietário vínculado a um imóvel.']
        ], true);
    }

    $deleted = $PropertyOwnerModel->delete($propertyOwnerId);
    requestResponse($deleted);
