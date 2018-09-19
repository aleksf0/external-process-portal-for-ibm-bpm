import * as types from './actionTypes';
import exposedItemApi from '../api/exposedItemApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

function retrieveSuccess(exposedItems) {
  return {
    type: types.RETRIEVE_EXPOSED_ITEMS_SUCCESS,
    exposedItems
  };
}

function startSuccess(startedExposedItem) {
  return {
    type: types.START_EXPOSED_ITEM_SUCCESS,
    startedExposedItem
  };
}

export function retrieve(user) {

  return function (dispatch) {
    dispatch(beginAjaxCall());
    return exposedItemApi.retrieve(user).then(body => {
      let exposedItems = [];
      if (body.data && body.data.exposedItemsList) {
        exposedItems = body.data.exposedItemsList;
      }
      dispatch(retrieveSuccess(exposedItems));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function start(user, startUrl) {

  return function (dispatch) {
    dispatch(beginAjaxCall());
    return exposedItemApi.start(user, startUrl).then(body => {
      let startedExposedItem = {};
      if (body.data) {
        startedExposedItem = body.data;
      }
      dispatch(startSuccess(startedExposedItem));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}
