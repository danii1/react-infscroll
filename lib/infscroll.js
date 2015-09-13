'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var InfiniteScroll = (function (_React$Component) {
    _inherits(InfiniteScroll, _React$Component);

    function InfiniteScroll(props) {
        _classCallCheck(this, InfiniteScroll);

        _get(Object.getPrototypeOf(InfiniteScroll.prototype), 'constructor', this).call(this, props);
        this.state = { isLoading: false };
    }

    _createClass(InfiniteScroll, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._listen();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._unlisten();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var throttle = nextProps.throttle;
            if (this.props.throttle === throttle) {
                return;
            }
            this._unlisten();
            this._listen(throttle);
        }
    }, {
        key: '_listen',
        value: function _listen(throttle) {
            var _this = this;

            throttle = throttle || this.props.throttle;
            this._scrollHandler = _lodash2['default'].throttle(function () {
                return _this.onScroll();
            }, throttle);
            window.addEventListener('resize', this._scrollHandler);
        }
    }, {
        key: '_unlisten',
        value: function _unlisten() {
            window.removeEventListener('resize', this._scrollHandler);
        }
    }, {
        key: 'onScroll',
        value: function onScroll() {
            var props = this.props;
            if (!props.canGetNext || this.state.isLoading) {
                return;
            }
            var el = _react2['default'].findDOMNode(this);
            var offset = el.scrollTop + el.offsetHeight;
            if (offset + props.threshold < el.scrollHeight) {
                return;
            }
            this.setState({ isLoading: true });
            props.getNext();
        }
    }, {
        key: 'renderLoading',
        value: function renderLoading() {
            return this.state.isLoading ? this.props.loadingEl : '';
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { style: this.props.style, onScroll: this._scrollHandler },
                this.props.children,
                this.renderLoading()
            );
        }
    }]);

    return InfiniteScroll;
})(_react2['default'].Component);

InfiniteScroll.propTypes = {
    canGetNext: _react2['default'].PropTypes.bool.isRequired,
    getNext: _react2['default'].PropTypes.func.isRequired,
    threshold: _react2['default'].PropTypes.number,
    throttle: _react2['default'].PropTypes.number,
    loadingEl: _react2['default'].PropTypes.element,
    style: _react2['default'].PropTypes.object,
    children: _react2['default'].PropTypes.node
};

InfiniteScroll.defaultProps = {
    threshold: 1000,
    throttle: 250,
    style: {
        overflow: 'auto',
        height: '500px'
    }
};

exports['default'] = InfiniteScroll;
module.exports = exports['default'];