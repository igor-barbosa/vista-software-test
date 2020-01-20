<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $ContractsModel = new Contracts();
    $MonthlyPaymentModel  = new MonthlyPayments();

    $ContractsService = new ContractsService();

    $contractId = $ContractsService->getUrlParamContractId();
    $contractOrder = $ContractsService->getUrlParamOrder();

    $data = $ContractsService->savePaymentStatusRequestValidation($_POST);
   
    $monthlyPayment = $ContractsModel->getMonthPaymentByContractIdAndOrder($contractId, $contractOrder);

    if(empty($monthlyPayment)){
        requestResponse(['messages' => ['Não foi possível identificar a parcela desejada.']], true);
    }

    $updated = $MonthlyPaymentModel->update($monthlyPayment['mp_id'], $data);
    $updated = $ContractsModel->calculateMonthlyPaymentStatus([$updated]);

    requestResponse($updated[0]);
