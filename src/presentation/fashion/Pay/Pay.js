import { shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import useCart from '../../../../composition/useCart';
import useCartTools from '../../../../composition/useCartTools';
import { apolloClient } from '../../../../src/apollo';
import gql from 'graphql-tag';

export default {
  setup() {
    const { t } = useI18n();
    const orderComplete = shallowRef(false);
    const route = useRoute();
    const { cart } = useCart();
    const cartTools = useCartTools();
    const saved = shallowRef(false);

    watch([cart, saved], ([cart, s]) => {
      if (cart && !s) {
        saved.value = true;
        cartTools
          .createMyOrderFromCart({
            method: route.params.method,
            cart,
          })
          .then(async () => {
            const url = await apolloClient
              .query({
                query: gql`
                  query GetCart($id: String!) {
                    cart(id: $id) {
                      id
                      paymentInfo {
                        payments {
                          id
                          amountPlanned {
                            currencyCode
                            centAmount
                          }
                          custom {
                            typeRef {
                              id
                            }
                            customFieldsRaw {
                              name
                              value
                            }
                          }
                        }
                      }
                    }
                  }
                `,
                variables: {
                    id: cart.cartId,
                }
              }).then((result) => {
                console.log(result);
                  return  result.data.cart.paymentInfo.payments[0].custom.customFieldsRaw.find((elem)=>{
                            return elem.name === "pp_url"
                        }).value
              });
            if (route.params.method.includes("ecommpay")){
                location.href = url;
            } else {
              orderComplete.value = true;
            }
          })
          .catch((error) => console.warn('error:', error));
      }
    });

    return { t, orderComplete };
  },
};
