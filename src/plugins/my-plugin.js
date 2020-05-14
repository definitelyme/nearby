import Vue from 'vue';
import mixin from '@/foundation/mixin';

export default Plugin.install = () => {
  Vue.mixin(mixin);
  Vue.directive('focus', {
    inserted: (el) => {
      el.focus();
    }
  });
}