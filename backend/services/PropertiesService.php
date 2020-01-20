<?php

    class PropertiesService {

        public function createOrEditRequestPropertiesValidation($request) {
            [$data, $errors] = Validation::validate($_POST, [
                ['pro_po_id', 'Proprietário', Validation::isRequired(), Validation::numbers('Não foi possível identificar o proprietário desejado.')],
                ['pro_cep', 'CEP', Validation::isRequired(), Validation::numbers(), Validation::max(8)],
                ['pro_street', 'Rua', Validation::isRequired(), Validation::max(150)],
                ['pro_number', 'Número', Validation::isRequired(), Validation::max(10)],
                ['pro_neighborhood', 'Bairro', Validation::isRequired(), Validation::max(100)],
                ['pro_city', 'Cidade', Validation::isRequired(), Validation::max(100)],
                ['pro_state', 'Estado', Validation::isRequired(), Validation::max(100)],
                ['pro_country', 'País', Validation::isRequired(), Validation::max(100)],
                ['pro_complement', 'Complemento', Validation::isRequired(), Validation::max(45)]
            ]);

            arrayTrim($data);
            convertArrayProperNames($data, ['pro_street', 'pro_neighborhood', 'pro_city', 'pro_country']);            
            $data['pro_country'] = (empty($data['pro_country'])) ? 'Brasil' : $data['pro_country'];
            $data['pro_state'] = strtoupper($data['pro_state']);

            if(count($errors) > 0) {        
                requestResponse(['messages' => $errors], true);
            }

            return $data;
        }

        public function createOrEditRequestPropertiesCustomValidation($data) {
            $PropertyOwnerModel = new PropertyOwner();

            if(empty($PropertyOwnerModel->getById($data['pro_po_id']))) {
                requestResponse(['messages' => ['Não foi possível identificar o proprietário do imóvel.']], true);
            }
        }

        public function getUrlParamPropertyId(){
            $propertyId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

            if($propertyId === 0) {
                requestResponse([
                    'messages' => ['Não foi possível identificar o imóvel desejado.']
                ], true);
            }

            return $propertyId;
        }


        public function removePropertyRequestCustomValidation($propertyId) {

            $PropertiesModel = new Properties();
            $ContractsModel = new Contracts();

            if(empty($PropertiesModel->getById($propertyId)) > 0) {
                requestResponse([
                    'messages' => ['Não foi possível identificar o imóvel desejado.']
                ], true);
            }

            if(count($ContractsModel->getContractsByPropertyId($propertyId)) > 0) {
                requestResponse([
                    'messages' => ['Não é possível remover um imóvel vínculado a um contrato.']
                ], true);
            }
        }
    }