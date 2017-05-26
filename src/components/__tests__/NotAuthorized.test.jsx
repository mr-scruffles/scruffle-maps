import React from 'react';
import { shallow } from 'enzyme';
import NotAuthorized from '../NotAuthorized';

describe('NotAuthorized', () => {
  let wrapper;
  it('finds the component with class not-authorized', () => {
    wrapper = shallow(<NotAuthorized />);
    expect(wrapper.find({ 'data-test': 'not-authorized' }).length).toEqual(1);
  });
});
