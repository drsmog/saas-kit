import "#src/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { store } from "#src/shared/store";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import useErrorHandler from "#src/shared/error/useErrorHandler";
import ErrorFallback from "#src/shared/error/ErrorFallback";
import { SessionProvider } from "next-auth/react";
import theme from "#src/shared/theme";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trackPageView } from "#src/shared/analitics";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();

  const errorHandler = useErrorHandler();
  const errorBoundaryHandler = (error, info) => {
    errorHandler(
      error,
      ["global-error-boundary"],
      {
        message: error.message,
        componentStack: info?.componentStack,
      },
      false
    );
  };

  useEffect(() => {
    const handleRouteChange = (url) => {
      trackPageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {process.env.NEXT_PUBLIC_TRACK_EVENTS === "true" && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
    `,
            }}
          />
        </>
      )}
      <SessionProvider session={session}>
        <Provider store={store}>
          <ChakraProvider theme={theme}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={errorBoundaryHandler}
            >
              <Component {...pageProps} />
            </ErrorBoundary>
          </ChakraProvider>
        </Provider>
      </SessionProvider>
    </>
  );
}
