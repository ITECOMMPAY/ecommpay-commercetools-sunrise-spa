import { onMounted, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const paymentMethods = [
  {
    name: 'ecommpay-',
    description: 'ecommpay',
    image: 'ecommpay',
  },
  {
    name: 'ecommpay-paypal-wallet',
    description: 'ecommpay',
    image: 'ecommpay-paypal',
  }
];
export default {
  props: {
    paymentMethod: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    onMounted(() => emit('card-paid'));
    const pm = shallowRef(props.paymentMethod);
    const { t } = useI18n();
    watch(pm, (pm) => {
      emit('payment-changed', pm);
    });
    const getImgUrl = (name) => {
      var images = require.context(
        'presentation/assets/img/',
        false,
        /\.png$/
      );
      return images(`./${name}.png`);
    };

    return { pm, t, paymentMethods, getImgUrl };
  },
};
