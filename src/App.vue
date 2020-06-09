<template>
  <div id="app">
    <EyeMap id="eyeMap" :Sensors="sensors" :MapCenter="mapCenter" style="height: 600px; width: 50%"/>
  </div>
</template>

<script>
import EyeMap from './components/EyeMap'

const sensorTypes = {
PLANE: 0,
SATELLITE: 1,
CAMERA: 2,
}

export default {
  name: 'App',
  components: {
    EyeMap
  },
  data: () => {
    return {
      
      sensors: [
        {
          lat: 32.109333,
          lng: 34.855499,
          text: 'איזור חם',
          id: 0,
          type: sensorTypes.PLANE,
          active: true
        },
        {
          lat: 32.119333,
          lng: 34.856499,
          text: 'כוננות 2',
          id: 1,
          type: sensorTypes.SATELLITE,
          active: true
        },
        {
          lat: 32.109433,
          lng: 34.865499,
          text: 'בסיס צבאי מחנה ידין',
          id: 2,
          type: sensorTypes.CAMERA,
          active: false
        }
      ],
      mapCenter: {
        MapCenterLat: 32.109333,
        MapCenterLng: 34.855499,
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
