import { createContext } from "react";

export interface IEvaluationContext {
    [key: string]: any;
}

const EvaluationContext = createContext<IEvaluationContext>({});

export default EvaluationContext;
