<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    const DB_HOST = 'localhost';
    const DB_NAME = 'imob';
    const DB_USER = 'default';
    const DB_PASS = 'default';

    require_once(__DIR__."/libraries/index.php");
    require_once(__DIR__."/services/index.php");
    require_once(__DIR__."/models/index.php");

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: *');

