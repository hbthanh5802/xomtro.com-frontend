import queryString from 'query-string';
import { useLocation, useParams } from 'react-router-dom';

const useUrl = () => {
  const { pathname, search, hash, state } = useLocation();
  const params = useParams();

  return { pathname, search: queryString.parse(search), hash, state, params };
};

export default useUrl;
