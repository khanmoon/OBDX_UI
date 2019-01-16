define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/locator",
    "framework/js/constants/constants",
    "@@GOOGLE_MAP_SDK"
], function (oj, ko, $, MapModel, resourceBundle, Constants) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params);
        self.nls = resourceBundle;
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var markersArray = [];
        var circle = new google.maps.Circle();
        var distnaceInfoWin;
        var informationwindow = new google.maps.InfoWindow({ content: "" });
        self.formatLayout = function () {
            if (params.baseModel.large()) {
                $("#googleMap").css("height", "100%");
                $("#googleMap").css("width", "100%");
                $("#googleMap").css("position", "absolute");
            }
            if (params.baseModel.medium()) {
                $("#googleMap").css("height", "100%");
                $("#googleMap").css("width", "100%");
                $("#googleMap").css("position", "absolute");
            }
            if (params.baseModel.small()) {
                $("#googleMap").css("height", "100%");
                $("#googleMap").css("width", "100%");
                $("#googleMap").css("position", "absolute");
            }
        };
        self.formatLayout();
        var mapDefaultProperties = {
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL }
        };
        self.map = new google.maps.Map(document.getElementById("googleMap"), mapDefaultProperties);
        function RadiusWidget() {
            if (self.distanceWidget)
                circle.setMap(null);
            var circleProp = {
                fillOpacity: 0.2,
                fillColor: "#A7A7A7",
                strokeColor: "#000000",
                strokeWeight: 1,
                strokeOpacity: 0.8,
                zIndex: -1
            };
            circle = new google.maps.Circle(circleProp);
            var radius = self.rootModel.radius();
            this.set("distance", radius);
            this.bindTo("bounds", circle);
            circle.bindTo("center", this);
            circle.bindTo("map", this);
            circle.bindTo("radius", this);
            circle.setRadius(radius * 1000);
            circle.setCenter(self.rootModel.userCurrentLocation());
            self.map.setCenter(circle.getCenter());
            self.map.fitBounds(circle.getBounds());
            this.addSizer_();
        }
        function DistanceWidget(map) {
            this.set("map", map);
            this.set("position", map.getCenter());
            var centerMarker = new google.maps.Marker({
                icon: Constants.imageResourcePath + "/locator/Center.png",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 12),
                raiseOn: !1
            });
            centerMarker.bindTo("map", this);
            centerMarker.bindTo("position", this);
            centerMarker.setPosition(self.rootModel.userCurrentLocation());
            var radiusWidget = new RadiusWidget();
            radiusWidget.bindTo("map", this);
            radiusWidget.bindTo("center", this, "position");
            this.bindTo("distance", radiusWidget);
            this.bindTo("bounds", radiusWidget);
            google.maps.event.addListener(radiusWidget, "dragend", function () {
                radiusWidget.fitCenter();
            });
            self.map.panBy(-100, 0);
        }
        DistanceWidget.prototype = new google.maps.MVCObject();
        DistanceWidget.prototype.fitCenter = function () {
            var distanceWidgetPos = this.get("position");
            self.map.setCenter(distanceWidgetPos);
        };
        RadiusWidget.prototype = new google.maps.MVCObject();
        RadiusWidget.prototype.addSizer_ = function () {
            function ShowDistanceInfo(resizeMarker) {
                var roundedOffRadius = self.rootModel.radius().toFixed(2);
                if (!distnaceInfoWin) {
                    distnaceInfoWin = new google.maps.InfoWindow({ content: roundedOffRadius + " Km" });
                    distnaceInfoWin.open(self.map, resizeMarker);
                } else {
                    distnaceInfoWin.close();
                    distnaceInfoWin.setContent(roundedOffRadius + " Km");
                    distnaceInfoWin.open(self.map, resizeMarker);
                }
            }
            var resizeMarker = new google.maps.Marker({
                draggable: !0,
                icon: Constants.imageResourcePath + "/locator/Resize.png",
                size: new google.maps.Size(24, 24),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12, 12),
                title: self.nls.headings.resizeCircle,
                raiseOnDrag: !1
            });
            function getData(radius) {
                self.rootModel.radius(radius);
            }
            resizeMarker.bindTo("map", this);
            resizeMarker.bindTo("position", this, "sizer_position");
            var radiusWidget = this;
            google.maps.event.addListener(resizeMarker, "drag", function () {
                radiusWidget.setDistance();
            });
            google.maps.event.addListener(resizeMarker, "dragend", function () {
                radiusWidget.fitCircle();
                getData(radiusWidget.get("distance"));
                ShowDistanceInfo(resizeMarker);
            });
            ShowDistanceInfo(resizeMarker);
        };
        RadiusWidget.prototype.distance_changed = function () {
            this.set("radius", 1000 * this.get("distance"));
        };
        RadiusWidget.prototype.center_changed = function () {
            var radiusWidgetBounds = this.get("bounds");
            if (radiusWidgetBounds) {
                var radiusWidgetLng = radiusWidgetBounds.getNorthEast().lng(), radiusWidgetLatLng = new google.maps.LatLng(this.get("center").lat(), radiusWidgetLng);
                this.set("sizer_position", radiusWidgetLatLng);
            }
        };
        RadiusWidget.prototype.distanceBetweenPoints_ = function (point1, point2) {
            if (!point1 || !point2) {
                return 0;
            }
            var Radius = 6371;
            var dLat = (point2.lat() - point1.lat()) * Math.PI / 180;
            var dLon = (point2.lng() - point1.lng()) * Math.PI / 180;
            var aComputedValue = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) + ((Math.cos(point1.lat() * Math.PI / 180)) * Math.cos(point2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2));
            var center = 2 * Math.atan2(Math.sqrt(aComputedValue), Math.sqrt(1 - aComputedValue));
            var distance = Radius * center;
            return distance > 10 && (distance = 10), distance < 0.5 && (distance = 0.5), distance;
        };
        RadiusWidget.prototype.setDistance = function () {
            var sizerPosition = this.get("sizer_position"), sizerCenter = this.get("center"), distance = this.distanceBetweenPoints_(sizerPosition, sizerCenter);
            this.set("distance", distance);
            var sizerBounds = this.get("bounds");
            if (sizerBounds) {
                var sizerLng = sizerBounds.getNorthEast().lng(), sizerLatLng = new google.maps.LatLng(this.get("center").lat(), sizerLng);
                this.set("sizer_position", sizerLatLng);
            }
        };
        RadiusWidget.prototype.fitCircle = function () {
            var circleBounds = this.get("bounds");
            if (circleBounds) {
                self.map.fitBounds(circleBounds);
                var circleLng = circleBounds.getNorthEast().lng(), circleLatLng = new google.maps.LatLng(this.get("center").lat(), circleLng);
                this.set("sizer_position", circleLatLng);
            }
        };
        var geoOptions = {
            enableHighAccuracy: true,
            timeout: 15000
        };
        var marker = new google.maps.Marker({
            map: self.map,
            icon: Constants.imageResourcePath + "/locator/Center.png",
            size: new google.maps.Size(24, 24),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 12)
        });
        var drawCircle = function () {
            self.distanceWidget = new DistanceWidget(self.map);
        };
        var geoSuccess = function (position) {
            var pos = new google.maps.LatLng(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude));
            marker.setVisible(false);
            self.map.setCenter(pos);
            self.map.setZoom(12);
            self.rootModel.userCurrentLocation(pos);
            self.rootModel.currentLocation(pos);
            marker.setPosition(pos);
            marker.setVisible(true);
        };
        var geoError = function () {
            self.baseModel.showMessages(null, [self.nls.errors.locationNotFound], "ERROR");
        };
        if (navigator.geolocation) {
            google.maps.event.clearListeners(self.map);
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
        }
        var input = document.getElementById("pac-input");
        var autocomplete = new google.maps.places.Autocomplete(input);
        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById("infowindow-content");
        infowindow.setContent(infowindowContent);
        autocomplete.addListener("place_changed", function () {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return false;
            }
            if (place.geometry.viewport) {
                self.map.fitBounds(place.geometry.viewport);
            } else {
                self.map.setCenter(place.geometry.location);
                self.map.setZoom(12);
            }
            self.rootModel.userCurrentLocation(place.geometry.location);
            self.rootModel.searchLocation();
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        });
        var removeAllMarkers = function () {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
        };
        var isLocationFetchedSubscription = params.rootModel.isLocationFetched.subscribe(function (fetched) {
            var marker;
            directionsDisplay.setMap(null);
            removeAllMarkers();
            if (fetched) {
                ko.utils.arrayForEach(params.rootModel.responseDTO(), function (item) {
                    var fetchedLocation = new google.maps.LatLng(parseFloat(item.geoCoordinate.latitude), parseFloat(item.geoCoordinate.longitude));
                    var bounds = new google.maps.LatLngBounds();
                    bounds.extend(params.rootModel.userCurrentLocation());
                    google.maps.event.trigger(self.map, "resize");
                    if (item.type === "ATM") {
                        marker = new google.maps.Marker({
                            position: fetchedLocation,
                            map: self.map,
                            icon: Constants.imageResourcePath + "/locator/atm-marker.png",
                            anchorPoint: new google.maps.Point(0, -29)
                        });
                    } else {
                        marker = new google.maps.Marker({
                            position: fetchedLocation,
                            map: self.map,
                            icon: Constants.imageResourcePath + "/locator/branch-marker.png",
                            anchorPoint: new google.maps.Point(0, -29)
                        });
                    }
                    google.maps.event.addListener(marker, "click", function () {
                        informationwindow.close();
                        var contentString = self.rootModel.format(self.nls.headings.atmMarker, {
                            name: item.name,
                            line1: item.postalAddress.line1,
                            line2: item.postalAddress.line2,
                            city: item.postalAddress.city
                        });
                        informationwindow.setContent(contentString);
                        informationwindow.open(self.map, this);
                    });
                    self.map.setCenter(self.rootModel.userCurrentLocation());
                    var currentBounds = self.map.getBounds();
                    var isInSight = currentBounds.contains(fetchedLocation);
                    if (isInSight) {
                        self.map.panTo(fetchedLocation);
                    }
                    marker.setPosition(fetchedLocation);
                    marker.setVisible(true);
                    markersArray.push(marker);
                    self.map.panBy(-100, 100);
                    var currentLatlng = new google.maps.LatLng(parseFloat(self.rootModel.userCurrentLocation().lat()), parseFloat(self.rootModel.userCurrentLocation().lng()));
                    var service = new google.maps.DistanceMatrixService();
                    service.getDistanceMatrix({
                        origins: [currentLatlng],
                        destinations: [fetchedLocation],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }, function (response, status) {
                        if (status === google.maps.DistanceMatrixStatus.OK) {
                            item.distanceFromUser = response.rows[0].elements[0].distance.text;
                            self.rootModel.addressDTO.push(item);
                        }
                    });
                });
                self.rootModel.addressDTOs(self.rootModel.addressDTO);
                drawCircle();
            }
        });
        params.rootModel.polesData.subscribe(function (directionData) {
            if (directionData) {
                var polesData = self.rootModel.polesData();
                var directionsService = new google.maps.DirectionsService();
                directionsDisplay.setMap(null);
                var start = new google.maps.LatLng(parseFloat(self.rootModel.currentLocation().lat()), parseFloat(self.rootModel.currentLocation().lng()));
                var end = new google.maps.LatLng(parseFloat(polesData.geoCoordinate.latitude), parseFloat(polesData.geoCoordinate.longitude));
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(start);
                bounds.extend(end);
                self.map.fitBounds(bounds);
                self.map.setZoom(30);
                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap(self.map);
                    }
                });
            }
        });
        $(window).resize(function () {
            self.formatLayout();
        });
        self.dispose = function () {
            isLocationFetchedSubscription.dispose();
        };
    };
});
