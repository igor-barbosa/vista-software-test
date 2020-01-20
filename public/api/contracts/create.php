<?php

    require_once(__DIR__."/../../../backend/config.php");

    $ContractsModel = new Contracts();
    $MonthlyPayments = new MonthlyPayments();
    $PropertiesModel = new Properties();

    $ContractsService = new ContractsService();

    $data = $ContractsService->createContractRequestValidation($_POST);
    $data = $ContractsService->createContractRequestConvertValues($data);

    $data = $ContractsService->createContractRequestCustomValidation(
        $data,
        $ContractsModel
    );

    $contract = $ContractsModel->createContract($data);

    $contract['monthly_payments'] = [];

    $monthlyPayments = $ContractsService->calculateMonthlyPayments($data);

    foreach($monthlyPayments as $payment) {        
        $contract['monthly_payments'][] = $MonthlyPayments->create(array_merge($payment, ['mp_ct_id' => $contract['ct_id']]));
    }

    requestResponse($contract);