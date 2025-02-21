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
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select';
// import { Container } from '@/components/container';
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { format } from 'date-fns';
// import { cn } from '@/lib/utils';
import {
	DataGrid,
	DataGridColumnHeader,
	// useDataGrid,
	// DataGridRowSelectAll,
	// DataGridRowSelect,
} from '@/components';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterDriver } from '../registerDriver';
import { EditDriver } from '../editDriver';
import { DeleteDriver } from '../deleteDriver';
import {
	handleLockJobs,
	handleSendJobs,
	handleShowAllJobs,
	handleShowHvsJobs,
	refreshAllDrivers,
	setDriver,
} from '../../../slices/driverSlice';
import isLightColor from '../../../utils/isLight';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
function ListDriver() {
	const dispatch = useDispatch();
	const { drivers } = useSelector((state) => state.driver);
	const [searchInput, setSearchInput] = useState('');
	const [registerDriverModal, setRegisterDriverModal] = useState(false);
	const [editDriverModal, setEditDriverModal] = useState(false);
	const [deleteDriverModal, setDeleteDriverModal] = useState(false);
	// const [date, setDate] = useState(new Date());

	const filteredDriver = drivers.filter((driver) =>
		driver?.fullName?.toLowerCase().includes(searchInput.toLowerCase())
	);

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

	const vehicleTypeName = {
		0: '',
		1: 'Saloon',
		2: 'Estate',
		3: 'MPV',
		4: 'MPVPlus',
		5: 'SUV',
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Id #'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`p-2 rounded-md`}>{row.original.id}</span>
				),
				meta: { headerClassName: 'w-20' },
			},
			{
				accessorKey: 'lastLogin',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Last Login'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`p-2 rounded-md`}>
						{new Date(
							row.original.lastLogin?.split('T')[0]
						)?.toLocaleDateString('en-GB')}{' '}
						{row.original.lastLogin?.split('T')[1].split('.')[0]?.slice(0, 5)}
					</span>
				),
				meta: { headerClassName: 'w-25' },
			},
			{
				accessorKey: 'regNo',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Reg No.'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`p-2 rounded-md`}>{row.original.regNo}</span>
				),
				meta: { headerClassName: 'w-25' },
			},
			{
				accessorKey: 'type',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Type'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						{row.original.vehicleType
							? vehicleTypeName[row.original.vehicleType]
							: '-'}
					</span>
				),
				meta: { headerClassName: 'w-20' },
			},
			{
				accessorKey: 'color',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Color'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span
						className={`font-medium p-2 rounded-md ${isLightColor(row.original.colorRGB) ? 'text-black' : 'text-white'}`}
						style={{ backgroundColor: row.original.colorRGB }}
					>
						{row.original.colorRGB}
					</span>
				),
				meta: { headerClassName: 'w-20' },
			},
			{
				accessorKey: 'fullName',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Full Name'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`p-2 rounded-md`}>{row.original.fullName}</span>
				),
				meta: { headerClassName: 'w-25' },
			},
			{
				accessorKey: 'phoneNumber',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Phone Number'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						{row.original.phoneNumber}
					</span>
				),
				meta: { headerClassName: 'w-20' },
			},
			{
				accessorKey: 'role',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Role'
						filter={<ColumnInputFilter column={column} />}
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<span className={`font-medium ${row.original.color}`}>
						{row.original.role === 1
							? 'Admin'
							: row.original.role === 2
								? 'User'
								: 'Driver'}
					</span>
				),
				meta: { headerClassName: 'w-20' },
			},
			{
				accessorKey: 'send',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Send'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<div className='w-full flex justify-start items-center gap-2'>
						<button
							className='rounded-full px-2 py-2  w-8 h-8 flex justify-center items-center hover:bg-red-100 group'
							onClick={() => handleSend(row.original)}
						>
							<KeenIcon
								icon='sms'
								className='group-hover:text-red-600'
							/>
						</button>
					</div>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},
			{
				accessorKey: 'lock',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Lock'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<div className='w-full flex justify-start items-center gap-2'>
						<button
							className='rounded-full px-2 py-2  w-8 h-8 flex justify-center items-center hover:bg-red-100 group'
							onClick={() => handleLock(row.original)}
						>
							<PersonOffOutlinedIcon
								sx={{ fontSize: 14 }}
								className='group-hover:text-red-600'
							/>
						</button>
					</div>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},
			{
				accessorKey: 'show',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Show'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<div className='w-full flex justify-start items-center gap-2'>
						<button
							className='rounded-full px-2 py-2  w-8 h-8 flex justify-center items-center hover:bg-red-100 group'
							onClick={() => handleShow(row.original)}
						>
							<KeenIcon
								icon='briefcase'
								className='group-hover:text-red-600'
							/>
						</button>
					</div>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},
			{
				accessorKey: 'hvs',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='HVS'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<div className='w-full flex justify-start items-center gap-2'>
						<button
							className='rounded-full px-2 py-2  w-8 h-8 flex justify-center items-center hover:bg-red-100 group'
							onClick={() => handleHvs(row.original)}
						>
							<KeenIcon
								icon='teacher'
								className='group-hover:text-red-600'
							/>
						</button>
					</div>
				),
				meta: { headerClassName: 'min-w-[80px]' },
			},

			{
				accessorKey: 'action',
				header: ({ column }) => (
					<DataGridColumnHeader
						title='Actions'
						column={column}
					/>
				),
				enableSorting: true,
				cell: ({ row }) => (
					<div className='w-full flex justify-start items-center gap-2'>
						<button
							className='rounded-full px-2 py-2  w-8 h-8 flex justify-center items-center hover:bg-red-100 group'
							onClick={() => {
								dispatch(setDriver(row.original));
								setEditDriverModal(true);
							}}
						>
							<KeenIcon
								icon='pencil'
								className='group-hover:text-red-600'
							/>
						</button>
						<button
							className='rounded-full px-2 py-2  w-8 h-8 flex justify-center items-center hover:bg-red-100 group'
							onClick={() => {
								dispatch(setDriver(row.original));
								setDeleteDriverModal(true);
							}}
						>
							<KeenIcon
								icon='trash'
								className='group-hover:text-red-600'
							/>
						</button>
					</div>
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

	const handleSend = (driver) => {
		dispatch(handleSendJobs(driver?.id));
	};
	const handleShow = (driver) => {
		dispatch(handleShowAllJobs(driver?.id, 0));
	};
	const handleHvs = (driver) => {
		dispatch(handleShowHvsJobs(driver?.id, 0));
	};
	const handleLock = (driver) => {
		dispatch(handleLockJobs(driver?.id, 0));
	};

	const handleClose = () => {
		if (registerDriverModal) {
			setRegisterDriverModal(false);
			return;
		}
		if (editDriverModal) {
			setEditDriverModal(false);
			return;
		}

		if (deleteDriverModal) {
			setDeleteDriverModal(false);
			return;
		}
	};

	useEffect(() => {
		dispatch(refreshAllDrivers());
	}, [dispatch]);

	return (
		<Fragment>
			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1580px] w-full'>
				<Toolbar>
					<ToolbarHeading>
						<ToolbarPageTitle />
						<ToolbarDescription>Showing {'23'} Drivers </ToolbarDescription>
					</ToolbarHeading>
					<ToolbarActions>
						<button
							className='btn btn-sm btn-primary px-4 py-4'
							onClick={() => setRegisterDriverModal(true)}
						>
							Add New Driver
						</button>
					</ToolbarActions>
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
												placeholder='Search Drivers'
												value={searchInput}
												onChange={(e) => setSearchInput(e.target.value)}
											/>
										</label>
									</div>
									{/* <div className='flex items-center gap-2.5'>
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

										<Select defaultValue='all'>
											<SelectTrigger
												className='w-28'
												size='sm'
												style={{ height: '40px' }}
											>
												<SelectValue placeholder='Select' />
											</SelectTrigger>
											<SelectContent className='w-32'>
												<SelectItem value='all'>All</SelectItem>
												<SelectItem value='cash'>Cash</SelectItem>
												<SelectItem value='card'>Card</SelectItem>
												<SelectItem value='account'>Account</SelectItem>
												<SelectItem value='rank'>Rank</SelectItem>
											</SelectContent>
										</Select>

										<button
											className='btn btn-sm btn-outline btn-primary'
											style={{ height: '40px' }}
										>
											<KeenIcon icon='magnifier' /> Search
										</button>
									</div> */}
								</div>
							</div>
							<div className='card-body'>
								<DataGrid
									columns={columns}
									data={filteredDriver}
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
			{registerDriverModal && (
				<RegisterDriver
					open={registerDriverModal}
					onOpenChange={handleClose}
				/>
			)}
			{editDriverModal && (
				<EditDriver
					open={editDriverModal}
					onOpenChange={handleClose}
				/>
			)}
			{deleteDriverModal && (
				<DeleteDriver
					open={deleteDriverModal}
					onOpenChange={handleClose}
				/>
			)}
		</Fragment>
	);
}

export { ListDriver };
