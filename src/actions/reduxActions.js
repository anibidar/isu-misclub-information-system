export const SELECT_VIEW = 'SELECT_VIEW';
export const selectView = view => ({
	type: SELECT_VIEW,
	view
});

export const SET_ACTIVE_EVENT = 'SET_ACTIVE_EVENT';
export const setActiveEvent = (eventId = '', eventName = '') => ({
	type: SET_ACTIVE_EVENT,
	eventId,
	eventName
});

export const ADD_REPORT_DATA = 'ADD_REPORT_DATA';
export const addReportData = (reportData = {}) => ({
	type: ADD_REPORT_DATA,
	reportData
});

export const RESET_ACTIVE_EVENT = 'RESET_ACTIVE_EVENT';
export const resetActiveEvent = () => ({
	type: RESET_ACTIVE_EVENT
});

export const SET_EVENTS_TODAY = 'SET_EVENTS_TODAY';
export const setEventsToday = eventsToday => ({
	type: SET_EVENTS_TODAY,
	eventsToday
});

export const UPDATE_AUTHORIZATION = 'UPDATE_AUTHORIZATION';
export const updateAuthorization = ({userId, accessLevel}) => ({
	type: UPDATE_AUTHORIZATION,
	userId,
	accessLevel
});

export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const setTransactions = transactions => ({
	type: SET_TRANSACTIONS,
	transactions
});