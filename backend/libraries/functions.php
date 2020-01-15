<?php

function requestResponse($data, $isError = false) {
    echo json_encode([ 'error' => $isError, 'data' => $data ]);
    exit;
}