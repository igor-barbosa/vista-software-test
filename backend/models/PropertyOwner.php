<?php
    
    class PropertyOwner extends Model {
       
        public $primaryKey = 'po_id';

        public $columns = [
            'po_name',
            'po_email',
            'po_transfer_day'
        ];

        public $table = 'property_owner';

        public function getPropertyOwnerByEmail($email){
            $resp = $this->query("SELECT * FROM {$this->table} WHERE po_email='{$email}'");
            if(count($resp)){
                return $resp[0];
            }
        }
    
    }