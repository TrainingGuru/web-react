import React, { Component } from 'react';

export default class Nav extends Component
{
    // // const [burgerClass, setBurgerClass] = useState("burgerBar unclicked");
    // // const [menuClass, setMenuClass] = useState("menu hidden");
    // const [isMenuClicked, setIsMenuClicked] = useState(false);

    // const updateMenu = () => {
    //     // if(!isMenuClicked) {
    //     //     setBurgerClass("burgerBar clicked");
    //     //     setMenuClass("menu visible");
    //     // }
    //     // else {
    //     //     setBurgerClass("burgerBar unclicked");
    //     //     setMenuClass("menu hidden");
    //     // }
    //     setIsMenuClicked(!isMenuClicked);
    // }

    render()
    {
        return (
            <div className='nav-container'>
                <nav className='navbar'>
                    <div className='burger-menu' onClick={updateMenu}>
                        {isMenuClicked ? <FontAwesomeIcon className='burger-menu-icon' icon={faX}/> : <FontAwesomeIcon style={styles.navStyles.burgerMenu.icon} icon={faBars}/>}
                    </div>
                    <div className='nav-logo'>
                        <img className='nav-logo-image'
                            src={"https://assets.api.uizard.io/api/cdn/stream/9789bb7f-8141-48f9-87dd-f2ebdadcbec6.png"}
                            alt="logo"/>
                    </div>
                    
                </nav>

                {/* <div style={isMenuClicked? {...styles.navStyles.menu, ...styles.navStyles.visible} : {...styles.navStyles.menu, ...styles.navStyles.hidden}}>
                    <div style={{...styles.navStyles.menu.link, ...styles.navStyles.button}}>
                        <FontAwesomeIcon style={styles.navStyles.menu.link.icon} icon={faHouseChimney}/>
                        <Link to="/" style={styles.navStyles.menu.link.a} onClick={updateMenu}>HOME</Link>
                    </div>
                    <div style={styles.navStyles.menu.link}>
                        <FontAwesomeIcon style={styles.navStyles.menu.link.icon} icon={faPeopleGroup}/>
                        <Link to="/clientscatchup" style={styles.navStyles.menu.link.a} onClick={updateMenu}>CLIENTS</Link>
                        <div style={styles.navStyles.menu.submenu}>
                            <div style={{...styles.navStyles.menu.submenu.link, ...styles.navStyles.button}}>
                                <FontAwesomeIcon style={styles.navStyles.menu.submenu.link.icon} icon={faClipboardList}/>
                                <Link to="/manageclients" style={styles.navStyles.menu.submenu.link.a} onClick={updateMenu}>MANAGE</Link>
                            </div>
                            <div style={{...styles.navStyles.menu.submenu.link, ...styles.navStyles.button}}>
                                <FontAwesomeIcon style={styles.navStyles.menu.submenu.link.icon} icon={faChartSimple}/>
                                <Link to="/clientscatchup" style={styles.navStyles.menu.submenu.link.a} onClick={updateMenu}>CATCH UP</Link>
                            </div>
                        </div>
                    </div>
                    <div style={{...styles.navStyles.menu.link, ...styles.navStyles.button}}>
                        <FontAwesomeIcon style={styles.navStyles.menu.link.icon} icon={faUser}/>
                        <Link to="/profile" style={styles.navStyles.menu.link.a} onClick={updateMenu}>PROFILE</Link>
                    </div>
                </div> */}
            </div>
        )
    }
}