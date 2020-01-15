<?php
    require_once(__DIR__."/../../../backend/config.php");

    [$data, $errors] = Validation::validate($_POST, [
        ['pro_po_id', 'Proprietário', Validation::isRequired()],
        ['pro_cep', 'CEP', Validation::isRequired()],
        ['pro_street', 'Rua', Validation::isRequired()],
        ['pro_number', 'Número', Validation::isRequired()],
        ['pro_neighborhood', 'Bairro', Validation::isRequired()],
        ['pro_city', 'Cidade', Validation::isRequired()],
        ['pro_state', 'Estado', Validation::isRequired()],
        ['pro_country', 'País', Validation::isRequired()],
        ['pro_complement', 'Complemento', Validation::isRequired()],

    ]);
        
    if(count($errors) > 0) {        
        requestResponse(['messages' => $errors], true);
    }

    $Properties = new Properties();

    $created = $Properties->create($data);
    requestResponse(['data' => $created]);
