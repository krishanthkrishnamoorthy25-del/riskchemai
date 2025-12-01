import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import Security from './pages/Security';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Legal from './pages/Legal';
import Cookies from './pages/Cookies';
import Analysis from './pages/Analysis';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "Features": Features,
    "Pricing": Pricing,
    "Account": Account,
    "Security": Security,
    "Support": Support,
    "Privacy": Privacy,
    "Terms": Terms,
    "Legal": Legal,
    "Cookies": Cookies,
    "Analysis": Analysis,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};