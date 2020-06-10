<template>
  <v-container>
    <l-map
      id="map"
      :key="mapKey"
      :zoom="zoom"
      :max-bounds="maxBounds"
      :min-zoom="7"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      @click="changeLatLng"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        v-for="tileProvider in getTileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
      />
      <l-control class="example-custom-control">
        <v-btn
        id="switchMapBtn"
        @click="switchMap()">
          <span>{{switchMapBtnText}}</span>
        </v-btn>
      </l-control>
      <l-polygon
        id="southPolygon"
        :lat-lngs="southPolygon.latlngs"
        :color="southPolygon.color"
        v-if="selectedPolygon === southID"
      />
      <l-polygon
        id="centerPolygon"
        :lat-lngs="centerPolygon.latlngs"
        :color="centerPolygon.color"
        v-if="selectedPolygon === centerID"
      />
      <l-polygon
        id="northPolygon"
        :lat-lngs="northPolygon.latlngs"
        :color="northPolygon.color"
        v-if="selectedPolygon === northID"
      />
      
      <l-marker
      v-for="sensor in Sensors"
      :key="sensor.id"
      ref="markersRef"
      :id="`sensor-${sensor.id}`"
      :icon="getIcon(sensor.active, sensor.type)"
      :lat-lng="getLatLng(sensor.lat, sensor.lng)"
      @click="emitSensorClick(sensor)"
      >
        <l-tooltip>
          <div>
            {{sensor.text}}
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
    <v-bottom-navigation
    grow
    color="teal"
  >
    <v-btn
    v-for="polygon in polygons"
    :id="`polygon${polygon.id}Btn`"
    @click="selectPolygon(polygon.id)"
    :key="polygon.id">
      <span>{{polygon.text}}</span>
    </v-btn>

    <v-autocomplete
      v-model="favoritePlaceSelected"
      :items="savedLocationsNames"
      dense
      style="z-index:9999;"
      label="מקומות שמורים"
      @change="gotoFavoritePlace(favoritePlaceSelected)"
    ></v-autocomplete>
  </v-bottom-navigation>
  <v-bottom-navigation>
    <v-row>
      <v-col class='col-4'>
        <v-btn
        id="gotoPointBtn"
        @click="gotoPoint()">
          <span>עבור לנ.צ</span>
        </v-btn>
      </v-col>
      <v-col class='col-3'>
    <v-text-field
      id="longitudeTextField"
      label="קו אורך"
      placeholder="מלא קו אורך"
      dense
      v-model="chosenLng"
    >
    </v-text-field>
      </v-col>
      <v-col class='col-3'>
    <v-text-field
      id="latitudeTextField"
      label="קו רוחב"
      placeholder="מלא קו רוחב"
      dense
      v-model="chosenLat"
    ></v-text-field>
      </v-col>
      <v-col class="col-2">
        <v-btn icon id="saveFavorite" @click="saveFavorite">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    </v-bottom-navigation>
    <v-dialog
      style="z-index:9999; position: relative;"
      v-model="dialog"
      width="500"
    >
      <v-card dir="rtl" class="justify-center">
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          שמור מקום חדש
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-form ref="form" @submit.prevent>
            <v-text-field
              id="newPlaceName"
              placeholder="שם מקום שמור"
              dense
              v-model="newPlaceName"
            >
            </v-text-field>
          </v-form>
        </v-card-actions>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            id="acceptSaveLocationThatLovesEyalBenedek"
            color="primary"
            text
            @click="saveDetails"
          >
            שמור
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { latLng, icon, latLngBounds } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LPolygon, LControl } from "vue2-leaflet";
import EventBus  from '../Eventbus'

const tileProviders = [
{
  name: 'OpenStreetMap',
  visible: true,
  attribution:
    '<a href="https://www.instagram.com/ofir.norani/">© - Ofir Bar Yacov Norai Norani</a>',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
},
{
  name: 'OpenTopoMap',
  visible: false,
  url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  attribution:
    '<a href="https://www.instagram.com/ofir.norani/">© - Ofir Bar Yacov Norai Norani</a>',
},
];

