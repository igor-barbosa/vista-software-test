<?php

    class PropertyOwnerService {

        public function createOrEditPropertyOwnerRequestValidation($request){
            [$data, $errors] = Validation::validate($_POST, [
                ['po_name', 'Nome Completo', Validation::isRequired(), Validation::names(), Validation::max(80)],
                ['po_email', 'E-mail', Validation::isRequired(), Validation::email(), Validation::max(150)],
                ['po_transfer_day', 'Dia para repasse', Validation::isRequired(), Validation::numbers(), Validation::greaterThan(0), Validation::lessThan(28)]
            ]);

            arrayTrim($data);
            convertArrayProperNames($data, ['po_name']);
            arrayStrToLower($data, ['po_email']);

            if(count($errors) > 0) {        
                requestResponse(['messages' => $errors], true);
            }

            return $data;
        }

        public function createOrEditPropertyOwnerRequestCustomValidation($data, $propertyOwnerId = 0){
            $PropertyOwnerModel = new PropertyOwner();    

            $propertyOwner = $PropertyOwnerModel->getPropertyOwnerByEmail($data['po_email']);  

            if((!empty($propertyOwner) && $propertyOwnerId == 0) || (!empty($propertyOwner) && $propertyOwner['po_id'] != $propertyOwnerId)){
                requestResponse(array('messages' => ['Já existe um proprietário cadastrado com o e-mail informado.']), true);
            }
        }

        public function getUrlParamPropertyOwnerId() {            
            $propertyOwnerId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

            if($propertyOwnerId === 0) {
                requestResponse(['messages' => ['Não foi possível identificar o proprietário desejado.']], true);
            }

            return $propertyOwnerId;
        }

        public function removePropertyOwnerRequestValidation($propertyOwnerId) {
            $PropertyOwnerModel = new PropertyOwner();
            $ContractsModel = new Contracts();
            $PropertiesModel = new Properties();
            
            if(empty($PropertyOwnerModel->getById($propertyOwnerId))){
                requestResponse([
                    'messages' => ['Não foi possível identificar o proprietário desejado.']
                ], true);
            } 
        
            if(count($ContractsModel->getContractsByPropertyOwnerId($propertyOwnerId)) > 0) {
                requestResponse([
                    'messages' => ['Não é possível remover um proprietário vínculado a um contrato.']
                ], true);
            }
        
            if(count($PropertiesModel->getPropertiesByPropertyOwnerId($propertyOwnerId)) > 0) {
                requestResponse([
                    'messages' => ['Não é possível remover um proprietário vínculado a um imóvel.']
                ], true);
            }
        
        }

    }