/** @format */
import { useState } from 'react';
import { IoChevronUpSharp } from 'react-icons/io5';
import { IoChevronDownSharp } from 'react-icons/io5';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { KeenIcon } from '@/components';

const AvailabilityLogs = () => {
	const [driverNumber, setDriverNumber] = useState(0);
	const [date, setDate] = useState(new Date());

	return (
		<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1580px] w-full'>
			{/* Header Section */}
			<h2 className='text-xl leading-none font-medium text-gray-900'>
				Change Log of Availability #: {driverNumber}
			</h2>

			{/* Filter Inputs */}
			<div className='flex flex-wrap items-center gap-4 mt-4'>
				{/* Driver Number Selection */}
				<div className='flex flex-col gap-1'>
					{/* Improved Label Styling */}
					<label className='form-label text-gray-900'>Driver Number</label>

					<div className='flex items-center border rounded-md px-2 py-1 dark:bg-[#1F212A] border-gray-300 dark:border-gray-300 hover:shadow-md'>
						<span className='px-4 text-xs font-medium'>{driverNumber}</span>

						{/* Buttons placed vertically */}
						<div className='flex flex-col'>
							<button
								className='px-2 dark:text-white rounded-t-md hover:bg-gray-300 transition-all'
								onClick={() => setDriverNumber(driverNumber + 1)}
							>
								<IoChevronUpSharp
									fontSize='14'
									className='dark:text-[#9A9CAE]'
								/>
							</button>
							<button
								className='px-2  dark:text-white rounded-b-md hover:bg-gray-300 transition-all'
								onClick={() => setDriverNumber(Math.max(0, driverNumber - 1))}
							>
								<IoChevronDownSharp
									fontSize='14'
									className='dark:text-[#9A9CAE]'
								/>
							</button>
						</div>
					</div>
				</div>

				{/* Date Picker */}
				<div className='flex flex-col gap-1'>
					{/* Added Label for Date Picker */}
					<label
						htmlFor='date'
						className='form-label text-gray-900'
					>
						Date
					</label>

					<div className='flex items-center gap-2 relative'>
						<Popover>
							<PopoverTrigger
								asChild
								className='h-[2.27rem]'
							>
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
									{date ? format(date, 'LLL dd, y') : <span>Pick a date</span>}
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
					</div>
				</div>
			</div>

			{/* No Availability Message */}
			<div className='mt-4 p-4 bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-200 rounded-md text-center text-sm font-medium'>
				ℹ️ No Availability
			</div>
		</div>
	);
};

export { AvailabilityLogs };
