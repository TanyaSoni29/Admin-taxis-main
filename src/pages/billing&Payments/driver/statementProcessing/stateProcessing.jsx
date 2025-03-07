/** @format */
import { useState, Fragment, useEffect } from 'react';
import {
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	TableSortLabel,
} from '@mui/material';
import {
	KeyboardArrowDown,
	KeyboardArrowUp,
	EmailOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';
import MoneyIcon from '@mui/icons-material/Money';
// import { Container } from '@/components/container';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import { KeenIcon } from '@/components';
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { refreshAllDrivers } from '../../../../slices/driverSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
	Toolbar,
	ToolbarDescription,
	ToolbarHeading,
	ToolbarPageTitle,
} from '@/partials/toolbar';
import {
	refreshDriverChargeableJobs,
	setDriverChargeableJobs,
} from '../../../../slices/billingSlice';
import {
	driverCreateStatements,
	driverPostOrUnpostJobs,
	driverPriceJobByMileage,
	driverUpdateChargesData,
} from '../../../../service/operations/billing&Payment';
import toast from 'react-hot-toast';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { cancelBooking } from '../../../../service/operations/webBookingsApi';

// Collapsible Row Component
function RowNotPriced({ row, setPriceBaseModal, handlePostButton }) {
	const [open, setOpen] = useState(false);
	const [waiting, setWaiting] = useState(row.waiting);
	const [driverFare, setDriverFare] = useState(row.driverFare);
	const [parking, setParking] = useState(row.parking);
	const user = JSON.parse(localStorage.getItem('userData'));

	const handleCancel = async () => {
		try {
			const payload = {
				bookingId: row?.bookingId,
				cancelledByName: user?.fullName,
				cancelBlock: false,
				cancelledOnArrival: false,
				actionByUserId: user?.userId,
			};
			const response = await cancelBooking(payload);
			if (response?.status === 'success') {
				toast.success('Invoice Cancellation Successful');
			}
		} catch (error) {
			console.error('Failed to cancel invoice:', error);
			toast.error('Failed to cancel invoice');
		}
	};

	const handleInputChange = async (field, value) => {
		const newValue = value < 0 ? 0 : value;

		// Update state based on field name
		if (field === 'waiting') setWaiting(newValue);
		if (field === 'driverFare') setDriverFare(newValue);
		if (field === 'parking') setParking(newValue);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			const updateCharges = async () => {
				try {
					const payload = {
						bookingId: row?.id || 0,
						waitingMinutes: waiting || 0,
						parkingCharge: parking || 0,
						priceAccount: 0,
						price: driverFare || 0,
					};

					const response = await driverUpdateChargesData(payload);

					if (response?.status === 'success') {
						console.log(response);
					}
				} catch (error) {
					console.error('Error updating charges:', error);
				}
			};

			updateCharges(); // Call the async function
		}, 500); // API calls after 500ms

		// Cleanup timeout if input changes again before 500ms
		return () => clearTimeout(timer);
	}, [waiting, driverFare, parking, row?.id]);

	return (
		<>
			{/* Main Table Row */}
			<TableRow
				className={`${row?.coa ? ' bg-orange-500 hover:bg-orange-400' : 'bg-white dark:bg-[#14151A] hover:bg-gray-100'} `}
			>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<KeyboardArrowUp
								className={`${row?.coa ? 'text-gray-800 dark:text-white' : 'text-gray-800 dark:text-gray-700'}`}
							/>
						) : (
							<KeyboardArrowDown
								className={`${row?.coa ? 'text-gray-800 dark:text-white' : 'text-gray-800 dark:text-gray-700'}`}
							/>
						)}
					</IconButton>
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'text-blue-600 dark:text-white' : 'text-blue-500 dark:text-cyan-400'}  font-medium`}
				>
					{row.id}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.date}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.accNumber}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.driver}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.pickup}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.destination}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.passenger}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.hasVias ? 'Yes' : 'No'}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					<input
						type='number'
						className='w-16 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit'
						value={waiting}
						onChange={(e) => handleInputChange('waiting', +e.target.value)}
					/>
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					£{row.waitingCharge?.toFixed(2)}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.actualMiles}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					<input
						type='number'
						className='w-16 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit'
						value={driverFare}
						onChange={(e) => handleInputChange('driverFare', +e.target.value)}
					/>
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					<input
						type='number'
						className='w-16 text-center border rounded p-1 bg-inherit ring-inherit dark:bg-inherit dark:ring-inherit'
						value={parking}
						onChange={(e) => handleInputChange('parking', +e.target.value)}
					/>
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900 font-semibold`}
				>
					£{row.total.toFixed(2)}
				</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => setPriceBaseModal(true)}
					>
						<MoneyIcon
							className={`${row?.coa ? 'text-blue-600 dark:text-white' : 'text-blue-500 dark:text-cyan-400'}  `}
						/>
					</IconButton>
				</TableCell>

				<TableCell>
					<IconButton
						size='small'
						onClick={() => {
							if (row.driverFare === 0) {
								toast.error('Driver Price Should not be 0'); // Show error if price is 0
							} else {
								handlePostButton(row); // Post the job if valid
							}
						}}
					>
						<EmailOutlined
							className={`${row?.coa ? `${row.postedForStatement ? 'text-red-500 dark:text-red-900' : 'text-blue-500 dark:text-white'}` : `${row.postedForStatement ? 'text-red-500 dark:text-red-600' : 'text-blue-500 dark:text-cyan-400'}`}  `}
						/>
					</IconButton>
				</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={handleCancel}
					>
						<DeleteOutlinedIcon className='text-red-500 dark:text-red-600' />
					</IconButton>
				</TableCell>
			</TableRow>

			{/* Collapsible Booking Details Row */}
			<TableRow>
				<TableCell
					colSpan={16}
					style={{ paddingBottom: 0, paddingTop: 0 }}
				>
					<Collapse
						in={open}
						timeout='auto'
						unmountOnExit
					>
						<Box
							margin={1}
							className='border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-100 dark:bg-[#232427] text-gray-900 dark:text-gray-700'
						>
							<Typography
								variant='h6'
								className='text-blue-500 dark:text-cyan-400 font-semibold'
							>
								Booking #: {row.id}
							</Typography>
							<Box
								display='flex'
								justifyContent='space-between'
							>
								<Box>
									<Typography variant='body2'>
										<strong>Vias:</strong> {row.details?.vias ?? 'N/A'}
									</Typography>

									<Typography variant='body2'>
										<strong>Details:</strong> {row.details?.details ?? 'N/A'}
									</Typography>
								</Box>
								<Box>
									<Typography variant='body2'>
										<strong>Scope:</strong> {row.details?.scope ?? 'N/A'}
									</Typography>
								</Box>
							</Box>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

