<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $ContractsModel = new Contracts();
    $ContractsService = new ContractsService();

    $contractId = $ContractsService->getUrlParamContractId();        
    $ContractsService->removeContractRequestCustomValidation($contractId);

    $deleted = $ContractsModel->delete($contractId);
    requestResponse($deleted);
