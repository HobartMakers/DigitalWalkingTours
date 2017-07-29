#!/bin/bash
#
# Simple script to use GDAL to convert points of interest files in ESRI Shapefile
# format to GeoJSON format for consumption by Leaflet.  ogr2ogr.py exists in the
# GDAL example code directory.
#
# Quick & dirty...

cd data/community

for i in *.shp;
do
  x=`echo $i | cut -f1 -d.`
  ../../ogr2ogr.py -f GeoJSON -t_srs crs:84 $x.geojson $x.shp
done

cd ../..