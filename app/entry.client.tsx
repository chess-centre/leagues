import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

// Getting hydration errors on React 18
// https://github.com/remix-run/remix/issues/2570
hydrate(<RemixBrowser />, document);
