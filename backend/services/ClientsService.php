<?php

    class ClientsService {
        
        public function createOrEditClientRequestValidation($request) {
            [$data, $errors] = Validation::validate($_POST, [
                ['cl_name', 'Nome Completo', Validation::isRequired(), Validation::min(4), Validation::max(80), Validation::names() ],
                ['cl_email', 'E-mail', Validation::isRequired(), Validation::min(5), Validation::max(150)],
                ['cl_phone', 'Telefone', Validation::isRequired(), Validation::min(11), Validation::max(12), Validation::numbers()]
            ]);

            if(count($errors) > 0) {        
                requestResponse(['messages' => $errors], true);
            }

            arrayTrim($data);
            convertArrayProperNames($data, ['cl_name']);
            arrayStrToLower($data, ['cl_email']);

            return $data;
        }

        public function createOrEditClientRequestCustomValidation($data, $clientId = 0) {
            $ClientModel = new Clients();
            
            $client = $ClientModel->getClientByEmail($data['cl_email']);

            if((!empty($client) && $clientId == 0) || $client['cl_id'] != $clientId){
                requestResponse(array('messages' => ['Já existe um cliente cadastrado com o e-mail informado.']), true);
            }

            return $data;
        }

        public function getUrlParamClientId(){
            $clientId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

            if($clientId === 0) {
                requestResponse([
                    'messages' => ['Não foi possível identificar o cliente desejado.']
                ], true);
            }

            return $clientId;
        }

        public function removeClientRequestCustomValidation($clientId) {            
            $ClientModel = new Clients();
            $ContractsModel = new Contracts();

            if(empty($ClientModel->getById($clientId))){
                requestResponse([
                    'messages' => ['Não foi possível identificar o cliente desejado.']
                ], true);
            } 
        
            if(count($ContractsModel->getContractsByClientId($clientId)) > 0) {
                requestResponse([
                    'messages' => ['Não é possível remover um cliente vinculado a um contrato.']
                ], true);
            }
        }

    }