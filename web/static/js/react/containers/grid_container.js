import {connect} from 'react-redux';

import Grid from '../components/grid';

import {
  touchStarted, touchMoved, touchEnded, mouseDown, mouseMove, mouseUp
} from '../actions/touch_and_mouse_events';

const mapStateToProps = state => ({
  grid: state.gameState.grid,
  selection: state.selection,
});

const mapDispatchToProps = dispatch => ({
  onTouchStart: event => dispatch(touchStarted(event)),
  onTouchMove:  event => dispatch(touchMoved(event)),
  onTouchEnd:   event => dispatch(touchEnded(event)),
  onMouseDown:  event => dispatch(mouseDown(event)),
  onMouseMove:  event => dispatch(mouseMove(event)),
  onMouseUp:    event => dispatch(mouseUp(event)),
});

const GridContainer = connect(mapStateToProps, mapDispatchToProps)(Grid);

export default GridContainer;
