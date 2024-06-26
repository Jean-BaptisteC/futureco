'use client'

import useSetSearchParams from '@/components/useSetSearchParams'
import { useState } from 'react'
import { DialogButton } from '../UI'
import { useInterval } from 'usehooks-ts'
import Link from 'next/link'
import Image from 'next/image'

export const initialDate = (type = 'date') => {
	const stringDate = new Date().toLocaleString('fr')
	const [date, hour] = stringDate.split(' ')

	const day = date.split('/').reverse().join('-')
	if (type === 'day') return day

	return day + 'T' + hour.slice(0, -3)
}

// Can be type date (day + hour) or type day
export default function DateSelector({ date, type = 'date' }) {
	const defaultDate = initialDate(type)
	const [localDate, setLocalDate] = useState(date || defaultDate)
	const setSearchParams = useSetSearchParams()
	return (
		<div
			css={`
				display: flex;
				align-items: center;
				> input {
					margin-right: 0.4rem !important;
					font-size: 110%;
					height: 1.4rem;
					padding: 0 0.2rem;
					color: var(--darkerColor);
					border: 2px solid var(--darkColor);
					border-radius: 0.15rem;
				}
			`}
		>
			<input
				type={type === 'date' ? 'datetime-local' : 'date'}
				id="date"
				name="date"
				value={localDate}
				min={defaultDate}
				onChange={(e) => {
					const value = e.target.value
					// changing e.g. the weekday starting with the 0 diigt with the keyboard will make value '' on firefox, LOL
					if (value !== '') setLocalDate(e.target.value)
				}}
			/>
			{date !== localDate && (
				<DialogButton
					onClick={() =>
						setSearchParams(
							type === 'date'
								? { date: encodeDate(localDate) }
								: { day: encodeDate(localDate) }
						)
					}
					css={`
						font-size: 100%;
					`}
				>
					OK
				</DialogButton>
			)}
			{type === 'date' && (
				<UpdateDate
					date={localDate}
					updateDate={(newDate) =>
						setSearchParams({ date: encodeDate(newDate) }, true)
					}
				/>
			)}
		</div>
	)
}

const newTimestamp = () => new Date().getTime() / 1000
const UpdateDate = ({ date, updateDate }) => {
	const [now, setNow] = useState(newTimestamp())

	useInterval(() => {
		setNow(newTimestamp())
	}, 5 * 1000)
	const isOutdated = now - new Date(date).getTime() / 1000 > 10

	if (!isOutdated) return null
	return (
		<Link href={updateDate(initialDate())}>
			<Image
				src={'/invertIcon.svg'}
				alt="Rafraichir l'heure de départ"
				width="10"
				height="10"
				css={`
					width: 1.5rem;
					height: auto;
					vertical-align: middle;
					margin-left: 0.2rem;
				`}
			/>
		</Link>
	)
}
export const encodeDate = (date) => date?.replace(/:/, 'h')
export const decodeDate = (date) => date?.replace(/h/, ':')
