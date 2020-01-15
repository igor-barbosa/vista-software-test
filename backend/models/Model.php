<?php

    class Model {

        public $pdo = null;

        public $primaryKey = '';

        public $columns = [
            
        ];

        public $table = '';


        public function __construct(){            
            $this->pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.'', DB_USER, DB_PASS);
        }


        protected function filterColumns($data){
            $rawData = [];
            foreach(array_keys($data) as $column){
                if(in_array($column, $this->columns)){
                    $rawData[$column] = $data[$column];
                }
            }
            return $rawData;
        }

        protected function filterIndexs($data){
            $rawData = [];
            foreach(array_keys($data) as $column){
                if(in_array($column, $this->columns)){
                    $rawData[":".$column] = $data[$column];
                }
            }
            return $rawData;    
        }

        public function create($data) {
            $rawData = $this->filterColumns($data);
            $rawDataWithIndexs = $this->filterIndexs($data);

            $columns = implode(",",array_keys($rawData));
            $indexs = implode(",", array_keys($rawDataWithIndexs));
           
            $stmt = $this->pdo->prepare("INSERT INTO {$this->table} ($columns) VALUES($indexs) ");
            $stmt->execute($rawDataWithIndexs);

            $id = $this->pdo->lastInsertId();

            return $this->query("SELECT * FROM {$this->table} WHERE {$this->primaryKey}={$id}")[0];
        }

        public function query($SQL, $fetchType = PDO::FETCH_ASSOC) {
            return $this->pdo->query($SQL)->fetchAll($fetchType);
        }
    }