import { useState, useEffect, useRef } from "react";

export default function useFetchAll(urls) {
  const prevUrls = useRef([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // only run if the array of URLs passed in changes
    if (areEqual(prevUrls.current, urls)) {
      setLoading(false);
      return;
    }
    prevUrls.current = urls;

    const promises = urls.map((url) =>
      fetch(process.env.REACT_APP_API_BASE_URL + url).then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
    );
    // built in js function that runs multiple promises at the same time.
    // so this will make multiple HTTp requests at the same time.
    Promise.all(promises)
      .then((json) => setData(json))
      .catch((e) => {
        console.error(e);
        setError(e);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  return { data, loading, error };
}

// function that compares the arrays to check if previous URLs are the same
function areEqual(array1, array2) {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}
