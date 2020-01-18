<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $propertyId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if($propertyId === 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o imóvel desejado.']
        ], true);
    }

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
        
    if(count($errors) > 0) {        
        requestResponse(['messages' => $errors], true);
    }

    $PropertiesModel = new Properties();
    $PropertyOwnerModel = new PropertyOwner();

    if(empty($PropertyOwnerModel->getById($data['pro_po_id']))) {
        requestResponse(['messages' => ['Não foi possível identificar o proprietário do imóvel.']], true);
    }

    $updated = $PropertiesModel->update($propertyId, $data);
    requestResponse($updated);
