<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $ContractsModel = new Contracts();
    requestResponse($ContractsModel->getAllWithMonthlyPayments());
