/** @format */

import { Fragment, useEffect, useMemo, useState } from 'react';
import {
	Toolbar,
	ToolbarDescription,
	ToolbarHeading,
	ToolbarPageTitle,
} from '@/partials/toolbar';
import { KeenIcon } from '@/components';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
// import { Container } from '@/components/container';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
	DataGrid,
	DataGridColumnHeader,
	// useDataGrid,
	// DataGridRowSelectAll,
	// DataGridRowSelect,
} from '@/components';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { refreshRejectedWebBookings } from '../../../slices/webBookingSlice';
function RejectedBookings() {
	const dispatch = useDispatch();
	const { rejectedWebBookings } = useSelector((state) => state.webBooking);
	const [searchInput, setSearchInput] = useState('');
	const [selectedScope, setSelectedScope] = useState('3');
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		dispatch(refreshRejectedWebBookings());
	}, [dispatch]);

	const filteredBookings = useMemo(() => {
		// if No filtration is applied
		if (!searchInput && selectedScope === '3' && !date) {
			return rejectedWebBookings;
		}

		return rejectedWebBookings?.filter((booking) => {
			const searchValue = searchInput?.toLowerCase();

			const bookingDate = booking.pickupDateTime
				? format(new Date(booking?.pickupDateTime), 'yyyy-MM-dd')
				: '';

			const isMatch =
				booking.pickupAddress.toLowerCase().includes(searchValue) ||
				booking.pickupPostCode.toLowerCase().includes(searchValue) ||
				booking.destinationAddress.toLowerCase().includes(searchValue) ||
				booking.destinationPostCode.toLowerCase().includes(searchValue);

			const isDateMatch = date
				? bookingDate === format(date, 'yyyy-MM-dd')
				: true;

			const isScopeMatch =
				selectedScope === '3' || String(booking?.scope) === selectedScope;

			return isMatch && isDateMatch && isScopeMatch;
		});
	}, [rejectedWebBookings, searchInput, date, selectedScope]);

	console.log('.....', filteredBookings);

	const ColumnInputFilter = ({ column }) => {
		return (
			<Input
				placeholder='Filter...'
				value={column.getFilterValue() ?? ''}
				onChange={(event) => column.setFilterValue(event.target.value)}
				className='h-9 w-full max-w-40'
			/>
		);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'bookingId',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='# id'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`p-2 rounded-md`}>{row?.original?.id}</span>
				),
				meta: { headerClassName: 'w-20' },
			},
			{
				accessorKey: 'pickUpDateTime',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Pickup Date/Time'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						{new Date(
							row.original.pickupDateTime?.split('T')[0]
						)?.toLocaleDateString('en-GB')}{' '}
						{row.original.pickupDateTime
							?.split('T')[1]
							.split('.')[0]
							?.slice(0, 5)}
					</span>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},

			{
				accessorKey: 'pickupAddress',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Pickup Address'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						{row?.original?.pickupAddress}, {row?.original?.pickupPostCode}
					</span>
				),
				meta: { headerClassName: 'min-w-[120px]' },
			},
			{
				accessorKey: 'destinationAddress',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Destination Address'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						{row.original.destinationAddress},{' '}
						{row.original.destinationPostCode}
					</span>
				),
				meta: { headerClassName: 'min-w-[120px]' },
			},
			// {
			// 	accessorKey: 'passengerName',
			// 	header: ({ column }) => (
			// 		<DataGridColumnHeader
			// 			title='Passenger Name'
			// 			column={column}
			// 		/>
			// 	),
			// 	enableSorting: true,
			// 	cell: ({ row }) => (
			// 		<span className={row.original.color}>
			// 			{row?.original?.passengerName}
			// 		</span>
			// 	),
			// 	meta: { headerClassName: 'w-18' },
			// },
			// {
			// 	accessorKey: 'passenger',
			// 	header: ({ column }) => (
			// 		<DataGridColumnHeader
			// 			title='Passenger'
			// 			column={column}
			// 		/>
			// 	),
			// 	enableSorting: true,
			// 	cell: ({ row }) => (
			// 		<span className={row.original.color}>
			// 			{row?.original?.passengers}
			// 		</span>
			// 	),
			// 	meta: { headerClassName: 'w-18' },
			// },
			// {
			// 	accessorKey: 'phoneNumber',
			// 	header: ({ column }) => (
			// 		<DataGridColumnHeader
			// 			title='Phone Number'
			// 			column={column}
			// 		/>
			// 	),
			// 	enableSorting: true,
			// 	cell: ({ row }) => (
			// 		<span className={row.original.color}>{row.original.phoneNumber}</span>
			// 	),
			// 	meta: { headerClassName: 'w-18' },
			// },
			{
				accessorKey: 'rejectedReason',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Reason'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{row.original.rejectedReason}
					</span>
				),
				meta: { headerClassName: 'min-w-[220px]' },
			},
			{
				accessorKey: 'rejectedBy',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Rejected By'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{row.original.acceptedRejectedBy}
					</span>
				),
				meta: { headerClassName: 'w-18' },
			},
			{
				accessorKey: 'rejectedOn',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Rejected On'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{new Date(
							row.original.acceptedRejectedOn?.split('T')[0]
						)?.toLocaleDateString('en-GB')}{' '}
						{row.original.acceptedRejectedOn
							?.split('T')[1]
							.split('.')[0]
							?.slice(0, 5)}
					</span>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},
		],
		[]
	);

	const handleRowSelection = (state) => {
		const selectedRowIds = Object.keys(state);
		if (selectedRowIds.length > 0) {
			alert(`Selected Drivers: ${selectedRowIds.join(', ')}`);
		}
	};
	return (
		<Fragment>
			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1580px] w-full'>
				<Toolbar>
					<ToolbarHeading>
						<ToolbarPageTitle />
						<ToolbarDescription>
							Total {`${rejectedWebBookings.length}`} Rejected Web Job(s){' '}
						</ToolbarDescription>
					</ToolbarHeading>
				</Toolbar>
			</div>
			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1580px] w-full'>
				<div className='flex flex-col items-stretch gap-5 lg:gap-7.5'>
					<div className='flex flex-wrap items-center gap-5 justify-between'>
						<div className='card card-grid min-w-full'>
							<div className='card-header flex-wrap gap-2'>
								<div className='flex flex-wrap gap-2 lg:gap-5'>
									<div className='flex'>
										<label
											className='input input-sm'
											style={{ height: '40px' }}
										>
											<KeenIcon icon='magnifier' />
											<input
												type='text'
												placeholder='Search Jobs'
												value={searchInput}
												onChange={(e) => setSearchInput(e.target.value)}
											/>
										</label>
									</div>
									<div className='flex flex-wrap items-center gap-2.5'>
										<Popover>
											<PopoverTrigger asChild>
												<button
													id='date'
													className={cn(
														'input data-[state=open]:border-primary',
														!date && 'text-muted-foreground'
													)}
													style={{ width: '13rem' }}
												>
													<KeenIcon
														icon='calendar'
														className='-ms-0.5'
													/>
													{date ? (
														format(date, 'LLL dd, y')
													) : (
														<span>Pick a date</span>
													)}
												</button>
											</PopoverTrigger>
											<PopoverContent
												className='w-auto p-0'
												align='start'
											>
												<Calendar
													initialFocus
													mode='single' // Single date selection
													defaultMonth={date}
													selected={date}
													onSelect={setDate}
													numberOfMonths={1}
												/>
											</PopoverContent>
										</Popover>

										<Select
											value={selectedScope}
											onValueChange={setSelectedScope}
										>
											<SelectTrigger
												className='w-28'
												size='sm'
												style={{ height: '40px' }}
											>
												<SelectValue placeholder='Select' />
											</SelectTrigger>
											<SelectContent className='w-32'>
												<SelectItem value='3'>All</SelectItem>
												<SelectItem value='0'>Cash</SelectItem>
												<SelectItem value='4'>Card</SelectItem>
												<SelectItem value='1'>Account</SelectItem>
												<SelectItem value='2'>Rank</SelectItem>
											</SelectContent>
										</Select>

										{/* <button
											className='btn btn-sm btn-outline btn-primary'
											style={{ height: '40px' }}
										>
											<KeenIcon icon='magnifier' /> Search
										</button> */}
									</div>
								</div>
							</div>
							<div className='card-body'>
								<DataGrid
									columns={columns}
									data={filteredBookings}
									rowSelection={true}
									onRowSelectionChange={handleRowSelection}
									pagination={{ size: 10 }}
									sorting={[{ id: 'driver', desc: false }]}
									layout={{ card: true }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export { RejectedBookings };
