/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

const useLazyQuery = (name: string, variables: [any]) => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const [execute, setExecute] = useState(false);

    useEffect(() => {
        let unmounted = false;
        (async () => {
            if (execute) {
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
            }
        })();
        return () => {
            unmounted = true;
        };
    }, [name, variables, execute]);

    const trigger = () => {
        setExecute(true);
    };

    return [trigger, { result, loading, error }];
};

export default useLazyQuery;
