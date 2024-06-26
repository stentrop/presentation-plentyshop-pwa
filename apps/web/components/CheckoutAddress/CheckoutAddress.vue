<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <SfButton v-if="!disabled && addresses.length > 0" size="sm" variant="tertiary" @click="edit">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>

    <div v-if="selectedAddress" class="mt-2 md:w-[520px]">
      <AddressDisplay :address="selectedAddress" />
    </div>

    <div class="w-full md:max-w-[520px]" v-if="!disabled && (isAuthorized || addresses.length === 0)">
      <p v-if="addresses.length === 0">{{ description }}</p>
      <SfButton :data-testid="`add-${type}-button`" class="mt-4 w-full md:w-auto" variant="secondary" @click="create">
        {{ buttonText }}
      </SfButton>
    </div>

    <UiModal
      v-if="!disabled"
      v-model="isOpen"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
          <SfIconClose />
        </SfButton>
        <h3 id="address-modal-title" class="text-neutral-900 text-lg md:text-2xl font-bold mb-4">
          {{ heading }}
        </h3>
      </header>
      <AddressForm
        :countries="activeShippingCountries"
        :saved-address="
          editMode ? addresses.find((address) => address.id?.toString() === selectedAddress?.id?.toString()) : undefined
        "
        :type="type"
        @on-save="saveAddress"
        @on-close="close"
      />
    </UiModal>
  </div>
</template>
<script setup lang="ts">
import { type Address, AddressType } from '@plentymarkets/shop-api';
import { cartGetters, userAddressGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';
import type { CheckoutAddressProps } from '~/components/CheckoutAddress/types';

const { isOpen, open, close } = useDisclosure();
const { isAuthorized } = useCustomer();
const { saveAddress: saveBillingAddress } = useAddress(AddressType.Billing);
const { saveAddress: saveShippingAddress } = useAddress(AddressType.Shipping);
const { data: activeShippingCountries, getActiveShippingCountries } = useActiveShippingCountries();
const props = withDefaults(defineProps<CheckoutAddressProps>(), {
  disabled: false,
});
const { data: cart } = useCart();
const editMode = ref(false);

const cartAddress = computed(() =>
  props.type === AddressType.Billing
    ? cartGetters.getCustomerInvoiceAddressId(cart.value)
    : cartGetters.getCustomerShippingAddressId(cart.value),
);

const selectedAddress = computed(
  () =>
    props.addresses.find((address) => userAddressGetters.getId(address) === cartAddress?.value?.toString()) ??
    ({} as Address),
);

const emit = defineEmits(['on-saved']);

getActiveShippingCountries();

const create = () => {
  editMode.value = false;
  open();
};

const edit = () => {
  editMode.value = true;
  open();
};

const saveAddress = async (address: Address, useAsShippingAddress: boolean = false) => {
  if (props.type === AddressType.Billing) {
    await saveBillingAddress(address);
  }
  if (props.type === AddressType.Shipping || useAsShippingAddress) {
    await saveShippingAddress(address);
  }
  emit('on-saved');
  close();
};
</script>
