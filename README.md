# Mantine + Vite template

Official [Mantine](https://mantine.dev/) + [Vite](https://vitejs.dev/) template.

Links:

- [Mantine documentation](https://mantine.dev/)
- [Vite documentation](https://vitejs.dev/)

## Issues with useEffect:

data fetching and set state code was written inside useEffect and caused these problems:

- **race conditions**: lack of a clean up function that ignored stale responses introduced bugs when responses arrived in a different order

- **no instant back button**: when the user navigated to another page and then clicked browser Back button, there was no data to show them because there is no cache and previous page was already unmounted.

- **slow navigation**: parent and child components were both doing fetching and the child components cannot start fetching data until the parent component finished fetching.
