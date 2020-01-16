<?php
    require_once(__DIR__."/../../../backend/config.php");    

    $PropertyOwnerModel = new PropertyOwner();
    requestResponse($PropertyOwnerModel->all());
