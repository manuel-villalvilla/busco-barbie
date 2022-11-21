import styles from './Loader.module.css'
import Image from "next/image";

export default function Loader() {
    return <div className={styles.container}><div className={styles.rotateScaleUp}><Image src='/logo4.png' width={100} height={50}></Image></div></div>;
}