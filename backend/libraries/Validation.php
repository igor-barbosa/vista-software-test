<?php

    class Validation {

        public static function isRequired() {
            return function ($label, $value = null) {
                if(empty($value) || trim($value) === ''){
                    return 'O campo "'.$label.'" é obrigatório.';
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
                array_filter($errors)                
            ];
        }


    }