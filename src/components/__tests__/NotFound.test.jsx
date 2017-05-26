import React from 'react';
import { shallow } from 'enzyme';
import NotFound from '../NotFound';

describe('NotFound', () => {
  let wrapper;
  it('finds a single instance of not found.', () => {
    wrapper = shallow(<NotFound />);
    expect(wrapper.find({ 'data-test': 'not-found' }).length).toEqual(1);
  });
});
