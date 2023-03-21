export async function getList({ id }: { id: number }): Promise<{
	id: number
	title: string
	body: string
	userId: number
}> {
	console.log(id)

	return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
		(response) => response.json()
	)
}
