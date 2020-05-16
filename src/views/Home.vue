<template>
  <div>
    <v-navigation-drawer app v-model="drawer" color="primary" class="d-lg-none d-md-flex">
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="false && 'px-0'">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Guest</v-list-item-title>
            <v-list-item-subtitle>ejike.br@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>account_circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Preferences</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="signOut" v-show="false">
          <v-list-item-icon>
            <v-icon v-text="'$logout'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div>
      <v-container fluid style="position: absolute" class="search-bar">
        <!-- View on Small/Tablet Screens only -->
        <v-toolbar class="hidden-lg-and-up" elevation="1" dense flat>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
          <v-text-field
            hide-details
            prepend-icon="search"
            style="width:100%"
            single-line
            clearable
            v-model="searchString"
            @keyup="findPlace()"
            @keydown.enter="findPlace()"
            @click:clear="isTyping = false"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn icon @click="userLocation">
            <v-icon>my_location</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- View on Large Screens only -->
        <v-toolbar class="hidden-md-and-down" elevation="1" dense flat>
          <v-text-field
            hide-details
            prepend-icon="search"
            style="width:100%"
            single-line
            clearable
            v-model="searchString"
            @keyup="findPlace()"
            @keydown.enter="findPlace()"
            @click:clear="isTyping = false"
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-btn icon @click="userLocation">
            <v-icon>my_location</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list color="grey lighten-4" elevation="0" dense flat tile v-show="isTyping">
          <v-list-item
            v-for="(item, index) in candidates"
            :key="index+item.name"
            @click="setMarkerAndPanTo(item.geometry.location, null)"
            ripple
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.formatted_address"></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-content style="display: block">
              <v-rating
                v-model="item.rating"
                :length="5"
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                half-icon="mdi-star-half-full"
                :readonly="true"
                :size="23"
                dense
                color="red lighten-1"
                background-color="grey lighten-1"
                style="float:right; right: 0px;"
              ></v-rating>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-show="isTyping && (responseError == null || responseError == '')">
            <v-list-item-content>
              <v-progress-linear indeterminate color="teal"></v-progress-linear>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-show="candidates == null && (responseError != null || responseError != '')">
            <v-list-item-content>
              <v-list-item-title>No Results found!</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>

      <!-- Map -->
      <v-card-text
        style="height: 100%; position: absolute"
        ref="map"
        class="map"
        :class="`d-flex align-stretch`"
      />

      <!-- My Location Icon -->
      <v-card-text class="pa-0 my-location">
        <v-slider
          v-model="radius.current"
          height="20"
          step="50"
          :min="radius.min"
          :max="radius.max"
          ticks
          dense
          vertical
          thumb-label
          class="radius-slider"
          thumb-color="#e60000"
          track-fill-color="#e60000"
          track-color="secondary"
        ></v-slider>
        <v-fab-transition>
          <v-btn absolute fab top right @click="userLocation">
            <v-icon>my_location</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-text>

      <v-list-item class="nearby-selector px-0">
        <v-autocomplete
          :items="nearby__items"
          color="white"
          label="Nearby"
          placeholder="Start searching nearby..."
          flat
          cache-items
          solo
          clearable
          :search-input.sync="nearby"
        ></v-autocomplete>
      </v-list-item>
    </div>
  </div>
</template>

<script>
import userMixin from "@/foundation/user-mixin";

