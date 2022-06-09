import type { FunctionComponent, ReactElement } from "react";

import "./Splash.css";

const Splash: FunctionComponent = (): ReactElement => {
    return (
        <div className="splash-screen">
            <div className="center">
                <div className="logo-container">
                    <img
                        className="logo"
                        src="https://res.cloudinary.com/hypertool/image/upload/v1642502111/hypertool-starter/hypertool-logo_xvqljy.png"
                        alt="Hypertool logo"
                    />
                </div>

                <div className="spinner-wrapper">
                    <div className="spinner">
                        <div className="inner">
                            <div className="gap"></div>
                            <div className="left">
                                <div className="half-circle"></div>
                            </div>
                            <div className="right">
                                <div className="half-circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Splash;
