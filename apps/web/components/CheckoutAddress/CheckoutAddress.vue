<template>
  <div data-testid="checkout-address" class="md:px-4 py-6">
    <div class="flex justify-between items-center">
      <h2 class="text-neutral-900 text-lg font-bold mb-4">{{ heading }}</h2>
      <SfButton v-if="savedAddress" size="sm" variant="tertiary" @click="open">
        {{ $t('contactInfo.edit') }}
      </SfButton>
    </div>

    <div v-if="savedAddress" class="mt-2 md:w-[520px]">
      <p>{{ `${userAddressGetters.getFirstName(savedAddress)} ${userAddressGetters.getLastName(savedAddress)}` }}</p>
      <p>{{ userAddressGetters.getPhone(savedAddress) }}</p>
      <p>{{ userAddressGetters.getStreetName(savedAddress) }} {{ userAddressGetters.getStreetNumber(savedAddress) }}</p>
      <p>{{ `${userAddressGetters.getProvince(savedAddress)} ${userAddressGetters.getPostCode(savedAddress)}` }}</p>
    </div>

    <div v-else class="w-full md:max-w-[520px]">
      <p>{{ description }}</p>
      <SfButton class="mt-4 w-full md:w-auto" variant="secondary" @click="open">
        {{ buttonText }}
      </SfButton>
    </div>

    <UiOverlay v-if="isOpen" :visible="isOpen">
      <SfModal
        v-model="isOpen"
        as="section"
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
        <AddressForm :saved-address="savedAddress" :type="type" @on-save="close" @on-close="close" />
      </SfModal>
    </UiOverlay>
  </div>
</template>
<script lang="ts" setup>
import { SfButton, SfIconClose, SfModal, useDisclosure } from '@storefront-ui/vue';
import type { CheckoutAddressProps } from './types';
import { userAddressGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';

defineProps<CheckoutAddressProps>();

const { isOpen, open, close } = useDisclosure();
</script>