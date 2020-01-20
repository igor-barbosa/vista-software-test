<?php

    class ContractsService {

        public function createContractRequestValidation($request) {
            [$data, $errors] = Validation::validate($request, [
                ['ct_pro_id', 'Imóvel', Validation::isRequired(), Validation::numbers('Não foi possível identificar o imóvel desejado.'), Validation::max(11)],
                ['ct_cl_id', 'Cliente', Validation::isRequired(), Validation::numbers('Não foi possível identificar o cliente desejado.'), Validation::max(11)],
                ['ct_start_date', 'Início da contratação', Validation::isRequired(), Validation::date()],
                ['ct_end_date', 'Fim da contratação', Validation::isRequired(), Validation::date()],
                ['ct_administration_fee', 'Taxa de Administração', Validation::isRequired(), Validation::numbers(), Validation::greaterThan(0), Validation::lessThan(100)],
                ['ct_rent_amount', 'Aluguel', Validation::isRequired(), Validation::money(), Validation::max(13)],
                ['ct_condo_value', 'Condomínio', Validation::isRequired(), Validation::money(), Validation::max(13)],    
                ['ct_IPTU', 'IPTU', Validation::isRequired(), Validation::money(), Validation::max(13)]
            ]);

            arrayTrim($data);

            if(count($errors) > 0) {        
                requestResponse(['messages' => $errors], true);
            }

            return $data;
        }

        public function createContractRequestConvertValues($data) {
            $data['ct_start_date'] = convertBrDate($data['ct_start_date']);
            $data['ct_end_date'] = convertBrDate($data['ct_end_date']);
            $data['ct_rent_amount'] = convertBrMoney($data['ct_rent_amount']);
            $data['ct_condo_value'] = convertBrMoney($data['ct_condo_value']);
            $data['ct_IPTU'] = convertBrMoney($data['ct_IPTU']);

            return $data;
        }

        public function createContractRequestCustomValidation($data, Contracts $ContractsModel) {
            $ClientModel = new Clients();
            $PropertiesModel = new Properties();
            $PropertyOwnerModel = new PropertyOwner();

            if($data['ct_end_date'] < $data['ct_start_date']){
                requestResponse(['messages' => 'A data final da contratação não pode ser menor do que a data inicial.'], true);
            }

            if(empty($ClientModel->getById($data['ct_cl_id']))){
                requestResponse(['messages' => 'Não foi possível identificar o cliente desejado.'], true);
            }

            $property = $PropertiesModel->getById($data['ct_pro_id']);
            if(empty($property)){
                requestResponse(['messages' => 'Não foi possível identificar o imóvel desejado.'], true);
            }

            $data['ct_po_id'] = $property['pro_po_id'];

            $inProgress = $ContractsModel->findContractInProgressByPropertyIdAndPeriod(
                $data['ct_pro_id'],
                $data['ct_start_date'],
                $data['ct_end_date']
            );

            if($inProgress) {
                requestResponse(array('messages' => ['O imóvel informado já possui um contrato em andamento.']), true);
            }

            return $data;
        }

        public function calculateMonthlyPayments($data) {
            $monthlyPaymentDate = new DateTime($data['ct_start_date']);
            $endDate = new DateTime($data['ct_end_date']);            
            $numberOfMonths = $this->calculateNumberOfMonths($data['ct_start_date'], $data['ct_end_date']);            

            for($i=1; $i <= $numberOfMonths; $i++) {          

                $mpDate = ($i === 1) ? $monthlyPaymentDate->format('Y-m-d') : $monthlyPaymentDate->modify('+1 month')->format('Y-m')."-01";                
                $mpRentAmount = $data['ct_rent_amount'];  
                $mpCondoValue = $data['ct_condo_value'];                                
                $mpIPTU = $data['ct_IPTU'] / 12;

                $monthDays = $this->getMonthDays($monthlyPaymentDate);
                $proportionalDays = $this->getProportionalDaysOfInitialMonth($monthlyPaymentDate);

                if($i === 1 && $monthlyPaymentDate->format('d') > 1) {                    
                    $mpRentAmount = ($mpRentAmount / $monthDays) * $proportionalDays;                         
                }

                if($i === $numberOfMonths) { 
                    $proportionalDays = $endDate->format('d');
                    $mpRentAmount = ($mpRentAmount / $monthDays) * $proportionalDays;                         
                }

                if($i === 1 || $i === $numberOfMonths){
                    $mpCondoValue = ($mpCondoValue / $monthDays) * $proportionalDays;
                    $mpIPTU = ($mpIPTU / $monthDays) * $proportionalDays;
                }
                
                $mpAdministrationFee = ($mpRentAmount / 100) * $data['ct_administration_fee'];

                $response[] = [
                    'mp_order' => $i,
                    'mp_date' => $mpDate,
                    'mp_payment_done' => 0,
                    'mp_trasnfer_done' => 0,
                    'mp_rent_amount' => number_format($mpRentAmount, 2, '.', ''),
                    'mp_condo_value' => number_format($mpCondoValue, 2, '.', ''),
                    'mp_IPTU' => number_format($mpIPTU, 2, '.', ''),
                    'mp_administration_fee' => number_format($mpAdministrationFee, 2, '.', '')
                ];
            }

            return $response;
        }

        public function getUrlParamContractId(){
            $contractId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

            if($contractId === 0) {
                requestResponse([
                    'messages' => ['Não foi possível identificar o contrato desejado.']
                ], true);
            }

            return $contractId;
        }

        public function getUrlParamOrder(){
            $order = isset($_GET['order']) ? (int) $_GET['order'] : 0;

            if($order === 0) {
                requestResponse([
                    'messages' => ['Não foi possível identificar a parcela desejada.']
                ], true);
            }

            return $order;
        }

        public function removeContractRequestCustomValidation($contractId) {
            $ContractsModel = new Contracts();

            if(empty($ContractsModel->getById($contractId)) > 0) {
                requestResponse([
                    'messages' => ['Não foi possível identificar o contrato desejado.']
                ], true);
            }
        }

        public function savePaymentStatusRequestValidation($request) {
            [$data, $errors] = Validation::validate($_POST, [
                ['mp_payment_done', 'Status de Pagamento', Validation::isRequired(), Validation::numbers('Não foi possível identificar o status de pagamento.')],
                ['mp_transfer_done', 'Status de Repasse', Validation::isRequired(), Validation::numbers('Não foi possível identificar o status de repasse.')],
            ]);

            if(count($errors) > 0) {        
                requestResponse(['messages' => $errors], true);
            }

            $data['mp_payment_done'] = ($data['mp_payment_done']) ? '1' : '0';
            $data['mp_payment_done'] = ($data['mp_transfer_done']) ? '1' : '0';

            return $data;
        }

        

        /**
         * Obtem o dia da data específicada e verifica quantos dias faltam para 
         * finalizar o mês. 
         * 
         * Retorna a quantidade calculada + 1 (dia atual da contratação)
         */
        private function getProportionalDaysOfInitialMonth(DateTime $exactDate){
            $monthDays = $this->getMonthDays($exactDate);    
            $proportionalDays = ($monthDays - $exactDate->format('d')) + 1;
            return $proportionalDays;
        }

        private function getMonthDays(DateTime $exactDate) {
            return (int) cal_days_in_month(CAL_GREGORIAN, $exactDate->format('m'), $exactDate->format('Y'));    
        }

        /**
         * Calcula a diferença de meses entre duas datas.
         */
        private function calculateNumberOfMonths($start, $end){
            [$startYear, $startMonth] = explode('-', $start);
            [$endYear, $endMonth] = explode('-', $end);
            $startDate = new DateTime("{$startYear}-{$startMonth}-01");
            $endDate = new DateTime("{$endYear}-{$endMonth}-01");
            $interval = $startDate->diff($endDate);
            return ($interval->y * 12) + $interval->m + 1;
        }
    }