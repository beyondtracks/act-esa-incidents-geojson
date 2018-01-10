const gp = require('geojson-precision');
const turf = {
    point: require('@turf/helpers').point,
    polygon: require('@turf/helpers').polygon,
    geometryCollection: require('@turf/helpers').geometryCollection,
    featureCollection: require('@turf/helpers').featureCollection
};
//const moment = require('moment-timezone');
const rewind = require('geojson-rewind');
const extend = require('xtend');

module.exports = {
    /**
     * Converts the ACT ESA Incidents Upstream Feed to GeoJSON with features:
     *
     *   - Only include ACT incidents
     *   - Unpack overloaded description field
     *   - Limit coordinate precision
     *   - Enforce GeoJSON winding order
     *
     * @param {Object} json ACT ESA Incidents Upstream Feed as a JSON Object
     * @returns {Object} The GeoJSON result
     */
    toGeoJSON: function(json) {
        var self = this;

        var geoJSONFeatures = json.filter(function (item) {
            return item.state === "ACT";
        }).map(function (item) {
            var properties = {
                title: item.title,
                icon: item.icon
            };
            var descriptionItems = item.description.split(/<br *\/?>/).map(function (line) {
                var split = line.split(/:/);
                if (split.length > 1) {
                    var key = split.shift();
                    var value = split.join(':');
                    return {
                        key: key.trim().toLowerCase().replace(/ /, '-'),
                        value: value.trim()
                    };
                }
            }).reduce(function (acc, cur) {
                acc[cur.key] = cur.value;
                return acc;
            }, {});
            properties = extend(descriptionItems, properties); // use this order to avoid description properties overriding 1st level properties

            var id = item.guid;

            var pointCoordinates;
            var polygonCoordinates;
            if (item.point && item.point.type === "Point" && item.point.coordinates && item.point.coordinates.length > 1) {
                pointCoordinates = [Number(item.point.coordinates[1]), Number(item.point.coordinates[0])];
            }
            if (item.polygon && item.polygon.type === "Polygon" && item.polygon.coordinates && item.polygon.coordinates.length > 1) {
                var outer = [];
                for (var i = 0; i += 2; i < item.polygon.coordinates.length) {
                    var lat = Number(item.polygon.coordinates[i]);
                    var lng = Number(item.polygon.coordinates[i + 1]);
                    outer.push([lng, lat]);
                }
                polygonCoordinates = [outer];
            }

            if (pointCoordinates && polygonCoordinates) {
                return turf.geometryCollection([{
                    type: 'Point',
                    coordinates: pointCoordinates
                }, {
                    type: 'Polygon',
                    coordinates: polygonCoordinates
                }], properties, {id: id});
            }

            if (pointCoordinates) {
                return turf.point(pointCoordinates, properties, {id: id});
            }

            if (polygonCoordinates) {
                return turf.polygon(polygonCoordinates, properties, {id: id});
            }
        });

        var geoJSON = turf.featureCollection(geoJSONFeatures);

        // Limit Coordinate Precision
        geoJSON = gp.parse(geoJSON, 4);

        // Enforce Winding Order
        geoJSON = rewind(geoJSON);

        return geoJSON;
    }
};
