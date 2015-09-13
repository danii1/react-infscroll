'use strict';

import React from 'react';
import _ from 'lodash';

class InfiniteScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false };
    }
    componentDidMount(){
        this._listen();
    }
    componentWillUnmount(){
        this._unlisten();
    }
    componentWillReceiveProps(nextProps){
        const throttle = nextProps.throttle;
        if(this.props.throttle === throttle){ return; }
        this._unlisten();
        this._listen(throttle);
    }
    _listen(throttle){
        throttle = throttle || this.props.throttle;
        this._scrollHandler = _.throttle(() => this.onScroll(), throttle);
        window.addEventListener('resize', this._scrollHandler);
    }
    _unlisten(){
        window.removeEventListener('resize', this._scrollHandler);
    }
    onScroll(){
        let props = this.props;
        if(!props.canGetNext || this.state.isLoading){ return; }
        let el = React.findDOMNode(this);
        let offset = el.scrollTop + el.offsetHeight;
        if(offset + props.threshold < el.scrollHeight){ return; }
        this.setState({ isLoading: true });
        props.getNext();
    }
    renderLoading(){
        return this.state.isLoading ? this.props.loadingEl : '';
    }
    render(){
        return (
            <div style={this.props.style} onScroll={this._scrollHandler}>
                {this.props.children}
                {this.renderLoading()}
            </div>
        );
    }
}

InfiniteScroll.propTypes = {
    canGetNext: React.PropTypes.bool.isRequired,
    getNext: React.PropTypes.func.isRequired,
    threshold: React.PropTypes.number,
    throttle: React.PropTypes.number,
    loadingEl: React.PropTypes.element,
    style: React.PropTypes.object,
    children: React.PropTypes.node
};

InfiniteScroll.defaultProps = {
    threshold: 1000,
    throttle: 250,
    style: {
        overflow: 'auto',
        height: '500px'
    }
};

export default InfiniteScroll;
