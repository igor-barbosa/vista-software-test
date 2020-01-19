<?php

    class Contracts extends Model {

        public $primaryKey = 'ct_id';

        public $table = 'contracts';

        public $columns = [
            'ct_id', 
            'ct_pro_id', 
            'ct_po_id', 
            'ct_cl_id', 
            'ct_start_date', 
            'ct_end_date', 
            'ct_administration_fee', 
            'ct_rent_amount', 
            'ct_condo_value', 
            'ct_IPTU'
        ];

        public function getContractsByClientId($id) {
            return $this->query("SELECT * FROM {$this->table} WHERE ct_cl_id = {$id}");
        }

        public function getContractsByPropertyOwnerId($id) {
            return $this->query("SELECT * FROM {$this->table} WHERE ct_po_id = {$id}");
        }

        public function getContractsByPropertyId($id){
            return $this->query("SELECT * FROM {$this->table} WHERE ct_pro_id = {$id}");
        }
        
        /**
         * Busca o contrato de um imóvel em andamento de acordo com
         * o ID do imóvel e o período desejado. Dever ser utilizado para consultar se em um
         * determinado período o imóvel estará disponível.
         */
        public function findContractInProgressByPropertyIdAndPeriod($id, $start, $end){
            return $this->query("
                SELECT * FROM {$this->table}
                WHERE ct_pro_id = {$id}
                AND (
                    ct_start_date BETWEEN '{$start}' AND '{$end}' OR 
                    ct_end_date BETWEEN '{$start}' AND '{$end}' OR
                    ( ct_start_date <= '{$start}' AND ct_end_date >= '{$end}' )
                );
            ");
        }
        
        public function delete($id) {
            $monthly = new MonthlyPayments();
            $payments = $monthly->deleteByContractId($id);
            $contract = parent::delete($id);
            $contract['monthly_payments'] = $payments;
            return $contract;
        }

        public function getAllWithMonthlyPayments(){
            $monthly = new MonthlyPayments();
            $raw = [];
            foreach($this->all() as $contract){
                $contract['monthly_payments'] = $monthly->getPaymentsByContratId($contract['ct_id']);
                $raw[] = $contract;
            }
            return $raw;
        }

        public function getMonthPaymentByContractIdAndOrder($contractId, $order){
            return $this->pdo->query("
                SELECT * FROM {$this->table} 
                    INNER JOIN monthly_payments ON mp_ct_id = ct_id AND mp_order = '{$order}'   
                WHERE ct_id={$contractId}                
            ")->fetch(PDO::FETCH_ASSOC);
        }

        public function getContractById($id) {            
            $contract = $this->pdo->query("
                SELECT * FROM {$this->table} 
                    INNER JOIN clients ON cl_id = ct_cl_id
                    INNER JOIN properties ON pro_id = ct_pro_id
                    INNER JOIN property_owner ON po_id = ct_po_id
                WHERE ct_id={$id}
            ")->fetch(PDO::FETCH_ASSOC);

            if(!empty($contract)) {
                $contract['monthly_payments'] = (new MonthlyPayments())->getPaymentsByContratId($id);
            }           
            
            return $contract;
        }
    }