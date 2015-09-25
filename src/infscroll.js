'use strict';

import React from 'react';
import _ from 'lodash';

class InfiniteScroll extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false };
        this.watch();
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
        this.watch(throttle);
    }
    watch(throttle){
        throttle = throttle || this.props.throttle;
        if(throttle === 0){ this._onScroll = this.onScroll.bind(this); }
        else { this._onScroll = _.throttle(() => this.onScroll(), throttle); }
    }
    _listen(throttle){
        window.addEventListener('resize', this._onScroll);
        window.addEventListener('load', this._onScroll);
    }
    _unlisten(){
        window.removeEventListener('resize', this._onScroll);
        window.removeEventListener('load', this._onScroll);
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
        const style = this._styles();
        return (
            <div style={style} onScroll={this._onScroll} ref="scroller">
                {this.props.children}
                {this.renderLoading()}
            </div>
        );
    }
    _styles(){
        const style = this.props.style || {};
        const scroll = this._scrollStyle();
        const styles = _.extend({}, scroll, style);
        return styles;
    }
    _scrollStyle(){
        return {
            overflow: this.props.overflow,
            height: this.props.height
        }    
    }
}

InfiniteScroll.propTypes = {
    canGetNext: React.PropTypes.bool,
    getNext: React.PropTypes.func,
    height: React.PropTypes.number,
    overflow: React.PropTypes.string,
    threshold: React.PropTypes.number,
    throttle: React.PropTypes.number,
    loadingEl: React.PropTypes.element,
    style: React.PropTypes.object,
    children: React.PropTypes.node
};

InfiniteScroll.defaultProps = {
    threshold: 1000,
    throttle: 0,
    height: 500,
    overflow: 'auto'
};

export default InfiniteScroll;
