import {connect} from 'react-redux';

import Status from '../components/status';

const mapStateToProps = state => ({status: state.status});

const StatusContainer = connect(mapStateToProps)(Status);

export default StatusContainer;