function RowPriced({ row, handleRevert }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Main Table Row */}
			<TableRow
				className={`${row?.coa ? ' bg-orange-500 hover:bg-orange-400' : 'bg-white dark:bg-[#14151A] hover:bg-gray-100'} `}
			>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<KeyboardArrowUp
								className={`${row?.coa ? 'text-gray-800 dark:text-white' : 'text-gray-800 dark:text-gray-700'}`}
							/>
						) : (
							<KeyboardArrowDown
								className={`${row?.coa ? 'text-gray-800 dark:text-white' : 'text-gray-800 dark:text-gray-700'}`}
							/>
						)}
					</IconButton>
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'text-blue-600 dark:text-white' : 'text-blue-500 dark:text-cyan-400'}  font-medium`}
				>
					{row.id}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.date}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.accNumber}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.driver}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.pickup}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.destination}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.passenger}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.hasVias ? 'Yes' : 'No'}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.waiting}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					£{row.waitingCharge?.toFixed(2)}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.actualMiles}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.driverFare}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900`}
				>
					{row.parking}
				</TableCell>
				<TableCell
					className={`${row?.coa ? 'dark:text-white' : 'dark:text-gray-700'} text-gray-900 font-semibold`}
				>
					£{row.total.toFixed(2)}
				</TableCell>

				<TableCell>
					<IconButton size='small'>
						<EmailOutlined
							className={`${row?.coa ? `${row.postedForStatement ? 'text-red-700 dark:text-red-900' : 'text-blue-500 dark:text-white'}` : `${row.postedForStatement ? 'text-red-500 dark:text-red-600' : 'text-blue-500 dark:text-cyan-400'}`}  `}
							onClick={() => handleRevert(row)}
						/>
					</IconButton>
				</TableCell>
			</TableRow>

			{/* Collapsible Booking Details Row */}
			<TableRow>
				<TableCell
					colSpan={16}
					style={{ paddingBottom: 0, paddingTop: 0 }}
				>
					<Collapse
						in={open}
						timeout='auto'
						unmountOnExit
					>
						<Box
							margin={1}
							className='border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-100 dark:bg-[#232427] text-gray-900 dark:text-gray-700'
						>
							<Typography
								variant='h6'
								className='text-blue-500 dark:text-cyan-400 font-semibold'
							>
								Booking #: {row.id}
							</Typography>
							<Box
								display='flex'
								justifyContent='space-between'
							>
								<Box>
									<Typography variant='body2'>
										<strong>Vias:</strong> {row.details?.vias ?? 'N/A'}
									</Typography>

									<Typography variant='body2'>
										<strong>Details:</strong> {row.details?.details ?? 'N/A'}
									</Typography>
								</Box>
								<Box>
									<Typography variant='body2'>
										<strong>Scope:</strong> {row.details?.scope ?? 'N/A'}
									</Typography>
								</Box>
							</Box>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

