# Solid-request

## Quick Start

With a strong ability to manage network requests, Hook has a flying experience

<br />

## Usage

```
npm i solid-request

import useRequest from "solid-request"

```

`useRequest` Through the plug-in organization code, the core code is easy to understand, and can be easily expanded to more advanced functions. Capacity is now available to include

- Automatic/manual request
- Polling
- Debounce
- Throttle
- Refresh on window focus
- Error retry
- Loading delay
- SWR(stale-while-revalidate)
- Caching
- InfiniteScroll
- Fetchs
- Plugins

## Default request

By default, the first parameter of `useRequest` is an asynchronous function, which is automatically executed when the component is initialized. At the same time, it automatically manages the status of `loading`, `data`, `error` of the asynchronous function.

```js
const { data, error, loading } = useRequest(service)
```
