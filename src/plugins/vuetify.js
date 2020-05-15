import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import { mdiLocationExit } from '@mdi/js';
import { mdiMapSearch } from '@mdi/js';

Vue.use(Vuetify);

const options = {
  icons: {
    values: {
      logout: mdiLocationExit,
      mapSearch: mdiMapSearch
    }
  },
};

export default new Vuetify(options);