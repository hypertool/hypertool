import { ApolloClient, gql, InMemoryCache, useMutation } from "@apollo/client";
import cloneDeep from "lodash.clonedeep";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
  cache: new InMemoryCache(),
});

const EXECUTE_QUERY = gql`
  mutation ExecuteQuery(
    $name: String!
    $variables: GraphQLJSON!
    $format: QueryResultFormat!
  ) {
    executeQuery(name: $name, variables: $variables, format: $format) {
      result
      error
    }
  }
`;

const useExecuteQuery = () => {
  const [mutate, { data, loading, error }] = useMutation(EXECUTE_QUERY, {
    notifyOnNetworkStatusChange: true,
    client,
  });

  type Mutate = typeof mutate;
  const executeQuery = (async (...values: any[]) => {
    const result = await mutate(...values);

    const trimmed = cloneDeep(result?.data?.executeQuery ?? {});
    delete trimmed.__typename;

    return trimmed;
  }) as Mutate;

  return {
    executeQuery,
    data,
    loading,
    error,
  };
};

export default useExecuteQuery;
