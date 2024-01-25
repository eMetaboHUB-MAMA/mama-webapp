#!/usr/bin/php
<?php

// info
echo "[info] this script is used to download and update French public laboratories RNSR codes. \n";

// processing current date
echo "[info] processing current date (add it in generated file name)...\n";
$timestamp = time();
$current_date = gmdate('Y-m-d', $timestamp);

// init output files
echo "[info] init files to create / link...\n";
$target = __DIR__ . "/../json/list_labs_rnsr_$current_date.json";
$symlink = __DIR__ . "/../json/list_labs_rnsr.json";

// remove old symlink
echo "[info] if old symlink exists, remove it...\n";
if (file_exists($symlink)) {
    if (is_link($symlink)) {
        unlink($symlink);
    } else {
        echo "[ERROR] could not remove old symlink!\n";
        die(1);
    }
}

// init response
$response = array();

// process curl
echo "[info] getting an updated version of the RNSR laboratories list...\n";
$ch = curl_init();
try {
    curl_setopt($ch, CURLOPT_URL, "https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-repertoire-national-structures-recherche/download?format=json&timezone=Europe/Berlin&use_labels_for_header=false");
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 2);
    // curl_setopt($ch, CURLOPT_NOBODY, true);

    // check errors
    $response_raw = curl_exec($ch);
    if (curl_errno($ch)) {
        echo "[ERROR] could not process CURL: " . curl_error($ch) . "\n";
        die(1);
    }

    // check success
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($http_code == intval(200)) {
        echo "[info] RNSR reference file has been found.\n";
    } else {
        echo "[ERROR] could not update RNSR reference file; HTTP error code: " . $http_code . "\n";
        die(1);
    }

    // process success response
    echo "[info] decoding JSON response...\n";
    $response =  json_decode($response_raw, true);
} catch (\Throwable $th) {
    throw $th;
} finally {
    curl_close($ch);
}

// process lab list
$list_light = array();
echo "[info] processing lab list (set an object without too much useless data for MAMA)...\n";
foreach ($response as &$lab) {
    $lab_content = $lab["fields"];
    $lab_light = array();
    $lab_light['id'] = $lab_content["numero_national_de_structure"];
    // $lab_light['s'] = $lab_content["sigle"];
    $lab_light['name'] = $lab_content["libelle"];
    $lab_light['a'] = ($lab_content["etat"] === "Active");
    array_push($list_light, $lab_light);
}

// convert object to string
echo "[info] convert updated list from PHP object to a JSON object...\n";
$target_conent = json_encode($list_light);

// write into file
echo "[info] write updated content into file (overwrite)...\n";
$target_file = fopen($target, "w");
fwrite($target_file, $target_conent);
fclose($target_file);

// info
echo "[info] $target size: " . filesize($target) . " bytes!\n";

// create symlink
echo "[info] create new symlink...\n";
symlink($target, $symlink);

// end
echo "[info] success!\n";
exit(0);
