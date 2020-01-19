<?php
    require_once(__DIR__."/../../../backend/config.php");    


    $contractId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $contractOrder = isset($_GET['order']) ? (int) $_GET['order'] : 0;

    [$data, $errors] = Validation::validate($_POST, [
        ['mp_payment_done', 'Status de Pagamento', Validation::isRequired(), Validation::numbers('Não foi possível identificar o status de pagamento.')],
        ['mp_transfer_done', 'Status de Repasse', Validation::isRequired(), Validation::numbers('Não foi possível identificar o status de repasse.')],
    ]);

    if(!isset($_POST['mp_payment_done']) || !in_array($_POST['mp_payment_done'], ['0','1'])){
        requestResponse(['messages' => ['Não foi possível identificar o status de pagamento.']], true);
    }

    if(!isset($_POST['mp_transfer_done']) || !in_array($_POST['mp_transfer_done'], ['0','1'])){
        requestResponse(['messages' => ['Não foi possível identificar o status de repasse.']], true);
    }

    $ContractsModel = new Contracts();
    $MonthlyPaymentModel  = new MonthlyPayments();

    $monthlyPayment = $ContractsModel->getMonthPaymentByContractIdAndOrder($contractId, $contractOrder);

    if(empty($monthlyPayment)){
        requestResponse(['messages' => ['Não foi possível identificar a parcela desejada.']], true);
    }

    $updated = $MonthlyPaymentModel->update($monthlyPayment['mp_id'], [
        'mp_payment_done' => $data['mp_payment_done'] ? $data['mp_payment_done'] : '0',
        'mp_transfer_done' => $data['mp_transfer_done'] ? $data['mp_payment_done'] : '0'
    ]);

    requestResponse($updated);
