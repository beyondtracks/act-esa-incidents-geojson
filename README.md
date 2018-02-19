# act-esa-incidents-geojson

The ACT Emergency Services Agency (ESA) [publishes a GeoRSS feeds of current incidents](http://www.esa.act.gov.au/feeds/currentincidents.xml), along with an [unlisted JSON feed](http://esa.act.gov.au/feeds/allincidents.json). This project aims to make that JSON feed available as GeoJSON, with a few other opinionated changes per the Features section.

You can either build this application into your own pipeline or use the hosted URL at https://www.beyondtracks.com/contrib/act-esa-incidents.geojson (no service availability guarantees!), [preview it at geojson.io](http://geojson.io/#data=data:text/x-url,https://www.beyondtracks.com/contrib/act-esa-incidents.geojson).

_The ESA Current Incidents feed and ESA News Alerts feed are licensed under the Creative Commons Attribution 4.0 International License. You are free to share and adapt the data under the condition that you attribute the data to the ACT Emergency Services Agency._

# Where is it used?

This pipeline has been built for [www.beyondtracks.com](https://www.beyondtracks.com) to provide information about bushfires nearby bushwalks.

# Features

 - **GeoJSON** GeoJSON allows easier integration into geospatial applications as the format is well defined.
 - **Exploded description** The upstream field overloads the "description" with an HTML list of key values. This is exploded out into individual properties.
 - **Coordinate Precision** Practically bushfire locations won't be more than 10m in accuracy so limiting to 4 decimal places will suffice.
 - **Access-Control-Allow-Origin Header** The upstream feeds lack this header meaning web applications aren't able to use the feed directly. The sample crontab file allows you host the GeoJSON file yourself adding the header.
 - **ACT Incidents Only** The upstream feed includes NSW incidents however these are already available from NSW RFS, so to avoid duplication these are dropped from the output feed.
 - **Enforce GeoJSON winding order** For extra assurances the GeoJSON winding order is enforced with https://github.com/mapbox/geojson-rewind.

# Usage

Install the Node dependencies with:

    yarn install

Run the script with:

    ./bin/act-esa-incidents-geojson act-esa-incidents.geojson

This will download the upstream feed, process it and save the resulting GeoJSON file at `act-esa-incidents.geojson`.

# Warranty

The information in the ACT ESA feed can affect life and property. Errors or
omissions may be present and/or the upstream supplied data structure may change
without any notice causing issues. Use at your own risk.

THIS SOFTWARE IS PROVIDED ``AS IS'' AND WITHOUT ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

# Schema

Possible values for `status`:
 * `Under control`
 * `Being controlled`
 * `Out of control`
 * `Out / Completed`
 * `Resource allocation Pending`
 * `Finished`
 * `Units On route`
 * `On Scene`

Possible values for `type`:
 * `CAR FIRE`
 * `CONFINED SPACE RESCUE`
 * `STRUCTURE FIRE`
 * `ELECTRICAL THREAT OR POWER LINES DOWN`
 * `LPG CYLINDER INCIDENT`
 * `GAS PIPELINE INCIDENT`
 * `GRASS AND BUSH FIRE`
 * `HAZARD REDUCTION BURN`
 * `HAZMAT INCIDENT`
 * `HOUSE FIRE`
 * `INDUSTRIAL RESCUE`
 * `LANDFILL TIP FIRES`
 * `MOTOR VEHICLE ACCIDENT`
 * `PEDESTRIAN OR PUSHBIKE ACCIDENT`
 * `RAIL ACCIDENT`
 * `RUBBISH FIRE`
 * `TRANSPORT FIRE`
 * `TRENCH COLLAPSE RESCUE`
 * `VERTICAL  RESCUE`
