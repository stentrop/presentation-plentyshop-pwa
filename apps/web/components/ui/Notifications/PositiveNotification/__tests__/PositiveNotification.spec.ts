import { mount } from '@vue/test-utils';
import PositiveNotification from '../PositiveNotification.vue';

describe('<PositiveNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(PositiveNotification, {
      props: {
        notification: {
            message: 'Test alert positive',
            type: 'positive',
            persist: true,
            action: {
              text: 'action',
              onClick: () => {},
            }
        },
      },
    });

    expect(wrapper.getByTestId('PositiveNotification'));    
  });
});