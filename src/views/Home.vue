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
            @click:clear="isSearching = false"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn icon @click="currentLocation">
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
            @click:clear="isSearching = false"
          ></v-text-field>
          <v-spacer></v-spacer>

          <v-btn icon @click="currentLocation">
            <v-icon>my_location</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list color="grey lighten-4" elevation="0" dense flat tile v-show="isSearching">
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

          <v-list-item v-if="candidates == null">
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
      <v-card-text style="position: absolute; bottom: 35%;" class="pa-0" @click="currentLocation">
        <v-fab-transition>
          <v-btn absolute fab top right>
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
      isSearching: false,
      nearby__items: [],
      nearby: "", // Nearby value
      willSearchNearby: false,
      candidates: [], // Represents list of Places returned by search
      nearby_results: [],
      currentPosition: {
        lat: 6.537216,
        lng: 3.3292287999999997
      },
      map: null,
      marker: null,
      markers: [],
      zoom: 15,
      infoWindow: null
      // geocoder: null
    };
  },
  computed: {
    url() {
      var proxyUrl = "https://morning-mountain-19254.herokuapp.com/";
      const API_KEY = "AIzaSyA3pv09p5d-qDmu3cFkcQqcu09SQaKYnDo";
      const RADIUS = `1200`;
      const INPUT_TYPES =
        "textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry";
      const LOCATION_BIAS = `circle:${RADIUS}@${this.currentPosition.lat},${this.currentPosition.lng}`;

      if (this.willSearchNearby) {
        // Serialize url to query
        return (
          proxyUrl +
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
            this.currentPosition.lat
          },${
            this.currentPosition.lng
          }&radius=${RADIUS}&type=${this.nearby.toLowerCase()}&keyword=${
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

      if (marker == null) {
        // If marker == null, create a new marker
        marker = new google.maps.Marker({
          // position: this.currentPosition,
          map: this.map
        });

        this.setMarkerOnMap(geometry);
      }

      // Push to markers array
      this.markers.push(marker);
    },

    setMarkerOnMap(geometry) {
      this.markers.map(marker => {
        if (geometry == null) {
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

    currentLocation() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // this.infoWindow.setPosition(this.currentPosition);
          // this.infoWindow.setContent("Location found.");
          // this.infoWindow.open(this.map);
          // this.infoWindow.setPosition(this.currentPosition);
          // this.clearMarkers();
          this.setMarkerAndPanTo(this.currentPosition, null);

          // Save current location to firestore
          // this.saveCurrentLocation(this.currentPosition);
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

    saveCurrentLocation(position) {
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
        this.isSearching =
          this.searchString == null || this.searchString == "" ? false : true;

        this.get(this.url)
          .then(data => (this.candidates = data.candidates))
          .catch(e => console.log(e));
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
              map: this.map
            });
            this.setMarkerAndPanTo(candidate.geometry.location, newMarker);
            // this.setMarkerOnMap(this.map);
          });
        })
        .catch(e => console.log(e));
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

    getNearbyTypes() {
      this.$firestore
        .collection("defaults")
        .doc("nearby_types")
        .get()
        .then(data => (this.nearby__items = data.data().data));
    }
  },

  mixins: [userMixin],

  mounted() {
    this.startMap();
  },

  created() {
    this.getNearbyTypes();
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

/* @media only screen and (min-width: 320px) and (max-width: 641px) {
  .nearby-selector{
    bottom: 8%;
  }
} */
</style>