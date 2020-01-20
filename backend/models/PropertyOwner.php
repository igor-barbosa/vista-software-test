<?php
    
    class PropertyOwner extends Model {
       
        public $primaryKey = 'po_id';

        public $columns = [
            'po_name',
            'po_email',
            'po_transfer_day'
        ];

        public $table = 'property_owner';

        public $deletedAt = 'po_deleted_at';

        public function getPropertyOwnerByEmail($email){
            $resp = $this->query("SELECT * FROM {$this->table} WHERE po_email='{$email}' AND {$this->deletedAt} IS NULL");
            if(count($resp)){
                return $resp[0];
            }
        }
    
    }