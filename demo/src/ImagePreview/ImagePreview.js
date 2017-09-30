import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

const ANIMATION_DURATION = 0.2;
const Scale = 0.92;

function throttle (fun, delay) {
  let tid = null;
  return function() {
    if (!tid) {
      tid = setTimeout(() => {
        fun();
        tid = null;
      }, delay);
    }
  }
}


const styles = {
  containerStyles: {
    cursor: 'zoom-out',
    background: 'rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    transition: `background-color ${ANIMATION_DURATION}s ease-in-out`,
    zIndex: 1001,
  },
  viewStyle: {
    height: '100%',
    overflow: 'auto',
  },
  initStyle: {
    transition: `transform ${ANIMATION_DURATION}s ease-in-out`,
    width: 0,
    height: 0,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto',
  }
}

class ImagePreview extends React.Component {

  constructor() {
    super();
    this.img = null;
    this.state = {
      computedImageState: {},
    }
  }

  componentWillMount () {
    const { imageUrl } = this.props;
    styles.initStyle = {
      ...styles.initStyle,
      ...this.getInitStyles(),
    };
    this.setState({
      computedImageState: styles.initStyle,
    })
    // 为了获取图片的原始尺寸
    if (!this.img) {
      this.img = document.createElement('img');
    }  
    this.img.src = imageUrl;
    this.img.onload = () => {
      this.getComputedStyle();
    }
    // 使用节流函数，防止过度渲染
    window.addEventListener('resize', throttle(() => {
      this.getComputedStyle();
    }, 200));
  }

  getInitStyles () {
    const { imageTarget } = this.props;
    const width = imageTarget.width;
    const height = imageTarget.height;
    const rect = imageTarget.getBoundingClientRect();
    const left = rect.left;
    const top = imageTarget.offsetTop - window.pageYOffset;
    return {
      width,
      height,
      transform: `translate3d(${left}px, ${top}px, 0)`,
    }
  }

  handleImageClick () {
    this.setState({
      computedImageState: {
        ...styles.initStyle,
      }
    }, () => {
      setTimeout( () => {
        imagePreviewSingleton.hide();
      }, ANIMATION_DURATION * 1000 );
    })
  }

  getComputedStyle () {
    // 图片的原始尺寸
    const realWidth = this.img.width;
    const realHeight = this.img.height;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const realRate = realWidth / realHeight;
    let finalWidthScale, finalHeightScale;
    if (realRate > windowWidth / windowHeight) {
      finalWidthScale = (Scale * windowWidth) / styles.initStyle.width;
      finalHeightScale = ((Scale * windowWidth) / realWidth) * realHeight / styles.initStyle.height;
    } else {
      finalHeightScale = (Scale * windowHeight) / styles.initStyle.height;
      finalWidthScale = (Scale * windowHeight) / realHeight * realWidth / styles.initStyle.width;
    }
    const translateX = (windowWidth - this.state.computedImageState.width) / 2;
    const translateY = (windowHeight - this.state.computedImageState.height) / 2;
    this.setState({
      computedImageState: {
        ...this.state.computedImageState,
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale3d(${finalWidthScale}, ${finalHeightScale}, 1)`,
      }
    })
  }

  render () {
    const { imageUrl } = this.props;
    const imageStyle = {
      ...styles.initStyle,
      backgroundImage: `url(${imageUrl})`,
      ...this.state.computedImageState,
    };

    return (
      <div className="image-preview-container" style={styles.containerStyles} onClick={this.handleImageClick.bind(this)}>
        <div className="image-preview" style={styles.viewStyle}>
          <div style={imageStyle}></div>
        </div>    
      </div>
    )
  }
}

ImagePreview.propTypes = {
  imageUrl: PropTypes.string,
  imageTarget: PropTypes.object,
}

export class ImagePreviewSingleton {
  constructor() {
    this.$mountEle = null;
  }

  show (imageUrl, imageTarget) {
    if (!this.$mountEle) {
      this.$mountEle = document.createElement('div');
      document.body.appendChild(this.$mountEle);
    }
    ReactDom.render(<ImagePreview imageUrl={imageUrl} imageTarget={imageTarget}/>, this.$mountEle);
  }

  hide () {
    ReactDom.unmountComponentAtNode(this.$mountEle);
  }
}

const imagePreviewSingleton = new ImagePreviewSingleton();
export { imagePreviewSingleton }