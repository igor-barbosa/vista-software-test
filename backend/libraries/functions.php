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

function arrayTrim(&$array) {
    foreach($array as $key => $value){
        if(is_string($value)){
            $array[$key] = trim($value);
        }
    }
}

function convertArrayProperNames(&$array, $keys = []) {
    foreach($keys as $key){
        if(!empty($array[$key])){
            $array[$key] = ucwords(strtolower($array[$key]));
        }
    }
}

function arrayStrToLower(&$array, $keys = []) {
    foreach($keys as $key){
        if(!empty($array[$key])){
            $array[$key] = strtolower($array[$key]);
        }
    }
}