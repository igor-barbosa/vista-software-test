<?php

    require_once(__DIR__."/../../../backend/config.php");

    $ContractsModel = new Contracts();
    $MonthlyPayments = new MonthlyPayments();

    $ContractsService = new ContractsService();

    $data = $ContractsService->createContractRequestValidation($_POST);

    $data = $ContractsService->createContractRequestCustomValidation(
        $data,
        $ContractsModel
    );

    $monthlyPayments = $ContractsService->calculateMonthlyPayments($data);

    requestResponse($monthlyPayments);