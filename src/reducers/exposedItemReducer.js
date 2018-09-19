import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function exposedItemReducer(state = initialState.exposedItems, action) {

  switch (action.type) {
    case types.RETRIEVE_EXPOSED_ITEMS_SUCCESS:
      return [...formatExposedItems(action.exposedItems)];
    default:
      return state;
  }
}

function formatExposedItems(exposedItems) {

  //Deep cloning the exposed items array and initializing relevant display properties
  let exposedItemsForDisplay = initializeExposedItemsForDisplay(exposedItems);

  //Sort by 1. title asc (if service and title is set) or display asc; 2. branchName asc; 3. snapshotCreatedOn desc
  exposedItemsForDisplay.sort(compareExposedItems);

  //Iterate one by one and check if itemID AND branchName changed - if no: put as subitem to previous item, if yes: create new item in array
  exposedItemsForDisplay = nestRelatedExposedItems(exposedItemsForDisplay);

  return exposedItemsForDisplay;
}

function initializeExposedItemsForDisplay(exposedItems) {
  return exposedItems.map(item => {
    item = Object.assign({}, item);
    item.displayName = (item.type === 'service' && item.title) ? item.title : item.display;
    item.showBranch;
    item.showProcessAppName;
    item.children = [];
    return item;
  });
}

function compareExposedItems(item1, item2) {
  let comparisonResult = compareDisplayNames(item1, item2);
  if (comparisonResult !== 0) {
    return comparisonResult;
  } else {
    // in DEV there are normal branches, but in TEST, SYST and PROD there are no branches and branch name matches snapshot name
    comparisonResult = item1.snapshotName === item1.branchName ? compareProcessAppIds(item1, item2) : compareBranchNames(item1, item2);
    if (comparisonResult !== 0) {
      return comparisonResult;
    } else {
      comparisonResult = compareSnapshotCreatedOn(item1, item2);
      if (comparisonResult !== 0) {
        return comparisonResult === 1 ? -1 : 1; //descending order
      } else {
        return 0;
      }
    }
  }
}

function compareDisplayNames(item1, item2) {
  return item1.displayName.toLowerCase() === item2.displayName.toLowerCase() ? 0 : item1.displayName.toLowerCase() > item2.displayName.toLowerCase() ? 1 : -1;
}

function compareBranchNames(item1, item2) {
  return item1.branchName === item2.branchName ? 0 : item1.branchName > item2.branchName ? 1 : -1;
}

function compareProcessAppIds(item1, item2) {
  return item1.processAppID === item2.processAppID ? 0 : item1.processAppID > item2.processAppID ? 1 : -1;
}

function compareSnapshotCreatedOn(item1, item2) {
  return item1.snapshotCreatedOn === item2.snapshotCreatedOn ? 0 : item1.snapshotCreatedOn > item2.snapshotCreatedOn ? 1 : -1;
}

function nestRelatedExposedItems(exposedItems) {
  let masterItem;
  const exposedItemsForDisplay = [];
  for (let i = 0; i < exposedItems.length; i++) {

    const currentItem = exposedItems[i];

    setSpecificExposedItemVisibilityFlags(currentItem, exposedItems);

    if (masterItem && currentItem.itemID === masterItem.itemID
      /* in DEV there are normal branches */
      && (currentItem.branchName === masterItem.branchName
        /* in TEST, SYST and PROD there are no branches and branch name matches snapshot name */
        || (currentItem.snapshotName === currentItem.branchName && currentItem.processAppID === masterItem.processAppID))) {
      masterItem.children.push(currentItem);
    } else {
      masterItem = currentItem;
      exposedItemsForDisplay.push(masterItem);
    }
  }
  return exposedItemsForDisplay;
}

function setSpecificExposedItemVisibilityFlags(currentItem, exposedItems) {

  let distinctProcessAppNameCount = 0;
  let distinctBranchCount = 0;
  let previousProcessAppName;
  let previousBranch;

  exposedItems.forEach(currentItemLocal => {
    if (currentItemLocal.displayName === currentItem.displayName) {
      if (previousProcessAppName !== currentItemLocal.processAppName) {
        distinctProcessAppNameCount++;
      }
      // in DEV there are normal branches, but in TEST, SYST and PROD there are no branches and branch name matches snapshot name
      if (previousBranch !== currentItemLocal.branchName && currentItemLocal.branchName !== currentItemLocal.snapshotName) {
        distinctBranchCount++;
      }
    }
    previousProcessAppName = currentItemLocal.processAppName;
    previousBranch = currentItemLocal.branchName;
  });

  currentItem.showProcessAppName = distinctProcessAppNameCount > 1 ? true : false;
  currentItem.showBranch = distinctBranchCount > 1 ? true : false;
}
