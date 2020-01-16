<?php

    class Model {

        public $pdo = null;

        public $primaryKey = '';

        public $columns = [
            
        ];

        public $table = '';


        public function __construct(){            
            $this->pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.'', DB_USER, DB_PASS);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
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

        public function update($id, $data) {
            $rawData = $this->filterColumns($data);
            $rawDataWithIndexs = $this->filterIndexs($data);

            $keysAndIndexs = array_map(function($key){
                return "{$key}=:{$key}";
            }, array_keys($rawData));

            $keysAndIndexs = implode(',', $keysAndIndexs);

            $stmt = $this->pdo->prepare("UPDATE {$this->table} SET {$keysAndIndexs} WHERE {$this->primaryKey}=:id");
            $stmt->execute(array_merge(
                $rawDataWithIndexs,
                [':id' => $id]  
            ));

            return $this->query("SELECT * FROM {$this->table} WHERE {$this->primaryKey}={$id}")[0];
        }

        public function query($SQL, $fetchType = PDO::FETCH_ASSOC) {
            return $this->pdo->query($SQL)->fetchAll($fetchType);
        }

        public function all(){
            return $this->query("SELECT * FROM {$this->table}");
        }

        public function getById($id){
            return $this->pdo->query("SELECT * FROM {$this->table} WHERE {$this->primaryKey}={$id}")->fetch(PDO::FETCH_ASSOC);
        }

        public function delete($id){
            $data = $this->getById($id);
            $this->pdo->query("DELETE FROM {$this->table} WHERE {$this->primaryKey}={$id}");
            return $data;
        }
    }