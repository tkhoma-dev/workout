import { useState } from 'react'
import WorkoutSnapshot from './WorkoutSnapshot'
import { Tooltip as ReactTooltip } from "react-tooltip"
import WorkoutTooltipContent from './WorkoutTooltipContent'

/** Show vertical scroll when there are more than this many workouts. */
const SCROLL_THRESHOLD = 6;

interface WorkoutDetailProps {
	workouts: any[];
	selectWorkout: (workout: any, checked: boolean) => void;
	showCheckbox?: boolean;
	refreshWorkouts?: () => void;
	heightClass?: string;
}

export default function WorkoutDetail({
	workouts,
	selectWorkout,
	showCheckbox = false,
	refreshWorkouts = () => {},
	heightClass,
}: WorkoutDetailProps) {
	const [leftSelected, setLeftSelected] = useState(null)
	const [rightSelected, setRightSelected] = useState(null)

	const scrollBody = workouts.length > SCROLL_THRESHOLD
	const resolvedHeightClass = heightClass ?? 'max-h-[25rem]'

	return (
		<>
			<div
				className={
					scrollBody
						? `w-[90%] ml-6 mt-4 ${resolvedHeightClass} overflow-y-auto overscroll-y-contain`
						: 'w-[90%] ml-6 mt-4'
				}
			>
				<div className="flex items-center justify-between text-gray-700">
					<span className="text-gray-500 w-1/4 ml-12 pl-6">Date</span>
					<span className="text-gray-500 w-1/4">Training Load</span>
					<span className="text-gray-500 w-1/4">Calories</span>
					<span className="w-1/8">&nbsp;</span>
				</div>
				<div className="pr-6">
					{workouts.map((item, index) => (
						<WorkoutSnapshot
							key={`snapshot_${item.id}_${index}`}
							workout={item}
							onSelect={selectWorkout}
							showCheckbox={showCheckbox}
							leftSelected={leftSelected}
							setLeftSelected={setLeftSelected}
							rightSelected={rightSelected}
							setRightSelected={setRightSelected}
							refreshWorkouts={refreshWorkouts}
						/>
					))}
				</div>
			</div>
			{workouts.map((item, index) => (
				<ReactTooltip
					id={item.id}
					key={`${item.id}_${index}`}
					place="top"
					positionStrategy="fixed"
					globalCloseEvents={{ scroll: true }}
					style={{ backgroundColor : '#f3f4f6', color: "black" }}
					opacity={1}
				>
					<WorkoutTooltipContent
						key={index}
						item={item}
					/>
				</ReactTooltip>
			))}
		</>
	)
}
