import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/main/App';
import LoginPage from './components/container/LoginPage';
import LogoutPage from './components/container/LogoutPage';
import TasksPage from './components/container/TasksPage';
import ProcessInstancesPage from './components/container/ProcessInstancesPage';
import PickedProcessInstancePage from './components/container/PickedProcessInstancePage';

export const getRoutes = store => {

  const isAuthenticatedTransition = (targetState, replace) => {
    const state = store.getState();
    if (state.user && state.user.isAuthenticated) {
      replace('/tasks');
    }
  };

  const isNotAuthenticatedTransition = (targetState, replace) => {
    const state = store.getState();
    if (!state.user || !state.user.isAuthenticated) {
      replace('/login');
    }
  };

  const indexTransition = (targetState, replace) => {
    replace('/login');
  };

  return (<Route path="/" component={App}>
    <IndexRoute onEnter={indexTransition} />
    <Route path="login" component={LoginPage} onEnter={isAuthenticatedTransition} />
    <Route path="logout" component={LogoutPage} />
    <Route path="tasks" component={TasksPage} onEnter={isNotAuthenticatedTransition} />
    <Route path="processInstances" component={ProcessInstancesPage} onEnter={isNotAuthenticatedTransition}/>
    <Route path="pickedProcessInstance" component={PickedProcessInstancePage} onEnter={isNotAuthenticatedTransition} />
    <Route path="*" onEnter={indexTransition} />
  </Route>);
};
