import { useState, useEffect, useRef } from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function useFetch(url) {
  const isMounted = useRef(false); // basically an instance variable
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMounted.current = true; // change ref value
    async function init() {
      try {
        const response = await fetch(baseUrl + url);
        if (response.ok) {
          const json = await response.json();
          if (isMounted.current) setData(json);
        } else {
          throw response;
        }
      } catch (err) {
        if (isMounted.current) setError(err);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }
    init();
    // when the component is unmounted, the function is called and isMounted is set to false.
    return () => {
      isMounted.current = false;
    };
  }, [url]);
  return { data, error, loading };
}

// render prop pattern
// create a component that accepts a prop called render
// the component passes data/funcs to the render function
// instead of children you can use render, children is used for using the children prop
export function Fetch({ url, children }) {
  const { data, loading, error } = useFetch(url);
  return children(data, loading, error);
}
