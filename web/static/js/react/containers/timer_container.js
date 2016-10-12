import {connect} from 'react-redux';

import Timer from '../components/timer';

const mapStateToProps = state => ({remainingSeconds: state.gameState.remainingSeconds});

const TimerContainer = connect(mapStateToProps)(Timer);

export default TimerContainer;
