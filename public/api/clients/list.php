<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $ClientModel = new Clients();
    
    requestResponse($ClientModel->all());
