<?php
    require_once(__DIR__."/../../../backend/config.php");

    [$data, $errors] = Validation::validate($_POST, [
        ['cl_name', 'Nome Completo', Validation::isRequired(), Validation::min(4), Validation::max(80), Validation::names() ],
        ['cl_email', 'E-mail', Validation::isRequired(), Validation::min(5), Validation::max(150)],
        ['cl_phone', 'Telefone', Validation::isRequired(), Validation::min(11), Validation::max(12), Validation::numbers()]
    ]);
        
    $data['cl_name'] = trim($data['cl_name']);
    $data['cl_name'] = trim($data['cl_email']);
    $data['cl_name'] = trim($data['cl_phone']);

    if(count($errors) > 0) {        
        requestResponse(['messages' => $errors], true);
    }

    $ClientModel = new Clients();
    
    if($ClientModel->getClientByEmail($data['cl_email'])) {
        requestResponse(array('messages' => ['Já existe um cliente cadastrado com o e-mail informado.']), true);
    }

    $created = $ClientModel->create($data);
    requestResponse($created);
