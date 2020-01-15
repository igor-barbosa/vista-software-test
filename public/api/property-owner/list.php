<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertyOwnerModel = new PropertyOwner();
    requestResponse(['data' => $PropertyOwnerModel->all()]);
