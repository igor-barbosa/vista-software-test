<?php
    require_once(__DIR__."/../../../backend/config.php");

    [$data, $errors] = Validation::validate($_POST, [
        ['po_name', 'Nome Completo', Validation::isRequired(), Validation::names(), Validation::max(80)],
        ['po_email', 'E-mail', Validation::isRequired(), Validation::email(), Validation::max(150)],
        ['po_transfer_day', 'Dia para repasse', Validation::isRequired(), Validation::numbers(), Validation::greaterThan(0), Validation::lessThan(28)]
    ]);

        
    if(count($errors) > 0) {        
        requestResponse(['messages' => $errors], true);
    }

    $PropertyOwnerModel = new PropertyOwner();
    
    if($PropertyOwnerModel->getPropertyOwnerByEmail($data['po_email'])) {
        requestResponse(array('messages' => ['Já existe um proprietário cadastrado com o e-mail informado.']), true);
    }

    $created = $PropertyOwnerModel->create($data);
    requestResponse($created);
