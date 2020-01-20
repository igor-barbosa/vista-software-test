<?php

    class Validation {

        private static function isEmpty($value) {
            return (empty($value) && $value != 0);
        }

        public static function isRequired() {
            return function ($label, $value = null) {
                if(Validation::isEmpty($value) || trim($value) === ''){
                    return "O campo \"{$label}\" é obrigatório.";
                }
            };
        }

        public static function max($max) {
            return function ($label, $value = null) use($max) {
                if(!Validation::isEmpty($value) && strlen($value) > $max){
                    return "O campo \"{$label}\" deve conter no máximo {$max} caracteres.";
                }
            };
        }

        public static function min($min) {
            return function ($label, $value = null) use($min) {
                if(!Validation::isEmpty($value) && strlen($value) < $min){
                    return "O campo \"{$label}\" deve conter no mínimo {$min} caracteres.";
                }
            };
        }  
        
        
        public static function names() {
            return function ($label, $value = null) {
                if(!Validation::isEmpty($value) && !preg_match('/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s\.]+$/', $value)){
                    return "O campo \"{$label}\" deve conter apenas letras, espaço e/ou pontuação.";
                }
            };
        }

        public static function email(){
            return function ($label, $value = null) {
                if(!Validation::isEmpty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)){
                    return "O campo \"{$label}\" contém um e-mail inválido.";
                }
            };
        }

        public static function numbers($message = null) {
            return function ($label, $value = null) {
                if(!Validation::isEmpty($value) && !preg_match('/^[0-9]+/', $value)){
                    return ($message) ? $message : "O campo \"{$label}\" deve conter apenas números.";
                }
            };
        }

        public static function greaterThan($min) {
            return function ($label, $value = null) use($min) {
                $isGreater = ((float) $value) > $min;
                if(!Validation::isEmpty($value) && !$isGreater){
                    return "O campo \"{$label}\" deve ser maior que {$min}.";
                }
            };
        } 

        public static function lessThan($max) {
            return function ($label, $value = null) use($max) {
                $isLess = ((float) $value) < $max;
                if(!Validation::isEmpty($value) && !$isLess){
                    return "O campo \"{$label}\" deve ser menor que {$max}.";
                }
            };
        } 

        public static function lessThanOrEqual($max) {
            return function ($label, $value = null) use($max) {
                $isLess = ((float) $value) <= $max;
                if(!Validation::isEmpty($value) && !$isLess){
                    return "O campo \"{$label}\" deve ser menor ou igual a {$max}.";
                }
            };
        } 

        public static function date() {
            return function ($label, $value = null) {
                if(!Validation::isEmpty($value)) {

                    if(!preg_match('/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/', $value)){
                        return "O campo \"{$label}\" deve conter o formato xx/xx/xxxx.";
                    }
                    
                    [$day, $month, $year] = explode("/", $value);
                    if(!checkdate($month, $day, $year)){
                        return "O campo \"{$label}\" deve conter uma data válida.";
                    }
                }
            };
        }

        public static function money() {
            return function ($label, $value = null) {
                if(!Validation::isEmpty($value) && !preg_match('/^((R\$\s)([0-9]{1,3})|([0-9]{1,3}))(((\.)([0-9]{3}))+)?((\,)([0-9]{2}))?$/', $value)){
                    return "O campo \"{$label}\" deve conter o formato : \"R$ 1.000,00\".";
                }
            };
        }

        /**
         * Confere as regras passadas para um campo.
         */
        public static function check($data, $label, ...$functions){
            $error = null;
            foreach($functions as $function){
                $error = $function($label, $data);
                if($error) break;
            }

            return $error;
        }

        /**
         * Realiza validação de todos os campos a partir do valor, label e regras.
         * exemplo:
         */
        public static function validate($data, $rules){
            $errors = [];
            $rawData = [];
            foreach($rules as $rule){
                $key = array_shift($rule);
                $label = array_shift($rule);
                $rawData[$key] = isset($data[$key]) ? $data[$key] : null;
                $errors[] = Validation::check($rawData[$key], $label, ...$rule);
            }

            return [
                $rawData,
                array_values(array_filter($errors))
            ];
        }


    }