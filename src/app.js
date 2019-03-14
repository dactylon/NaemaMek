import L from 'leaflet';
import 'leaflet-extra-markers';
import 'vendor/ryzom/map.js';

import './app.scss';

var Ryzom = window.Ryzom;

var southWest = L.latLng(107648, -16656);
var northEast = L.latLng(122320, 96);
var bounds = L.latLngBounds(southWest, northEast);
var zoom = 6;
var map = null;
var markers = null;

document.addEventListener('DOMContentLoaded', () => {
  initMap();

  var findButton = document.getElementById('findbutton');
  findButton.addEventListener('click', findMyPets);
});

function initMap() {
  // eslint-disable-next-line no-undef
  map = Ryzom.map('ryzommap', {
    rzSatellite: false,
    center: bounds.getCenter(),
    minZoom: 5,
    maxZoom: 14,
    noWrap: true,
    attributionControl: true,
  });

  map.attributionControl.setPrefix(
    '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>' +
      ' | <a href="https://ballisticmystix.net/" title="Powered by Ballistic Mystix">Ryzom</a>' +
      ' | &copy; <a href="mailto:DactylonRyzom@gmail.com" title="Created by Dactylon">Dactylon</a>',
  );

  map.setMaxBounds(bounds);

  map.on('drag', function() {
    map.panInsideBounds(bounds, {
      animate: false,
    });
  });

  map.addControl(new L.Control.MousePosition());

  markers = new L.FeatureGroup();
  map.addLayer(markers);
  map.setView(bounds.getCenter(), zoom);
}

function findMyPets() {
  var key = document.getElementById('charkey').value;
  if (key == '') {
    return;
  }
  getPetsPosition(key);
}

function getPetsPosition(charKey) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let parseXml;
      if (typeof window.DOMParser != 'undefined') {
        parseXml = xmlStr => {
          return new window.DOMParser().parseFromString(xmlStr, 'text/xml');
        };
      } else if (
        typeof window.ActiveXObject != 'undefined' &&
        new window.ActiveXObject('Microsoft.XMLDOM')
      ) {
        parseXml = xmlStr => {
          var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
          xmlDoc.async = false;
          xmlDoc.loadXML(xmlStr);
          return xmlDoc;
        };
      } else {
        throw new Error('No XML parser found');
      }

      let xmlDoc = parseXml(this.responseText);
      let animals = xmlDoc.getElementsByTagName('animal');

      var pets = [];
      Array.prototype.forEach.call(animals, animal => {
        // Pet index
        let index = parseInt(animal.getAttribute('index'));

        // Get stable status
        let stableStatus = animal.getElementsByTagName('status')[0];
        let stable = stableStatus.getAttribute('stable');
        let status = stableStatus.innerHTML;

        // Get pet's satiety
        let satiety = parseFloat(
          animal.getElementsByTagName('satiety')[0].innerHTML,
        );

        // Get position of each animal
        let position = animal.getElementsByTagName('position')[0];
        let x = parseInt(position.getAttribute('x'));
        let y = parseInt(position.getAttribute('y'));
        let z = parseInt(position.getAttribute('z'));

        pets.push({
          index: index,
          stable: stable,
          status: status,
          satiety: satiety,
          x: x,
          y: y,
          z: z,
        });
      });
      drawMarkers(pets);
    }
  };
  xmlhttp.open('GET', 'https://api.ryzom.com/character.php?apikey=' + charKey);
  xmlhttp.send();
}

function drawMarkers(pets) {
  markers.clearLayers();

  for (var i in pets) {
    var animal = pets[i];

    var numMarker = L.ExtraMarkers.icon({
      icon: 'fa-number',
      number: animal.index + 1,
      shape: 'star',
      markerColor: 'cyan',
    });

    var info = '<div><b>Mektoub: ' + (animal.index + 1) + '</b></div>';

    var marker = L.marker([animal.x, animal.y], {
      icon: numMarker,
      title: animal.index,
    });
    marker.bindPopup(info);
    markers.addLayer(marker);
  }
}
