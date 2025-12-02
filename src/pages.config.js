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
import Sources from './pages/Sources';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import About from './pages/About';
import Changelog from './pages/Changelog';
import UseCases from './pages/UseCases';
import WhyUs from './pages/WhyUs';
import Demo from './pages/Demo';
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
    "Sources": Sources,
    "Disclaimer": Disclaimer,
    "Contact": Contact,
    "Admin": Admin,
    "About": About,
    "Changelog": Changelog,
    "UseCases": UseCases,
    "WhyUs": WhyUs,
    "Demo": Demo,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};