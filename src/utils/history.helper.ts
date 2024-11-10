import { createBrowserHistory } from 'history';

export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}
const history = createBrowserHistory({ window });

export default history;
