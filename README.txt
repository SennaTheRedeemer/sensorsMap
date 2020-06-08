EyeMap - Rosh Ha-EYE-in Team
© Ofir Bar Yacov Norani

Component Props: 
- Sensors: Object Array
- MapCenter: Object

Sensors: 
Sensor object :
  lng - number (longitude)
  lat - number (latitude)
  text - string (text to display on tooltip [on hover])
  type - number out of sensorTypes enum. - you need to have provided icons in asset directory.
  const sensorTypes = {
	PLANE: 0,
	SATELLITE: 1,
	CAMERA: 2,
	}
  active - boolean
  id - Unique ID (Create a unique ID to each sensor)
  
  active 
  type
  
  for example: 
  [
        {
          lat: 32.109333,
          lng: 34.855499,
          text: 'wrg',
          id: 0,
          type: sensorTypes.PLANE,
          active: true
        },
        {
          lat: 32.119333,
          lng: 34.856499,
          text: 'ttt',
          id: 1,
          type: sensorTypes.SATELLITE,
          active: true
        },
        {
          lat: 32.109433,
          lng: 34.865499,
          text: 'text',
          id: 2,
          type: sensorTypes.CAMERA,
          active: false
        }
      ],

MapCenter: 
	An Object representing the default center of the map. 
	Attributes: 
		MapCenterLat - number
		MapCenterLng - number
	For example: 
		mapCenter: {
			MapCenterLat: 32.109333,
			MapCenterLng: 34.855499,
		}
	
Style: 
	You can controll the component's height and width using a simple style tag. 
	For example: 
	<EyeMap :Sensors="sensors" :MapCenter="mapCenter" style="height: 600px; width: 100%"/>

Features: 
	3 Main Polygons representing the south, center and north of Israel. 
	can be showed by clicking the bottom navigator buttons.
	
	An option to view latlng point on the map using the bottom navigator simple inputs.

	Display another topographic map using the top - right button.
