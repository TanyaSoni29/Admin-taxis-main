/** @format */

import { Fragment } from 'react';
// import { Container } from '@/components/container';
import {
	Toolbar,
	ToolbarActions,
	ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { Demo1LightSidebarContent } from '../light-sidebar';
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
// import { addDays, format } from 'date-fns';
// import { cn } from '@/lib/utils';
// import { KeenIcon } from '@/components/keenicons';
const Demo1DarkSidebarPage = () => {
	// const [date, setDate] = useState({
	// 	from: new Date(2025, 0, 20),
	// 	to: addDays(new Date(2025, 0, 20), 20),
	// });
	return (
		<Fragment>
			<div className=' pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1850px] w-full'>
				<Toolbar>
					<ToolbarHeading
						title='Dashboard'
						description=''
					/>
					<ToolbarActions>
						{/* <Popover>
							<PopoverTrigger asChild>
								<button
									id='date'
									className={cn(
										'btn btn-sm btn-light data-[state=open]:bg-light-active',
										!date && 'text-gray-400'
									)}
								>
									<KeenIcon
										icon='calendar'
										className='me-0.5'
									/>
									{date?.from ? (
										date.to ? (
											<>
												{format(date.from, 'LLL dd, y')} -{' '}
												{format(date.to, 'LLL dd, y')}
											</>
										) : (
											format(date.from, 'LLL dd, y')
										)
									) : (
										<span>Pick a date range</span>
									)}
								</button>
							</PopoverTrigger>
							<PopoverContent
								className='w-auto p-0'
								align='end'
							>
								<Calendar
									initialFocus
									mode='range'
									defaultMonth={date?.from}
									selected={date}
									onSelect={setDate}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover> */}
					</ToolbarActions>
				</Toolbar>
			</div>

			<div className='pe-[1.875rem] ps-[1.875rem] ms-auto me-auto max-w-[1850px] w-full'>
				<Demo1LightSidebarContent />
			</div>
		</Fragment>
	);
};
export { Demo1DarkSidebarPage };
