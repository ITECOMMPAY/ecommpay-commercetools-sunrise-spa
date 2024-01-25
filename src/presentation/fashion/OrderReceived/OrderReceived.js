import { shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    const orderComplete = shallowRef(false);
    orderComplete.value = true;
    return { t, orderComplete };
  },
};
