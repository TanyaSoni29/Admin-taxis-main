/** @format */

import { Fragment, useEffect, useMemo, useState } from 'react';
import {
	Toolbar,
	ToolbarDescription,
	ToolbarHeading,
	ToolbarActions,
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
import {
	refreshWebBookings,
	setWebBooking,
} from '../../../slices/webBookingSlice';
import { AcceptWebBooking } from './acceptWebBooking';
import { RejectWebBooking } from './rejectWebBooking';
import { Link } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
function NewBooking() {
	const dispatch = useDispatch();
	const [acceptModal, setAcceptModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [selectedScope, setSelectedScope] = useState('3');
	const [date, setDate] = useState(null);
	const [open, setOpen] = useState(false);
	const { webBookings } = useSelector((state) => state.webBooking);

	useEffect(() => {
		dispatch(refreshWebBookings());
	}, [dispatch]);

	const filteredBookings = useMemo(() => {
		// if No filtration is applied
		if (!searchInput && selectedScope === '3' && !date) {
			return webBookings;
		}

		return webBookings?.filter((booking) => {
			const searchValue = searchInput?.toLowerCase();

			const bookingDate = booking.pickupDateTime
				? format(new Date(booking?.pickupDateTime), 'yyyy-MM-dd')
				: '';

			const isMatch =
				booking?.pickupAddress.toLowerCase().includes(searchValue) ||
				booking?.pickupPostCode.toLowerCase().includes(searchValue) ||
				booking?.destinationAddress.toLowerCase().includes(searchValue) ||
				booking?.destinationPostCode.toLowerCase().includes(searchValue) ||
				booking?.passengerName.toLowerCase().includes(searchValue);

			const isDateMatch = date
				? bookingDate === format(date, 'yyyy-MM-dd')
				: true;

			const isScopeMatch =
				selectedScope === '3' || String(booking?.scope) === selectedScope;

			return isMatch && isDateMatch && isScopeMatch;
		});
	}, [webBookings, searchInput, date, selectedScope]);

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
			// {
			// 	accessorKey: 'id',
			// 	header: ({ column }) => (
			// 		<DataGridColumnHeader
			// 			title=<span className='font-bold'># id</span>
			// 			filter={<ColumnInputFilter column={column} />}
			// 			column={column}
			// 		/>
			// 	),
			// 	enableSorting: true,
			// 	cell: ({ row }) => (
			// 		<span className={`p-2 rounded-md`}>{row?.original?.id}</span>
			// 	),
			// 	meta: { headerClassName: 'w-10' },
			// },
			{
				accessorKey: 'arriveBy',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Arrive By</span>
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						<label className='switch'>
							<input
								type='checkbox'
								name='arriveBy'
								checked={row.original.arriveBy}
								readOnly
							/>
						</label>
					</span>
				),
				meta: { headerClassName: 'w-10' },
			},
			{
				accessorKey: 'pickUpDateTime',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Date/Time</span>
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
				meta: { headerClassName: 'min-w-[160px]' },
			},

			{
				accessorKey: 'pickupAddress',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Pickup Address</span>
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
				meta: { headerClassName: 'min-w-[200px]' },
			},
			{
				accessorKey: 'destinationAddress',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Destination Address</span>
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
				meta: { headerClassName: 'min-w-[200px]' },
			},
			{
				accessorKey: 'passengerName',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Passenger Name</span>
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{row?.original?.passengerName}
					</span>
				),
				meta: { headerClassName: 'w-18' },
			},
			{
				accessorKey: 'passengers',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Passenger</span>
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{row?.original?.passengers}
					</span>
				),
				meta: { headerClassName: 'w-18' },
			},
			{
				accessorKey: 'phoneNumber',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Phone Number</span>
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{row.original.phoneNumber ? row.original.phoneNumber : '-'}
					</span>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},
			{
				accessorKey: 'repeatText',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Days & Ends on Date</span>
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={row.original.color}>
						{row.original.repeatText ? row.original.repeatText : '-'}
					</span>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},

			{
				accessorKey: 'action',
				header: ({ column }) => (
					<DataGridColumnHeader
						title=<span className='font-bold'>Actions</span>
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<div className='w-full flex justify-start items-center gap-2'>
						{!row?.accepted && (
							<button
								className='btn btn-sm btn-success px-4 py-4'
								onClick={() => {
									setAcceptModal(true);
									dispatch(setWebBooking(row.original));
								}}
							>
								Accept
							</button>
						)}
						{!row?.accepted && (
							<button
								className='btn btn-sm btn-danger px-4 py-4'
								onClick={() => {
									setRejectModal(true);
									dispatch(setWebBooking(row.original));
								}}
							>
								Reject
							</button>
						)}
					</div>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},
		],
		[dispatch]
	);

	const handleCloseAcceptModal = () => {
		setAcceptModal(false);
	};

	const handleCloseRejectModal = () => {
		setRejectModal(false);
	};

	const handleRowSelection = (state) => {
		const selectedRowIds = Object.keys(state);
		if (selectedRowIds.length > 0) {
			alert(`Selected Drivers: ${selectedRowIds.join(', ')}`);
		}
	};

	const handleDateSelect = (date) => {
		setDate(date); // Update the date range
		// Close the popover if both from and to dates are selected
		setOpen(false);
	};

	return (
		<Fragment>
			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1850px] w-full'>
				<Toolbar>
					<ToolbarHeading>
						<ToolbarPageTitle />
						<ToolbarDescription>
							Total {`${webBookings?.length}`} Web Job(s){' '}
						</ToolbarDescription>
					</ToolbarHeading>
					<ToolbarActions>
						<Link to='/bookings/reject-booking'>
							<button className='btn btn-sm btn-danger px-4 py-4'>
								Rejected Bookings
							</button>
						</Link>
					</ToolbarActions>
				</Toolbar>
			</div>
			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1850px] w-full'>
				<div className='flex flex-col items-stretch gap-5 lg:gap-7.5'>
					<div className='flex flex-wrap items-center gap-5 justify-between'>
						<div className='card card-grid min-w-full'>
							<div className='card-header flex-wrap gap-2'>
								<div className='flex flex-wrap gap-2 lg:gap-5'>
									<div className='flex'>
										<label
											className='input input-sm'
											style={{ height: '40px', marginTop: '16px' }}
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
										<Popover
											open={open}
											onOpenChange={setOpen}
										>
											<PopoverTrigger asChild>
												<div className='relative'>
													<button
														id='date'
														className={cn(
															'input data-[state=open]:border-primary',
															!date && 'text-muted-foreground'
														)}
														style={{ width: '13rem', marginTop: '16px' }}
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
													{date && (
														<button
															onClick={(e) => {
																e.stopPropagation(); // Prevent closing popover
																setDate(null); // Clear date
															}}
															className='absolute right-2 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
														>
															<KeenIcon
																icon='cross-circle'
																className=''
															/>
														</button>
													)}
												</div>
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
													onSelect={handleDateSelect}
													numberOfMonths={1}
												/>
											</PopoverContent>
										</Popover>

										<div className='flex flex-col'>
											<label className='form-label'>Scope</label>
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
										</div>

										<button
											className='btn btn-sm btn-outline btn-primary mt-4'
											style={{ height: '40px' }}
											onClick={() => dispatch(refreshWebBookings())}
										>
											<RefreshIcon sx={{ fontSize: '12px' }} /> Refresh
										</button>
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
									sorting={[{ id: 'pickUpDateTime', desc: false }]}
									layout={{ card: true }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{acceptModal && (
				<AcceptWebBooking
					open={acceptModal}
					onOpenChange={handleCloseAcceptModal}
				/>
			)}
			{rejectModal && (
				<RejectWebBooking
					open={rejectModal}
					onOpenChange={handleCloseRejectModal}
				/>
			)}
		</Fragment>
	);
}

export { NewBooking };
