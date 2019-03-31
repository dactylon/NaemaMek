import 'leaflet';
import 'leaflet-extra-markers';
import { Ryzom } from 'vendor/ryzom/map';

import './app.scss';

declare const L: any;

interface IPet {
  index: number;
  stable: string;
  status: string;
  satiety: number;
  x: number;
  y: number;
  z: number;
}

const southWest: L.LatLng = L.latLng(107648, -16656);
const northEast: L.LatLng = L.latLng(122320, 96);
const bounds: L.LatLngBounds = L.latLngBounds(southWest, northEast);
const zoom: number = 6;
var map: any = null;
var markers: any = null;

document.addEventListener('DOMContentLoaded', () => {
  initMap();

  const findButton: HTMLElement = <HTMLElement>(
    document.getElementById('findbutton')
  );
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
  var key: string = (document.getElementById('charkey') as HTMLInputElement)
    .value;
  if (!key) {
    return;
  }
  getPetsPosition(key);
}

function getPetsPosition(charKey: string): void {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let parseXml = xmlStr => {
        return new DOMParser().parseFromString(xmlStr, 'text/xml');
      };

      let xmlDoc = parseXml(this.responseText);
      let animals = xmlDoc.getElementsByTagName('animal');

      var pets: Array<IPet> = [];
      Array.prototype.forEach.call(animals, animal => {
        // Pet index
        let index: number = parseInt(animal.getAttribute('index'));

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
        let x: number = parseInt(position.getAttribute('x'));
        let y: number = parseInt(position.getAttribute('y'));
        let z: number = parseInt(position.getAttribute('z'));

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

function drawMarkers(pets: Array<IPet>): void {
  markers.clearLayers();

  for (const i in pets) {
    const animal = pets[i];

    const numMarker = L.ExtraMarkers.icon({
      icon: 'fa-number',
      number: animal.index + 1,
      shape: 'star',
      markerColor: 'cyan',
    });

    const info = '<div><b>Mektoub: ' + (animal.index + 1) + '</b></div>';

    const marker = L.marker([animal.x, animal.y], {
      icon: numMarker,
      title: animal.index,
    });
    marker.bindPopup(info);
    markers.addLayer(marker);
  }
}
