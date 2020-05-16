import Vue from 'vue';
import mixin from '@/foundation/mixin';
import helper from '@/foundation/helper';

export default Plugin.install = () => {
  Vue.mixin(mixin);
  Vue.prototype.$helper = helper;
  Vue.directive('focus', {
    inserted: (el) => {
      el.focus();
    }
  });
}