const areas = {
SOUTH: 0,
CENTER: 1,
NORTH: 2,
}

const sensorTypes = {
PLANE: 0,
SATELLITE: 1,
CAMERA: 2,
}
export default {
name: "EyeMap",
components: {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LPolygon,
  LControl
},
props: {
  Sensors: Array,
  MapCenter: Object,
},
data() {
  return {
    newPlaceName: undefined,
    dialog: false,
    favoritePlaceSelected: undefined,
    dataMapCenter: this.MapCenter,
    mapKey: 0,
    zoom: 7,
    attribution:
      '© - Ofir Bar Yacov Norani',
    currentZoom: 11.5,
    currentCenter: 0,
    mapOptions: {
      zoomSnap: 0.5
    },
    chosenLat: undefined,
    chosenLng: undefined,
    markers: [],
    southWestBounds: {
      lat: 29.3204893,
      lng: 32.5077242
    },
    savedLocations: [
      {
        name: "אשדוד",
        location: {
          lat: 31.7701779,
          lng: 34.6350122
        },
      },
      {
        name: "איזור התחממות תל אביב",
        location: {
          lat: 32.0880577,
          lng: 34.8672865
        }
      }
    ],
    northEastBounds: {
      lat: 33.4869697,
      lng: 37.0066256
    },
    showTopoMap: false,
    polygons: [
      {
        id: areas.SOUTH,
        text: 'מחוז דרום',
        location: {
          lat: 31.7701779,
          lng: 34.6350122
        }
      },
      {
        id: areas.CENTER,
        text: 'מחוז מרכז',
        location: {
          lat: 32.0880577,
          lng: 34.8672865
        }
      },
      {
        id: areas.NORTH,
        text: 'מחוז צפון',
        location: {
          lat: 32.7996897, 
          lng: 35.0517956
        }
      }
    ],
    southPolygon: {
      latlngs: [
        [31.8537621, 34.665446],
        [31.3174803, 35.4053051],
        [30.5831648, 35.2338555],
        [29.5404946, 34.935143],
        [31.2168992, 34.2522354],
        [31.8537621, 34.665446],
      ],
      color: "#ff00ff"
    },
    centerPolygon: {
      latlngs: [
        [31.8537621, 34.665446],
        [32.2648095, 34.8285183],
        [32.3853129, 35.5530169],
        [31.3174803, 35.4053051],
        [31.8537621, 34.665446]
      ],
      color: "#b266ff"
    },
    northPolygon: {
      latlngs: [
        [32.2648095, 34.8285183],
        [32.8283665, 34.9668591],
        [32.8159623, 35.0212809],
        [33.0902169, 35.1171522],
        [33.0899517, 35.0999174],
        [33.0847566, 35.5037574],
        [33.286967, 35.5776158],
        [33.3191494, 35.7888854],
        [32.9400122, 35.9115305],
        [32.6408816, 35.577985],
        [32.3853129, 35.5530169],
        [32.2648095, 34.8285183]
      ],
      color: "#3399ff"
    },
    selectedPolygon: undefined
    }
},
mounted: function() {
  this.$nextTick(() => {
    this.markers = this.$refs.markersRef.map(ref => ref.mapObject);
  });
},
computed: {
    savedLocationsNames() {
      return this.savedLocations.map(loc => loc.name);
    },
    switchMapBtnText: function() {
      return this.showTopoMap ? 'למפה הרגילה' : 'למפה הטופוגרפית'
    },
    getTileProviders() {
      return tileProviders;
    },
    center: function() {
      return (this.dataMapCenter == undefined) ? latLng(32.109333, 34.855499) : 
                                              latLng(this.dataMapCenter.MapCenterLat, this.dataMapCenter.MapCenterLng);
    },
    maxBounds: function() { 
        return latLngBounds([
          this.southWestBounds,
          this.northEastBounds
        ])
    },
    northID: function() {
      return areas.NORTH;
    },
    southID: function() {
      return areas.SOUTH;
    },
    centerID: function() {
      return areas.CENTER;
    }
},
methods: {
  saveDetails() {
    if(this.newPlaceName === undefined ||
        this.newPlaceName === "" || 
        this.savedLocationsNames.includes(this.newPlaceName)) {
        this.$alertify.error('שם המקום קיים או אינו תקין');
    }
    else {
      this.savedLocations.push({
      name: this.newPlaceName,
      location: {
                    lat: this.chosenLat,
                    lng: this.chosenLng
                  }
                })
        this.$alertify.success('המקום נשמר בהצלחה');
        this.$refs.form.reset()
        this.dialog = false;
    }
    
  },
  saveFavorite() {
    if(isNaN(this.chosenLat) || isNaN(this.chosenLng)) {
      this.$alertify.error('צריך למלא נ.צ במספרים');
    }
    else {
      this.dialog =  true;
    }
  },
  gotoFavoritePlace(placeName) {
    let place = this.savedLocations.find((loc) => {
      return loc.name === placeName
    })
    this.dataMapCenter.MapCenterLat = place.location.lat;
    this.dataMapCenter.MapCenterLng = place.location.lng;
    this.zoom = 13
    this.mapKey++;
  },
  changeLatLng(event) {
    this.chosenLng = event.latlng.lng;
    this.chosenLat = event.latlng.lat;
  },
  gotoPoint() {
    if(isNaN(this.chosenLat) || isNaN(this.chosenLng)) {
      this.$alertify.error('צריך למלא נ.צ במספרים');
    }
    else {
      this.dataMapCenter.MapCenterLat = this.chosenLat;
      this.dataMapCenter.MapCenterLng = this.chosenLng;
      this.zoom = 13
      this.mapKey++;
    }
  },
  switchMap() {
    tileProviders.forEach((provider) => {
      provider.visible = !provider.visible
    })
    this.showTopoMap = !this.showTopoMap
  },
  selectPolygon(id){
    this.selectedPolygon === id ? this.selectedPolygon = undefined : this.selectedPolygon = id;
    if(this.selectedPolygon !== undefined) {
      let polygon = this.polygons.find((p) => {return p.id === id})
      this.dataMapCenter.MapCenterLat = polygon.location.lat;
      this.dataMapCenter.MapCenterLng = polygon.location.lng;
      this.zoom = 10
      this.mapKey++;
    }
  },
  zoomUpdate(zoom) {
    this.currentZoom = zoom;
  },
  emitSensorClick(sensor) {
    this.chosenLng = sensor.lng;
    this.chosenLat = sensor.lat;
    EventBus.$emit('SENSOR_CLICK', sensor);
  },
  getLatLng(lat, lng) {
      return latLng(lat, lng);
  },
  centerUpdate(center) {
    this.currentCenter = center;
  },
  getIcon(active, type) {
    let url = '';
    if(type === sensorTypes.CAMERA) {
      if(active) {
        url = require('../assets/active-camera.png')
      }
      else {
        url = require('../assets/not-active-camera.png')
      }
    }
    else if(type === sensorTypes.SATELLITE) {
      if(active) {
        url = require('../assets/active-satellite.png')
      }
      else {
        url = require('../assets/not-active-satellite.png')
      }
    }
    else if(type === sensorTypes.PLANE) {
      if(active) {
        url = require('../assets/active-plane.png')
      }
      else {
        url = require('../assets/not-active-plane.png')
      }
    }
    return icon({
      iconUrl: url,
      iconSize: [32, 37],
      iconAnchor: [16, 37]
    })
  }
}
};
</script>
