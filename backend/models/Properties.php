<?php
    
    class Properties extends Model {
       
        public $primaryKey = 'pro_id';

        public $columns = [
            'pro_id', 
            'pro_po_id', 
            'pro_cep', 
            'pro_number', 
            'pro_street', 
            'pro_neighborhood', 
            'pro_city', 
            'pro_state', 
            'pro_country',
            'pro_complement'
        ];

        public $table = 'properties';

        public $deletedAt = 'pro_deleted_at';
    
        public function getPropertiesByPropertyOwnerId($id){
            return $this->query("SELECT * FROM {$this->table} WHERE pro_po_id = {$id} AND {$this->deletedAt} IS NULL");
        }
    }