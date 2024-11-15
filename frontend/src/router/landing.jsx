

import { Routes, Route} from "react-router-dom"

import { LandingMain } from "../LandingPage";
import { HandlerAuth } from "../Auth";

export const Landing = () => {
    return (
        <Routes>
            <Route>
                <Route path="/" element={<LandingMain /> } />
                <Route path="/login" element={<HandlerAuth />} />
            </Route>
        </Routes>
    )
}
