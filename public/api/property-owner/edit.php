<?php
    require_once(__DIR__."/../../../backend/config.php");

    $propertyOwnerId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if($propertyOwnerId === 0) {
        requestResponse([
            'messages' => ['Não foi possível identificar o proprietário desejado.']
        ], true);
    }

    [$data, $errors] = Validation::validate($_POST, [
        ['po_name', 'Nome Completo', Validation::isRequired()],
        ['po_email', 'E-mail', Validation::isRequired()],
        ['po_transfer_day', 'Dia para repasse', Validation::isRequired()]
    ]);
        
    if(count($errors) > 0) {        
        requestResponse(['messages' => $errors], true);
    }

    $PropertyOwner = new PropertyOwner();
    
    $propertyOwner = $PropertyOwner->getPropertyOwnerByEmail($data['po_email']);

    if(count($propertyOwner) && $propertyOwner['po_id'] != $propertyOwnerId){
        requestResponse(array('messages' => ['Já existe um proprietário cadastrado com o e-mail informado.']), true);
    }

    $updated = $PropertyOwner->update($propertyOwnerId, $data);
    requestResponse($updated);
