<?php

function requestResponse($data, $isError = false) {
    header('Content-Type: application/json');
    echo json_encode([ 'error' => $isError, 'data' => $data ]);
    exit;
}

function convertBrDate($date){
    return implode('-', array_reverse(explode('/', $date)));
}

function convertBrMoney($money) {
    if(!empty($money)) {
        $money = str_replace("R$ ", "", $money);
        $money = str_replace(".", "", $money);
        $money = str_replace(",", ".", $money);
        return (float) trim($money);
    }
}