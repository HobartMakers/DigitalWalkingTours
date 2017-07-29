<?php

$x = $_GET['x'];
$y = $_GET['y'];
$radius = $_GET['radius'];

//$x = -42.88234;
//$y = 147.33047;
//$radius = 0.1;

function distance($lat_1, $lon_1, $lat_2, $lon_2) {
    $lat_km_per_degree = 110;
    $lon_km_per_degree = cos(deg2rad($lon_1)) * 110;

    $lat_km_diff = (abs($lat_2) - abs($lat_1)) * $lat_km_per_degree;
    $lon_km_diff = (abs($lon_2) - abs($lon_1)) * $lon_km_per_degree;

    $km_diff = sqrt($lat_km_diff**2 + $lon_km_diff**2);
    
    return $km_diff;
}

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


$features = [];

// Load Hobart facilities

$hobart_facilities = json_decode(file_get_contents('data/Hobart_Facilities.json'), True);

foreach ($hobart_facilities['features'] as $f) {
    $feature = [];

    $feature['title'] = $f['properties']['NAME'];
    $feature['lon'] = $f['geometry']['coordinates'][0];
    $feature['lat'] = $f['geometry']['coordinates'][1];
    $type = $f['properties']['COM_TYPE1'] . " / " . $f['properties']['COM_TYPE2'];

    if (!in_array($type, array_keys($type_mapping))) continue;

    $feature['type'] = $type_mapping[$type];

    $feature['contents'] = "";
    $feature['images'] = [];
    $feature['distance'] = distance($x, $y, $feature['lat'], $feature['lon']);
    
    $features[] = $feature;
}

// Load Urban Art

$urban_art = json_decode(file_get_contents('data/Urban_Art.json'), True);

foreach ($urban_art['features'] as $f) {
    $feature = [];

    $feature['title'] = $f['properties']['Title'];
    $feature['lon'] = $f['geometry']['coordinates'][0];
    $feature['lat'] = $f['geometry']['coordinates'][1];
    $feature['type'] = 'urban art';
    $feature['contents'] = "Artist: " . $f['properties']['Artist'] . "\n" . "Date: " . $f['properties']['Date'];
    $id = $f['properties']['OBJECTID'];
    //$feature['images'] = $f['properties']['URL_1'];
    $feature['images'] = ["https://tascode.com/govhack2017/images/urban-art-$id.jpg"];
    $feature['distance'] = distance($x, $y, $feature['lat'], $feature['lon']);

    //print_r($feature);
    $features[] = $feature;
}

// Loop through all features, decide which are within radius given

$filtered = array_values(array_filter($features, function($var) {
    global $radius;
    return $var['distance'] <= $radius;
}));


//$results = ['type' => 'featureCollection',
//            'features' => $filtered];

header('Content-type: application/json');
echo json_encode($filtered);

