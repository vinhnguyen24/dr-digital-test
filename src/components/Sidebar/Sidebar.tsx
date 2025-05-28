import React from 'react';
import styles from './Sidebar.module.scss';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
import { ReactComponent as CommIcon } from '../../assets/icons/com-icon.svg';
import { ReactComponent as BagIcon } from '../../assets/icons/bag-icon.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import avatar from '../../assets/images/avatar.png';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Logo className={styles.logo} />
        <button className={styles.menuBtn}>
          <CommIcon />
          
        </button>
        <button className={styles.menuBtn}>
          <BagIcon />
          
        </button>
      </div>

      <div className={styles.bottom}>
        <img src={avatar} alt="User avatar" className={styles.avatar} />
        <button className={styles.logoutBtn}>
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
