/** @format */

// import { sendLogs } from '../../utils/getLogs';
import axios from 'axios';
import { handlePostReq, setHeaders } from '../apiRequestHandler';
import { webBookingEndpoints } from '../apis';

const {
	GET_WEB_BOOKINGS,
	ACCEPT_WEB_BOOKING,
	REJECT_WEB_BOOKING,
	GET_DURATION,
} = webBookingEndpoints;
export async function getWebBookings() {
	// Fetch current user details using token
	const response = await handlePostReq(GET_WEB_BOOKINGS, {
		processed: false,
		accepted: false,
		rejected: false,
	});

	console.log('GET WEB BOOKINGS API RESPONSE.........', response);

	if (response.status === 'success') {
		// sendLogs(
		// 	{
		// 		url: GET_WEB_BOOKINGS,
		// 		reqBody: null,
		// 		headers: setHeaders(),
		// 		response: response,
		// 	},
		// 	'info'
		// );
		return response;
	}
}

export async function getRejectedWebBookings() {
	// Fetch current user details using token
	const response = await handlePostReq(GET_WEB_BOOKINGS, {
		processed: true,
		accepted: false,
		rejected: true,
	});

	console.log('GET WEB BOOKINGS API RESPONSE.........', response);

	if (response.status === 'success') {
		// sendLogs(
		// 	{
		// 		url: GET_WEB_BOOKINGS,
		// 		reqBody: null,
		// 		headers: setHeaders(),
		// 		response: response,
		// 	},
		// 	'info'
		// );
		return response;
	}
}

export async function getAcceptedWebBookings() {
	// Fetch current user details using token
	const response = await handlePostReq(GET_WEB_BOOKINGS, {
		processed: true,
		accepted: true,
		rejected: false,
	});

	console.log('GET ACCEPTED WEB BOOKINGS API RESPONSE.........', response);

	if (response.status === 'success') {
		// sendLogs(
		// 	{
		// 		url: GET_WEB_BOOKINGS,
		// 		reqBody: null,
		// 		headers: setHeaders(),
		// 		response: response,
		// 	},
		// 	'info'
		// );
		return response;
	}
}

export async function acceptWebBookings(data) {
	// Fetch current user details using token
	const response = await handlePostReq(ACCEPT_WEB_BOOKING, data);

	console.log('ACCEPT WEB BOOKINGS API RESPONSE.........', response);

	if (response.status === 'success') {
		// sendLogs(
		// 	{
		// 		url: ACCEPT_WEB_BOOKING,
		// 		reqBody: data,
		// 		headers: setHeaders(),
		// 		response: response,
		// 	},
		// 	'info'
		// );
		return response;
	}
}

export async function rejectWebBookings(data) {
	// Fetch current user details using token
	const response = await handlePostReq(REJECT_WEB_BOOKING, data);

	console.log('GET WEB BOOKINGS API RESPONSE.........', response);

	if (response.status === 'success') {
		// sendLogs(
		// 	{
		// 		url: REJECT_WEB_BOOKING,
		// 		reqBody: data,
		// 		headers: setHeaders(),
		// 		response: response,
		// 	},
		// 	'info'
		// );
		return response;
	}
}

export async function getDurationWebBookings(id) {
	// Fetch current user details using token
	const response = await axios.get(GET_DURATION(id), { headers: setHeaders() });

	console.log('GET DURATION WEB BOOKINGS API RESPONSE.........', response);

	if (response.status === 200) {
		// sendLogs(
		// 	{
		// 		url: GET_DURATION(id),
		// 		reqBody: data,
		// 		headers: setHeaders(),
		// 		response: response,
		// 	},
		// 	'info'
		// );
		return { data: response.data, status: 'success' };
	}
}
