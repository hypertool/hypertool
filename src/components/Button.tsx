import {
  FunctionComponent,
  ReactElement,
  useCallback,
  useContext,
} from "react";
import { ControllersContext } from "../contexts";

export interface IProps {
  text?: string;
  onClick?: {
    moduleId: string;
    target: string;
  };
}

const Button: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { text, onClick } = props;
  const { controller, context } = useContext(ControllersContext);
  console.log(props);

  const handleClick = useCallback(() => {
    const { target = "" } = onClick || {};
    const callback = controller[target];

    if (callback) {
      callback(context);
    }
  }, [context, controller, onClick]);

  return <button onClick={handleClick}>{text}</button>;
};

export default Button;
