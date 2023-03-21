function isFunction(value: unknown): value is Function {
	return typeof value === 'function'
}

function unFunction(value: unknown) {
	return isFunction(value) ? value() : value
}

export { isFunction, unFunction }
