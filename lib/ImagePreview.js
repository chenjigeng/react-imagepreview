'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imagePreviewSingleton = exports.ImagePreviewSingleton = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ANIMATION_DURATION = 0.2;
var Scale = 0.92;

function throttle(fun, delay) {
  var tid = null;
  return function () {
    if (!tid) {
      tid = setTimeout(function () {
        fun();
        tid = null;
      }, delay);
    }
  };
}

var styles = {
  containerStyles: {
    cursor: 'zoom-out',
    background: 'rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    transition: 'background-color ' + ANIMATION_DURATION + 's ease-in-out',
    zIndex: 1001
  },
  viewStyle: {
    height: '100%',
    overflow: 'auto'
  },
  initStyle: {
    transition: 'transform ' + ANIMATION_DURATION + 's ease-in-out',
    width: 0,
    height: 0,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto'
  }
};

var ImagePreview = function (_React$Component) {
  _inherits(ImagePreview, _React$Component);

  function ImagePreview() {
    _classCallCheck(this, ImagePreview);

    var _this = _possibleConstructorReturn(this, (ImagePreview.__proto__ || Object.getPrototypeOf(ImagePreview)).call(this));

    _this.img = null;
    _this.state = {
      computedImageState: {}
    };
    _this.handleResize = throttle(function () {
      _this.getComputedStyle();
    }, 200);
    return _this;
  }

  _createClass(ImagePreview, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var imageUrl = this.props.imageUrl;

      styles.initStyle = _extends({}, styles.initStyle, this.getInitStyles());
      this.setState({
        computedImageState: styles.initStyle
      });
      // 为了获取图片的原始尺寸
      if (!this.img) {
        this.img = document.createElement('img');
      }
      this.img.src = imageUrl;
      this.img.onload = function () {
        _this2.getComputedStyle();
      };
      // 使用节流函数，防止过度渲染
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
  }, {
    key: 'getInitStyles',
    value: function getInitStyles() {
      var imageTarget = this.props.imageTarget;

      var width = imageTarget.width;
      var height = imageTarget.height;
      var rect = imageTarget.getBoundingClientRect();
      var left = rect.left;
      var top = imageTarget.offsetTop - window.pageYOffset;
      return {
        width: width,
        height: height,
        transform: 'translate3d(' + left + 'px, ' + top + 'px, 0)'
      };
    }
  }, {
    key: 'handleImageClick',
    value: function handleImageClick() {
      this.setState({
        computedImageState: _extends({}, styles.initStyle)
      }, function () {
        setTimeout(function () {
          imagePreviewSingleton.hide();
        }, ANIMATION_DURATION * 1000);
      });
    }
  }, {
    key: 'getComputedStyle',
    value: function getComputedStyle() {
      // 图片的原始尺寸
      var realWidth = this.img.width;
      var realHeight = this.img.height;
      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var realRate = realWidth / realHeight;
      var finalWidthScale = void 0,
          finalHeightScale = void 0;
      if (realRate > windowWidth / windowHeight) {
        finalWidthScale = Scale * windowWidth / styles.initStyle.width;
        finalHeightScale = Scale * windowWidth / realWidth * realHeight / styles.initStyle.height;
      } else {
        finalHeightScale = Scale * windowHeight / styles.initStyle.height;
        finalWidthScale = Scale * windowHeight / realHeight * realWidth / styles.initStyle.width;
      }
      var translateX = (windowWidth - this.state.computedImageState.width) / 2;
      var translateY = (windowHeight - this.state.computedImageState.height) / 2;
      this.setState({
        computedImageState: _extends({}, this.state.computedImageState, {
          transform: 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale3d(' + finalWidthScale + ', ' + finalHeightScale + ', 1)'
        })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var imageUrl = this.props.imageUrl;

      var imageStyle = _extends({}, styles.initStyle, {
        backgroundImage: 'url(' + imageUrl + ')'
      }, this.state.computedImageState);

      return _react2.default.createElement(
        'div',
        { className: 'image-preview-container', style: styles.containerStyles, onClick: this.handleImageClick.bind(this) },
        _react2.default.createElement(
          'div',
          { className: 'image-preview', style: styles.viewStyle },
          _react2.default.createElement('div', { style: imageStyle })
        )
      );
    }
  }]);

  return ImagePreview;
}(_react2.default.Component);

ImagePreview.propTypes = {
  imageUrl: _propTypes2.default.string,
  imageTarget: _propTypes2.default.object
};

var ImagePreviewSingleton = exports.ImagePreviewSingleton = function () {
  function ImagePreviewSingleton() {
    _classCallCheck(this, ImagePreviewSingleton);

    this.$mountEle = null;
  }

  _createClass(ImagePreviewSingleton, [{
    key: 'show',
    value: function show(imageUrl, imageTarget) {
      if (!this.$mountEle) {
        this.$mountEle = document.createElement('div');
        document.body.appendChild(this.$mountEle);
      }
      _reactDom2.default.render(_react2.default.createElement(ImagePreview, { imageUrl: imageUrl, imageTarget: imageTarget }), this.$mountEle);
    }
  }, {
    key: 'hide',
    value: function hide() {
      _reactDom2.default.unmountComponentAtNode(this.$mountEle);
    }
  }]);

  return ImagePreviewSingleton;
}();

var imagePreviewSingleton = new ImagePreviewSingleton();
exports.imagePreviewSingleton = imagePreviewSingleton;
//# sourceMappingURL=ImagePreview.js.map