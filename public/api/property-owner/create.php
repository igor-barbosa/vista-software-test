<?php
    require_once(__DIR__."/../../../backend/config.php");

    [$data, $errors] = Validation::validate($_POST, [
        ['po_name', 'Nome Completo', Validation::isRequired()],
        ['po_email', 'E-mail', Validation::isRequired()],
        ['po_transfer_day', 'Dia para repasse', Validation::isRequired()]
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
