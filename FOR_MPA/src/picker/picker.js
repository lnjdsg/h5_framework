/**
 * Created by 六年级的时光 on 2023/4/13.
 */
import React, { Component } from 'react';
import './picker.less';

class PickerColumn extends Component {
  reference = React.createRef();
  constructor(props) {
    super(props);
    this.initProps = props
    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      activeIndex: 0,
      ...this.computeTranslate(props)
    };
  }

  componentDidMount() {
    this.reference.current.addEventListener('wheel', this.handleWheel);
    this.reference.current.addEventListener('touchmove', this.handleTouchMove);
    this.reference.current.addEventListener('touchstart', this.handleTouchStart);
    this.reference.current.addEventListener('touchend', this.handleTouchEnd);
    this.reference.current.addEventListener('touchcancel', this.handleTouchCancel);
  }

  componentWillUnmount() {
    this.reference.current.removeEventListener('wheel', this.handleWheel);
    this.reference.current.removeEventListener('touchmove', this.handleTouchMove);
    this.reference.current.removeEventListener('touchstart', this.handleTouchStart);
    this.reference.current.removeEventListener('touchend', this.handleTouchEnd);
    this.reference.current.removeEventListener('touchcancel', this.handleTouchCancel);
  }

  componentDidUpdate(nextProps) {

  }

  computeTranslate = (props) => {
    const { options, value, itemHeight, columnHeight } = props;
    let selectedIndex = options.indexOf(value);
    console.log("selectedIndex:", selectedIndex)
    if (selectedIndex < 0) {
      this.onValueSelected(options[0]);
      selectedIndex = 0;
    }

    return {
      scrollerTranslate: columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight - 10,
      minTranslate: columnHeight / 2 - itemHeight * options.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

  onValueSelected = (newValue) => {
    this.props.onChange(this.props.name, newValue);
  };

  handleWheel = (event) => {
    const {
      itemHeight,
      wheel
    } = this.props;

    const {
      scrollerTranslate
    } = this.state;

    var delta = event.deltaY * 0.1;
    if (Math.abs(delta) < itemHeight) {
      delta = itemHeight * Math.sign(delta);
    }

    switch (wheel) {
      case 'natural':
        break;
      case 'normal':
        delta = delta * -1;
        break;
      default:
        return;
    }

    this.onScrollerTranslateSettled(scrollerTranslate + delta);
  };

  handleTouchStart = (event) => {
    const startTouchY = event.targetTouches[0].pageY;
    this.setState(({ scrollerTranslate }) => ({
      startTouchY,
      startScrollerTranslate: scrollerTranslate
    }));
  };

  safePreventDefault = (event) => {
    const passiveEvents = ['onTouchStart', 'onTouchMove', 'onWheel'];
    if (!passiveEvents.includes(event._reactName)) {
      event.preventDefault();
    }
  }

  onScrollerTranslateSettled = (scrollerTranslate) => {
    const {
      options,
      itemHeight
    } = this.props;

    const {
      minTranslate,
      maxTranslate,
    } = this.state;

    let activeIndex = 0;
    if (scrollerTranslate >= maxTranslate) {
      activeIndex = 0;
    } else if (scrollerTranslate <= minTranslate) {
      activeIndex = options.length - 1;
    } else {
      activeIndex = -Math.round((scrollerTranslate - maxTranslate) / itemHeight);
    }
    const { columnHeight } = this.initProps;
    let scrollerTranslate_end = columnHeight / 2 - itemHeight / 2 - activeIndex * itemHeight - 10
    this.setState({
      scrollerTranslate: scrollerTranslate_end
    })
    // console.log('activeIndex:', activeIndex)
    this.onValueSelected(options[activeIndex]);
  }

  handleTouchMove = (event) => {
    this.safePreventDefault(event);
    const touchY = event.targetTouches[0].pageY;
    // console.log('event:', event)
    this.setState(({ isMoving, startTouchY, startScrollerTranslate, minTranslate, maxTranslate }) => {
      if (!isMoving) {
        return {
          isMoving: true
        }
      }

      let nextScrollerTranslate = startScrollerTranslate + touchY - startTouchY;
      // console.log('minTranslate:', minTranslate)
      // console.log('maxTranslate:', maxTranslate)

      if (nextScrollerTranslate < minTranslate) {
        nextScrollerTranslate = minTranslate - Math.pow(minTranslate - nextScrollerTranslate, 0.5);
        // nextScrollerTranslate = minTranslate - 20
      } else if (nextScrollerTranslate > maxTranslate) {
        nextScrollerTranslate = maxTranslate + Math.pow(nextScrollerTranslate - maxTranslate, 0.1);
        // nextScrollerTranslate = maxTranslate + 20
      }
      // console.log('nextScrollerTranslate:', nextScrollerTranslate)

      let activeIndex = 0;
      const {
        options,
        itemHeight
      } = this.props;
      if (nextScrollerTranslate >= maxTranslate) {
        activeIndex = 0;
      } else if (nextScrollerTranslate <= minTranslate) {
        activeIndex = options.length - 1;
      } else {
        activeIndex = -Math.round((nextScrollerTranslate - maxTranslate) / itemHeight);
      }

      // console.log("activeIndex:", activeIndex)

      return {
        scrollerTranslate: nextScrollerTranslate,
        activeIndex: activeIndex
      };
    });
  };

  handleTouchEnd = (event) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0
    });
    // console.log('handleTouchEnd')

    setTimeout(() => {
      this.onScrollerTranslateSettled(this.state.scrollerTranslate);

    }, 0);
  };

  handleTouchCancel = (event) => {
    if (!this.state.isMoving) {
      return;
    }
    this.setState((startScrollerTranslate) => ({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      scrollerTranslate: startScrollerTranslate
    }));
  };

  handleItemClick = (option) => {
    //先随便写点  todo todo
    // if (option !== this.props.value) {
    //   this.onValueSelected(option);
    // } else {
    //   this.props.onClick(this.props.name, this.props.value);
    // }
  };

  renderItems() {
    const { options, itemHeight } = this.props;
    const { activeIndex } = this.state;
    return options.map((option, index) => {
      let size = 40
      let color = '#999999'
      if (activeIndex == index) {
        size = 40
        color = '#222222'
      }
      if (Math.abs(activeIndex - index) == 1) {
        size = 25
      }
      if (Math.abs(activeIndex - index) == 2) {
        size = 20
      }
      //先这么干吧  后续有精力在慢慢优化这块东西 哎
      let textAlign = 'center'
      let marginLeft = '0px'
      if (option.length > 3) {
        textAlign = 'left'
        marginLeft = "10px"
        size = 20
      }
      const style = {
        marginLeft: marginLeft,
        textAlign: textAlign,
        height: itemHeight + 'px',
        lineHeight: itemHeight + 'px',
        fontSize: size + "px",
        color: color
      };

      const className = `picker-item`;
      return (
        <div
          key={index}
          className={className}
          id={index}
          style={style}
          onClick={() => this.handleItemClick(option)}>{option}
        </div>
      );
    });
  }

  render() {
    const translateString = `translate3d(0, ${this.state.scrollerTranslate}px, 100px)`;
    const style = {
      MsTransform: translateString,
      MozTransform: translateString,
      OTransform: translateString,
      WebkitTransform: translateString,
      transform: translateString
    };
    if (this.state.isMoving) {
      style.transitionDuration = '0ms';
    }
    return (
      <div className="picker-column" ref={this.reference}>
        <div
          className="picker-scroller"
          style={style}
        >
          {this.renderItems()}
        </div>
      </div>
    )
  }
}

export default class Picker extends Component {
  static defaultProps = {
    onClick: () => { },
    itemHeight: 36,
    height: 216,
    wheel: 'natural'
  };

  renderInner() {
    const { optionGroups, valueGroups, itemHeight, height, onChange, onClick, wheel } = this.props;
    const highlightStyle = {
      height: itemHeight,
      marginTop: -(itemHeight / 2)
    };
    const columnNodes = [];
    for (let name in optionGroups) {
      columnNodes.push(
        <PickerColumn
          key={name}
          name={name}
          options={optionGroups?.[name]}
          value={valueGroups?.[name]}
          itemHeight={itemHeight}
          columnHeight={height}
          onChange={onChange}
          onClick={onClick}
          wheel={wheel}
        />
      );
    }
    return (
      <div className="picker-inner">
        {columnNodes}
        <div className="picker-highlight" style={highlightStyle}></div>
      </div>
    );
  }

  render() {
    const style = {
      height: this.props.height
    };

    return (
      <div className="picker-container" style={style}>
        {this.renderInner()}
      </div>
    );
  }
}
