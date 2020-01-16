<?php

require_once(__DIR__."/../../../backend/config.php");

/**
 * VERIFICAR SE A DATA FINAL É MAIOR DO QUE DATA DE INICIO
 */
[$data, $errors] = Validation::validate($_POST, [
    ['ct_pro_id', 'Imóvel', Validation::isRequired()],
    ['ct_po_id', 'Proprietário', Validation::isRequired()],
    ['ct_cl_id', 'Cliente', Validation::isRequired()],
    ['ct_start_date', 'Início da contratação', Validation::isRequired()],
    ['ct_end_date', 'Fim da contratação', Validation::isRequired()],
    ['ct_administration_fee', 'Taxa de Administração', Validation::isRequired()],
    ['ct_rent_amount', 'Aluguel', Validation::isRequired()],
    ['ct_condo_value', 'Condomínio'],    
    ['ct_IPTU', 'IPTU', Validation::isRequired()]
]);
    
if(count($errors) > 0) {        
    requestResponse(['messages' => $errors], true);
}

$data['ct_start_date'] = convertBrDate($data['ct_start_date']);
$data['ct_end_date'] = convertBrDate($data['ct_end_date']);
$data['ct_rent_amount'] = convertBrMoney($data['ct_rent_amount']);
$data['ct_condo_value'] = convertBrMoney($data['ct_condo_value']);
$data['ct_IPTU'] = convertBrMoney($data['ct_IPTU']);

$ContractsModel = new Contracts();
$MonthlyPayments = new MonthlyPayments();

$inProgress = $ContractsModel->findContractInProgressByPropertyIdAndPeriod(
    $data['ct_pro_id'],
    $data['ct_start_date'],
    $data['ct_end_date']
);

if($inProgress) {
    requestResponse(array('messages' => ['O imóvel informado já possui um contrato em andamento.']), true);
}

$contract = $ContractsModel->create($data);

$startDate = $monthlyPaymentDate = new DateTime($data['ct_start_date']);
$endDate = new DateTime($data['ct_end_date']);
$interval = $startDate->diff($endDate);

$monthlyPeymentsCreated = [];

for($i=1; $i <= $interval->m; $i++) {
    
    $mpDate = ($i === 1) ? $monthlyPaymentDate->format('Y-m-d') : $monthlyPaymentDate->modify('+1 month')->format('Y-m')."-01";
    $mpRentAmount = $data['ct_rent_amount'];  
    $mpCondoValue = $data['ct_condo_value'];
    
     //valor mensal do IPTU
    $mpIPTU = $data['ct_IPTU'] / 12;

    // Cálculo proporcional ao primeiro e ultimo mês.
    if($i === 1 || $i === $interval->m) {
        if($i === 1){
            $monthDays = (int) cal_days_in_month(CAL_GREGORIAN,$monthlyPaymentDate->format('m'),$monthlyPaymentDate->format('Y'));    
            $proportionalDays = $monthDays - $monthlyPaymentDate->format('d');

            if($monthlyPaymentDate->format('d') > 1) {
                $mpCondoValue = ($mpCondoValue / $monthDays) * $proportionalDays;
                $mpIPTU = ($mpIPTU / $monthDays) * $proportionalDays;
            }

        } else {
            $monthDays = (int) cal_days_in_month(CAL_GREGORIAN,$endDate->format('m'),$endDate->format('Y'));    
            $proportionalDays = $monthDays - $endDate->format('d');
        }    

        $mpRentAmount = ($mpRentAmount / $monthDays) * $proportionalDays;     
    }

    $mpAdministrationFee = ($mpRentAmount / 100) * $data['ct_administration_fee'];

    $monthlyPeymentsCreated[] = $MonthlyPayments->create([
        'mp_ct_id' => $contract['ct_id'],
        'mp_order' => $i,
        'mp_date' => $mpDate,
        'mp_payment_done' => 0,
        'mp_trasnfer_done' => 0,
        'mp_rent_amount' => number_format($mpRentAmount, 2),
        'mp_condo_value' => number_format($mpCondoValue, 2),
        'mp_IPTU' => number_format($mpIPTU, 2),
        'mp_administration_fee' => number_format($mpAdministrationFee, 2)
    ]);
}

$contract['monthly_payments'] = $monthlyPeymentsCreated;
requestResponse($contract);
