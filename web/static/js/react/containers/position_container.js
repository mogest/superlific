import {connect} from 'react-redux';

import Position from '../components/position';

const mapStateToProps = state => ({data: state.position});

const PositionContainer = connect(mapStateToProps)(Position);

export default PositionContainer;
