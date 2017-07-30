<?php

$time_start = microtime(true);

$type_mapping = [
    "Cultural / Gallery" => "gallery",
    "Cultural / Library" => "library",
    "Cultural / Museum" => "museum",
    "Cultural / Theatre/ cinema" => "theatre/cinema",
    "Ground / Burial ground" => "burial ground",
    "Ground / Park or reserve" => "park or reserve",
    "Ground / Picnic area" => "picnic area",
    "Ground / Sportsground" => "sportsground",
    "Tourist feature / Amusement or entertainment" => "amusement or entertainment",
    "Tourist feature / Cultural" => "cultural feature",
    "Tourist feature / Historical" => "historical",
    "Tourist feature / Industrial" => "industrial",
    "Tourist feature / Information" => "information",
    "Tourist feature / Natural" => "natural feature",
    "Tourist feature / Other" => "other",
];

function load_facilities($filename) {

    global $type_mapping;
    global $x;
    global $y;
    $features = [];
    $facilities = json_decode(file_get_contents($filename), True);

    foreach ($facilities['features'] as $f) {
        $feature = [];
    

        $feature['title'] = $f['properties']['NAME'];
        $feature['long'] = $f['geometry']['coordinates'][0];
        $feature['lat'] = $f['geometry']['coordinates'][1];
        $type = $f['properties']['COM_TYPE1'] . " / " . $f['properties']['COM_TYPE2'];

        if (!in_array($type, array_keys($type_mapping))) continue;

        $feature['type'] = $type_mapping[$type];

        $feature['contents'] = "";
        $feature['images'] = [];
        $feature['distance'] = distance($x, $y, $feature['lat'], $feature['long']);

        $features[] = $feature;
    } 

    return $features;
}

function load_urban_art($filename) {

    global $x;
    global $y;
    $features = [];
    $urban_art = json_decode(file_get_contents($filename), True);

    foreach ($urban_art['features'] as $f) {
        $feature = [];

        $feature['title'] = $f['properties']['Title'];
        $feature['long'] = $f['geometry']['coordinates'][0];
        $feature['lat'] = $f['geometry']['coordinates'][1];
        $feature['type'] = 'urban art';
        $feature['contents'] = "Artist: " . $f['properties']['Artist'] . "\n" . "Date: " . $f['properties']['Date'];
        $id = $f['properties']['OBJECTID'];
        $feature['images'] = [$f['properties']['URL_1']];
        //$feature['images'] = ["https://tascode.com/govhack2017/images/urban-art-$id.jpg"];
        $feature['distance'] = distance($x, $y, $feature['lat'], $feature['long']);

        //print_r($feature);
        $features[] = $feature;
    }

    return $features;
}

function filtered_features($features, $distance) {
    $filtered = [];
    foreach($features as $f) {
        if ($f['distance'] <= $distance) {
            $filtered[] = $f;
        }
    }
    return $filtered;
}

function distance($lat_1, $lon_1, $lat_2, $lon_2) {
    $lat_km_per_degree = 110;
    $lon_km_per_degree = cos(deg2rad($lon_1)) * 110;

    $lat_km_diff = (abs($lat_2) - abs($lat_1)) * $lat_km_per_degree;
    $lon_km_diff = (abs($lon_2) - abs($lon_1)) * $lon_km_per_degree;

    $km_diff = sqrt($lat_km_diff**2 + $lon_km_diff**2);
    
    return $km_diff;
}

function output_json($features) {
    header('Content-type: application/json');

    if (array_key_exists('HTTP_REFERER', $_SERVER)) {
        $origin = rtrim($_SERVER['HTTP_REFERER'], "/");
        header("Access-Control-Allow-Origin: $origin");
    }

    header("Access-Control-Allow-Headers: Content-Type");
    echo json_encode($features);
}

//$x = -42.88234;
//$y = 147.33047;
//$radius = 0.1;

$x = floatval($_GET['x']);
$y = floatval($_GET['y']);
$radius = floatval($_GET['radius']);

// Add to this array with each load of data
$features = [];

// Load various facilities
$features = array_merge($features, load_facilities('data/Hobart_Facilities.json'));
$features = array_merge($features, load_facilities('data/Glenorchy_Facilities.json'));
$features = array_merge($features, load_facilities('data/Brighton_Facilities.json'));
$features = array_merge($features, load_facilities('data/Clarence_Facilities.json'));
$features = array_merge($features, load_facilities('data/Kingborough_Facilities.json'));

// Load Urban Art
$features = array_merge($features, load_urban_art('data/Urban_Art.json'));

// Exclude those further away than $distance KM
$features = filtered_features($features, $radius);

// Send to client
output_json($features);

$time_end = microtime(true);
$seconds = $time_end - $time_start;
error_log(sprintf("points.php ran in %.2f seconds", $seconds));