// Main Component
function StateProcessing() {
	const dispatch = useDispatch();
	const { drivers } = useSelector((state) => state.driver);
	const { driverChargeableJobs } = useSelector((state) => state.billing);
	const [selectedDriver, setSelectedDriver] = useState(0);
	const [selectedScope, setSelectedScope] = useState('3');
	const [priceBaseModal, setPriceBaseModal] = useState(false);
	const [date, setDate] = useState(new Date());
	const [search, setSearch] = useState('');
	const [order, setOrder] = useState('asc'); // Sort order
	const [orderBy, setOrderBy] = useState(''); // Default sorted column
	console.log(driverChargeableJobs);

	const formattedNotPricedBookings = (
		driverChargeableJobs?.notPriced || []
	).map((booking) => ({
		id: booking?.bookingId,
		date: booking?.date
			? new Date(booking?.date).toLocaleDateString('en-GB') +
				' ' +
				booking?.date?.split('T')[1]?.split('.')[0]?.slice(0, 5)
			: '-', // Ensure correct date format
		accNumber: booking?.accNo,
		driver: booking?.userId || '-',
		pickup: `${booking?.pickup}`,
		destination: `${booking?.destination}`,
		passenger: booking?.passenger || 'Unknown',
		hasVias: booking?.hasVias,
		coa: booking?.coa,
		waiting: booking?.waitingMinutes || 0,
		waitingCharge: booking?.waitingPriceDriver || 0,
		phoneNumber: booking?.phoneNumber || '',
		actualMiles: booking?.miles,
		driverFare: booking?.price || 0,
		parking: booking?.parkingCharge || 0,
		total: booking?.totalCost || 0,
		postedForStatement: booking?.postedForStatement,
		details: {
			details: booking?.details || '',
			vias: booking?.vias?.length
				? booking.vias
						.map((via) => `${via.address}, ${via.postCode}`)
						.join(' → ')
				: '',

			scope: booking?.scope === 4 ? 'Card' : 'Cash',
		},
	}));

	const filteredNotPricedBookings = formattedNotPricedBookings?.filter(
		(booking) => {
			if (!search?.trim()) return true;

			const isMatch =
				booking?.pickup?.toLowerCase().includes(search?.toLowerCase()) ||
				booking?.destination?.toLowerCase().includes(search?.toLowerCase()) ||
				booking?.passenger?.toLowerCase().includes(search?.toLowerCase()) ||
				String(booking?.id)?.toLowerCase().includes(search?.toLowerCase());

			return isMatch;
		}
	);

	const handleSort = (property) => {
		const isAscending = orderBy === property && order === 'asc';
		setOrder(isAscending ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const sortedBookings = [...filteredNotPricedBookings].sort((a, b) => {
		if (order === 'asc') {
			return a[orderBy] > b[orderBy] ? 1 : -1;
		} else {
			return a[orderBy] < b[orderBy] ? 1 : -1;
		}
	});

	const formattedPricedBookings = (driverChargeableJobs?.priced || []).map(
		(booking) => ({
			id: booking?.bookingId,
			date: booking?.date
				? new Date(booking?.date).toLocaleDateString('en-GB') +
					' ' +
					booking?.date?.split('T')[1]?.split('.')[0]?.slice(0, 5)
				: '-', // Ensure correct date format
			accNumber: booking?.accNo,
			driver: booking?.userId || '-',
			pickup: `${booking?.pickup}`,
			destination: `${booking?.destination}`,
			passenger: booking?.passenger || 'Unknown',
			hasVias: booking?.hasVias,
			coa: booking?.coa,
			waiting: booking?.waitingMinutes || 0,
			waitingCharge: booking?.waitingPriceDriver || 0,
			phoneNumber: booking?.phoneNumber || '',
			actualMiles: booking?.miles,
			driverFare: booking?.price || 0,
			parking: booking?.parkingCharge || 0,
			total: booking?.totalCost || 0,
			postedForStatement: booking?.postedForStatement,
			details: {
				details: booking?.details || '',
				vias: booking?.vias?.length
					? booking.vias
							.map((via) => `${via.address}, ${via.postCode}`)
							.join(' → ')
					: '',

				scope: booking?.scope === 4 ? 'Card' : 'Cash',
			},
		})
	);

	const sortedPricedBookings = [...formattedPricedBookings].sort((a, b) => {
		if (order === 'asc') {
			return a[orderBy] > b[orderBy] ? 1 : -1;
		} else {
			return a[orderBy] < b[orderBy] ? 1 : -1;
		}
	});

	const handleClose = () => {
		if (priceBaseModal) setPriceBaseModal(false);
	};

	const handleShow = () => {
		dispatch(
			refreshDriverChargeableJobs(
				selectedDriver,
				selectedScope,
				format(new Date(date), 'yyyy-MM-dd')
			)
		);
	};

	const handlePostButton = async (row) => {
		try {
			const postJob = row?.driverFare > 0 && true;
			const response = await driverPostOrUnpostJobs(postJob, row?.id);
			if (response?.status === 'success') {
				toast.success('Job posted successfully');
				handleShow();
			} else {
				toast.error('Failed to post job');
			}
		} catch (error) {
			console.error('Failed to post job:', error);
			toast.error('Failed to post job');
		}
	};

	const handleRevert = async (row) => {
		try {
			const response = await driverPostOrUnpostJobs(false, row?.id);
			if (response?.status === 'success') {
				toast.success('Job reverted successfully');
				handleShow();
			} else {
				toast.error('Failed to revert job');
			}
		} catch (error) {
			console.error('Failed to revert job:', error);
			toast.error('Failed to revert job');
		}
	};

	const handlePostAllPriced = async () => {
		try {
			// Filter bookings with driverFare > 0
			const jobsToPost = formattedNotPricedBookings.filter(
				(job) => Number(job.driverFare) > 0
			);

			console.log({ formattedNotPricedBookings, jobsToPost });

			if (jobsToPost.length === 0) {
				toast.error('No jobs available to post.');
				return;
			}

			// Create an array of API call promises
			const postRequests = jobsToPost.map((job) =>
				driverPostOrUnpostJobs(true, job.id)
			);

			// Execute all API calls concurrently
			const responses = await Promise.all(postRequests);

			// Check responses for success/failure
			const allSuccessful = responses.every((res) => res?.status === 'success');

			if (allSuccessful) {
				toast.success(`${jobsToPost.length} jobs posted successfully!`);
				handleShow();
			} else {
				toast.error('Some jobs failed to post.');
			}
		} catch (error) {
			console.error('Error posting all jobs:', error);
			toast.error('Failed to post all jobs.');
		}
	};

	const handleProcessDriver = async () => {
		try {
			if (
				!driverChargeableJobs?.priced ||
				driverChargeableJobs.priced.length === 0
			) {
				toast.info('No jobs available to post.');
				return;
			}

			console.log(driverChargeableJobs.priced);

			// API expects { jobs: [...] }, so we wrap the array inside an object
			const payload = driverChargeableJobs.priced.map((job) => ({
				accNo: job.accNo || 0,
				bookingId: job.bookingId || 0,
				userId: job.userId || 0,
				date: job.date || new Date().toISOString(),
				passengers: job.passengers || 0,
				pickup: job.pickup || '',
				pickupPostcode: job.pickupPostcode || '',
				destination: job.destination || '',
				destinationPostcode: job.destinationPostcode || '',
				vias: job.vias || [], // Ensure vias is an array
				hasVias: job.hasVias || false,
				passenger: job.passenger || 'string',
				price: job.price || 0,
				scope: job.scope || 0,
				cancelled: job.cancelled || false,
				coa: job.coa || false,
				vehicleType: job.vehicleType || 0,
				priceAccount: job.priceAccount || 0,
				details: job?.details || '',
				hasDetails: job?.hasDetails || false,
				waitingMinutes: job.waitingMinutes || 0,
				paymentStatus: job.paymentStatus || 0,
				waitingTime: job.waitingTime || '',
				waitingPriceDriver: job.waitingPriceDriver || 0,
				waitingPriceAccount: job.waitingPriceAccount || 0,
				parkingCharge: job.parkingCharge || 0,
				totalCharge: job.totalCharge || 0,
				totalCost: job.totalCost || 0,
				postedForInvoicing: job.postedForInvoicing || false,
				postedForStatement: job.postedForStatement || false,
				miles: job.miles || 0,
			}));

			console.log('Sending Payload:', payload); // Debugging

			// Call API with the wrapped payload
			const response = await driverCreateStatements(payload);

			if (response?.status === 'success') {
				toast.success(
					`${driverChargeableJobs?.priced?.length} jobs processed successfully!`
				);
				handleShow();
			} else {
				toast.error('Some jobs failed to process.');
			}
		} catch (error) {
			console.error('Error processing all jobs:', error);
			toast.error('Failed to process all jobs.');
		}
	};

	useEffect(() => {
		dispatch(refreshAllDrivers());
	}, [dispatch]);

	useEffect(() => {
		dispatch(setDriverChargeableJobs({ priced: [], notPriced: [] }));
	}, [dispatch]);

	return (
		<Fragment>
			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1580px] w-full'>
				<Toolbar>
					<ToolbarHeading>
						<ToolbarPageTitle />
						<ToolbarDescription>Driver Job Processor</ToolbarDescription>
					</ToolbarHeading>
				</Toolbar>

				<div className='ms-auto me-auto max-w-[1580px] w-full'>
					<div className='flex flex-col items-stretch gap-5 lg:gap-7.5'>
						<div className='flex flex-wrap items-center gap-5 justify-between'>
							<div className='card card-grid min-w-full'>
								<div className='card-header flex-wrap gap-2'>
									<div className='flex flex-wrap gap-2 lg:gap-5'>
										<div className='flex'>
											<label
												className='input input-sm hover:shadow-lg'
												style={{ height: '40px' }}
											>
												<KeenIcon icon='magnifier' />
												<input
													type='text'
													placeholder='Search Statements'
													value={search}
													onChange={(e) => setSearch(e.target.value)}
												/>
											</label>
										</div>
										<div className='flex flex-wrap items-center gap-2.5'>
											<Popover>
												<PopoverTrigger asChild>
													<button className='input border-gray-300 bg-transparent w-48 py-2 px-3 rounded-md'>
														<KeenIcon
															icon='calendar'
															className='mr-2'
														/>
														{date ? (
															format(date, 'LLL dd, y')
														) : (
															<span>Pick a date</span>
														)}
													</button>
												</PopoverTrigger>
												<PopoverContent
													className='w-auto p-0 shadow-md'
													align='start'
												>
													<Calendar
														initialFocus
														mode='single'
														defaultMonth={date}
														selected={date}
														onSelect={setDate}
														numberOfMonths={1}
													/>
												</PopoverContent>
											</Popover>

											<Select
												value={selectedDriver}
												onValueChange={(value) => setSelectedDriver(value)}
											>
												<SelectTrigger
													className=' w-32 hover:shadow-lg'
													size='sm'
													style={{ height: '40px' }}
												>
													<SelectValue placeholder='Select' />
												</SelectTrigger>
												<SelectContent className='w-36'>
													<SelectItem value={0}>All</SelectItem>
													{drivers?.length > 0 &&
														drivers?.map((driver) => (
															<>
																<SelectItem value={driver?.id}>
																	{driver?.id} - {driver?.fullName}
																</SelectItem>
															</>
														))}
												</SelectContent>
											</Select>

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

											<button
												className='btn btn-primary flex justify-center'
												onClick={handleShow}
											>
												Show Jobs
											</button>
										</div>
									</div>
								</div>
								<div className='card-body'>
									<div className='flex justify-start items-center gap-4 ml-4 mt-2 mb-2'>
										Awaiting Pricing - {driverChargeableJobs?.notPriced?.length}
										<button
											className='btn btn-primary flex justify-center'
											onClick={handlePostAllPriced}
										>
											Post All Priced
										</button>
									</div>
									<TableContainer
										component={Paper}
										className='shadow-none bg-white dark:bg-[#14151A] overflow-x-auto'
									>
										<Table className='text-[#14151A] dark:text-gray-100'>
											<TableHead
												className='bg-gray-100 dark:bg-[#14151A]'
												sx={{
													'& .MuiTableCell-root': {
														borderBottom: '1px solid #464852',
														fontWeight: 'bold', // Ensures header text stands out
													},
												}}
											>
												<TableRow>
													<TableCell className='w-8' />{' '}
													{/* Empty Cell for Expand Button */}
													<TableCell className='text-gray-900 dark:text-gray-700'>
														<TableSortLabel
															active={orderBy === 'id'}
															direction={order}
															onClick={() => handleSort('id')}
															sx={{
																'&:hover': { color: '#9A9CAE' }, // Change color on hover
																'&.Mui-active': { color: '#9A9CAE' },
																'&.Mui-active .MuiTableSortLabel-icon': {
																	color: '#9A9CAE',
																}, // Change to blue when active
															}}
														>
															#
														</TableSortLabel>
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														<TableSortLabel
															active={orderBy === 'date'}
															direction={order}
															onClick={() => handleSort('date')}
															sx={{
																'&:hover': { color: '#9A9CAE' }, // Change color on hover
																'&.Mui-active': { color: '#9A9CAE' },
																'&.Mui-active .MuiTableSortLabel-icon': {
																	color: '#9A9CAE',
																}, // Change to blue when active
															}}
														>
															Date
														</TableSortLabel>
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Acc #
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Driver
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Pickup
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Destination
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Passenger
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Has Vias
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Waiting
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Waiting Charge
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Actual Miles
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														<TableSortLabel
															active={orderBy === 'driverFare'}
															direction={order}
															onClick={() => handleSort('driverFare')}
															sx={{
																'&:hover': { color: '#9A9CAE' }, // Change color on hover
																'&.Mui-active': { color: '#9A9CAE' },
																'&.Mui-active .MuiTableSortLabel-icon': {
																	color: '#9A9CAE',
																}, // Change to blue when active
															}}
														>
															Driver Price
														</TableSortLabel>
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Parking
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Total
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														£
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Post
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Cancel
													</TableCell>
												</TableRow>
											</TableHead>

											<TableBody
												sx={{
													'& .MuiTableCell-root': {
														borderBottom: '1px solid #464852',
													},
												}}
											>
												{sortedBookings.map((row) => (
													<>
														{priceBaseModal && (
															<PriceBase
																open={priceBaseModal}
																onOpenChange={handleClose}
																bookingId={row?.id}
																handleShow={handleShow}
															/>
														)}
														<RowNotPriced
															key={row.id}
															row={row}
															setPriceBaseModal={setPriceBaseModal}
															handlePostButton={handlePostButton}
														/>
													</>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>

								<div className='card-body'>
									<div className='flex justify-start items-center gap-4 ml-4 mt-2 mb-2'>
										Ready for Processing -{' '}
										{driverChargeableJobs?.priced?.length}
										<button
											className='btn btn-success flex justify-center'
											onClick={handleProcessDriver}
										>
											Process Driver {driverChargeableJobs?.priced?.length}
										</button>
									</div>
									<TableContainer
										component={Paper}
										className='shadow-none bg-white dark:bg-[#14151A] overflow-x-auto'
									>
										<Table className='text-[#14151A] dark:text-gray-100'>
											<TableHead
												className='bg-gray-100 dark:bg-[#14151A]'
												sx={{
													'& .MuiTableCell-root': {
														borderBottom: '1px solid #464852',
														fontWeight: 'bold', // Ensures header text stands out
													},
												}}
											>
												<TableRow>
													<TableCell className='w-8' />{' '}
													{/* Empty Cell for Expand Button */}
													<TableCell className='text-gray-900 dark:text-gray-700'>
														<TableSortLabel
															active={orderBy === 'id'}
															direction={order}
															onClick={() => handleSort('id')}
															sx={{
																'&:hover': { color: '#9A9CAE' }, // Change color on hover
																'&.Mui-active': { color: '#9A9CAE' },
																'&.Mui-active .MuiTableSortLabel-icon': {
																	color: '#9A9CAE',
																}, // Change to blue when active
															}}
														>
															#
														</TableSortLabel>
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														<TableSortLabel
															active={orderBy === 'date'}
															direction={order}
															onClick={() => handleSort('date')}
															sx={{
																'&:hover': { color: '#9A9CAE' }, // Change color on hover
																'&.Mui-active': { color: '#9A9CAE' },
																'&.Mui-active .MuiTableSortLabel-icon': {
																	color: '#9A9CAE',
																}, // Change to blue when active
															}}
														>
															Date
														</TableSortLabel>
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Acc #
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Driver
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Pickup
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Destination
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Passenger
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Has Vias
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Waiting
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Waiting Charge
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Actual Miles
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														<TableSortLabel
															active={orderBy === 'driverFare'}
															direction={order}
															onClick={() => handleSort('driverFare')}
															sx={{
																'&:hover': { color: '#9A9CAE' }, // Change color on hover
																'&.Mui-active': { color: '#9A9CAE' },
																'&.Mui-active .MuiTableSortLabel-icon': {
																	color: '#9A9CAE',
																}, // Change to blue when active
															}}
														>
															Driver Price
														</TableSortLabel>
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Parking
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Total
													</TableCell>
													<TableCell className='text-gray-900 dark:text-gray-700'>
														Revert
													</TableCell>
												</TableRow>
											</TableHead>

											<TableBody
												sx={{
													'& .MuiTableCell-root': {
														borderBottom: '1px solid #464852',
													},
												}}
											>
												{sortedPricedBookings.map((row) => (
													<RowPriced
														key={row.id}
														row={row}
														handleRevert={handleRevert}
													/>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export { StateProcessing };

function PriceBase({ open, onOpenChange, bookingId, handleShow }) {
	const userData = JSON.parse(localStorage.getItem('userData'));
	const { driverChargeableJobs } = useSelector((state) => state.billing);
	const notPriced = driverChargeableJobs?.notPriced;
	const addLocalSchema = Yup.object().shape({
		priceFromBase: Yup.string().required('Contact Name is required'),
	});

	const booking = notPriced?.find((job) => job?.bookingId === bookingId);

	console.log({ bookingId, booking, userData });
	const initialValues = {
		priceFromBase: booking?.priceFromBase || false,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addLocalSchema,
		onSubmit: async (values, { setSubmitting }) => {
			console.log('Submitted Values:', values);
			try {
				const payload = {
					pickupPostcode: booking?.pickupPostcode || '',
					viaPostcodes: booking?.vias?.length
						? booking.vias.map((via) => via.postCode)
						: [], // Map via postcodes
					destinationPostcode: booking?.destinationPostcode || '',
					pickupDateTime: booking?.date || new Date().toISOString(), // Use booking date if available
					passengers: booking?.passengers || 0,
					priceFromBase: values.priceFromBase, // Use form value
					bookingId: booking?.bookingId || 0,
					actionByUserId: userData?.userId || 0,
					updatedByName: userData?.fullName || '', // Change as needed
					price: booking?.price || 0,
					priceAccount: booking?.priceAccount || 0,
					mileage: booking?.miles || 0,
					mileageText: `${booking?.miles || 0} miles`, // Convert miles to string
					durationText: '', // No duration available in provided object
				};
				const response = await driverPriceJobByMileage(payload);
				console.log('Response:', response);
				if (response.status === 'success') {
					toast.success('Charge From Base Updated Successfully');
					handleShow();
				} else {
					toast.error('Failed to Update Charge From Base');
				}
			} catch (error) {
				console.log(error);
			}
			setSubmitting(false);
			onOpenChange(); // Reset Formik's submitting state
		},
	});
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent className='max-w-[300px]'>
				<DialogHeader className='border-0'>
					<DialogTitle></DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<DialogBody className='flex flex-col items-center pt-0 pb-4'>
					<h3 className='text-lg font-medium text-gray-900 text-center mb-3'>
						Price
					</h3>

					<form
						onSubmit={formik.handleSubmit}
						className='w-full'
					>
						<div className='w-full flex justify-center items-center gap-2'>
							<div className='flex flex-col gap-1 pb-2 w-full'>
								<div className='flex items-center gap-2'>
									<label className='switch'>
										<span className='switch-label'>Charge from base?</span>
										<input
											type='checkbox'
											name='priceFromBase'
											checked={formik.values.priceFromBase}
											onChange={(e) =>
												formik.setFieldValue('priceFromBase', e.target.checked)
											}
										/>
									</label>
									{formik.touched.priceFromBase &&
										formik.errors.priceFromBase && (
											<span
												role='alert'
												className='text-danger text-xs mt-1'
											>
												{formik.errors.priceFromBase}
											</span>
										)}
								</div>
							</div>
						</div>

						<div className='flex justify-end mb-2 mt-2'>
							<button
								className='btn btn-light'
								onClick={() => onOpenChange()}
							>
								Cancel
							</button>
							<button
								className='btn btn-primary ml-2'
								type='submit'
							>
								Submit
							</button>
						</div>
					</form>
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
}
