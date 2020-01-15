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
        
    }