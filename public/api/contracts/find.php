<?php

require_once(__DIR__."/../../../backend/config.php");

$ContractsModel = new Contracts();
$ContractsService = new ContractsService();

$contractId = $ContractsService->getUrlParamContractId();

$contract = $ContractsModel->getContractById($contractId);

if(empty($contract)){
    requestResponse(['messages' => ['Não foi possível encontrar o contrato desejado.']], true);
}

requestResponse($contract);
