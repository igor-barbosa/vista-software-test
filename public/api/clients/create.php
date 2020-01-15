<?php
    require_once(__DIR__."/../../../backend/config.php");

    [$data, $errors] = Validation::validate($_POST, [
        ['cl_name', 'Nome Completo', Validation::isRequired()],
        ['cl_email', 'E-mail', Validation::isRequired()],
        ['cl_phone', 'Telefone', Validation::isRequired()]
    ]);
        
    if(count($errors) > 0) {        
        requestResponse(['messages' => $errors], true);
    }

    $ClientModel = new Clients();
    
    if($ClientModel->getClientByEmail($data['cl_email'])) {
        requestResponse(array('messages' => ['Já existe um cliente cadastrado com o e-mail informado.']), true);
    }

    $created = $ClientModel->create($data);
    requestResponse(['data' => $created]);