export default {
  name: "Home",
  data() {
    return {
      // lng: 3.207347,
      // lat: 6.474986,
      searchString: "",
      isTyping: false, // Checks if user is typing
      nearby__items: [], // Place types retrieved from firestore
      nearby: "", // Nearby value
      willSearchNearby: false, // Determines if search should be performed nearby
      candidates: [], // Represents list of Places returned by search
      nearby_results: [], // Reaults received from selecting a Place type [e.g hospital, airport]
      responseError: null,
      currentPosition: {
        // Current Marker Position
        lat: 6.537216,
        lng: 3.3292287999999997
      },
      radius: {},
      map: null, // Map instance
      markers: [], // List of Markers on Map instance
      zoom: 14, // Zoom level
      infoWindow: null
      // geocoder: null
    };
  },
  computed: {
    url() {
      var proxyUrl = "https://morning-mountain-19254.herokuapp.com/";
      const API_KEY = process.env.VUE_APP_PLACES_KEY;
      var radius = this.radius.current.toString();
      const INPUT_TYPES =
        "textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry";
      const LOCATION_BIAS = `circle:${radius}@${this.currentPosition.lat},${this.currentPosition.lng}`;

      if (this.willSearchNearby) {
        // Serialize url to query
        return (
          proxyUrl +
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
            this.currentPosition.lat
          },${this.currentPosition.lng}&radius=${"" +
            radius}&type=${this.nearby.toLowerCase()}&keyword=${
            this.searchString
          }&key=${API_KEY}`
        );
      } else {
        return (
          proxyUrl +
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            this.searchString
          )}&inputtype=${INPUT_TYPES}&locationbias=${LOCATION_BIAS}&key=${API_KEY}`
        );
      }
    }
  },
  watch: {
    nearby(value) {
      // Set willSearchNearby == true - This will determine whether to search nearby or anywhere
      this.willSearchNearby = value == null || value == "" ? false : true;

      // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
      // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=6.537216,3.3292287999999997&radius=1200&type=School&keyword=&key=AIzaSyA3pv09p5d-qDmu3cFkcQqcu09SQaKYnDo

      if (this.nearby__items.includes(value)) this.findNearby();
    }
  },
  methods: {
    signOut() {
      this.$firebase
        .auth()
        .signOut()
        .catch(e => console.log(e));
    },

    startMap() {
      this.map = new google.maps.Map(this.$refs["map"], {
        zoom: this.zoom,
        center: this.currentPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.infoWindow = new google.maps.InfoWindow({ map: this.map });
    },

    setMarkerAndPanTo(geometry, marker) {
      this.map.setCenter(geometry);
      this.map.panTo(geometry);

      // Set as current position (whatever geometry coming in)
      this.currentPosition = {
        lat: geometry.lat,
        lng: geometry.lng
      };

      if (marker == null) {
        // If marker == null, create a new marker
        marker = new google.maps.Marker({
          position: geometry,
          draggable: true,
          animation: google.maps.Animation.DROP,
          map: this.map
        });
      }

      marker.addListener("click", () => {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      });

      // Push to markers array
      this.markers.push(marker);

      // Set marker on map
      this.setMarkerOnMap(geometry);

      this.isTyping = false;
    },

    setMarkerOnMap(geometry) {
      this.markers.map(marker => {
        if (geometry == null) {
          marker.setAnimation(null);
          marker.setMap(null);
          return;
        }
        marker.setPosition(new google.maps.LatLng(geometry.lat, geometry.lng));
      });
    },

    clearMarkers() {
      this.setMarkerOnMap(null);
      this.markers = [];
    },

    userLocation() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.clearMarkers();
          this.setMarkerAndPanTo(this.currentPosition, null);

          // Save current location to firestore
          // this.saveUserLocation(this.currentPosition);
        },
        error => {
          this.handleLocationError(true, this.infoWindow, this.map.getCenter());
        }
      );
      if (!navigator.geolocation) {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, this.infoWindow, this.map.getCenter());
        return;
      }
    },

    saveUserLocation(position) {
      console.log(`Current Position, `, position);
      this.$firestore
        .collection("users")
        .doc(this.user.uid)
        .set(
          { latitude: position.lat, longitude: position.lng, active: true },
          { merge: true }
        );
    },

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
    },

    findPlace() {
      this.$nextTick(() => {
        // Pop search outputs
        this.isTyping =
          this.searchString == null || this.searchString == "" ? false : true;

        this.get(this.url)
          .then(data => (this.candidates = data.candidates))
          .catch(e => this.responseError = e);
        // Museum of Contemporary Art Australia
      });
    },

    findNearby() {
      this.get(this.url)
        .then(data => {
          var results = data.results;
          this.clearMarkers();
          results.forEach(candidate => {
            var newMarker = new google.maps.Marker({
              position: candidate.geometry.location,
              // label: labels[labelIndex++ % labels.length],
              map: this.map
            });
            // Pan map
            this.map.panTo(candidate.geometry.location);
            // Push to Markers array
            this.markers.push(newMarker);
          });
          // Zoom out map
          this.map.setZoom(11);
        })
        .catch(e => this.responseError = e);
    },

    get(url) {
      var x = new XMLHttpRequest();
      x.open("GET", url);
      x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      x.setRequestHeader("Access-Control-Allow-Origin", "*");
      return new Promise((resolve, reject) => {
        // do some async task
        x.onload = () => {
          let data = JSON.parse(x.response);
          if (data.status != "OK") reject(data.status);
          resolve(data);
        };
        x.send();
      });
    },

    getDefaults() {
      this.$firestore
        .collection("defaults")
        .doc("nearby_types")
        .get()
        .then(data => {
          this.nearby__items = data.data().place_types;
          this.radius = data.data().radius;
        });
    },

    droppedPin(map, location) {
      //
    }
  },

  mixins: [userMixin],

  mounted() {
    this.startMap();
  },

  created() {
    this.getDefaults();
  }
};
</script>

<style scoped>
.map {
  flex-grow: 1;
  height: 80%;
}
.search-bar {
  z-index: 3;
}
.nearby-selector {
  position: absolute;
  bottom: 0%;
  right: 0;
  z-index: 4;
  margin-right: 10% !important;
}
.my-location {
  position: absolute;
  bottom: 35%;
  width: auto;
  right: 0px;
}
.radius-slider {
  margin-right: 100px;
}
/* @media only screen and (min-width: 320px) and (max-width: 641px) {
  .nearby-selector{
    bottom: 8%;
  }
} */
</style>