<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet';
import markercluster from 'leaflet.markercluster';

console.log('〖L ==「', L, '」〗');
console.log('〖markercluster ==「', markercluster, '」〗');
// let map = {};
const iconsConfig = {
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};
const icons = {
  // 🛈 常人和小孩存量
  green: new L.Icon({
    iconUrl:
      'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    ...iconsConfig,
  }),
  // 🛈 常人或小孩無存量
  yellow: new L.Icon({
    iconUrl:
      'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    ...iconsConfig,
  }),
  // 🛈 常人或小孩無存量
  grey: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    ...iconsConfig,
  }),
};

let markers = {};
const markClus = {
  addMap(y, x, item) {
    let mask = {};
    if (item.mask_adult === 0 && item.mask_child === 0) {
      mask = icons.gray;
    } else if (item.mask_adult === 0 || item.mask_child === 0) {
      mask = icons.yellow;
    } else {
      mask = icons.green;
    }

    markers.addLayer(
      L.marker([y, x], {
        icon: mask,
      }).bindPopup(`
      <div class="bdb">
          <h1>${item.name}</h1>
          <h3>
            <span>電話：</span>
            <a href="tel: ${item.phone}">${item.phone}</a>
          </h3>
          <h3>
            <span>地址：</span>
            <a href="http://www.google.com.tw/maps/place/${item.address}">
              ${item.address}
            </a>
          </h3>
          <h3>
            <span>更新時間：</span>
            ${item.updated}
          </h3>
      </div>
      <p>成人口罩數量： ${item.mask_adult}</p>
      <p>小孩口罩數量： ${item.mask_child}</p>`),
    );
  },
};

export default {
  name: 'home',
  data: () => ({
    data: {},
    map: {},
    markers: {},
    lat: 25.03,
    lon: 121.55,
    leafletID: 0,
  }),
  methods: {
    updateMarker() {
      this.data.forEach((a) => {
        const { properties, geometry } = a;
        markClus.addMap(geometry.coordinates[1], geometry.coordinates[0], properties);
      });
    },
  },
  mounted() {
    // ☛TODO: 載入地圖
    this.map = L.map('map', {
      center: [this.lat, this.lon],
      zoom: 15,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
    }).addTo(this.map);

    // ☛TODO: 啟動座標
    markers = new L.MarkerClusterGroup().addTo(this.map);

    this.$http
      .get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
      .then((res) => {
        this.data = res.data.features;
        this.updateMarker(markers);
      });
  },
};
</script>

<style lang="scss">
html,
body,
#map {
  width: 100%;
  height: 100%;
}

.bdb {
  border-bottom: 1px solid #aaa;
}
</style>
