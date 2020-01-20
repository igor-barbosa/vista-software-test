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

        public function all() {
            return $this->query("
                SELECT * FROM {$this->table} 
                    LEFT JOIN property_owner ON po_id = pro_po_id AND po_deleted_at IS NULL
                WHERE {$this->deletedAt} IS NULL
            ");
        }

        public function createProperty($data) {
            $created = $this->create($data);
            return $this->pdo->query("
                SELECT * FROM {$this->table}
                    LEFT JOIN property_owner ON po_id = pro_po_id AND po_deleted_at IS NULL
                WHERE pro_id={$created['pro_id']}
                AND {$this->deletedAt} IS NULL
            ")->fetch(PDO::FETCH_ASSOC);
        }

        public function updateProperty($propertyId, $data){
            $property = $this->update($propertyId, $data);
            return $this->pdo->query("
                SELECT * FROM {$this->table}
                    LEFT JOIN property_owner ON po_id = pro_po_id AND po_deleted_at IS NULL
                WHERE pro_id={$property['pro_id']}
                AND {$this->deletedAt} IS NULL
            ")->fetch(PDO::FETCH_ASSOC);
        }
    }