import React from 'react';

import GridContainer from '../containers/grid_container';
import Sidebar from './sidebar';

export default function Application({state}) {
  return (
    <section className={'game ' + state}>
      <Sidebar />
      <GridContainer />
    </section>
  );
};
