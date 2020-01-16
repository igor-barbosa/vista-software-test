<?php
    require_once(__DIR__."/../../../backend/config.php");    


    $contractId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $contractOrder = isset($_GET['order']) ? (int) $_GET['order'] : 0;

    if(!isset($_POST['mp_payment_done']) || !in_array($_POST['mp_payment_done'], ['0','1'])){
        requestResponse(['messages' => ['Não foi possível identificar o tipo da operação.']], true);
    }

    if($contractId === 0) {
        requestResponse(['messages' => ['Não foi possível identificar o contrato desejado.']], true);
    }

    if($contractOrder === 0) {
        requestResponse(['messages' => ['Não foi possível identificar a parcela desejada.']], true);
    }


    $ContractsModel = new Contracts();
    $MonthlyPaymentModel  = new MonthlyPayments();

    $monthlyPayment = $ContractsModel->getMonthPaymentByContractIdAndOrder($contractId, $contractOrder);

    if(empty($monthlyPayment)){
        requestResponse(['messages' => ['Não foi possível identificar a parcela desejada.']], true);
    }

    $updated = $MonthlyPaymentModel->update($monthlyPayment['mp_id'], [
        'mp_payment_done' => $_POST['mp_payment_done']
    ]);

    requestResponse($updated);
