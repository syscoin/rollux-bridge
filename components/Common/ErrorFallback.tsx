


// @ts-ignore
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <>
            <h1>Something went wrong :(</h1>
            <br />
            <pre>{error.message}</pre>

            <button onClick={resetErrorBoundary}>Try again</button>
        </>
    )
}

export default ErrorFallback;