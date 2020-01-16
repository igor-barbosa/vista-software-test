<?php

require_once(__DIR__."/../../../backend/config.php");

[$data, $errors] = Validation::validate($_POST, [
    ['ct_pro_id', 'Imóvel', Validation::isRequired(), Validation::numbers('Não foi possível identificar o imóvel desejado.'), Validation::max(11)],
    ['ct_po_id', 'Proprietário', Validation::isRequired(), Validation::numbers('Não foi possível identificar o proprietário desejado.'), Validation::max(11)],
    ['ct_cl_id', 'Cliente', Validation::isRequired(), Validation::numbers('Não foi possível identificar o cliente desejado.'), Validation::max(11)],
    ['ct_start_date', 'Início da contratação', Validation::isRequired(), Validation::date()],
    ['ct_end_date', 'Fim da contratação', Validation::isRequired(), Validation::date()],
    ['ct_administration_fee', 'Taxa de Administração', Validation::isRequired(), Validation::numbers(), Validation::greaterThan(0), Validation::lessThan(100)],
    ['ct_rent_amount', 'Aluguel', Validation::isRequired(), Validation::money(), Validation::max(13)],
    ['ct_condo_value', 'Condomínio', Validation::isRequired(), Validation::money(), Validation::max(13)],    
    ['ct_IPTU', 'IPTU', Validation::isRequired(), Validation::money(), Validation::max(13)]
]);
    
if(count($errors) > 0) {        
    requestResponse(['messages' => $errors], true);
}

$data['ct_start_date'] = convertBrDate($data['ct_start_date']);
$data['ct_end_date'] = convertBrDate($data['ct_end_date']);
$data['ct_rent_amount'] = convertBrMoney($data['ct_rent_amount']);
$data['ct_condo_value'] = convertBrMoney($data['ct_condo_value']);
$data['ct_IPTU'] = convertBrMoney($data['ct_IPTU']);

if($data['ct_end_date'] < $data['ct_start_date']){
    requestResponse(['messages' => 'A data final da contratação não pode ser menor do que a data inicial.'], true);
}

$ClientModel = new Clients();
$PropertiesModel = new Properties();
$PropertyOwnerModel = new PropertyOwner();
$ContractsModel = new Contracts();
$MonthlyPayments = new MonthlyPayments();

if(empty($ClientModel->getById($data['ct_cl_id']))){
    requestResponse(['messages' => 'Não foi possível identificar o cliente desejado.'], true);
}

if(empty($PropertiesModel->getById($data['ct_pro_id']))){
    requestResponse(['messages' => 'Não foi possível identificar o imóvel desejado.'], true);
}

if(empty($PropertyOwnerModel->getById($data['ct_po_id']))){
    requestResponse(['messages' => 'Não foi possível identificar o proprietário desejado.'], true);
}

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

$numberOfMonths = ($interval->y * 12) + $interval->m;

for($i=1; $i <= $numberOfMonths; $i++) {
    
    $mpDate = ($i === 1) ? $monthlyPaymentDate->format('Y-m-d') : $monthlyPaymentDate->modify('+1 month')->format('Y-m')."-01";
    $mpRentAmount = $data['ct_rent_amount'];  
    $mpCondoValue = $data['ct_condo_value'];
    
     //valor mensal do IPTU
    $mpIPTU = $data['ct_IPTU'] / 12;

    // Cálculo proporcional ao primeiro e ultimo mês.
    if($i === 1 || $i === $numberOfMonths) {
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
