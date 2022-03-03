import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>WebGL 编程指南</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    WebGL 编程指南笔记
                </h1>

                <p className={styles.description}>
                </p>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h2>HelloWebGL &rarr;</h2>
                        <Link href="/Hello">
                            <a>Hello</a>
                        </Link>
                    </div>
                    <div className={styles.card}>
                        <h2>Ch4: 高级变换与动画基础 &rarr;</h2>
                        <Paragraph>
                            <Link href="/ch4/TranslateRotate">
                                <a>平移，然后旋转</a>
                            </Link>
                        </Paragraph>

                        <Paragraph>
                            <Link href="/ch4/Animate">
                                <a>动画</a>
                            </Link>
                        </Paragraph>
                    </div>
                    <div className={styles.card}>
                        <h2>Ch5 颜色与纹理 &rarr;</h2>
                        <Paragraph>
                            <Link href="/ch5/PointSizeInVertShader">
                                <a>将非坐标数据传入顶点着色器</a>
                            </Link>
                        </Paragraph>

                        <Paragraph>
                            <Link href="/ch5/MultiAttributeSizeInterleaved">
                                <a>gl.vertexAttribPointer() 的步进和偏移参数</a>
                            </Link>
                        </Paragraph>
                        <Paragraph>
                            <Link href="/ch5/ChangeColorByVarying">
                                <a>修改颜色（varying变量）</a>
                            </Link>
                        </Paragraph>
                        <Paragraph>
                            <Link href="/ch5/Texture">
                                <a>纹理映射</a>
                            </Link>
                        </Paragraph>
                        <Paragraph>
                            <Link href="/ch5/MultiTexture">
                                <a>多幅纹理映射</a>
                            </Link>
                        </Paragraph>
                    </div>

                    <div className={styles.card}>
                        <h2>Ch7 进入三维世界 &rarr;</h2>
                        <Paragraph>
                            <Link href="/ch7/EyePointAndViewDirection">
                                <a>视点和视线</a>
                            </Link>
                        </Paragraph>

                        <Paragraph>
                            <Link href="/ch7/LookAtRotatedTrangles">
                                <a>观察旋转的三角形</a>
                            </Link>
                        </Paragraph>

                        <Paragraph>
                            <Link href="/ch7/OrthoView">
                                <a>正射投影</a>
                            </Link>
                        </Paragraph>
                    </div>
                </div>

            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16}/>
          </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
