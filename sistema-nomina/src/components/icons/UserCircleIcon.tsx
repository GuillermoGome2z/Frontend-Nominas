type Props = {
	className?: string
}

export default function UserCircleIcon({ className = '' }: Props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			className={className}
		>
			<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM2 20a10 10 0 1 1 20 0H2z" />
		</svg>
	)
}
