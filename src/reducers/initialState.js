export default {
  ajaxCallsInProgress: 0,
  user: {},
  exposedItems: [],
  startedExposedItem: {},
  taskSearchState: {
    searchCriteria: {
      searchFilter: '',
      completionStateFilter: 'Open',
      limit: 25
    },
    results: {
      items: [],
      total: 0
    }
  },
  processInstanceSearchState: {
    searchCriteria: {
      searchFilter: '',
      completionStateFilter: 'Active',
      limit: 25
    },
    results: {
      items: [],
      total: 0
    }
  },
  pickedProcessInstance: {
    summary: {},
    businessData: [],
    tasks: [],
    activities: [],
    isPreloadedFromParent: false
  }
};
