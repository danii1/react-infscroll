/*  eslint no-unused-expressions:0  */

'use strict';

const sinon = require('sinon');
const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const InfScroll = require('../../src/infscroll');

const createTestScrollable = function(options){
    return (
        <InfScroll
            getNext={options.getNext}
            canGetNext={options.canGetNext}
            threshold={options.threshold}
            overflow={options.overflow}
            height={options.height}>
            <div style={{ height: options.contentHeight }}/>
        </InfScroll>
    );
};

const createDomElement = function(){
    var div = document.createElement('div');
    document.body.appendChild(div);
    return div;
};

const removeDomElement = function(element){
    React.unmountComponentAtNode(element);
    element.remove();
};

class MockChild extends React.Component {
    render(){return (<div/>);}
}

class MockLoader extends React.Component {
    render(){return (<div>loading...</div>);}
}

describe('infscroll', () => {
    it('should not be loading on initialisation', () => {
        const infScroll = TestUtils.renderIntoDocument(<InfScroll/>);
        infScroll.state.isLoading.should.be.false;
    });

    it('should listen to the window load and resize events when the component mounts', () => {
        window.addEventListener = sinon.spy();
        const infScroll = TestUtils.renderIntoDocument(<InfScroll/>);
        window.addEventListener.should.be.calledWith('load', infScroll._onScroll);
        window.addEventListener.should.be.calledWith('resize', infScroll._onScroll);
    });

    it('should unlisten to the window load and resize events when the component unmounts', () => {
        window.removeEventListener = sinon.spy();
        const infScroll = TestUtils.renderIntoDocument(<InfScroll/>);
        infScroll.componentWillUnmount();
        window.removeEventListener.should.be.calledWith('load', infScroll._onScroll);
        window.removeEventListener.should.be.calledWith('resize', infScroll._onScroll);
    });

    it('should asynchronously invoke onScroll once via the throttled scroll handler', (done) => {
        const infScroll = TestUtils.renderIntoDocument(<InfScroll throttle={250}/>);
        const onScroll = infScroll.onScroll = done;
        infScroll._onScroll();
    });

    it('should not start loading if there is not get next handler on scroll', () => {
        const infScroll = TestUtils.renderIntoDocument(<InfScroll getNext={null}/>);
        infScroll.onScroll();
        infScroll.state.isLoading.should.be.false;
    });

    it('should not invoke get next handler if it is already loading on scroll', () => {
        const getNext = sinon.spy();
        const infScroll = TestUtils.renderIntoDocument(<InfScroll getNext={getNext}/>);
        infScroll.setState({isLoading: true});
        infScroll.onScroll();
        getNext.should.not.be.called.once;
    });

    it('should invoke get next handler if the scroll is over threshold', () => {
        const getNext = sinon.spy();
        const threshold = 100;
        const el = createDomElement();
        var infScroll = React.render(createTestScrollable({
            getNext: getNext,
            canGetNext: true,
            threshold: threshold,
            height: 100,
            contentHeight: 900
        }), el);
        const node = React.findDOMNode(infScroll);
        node.scrollTop = 825;
        TestUtils.Simulate.scroll(node, { target: node });
        removeDomElement(el);
        getNext.should.be.called;
    });

    it('should not invoke get next handler if the scroll is not over threshold', () => {
        const getNext = sinon.spy();
        const threshold = 100;
        const el = createDomElement();
        var infScroll = React.render(createTestScrollable({
            getNext: getNext,
            canGetNext: true,
            threshold: threshold,
            height: 100,
            contentHeight: 900
        }), el);
        const node = React.findDOMNode(infScroll);
        node.scrollTop = 25;
        TestUtils.Simulate.scroll(node, { target: node });
        removeDomElement(el);
        getNext.should.not.be.called;
    });

    it('should set the correct scroller properties from props', () => {
        const height = 100;
        const overflow = 'auto';
        const infScroll = TestUtils.renderIntoDocument(createTestScrollable({
            height: height,
            overflow: overflow
        }));
        const scroller = infScroll.refs.scroller;
        scroller.props.style.height.should.equal(height);
        scroller.props.style.overflow.should.equal(overflow);
    });

    it('should set overflow as auto by default', () => {
        const infScroll = TestUtils.renderIntoDocument(<InfScroll/>);
        const scroller = infScroll.refs.scroller;
        scroller.props.style.overflow.should.equal('auto');
    });

    it('should render children', () => {
        const child = <MockChild/>
        const infScroll = TestUtils.renderIntoDocument(<InfScroll>{child}</InfScroll>);
        TestUtils.findRenderedComponentWithType(infScroll, MockChild).should.exist;
    });

    it('should render the loader when it is loading', () => {
        const loader = <MockLoader/>;
        const infScroll = TestUtils.renderIntoDocument(
            <InfScroll loadingEl={loader}/>
        );
        infScroll.setState({ isLoading: true });
        TestUtils.findRenderedComponentWithType(infScroll, MockLoader).should.exist;
    });

    it('should not render the loader when it has finished loading', () => {
        const loader = <MockLoader/>;
        const infScroll = TestUtils.renderIntoDocument(
            <InfScroll loadingEl={loader}/>
        );
        infScroll.setState({ isLoading: true });
        infScroll.setState({ isLoading: false });
        TestUtils.scryRenderedComponentsWithType(infScroll, MockLoader).should.be.empty;
    });

    it('should not render the loader when it has finished loading', () => {
        const loader = <MockLoader/>;
        const infScroll = TestUtils.renderIntoDocument(
            <InfScroll loadingEl={loader}/>
        );
        infScroll.setState({ isLoading: true });
        infScroll.setState({ isLoading: false });
        TestUtils.scryRenderedComponentsWithType(infScroll, MockLoader).should.be.empty;
    });

    it('should set the overflow and height within the style context if not already explicitly set', () => {
        const styles = { width: 100, backgroundColor: 'red' };
        const height = 100;
        const overflow = 'auto';
        const infScroll = TestUtils.renderIntoDocument(
            <InfScroll
                height={height}
                overflow={overflow}
                style={styles}
            />
        );
        const scroller = infScroll.refs.scroller;
        scroller.props.style.overflow.should.equal(overflow);
        scroller.props.style.height.should.equal(height);
    });

    it('should not overwrite the overflow and height within the style context if already explicitly set', () => {
        const styles = { height: 300, overflow: 'scroll', width: 100, backgroundColor: 'red' };
        const height = 100;
        const overflow = 'auto';
        const infScroll = TestUtils.renderIntoDocument(
            <InfScroll
                height={height}
                overflow={overflow}
                style={styles}
            />
        );
        const scroller = infScroll.refs.scroller;
        scroller.props.style.overflow.should.equal(styles.overflow);
        scroller.props.style.height.should.equal(styles.height);
    });
});
