import {connect} from 'react-redux';

import Points from '../components/points';

const mapStateToProps = state => ({points: state.gameState.points});

const PointsContainer = connect(mapStateToProps)(Points);

export default PointsContainer;
