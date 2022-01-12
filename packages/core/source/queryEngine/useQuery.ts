/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

const useQuery = (name: string, variables: [any]) => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let unmounted = false;
        (async () => {
            setLoading(true);
            try {
                const response = await axios.post("http://localhost:3001", {
                    name,
                    variables,
                });
                if (!unmounted) {
                    setResult(response);
                }
            } catch (queryError) {
                setError(queryError);
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            unmounted = true;
        };
    }, [name, variables]);

    return { result, loading, error };
};

export default useQuery;
