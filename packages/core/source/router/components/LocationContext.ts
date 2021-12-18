/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext } from "react";

export interface LocationContextObject {
    location: Location;
    navigationType: NavigationType;
}

const LocationContext = createContext<LocationContextObject>(null!);
LocationContext.displayName = "Location";
export default LocationContext;
