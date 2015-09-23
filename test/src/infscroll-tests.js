/*  eslint no-unused-expressions:0  */

'use strict';

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const InfScroll = require('../../src/infscroll');

describe('infscroll', () => {
    it('should not have a loading state upon initialisation', () => {
        const infScroll = TestUtils.renderIntoDocument(<InfScroll/>);
        infScroll.state.isLoading.should.be.false;
    });
});
