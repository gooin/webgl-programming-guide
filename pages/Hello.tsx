import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef } from 'react';
import styles from '../styles/Home.module.css';
import BaseCanvas from '../components/BaseCanvas';

const Hello: NextPage = () => {

  const ref = useRef<HTMLCanvasElement | undefined>(undefined);
  return (
      <div className={styles.container}>
        <BaseCanvas ref={ref}/>
      </div>
  );
};

export default Hello;
