import {connect} from 'react-redux';

import Application from '../components/application';

const mapStateToProps = state => ({
  state: state.gameState.state,
});

const ApplicationContainer = connect(mapStateToProps)(Application);

export default ApplicationContainer;

