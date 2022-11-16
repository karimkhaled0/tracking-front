import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ProgressBar from "@badrap/bar-of-progress";
import Router from 'next/router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000 } },
});
const progress = new ProgressBar({
  size: 4,
  color: "#29e",
  className: "z-50",
  delay: 100
});

Router.events.on("routeChangeStart", progress.start)
Router.events.on("routeChangeComplete", progress.finish)
// Router.events.on("routeChangeError", progress.finish)

function MyApp({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
  </QueryClientProvider>
}

export default MyApp
