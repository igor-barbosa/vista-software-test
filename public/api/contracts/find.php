<?php

require_once(__DIR__."/../../../backend/config.php");


$contractId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

$ContractsModel = new Contracts();

$contract = $ContractsModel->getContractById($contractId);

if(empty($contract)){
    requestResponse(['messages' => ['Não foi possível encontrar o contrato desejado.']], true);
}

requestResponse($contract);
