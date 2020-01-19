<?php

    class MonthlyPayments extends Model {

        public $primaryKey = 'mp_id';

        public $table = 'monthly_payments';

        public $columns = [
            'mp_id', 
            'mp_ct_id', 
            'mp_order', 
            'mp_date', 
            'mp_payment_done', 
            'mp_transfer_done', 
            'mp_rent_amount',
            'mp_condo_value',
            'mp_IPTU',
            'mp_administration_fee'           
        ];

        public function deleteByContractId($id) {
            $resp = $this->getPaymentsByContratId($id);
            if(!empty($resp) && count($resp)){
                $this->pdo->query("DELETE FROM {$this->table} WHERE mp_ct_id = {$id}");
            }
            
            return $resp;
        }

        public function getPaymentsByContratId($id){
            return $this->query("SELECT * FROM {$this->table} WHERE mp_ct_id = {$id} ORDER BY mp_order ASC");
        }
    }