/** @format */

import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';

const DropdownNotificationsItem = ({ notification, markAsRead }) => {
	const { id, dateTimeStamp, message, event, status } = notification;

	// Extract user and document type from the message
	const extractDetails = (msg) => {
		const driverMatch = msg.match(/Driver '(.+?)'/);
		const driverName = driverMatch ? driverMatch[1] : 'Unknown Driver';

		// Extract Booking Number
		const bookingMatch = msg.match(/Booking #:\s*(\d+)/);
		const bookingNumber = bookingMatch ? bookingMatch[1] : 'N/A';

		let heading = 'Notification';
		if (event === 3) heading = 'New Booking Request';
		else if (event === 4) heading = 'Amendment Request';
		else if (event === 5) heading = 'Cancellation Request';
		else if (event === 1) {
			if (msg.includes('created a new web booking request')) {
				heading = (
					<>
						<span className='text-blue-600'>New Web Booking Request</span>
						<br />
						<span className='text-gray-700 text-xs'>{msg}</span>
					</>
				);
			} else if (msg.includes('requested to cancel booking')) {
				heading = (
					<>
						<span className='text-blue-600'>Cancellation Request</span>
						<br />
						<span className='text-gray-700 text-xs'>{msg}</span>
					</>
				);
			} else {
				heading = (
					<>
						<span className='text-blue-600'>{driverName}</span> Rejected{' '}
						<span className='text-red-600'>Booking #{bookingNumber}</span>
					</>
				);
			}
		} else if (event === 2)
			heading = (
				<>
					<span className='text-blue-600'>{driverName}</span> Didn&apos;t
					Respond (Timeout) for{' '}
					<span className='text-red-600'>Booking #{bookingNumber}</span>
				</>
			);

		return { driverName, bookingNumber, heading };
	};

	const { heading } = extractDetails(message);

	return (
		<div className='flex gap-3 px-5 py-2 border-b border-gray-200'>
			<div className='relative shrink-0 mt-0.5'>
				<KeenIcon
					icon='notification-on'
					className='size-6 text-primary'
				/>
			</div>

			<div className='flex flex-col gap-2 w-full'>
				<div className='text-sm font-bold text-gray-900'>{heading}</div>
				<div className='text-xs text-gray-500'>
					{new Date(dateTimeStamp).toLocaleString('en-gb')}
				</div>
				{/* Extract and render document link */}
				<div className='flex gap-3 mt-2'>
					{/* View Document Button (if docPath exists) */}
					{/* {docPath && (
						<a
							href={docPath}
							target='_blank'
							rel='noopener noreferrer'
							className='btn btn-sm btn-primary'
						>
							View Document
						</a>
					)} */}
					{event === 1 &&
						(message.includes('created a new web booking request') ||
							message.includes('requested to cancel booking')) && (
							<Link
								to={`/bookings/${message.includes('created a new web booking request') ? 'web-booking' : 'amend-booking'}`}
							>
								<button className='btn btn-sm btn-primary'>
									View Bookings
								</button>
							</Link>
						)}

					{/* Mark as Read Button (if unread) */}
					{status === 0 && (
						<button
							onClick={() => markAsRead(id)}
							className='btn btn-sm btn-secondary'
						>
							Mark as Read
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export { DropdownNotificationsItem };
