import styles from './header.module.scss';
import { KeyIcon } from './utils/keyIcon';

export default function Header() {
  return (
  <header className={styles.header}>
      <div className={styles.brand}>
        <KeyIcon color="#66cc66"/>
        <div className={styles.title}>PassVault</div>
      </div>
  </header>
  )
}
