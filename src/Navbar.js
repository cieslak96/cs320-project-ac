import React from "react";
import {Link} from "react-router-dom";

const Navbar = () =>{
return (
<nav>
    <div>
        <Link to="/">Home</Link>
        <span>  </span>
        <Link to="/about">About</Link>
    </div>
</nav>
);
};

export default Navbar;