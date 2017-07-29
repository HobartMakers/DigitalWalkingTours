#!/usr/bin/python
#
# Quick & dirty script to scrape the urban art images from the Hobart City Council
# applications web server and store them locally, with filenames reflecting the
# OBJECTID in the urban art CSV open data file.

import csv
import wget

with open('Urban_Art.csv', 'rb') as csvfile:
	csvrdr = csv.reader(csvfile, delimiter=',', quotechar='"')
	for row in csvrdr:
		url = row[12]
		dst = 'images/urban-art-'+row[2]+'.jpg'

		if ( url != 'URL_1' ):
			print row[2] + ' - ' + url
			wget.download(url, out=dst)

csvfile.close()