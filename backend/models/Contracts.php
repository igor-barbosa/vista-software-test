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

        public $deletedAt = 'ct_deleted_at';
        
        public function getContractsByClientId($id) {
            return $this->query("SELECT * FROM {$this->table} WHERE ct_cl_id = {$id} AND {$this->deletedAt} IS NULL");
        }

        public function getContractsByPropertyOwnerId($id) {
            return $this->query("SELECT * FROM {$this->table} WHERE ct_po_id = {$id} AND {$this->deletedAt} IS NULL");
        }

        public function getContractsByPropertyId($id){
            return $this->query("SELECT * FROM {$this->table} WHERE ct_pro_id = {$id} AND {$this->deletedAt} IS NULL");
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
                )
                AND {$this->deletedAt} IS NULL
            ");
        }
        
        public function delete($id) {
            $monthly = new MonthlyPayments();
            $payments = $monthly->deleteByContractId($id);
            $contract = parent::delete($id);
            $contract['monthly_payments'] = $payments;
            return $contract;
        }

        public function calculateMonthlyPaymentStatus($monthlyPayments){
            foreach($monthlyPayments as $key => $monthly) {
                $expired = $monthly['mp_date'] < date('Y-m-d');
                
                if($monthly['mp_payment_done'] != 1) {
                    $monthlyPayments[$key]['mp_payment_up_to_date'] = ($expired) ? 'Pendente': 'Em dia' ;
                } else {
                    $monthlyPayments[$key]['mp_payment_up_to_date'] = 'Recebido' ;
                }

                if($monthly['mp_payment_done'] == 1){
                    $monthlyPayments[$key]['mp_transfer_performed'] = ($monthly['mp_transfer_done'] != 1) ? 'Pendente': 'Realizado' ;
                } else {
                    if($monthly['mp_transfer_done'] != 1) {
                        $monthlyPayments[$key]['mp_transfer_performed'] = ($expired) ? 'Pendente': 'Em dia' ;
                    } else {
                        $monthlyPayments[$key]['mp_transfer_performed'] = 'Realizado' ;
                    }
                }
            }

            return $monthlyPayments;
        }


        public function getAllWithMonthlyPayments(){
            $MonthlyPaymentsModel = new MonthlyPayments();
            $raw = [];
            foreach($this->all() as $contract){
                $contract['monthly_payments'] = $MonthlyPaymentsModel->getPaymentsByContratId($contract['ct_id']);
                $contract['monthly_payments'] = $this->calculateMonthlyPaymentStatus($contract['monthly_payments']);
                $raw[] = $contract;
            }
            return $raw;
        }

        public function getMonthPaymentByContractIdAndOrder($contractId, $order){
            return $this->pdo->query("
                SELECT * FROM {$this->table} 
                    INNER JOIN monthly_payments ON mp_ct_id = ct_id AND mp_order = '{$order}'   
                WHERE ct_id={$contractId}           
                AND {$this->deletedAt} IS NULL     
            ")->fetch(PDO::FETCH_ASSOC);
        }

        public function getContractById($id) {            
            $contract = $this->pdo->query("
                SELECT * FROM {$this->table} 
                    INNER JOIN clients ON cl_id = ct_cl_id AND cl_deleted_at IS NULL
                    INNER JOIN properties ON pro_id = ct_pro_id AND pro_deleted_at IS NULL
                    INNER JOIN property_owner ON po_id = ct_po_id AND po_deleted_at IS NULL
                WHERE ct_id={$id}
                AND {$this->deletedAt} IS NULL
            ")->fetch(PDO::FETCH_ASSOC);

            if(!empty($contract)) {
                $contract['monthly_payments'] = (new MonthlyPayments())->getPaymentsByContratId($id);
                $contract['monthly_payments'] = $this->calculateMonthlyPaymentStatus($contract['monthly_payments']);
            }           
            
            return $contract;
        }

        public function all(){
             return $this->query("
                SELECT * FROM {$this->table} 
                    INNER JOIN clients ON cl_id = ct_cl_id AND cl_deleted_at IS NULL
                    INNER JOIN properties ON pro_id = ct_pro_id AND pro_deleted_at IS NULL
                    INNER JOIN property_owner ON po_id = ct_po_id AND po_deleted_at IS NULL
                WHERE {$this->deletedAt} IS NULL
            ");
        }

        public function createContract($data) {
            $created = $this->create($data);
            return $this->pdo->query("
                SELECT * FROM {$this->table} 
                    INNER JOIN clients ON cl_id = ct_cl_id AND cl_deleted_at IS NULL
                    INNER JOIN properties ON pro_id = ct_pro_id AND pro_deleted_at IS NULL
                    INNER JOIN property_owner ON po_id = ct_po_id AND po_deleted_at IS NULL
                WHERE ct_id={$created['ct_id']}
                AND {$this->deletedAt} IS NULL
            ")->fetch(PDO::FETCH_ASSOC);
        }
    }