/** @format */

import { createSlice } from '@reduxjs/toolkit';
import { dashboard } from '../service/operations/dashboardApi';

const initialState = {
	loading: false,
	data: null,
	driverWeeksEarnings: [],
	driverDaysEarnings: [],
	jobsBookedToday: [],
	allocationReplys: [],
	allocationStatus: [],
	smsHeartBeat: null,
	isDirectMsgModal: false,
	isGlobalMsgModal: false,
};

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState: initialState,
	reducers: {
		setLoading(state, action) {
			state.loading = action.payload;
		},
		setData(state, action) {
			state.data = action.payload;
		},
		setDriverWeeksEarnings(state, action) {
			state.driverWeeksEarnings = action.payload;
		},
		setDriverDaysEarnings(state, action) {
			state.driverDaysEarnings = action.payload;
		},
		setJobsBookedToday(state, action) {
			state.jobsBookedToday = action.payload;
		},
		setAllocationReplys(state, action) {
			state.allocationReplys = action.payload;
		},
		setAllocationStatus(state, action) {
			state.allocationStatus = action.payload;
		},
		setSmsHeartBeat(state, action) {
			state.smsHeartBeat = action.payload;
		},
		setIsDirectMsgModal(state, action) {
			state.isDirectMsgModal = action.payload;
		},
		setIsGlobalMsgModal(state, action) {
			state.isGlobalMsgModal = action.payload;
		},
	},
});

export function refreshDashboard() {
	return async (dispatch) => {
		try {
			const response = await dashboard();
			console.log(response);

			if (response.status === 'success') {
				dispatch(setData(response));
				dispatch(setDriverWeeksEarnings(response?.driverWeeksEarnings));
				dispatch(setDriverDaysEarnings(response?.driverDaysEarnings));
				dispatch(setJobsBookedToday(response?.jobsBookedToday));
				dispatch(setAllocationReplys(response?.allocationReplys));
				dispatch(setAllocationStatus(response?.allocationStatus || []));
				dispatch(setSmsHeartBeat(response?.smsHeartBeat));
			}
		} catch (error) {
			console.error('Failed to refresh users:', error);
		}
	};
}

export const {
	setToken,
	setData,
	setDriverDaysEarnings,
	setDriverWeeksEarnings,
	setJobsBookedToday,
	setAllocationReplys,
	setAllocationStatus,
	setSmsHeartBeat,
	setIsDirectMsgModal,
	setIsGlobalMsgModal,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
