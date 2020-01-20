<?php
    
    class Clients extends Model {
       
        public $primaryKey = 'cl_id';

        public $columns = [
            'cl_name',
            'cl_email',
            'cl_phone'
        ];

        public $table = 'clients';
        public $deletedAt = 'cl_deleted_at';

        public function getClientByEmail($email){
            $resp = $this->query("SELECT * FROM clients WHERE cl_email='{$email}' AND {$this->deletedAt} IS NULL");
            if(count($resp)){
                return $resp[0];
            }
        }
    
    }