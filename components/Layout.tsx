import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Layout as AntdLayout, Menu } from 'antd';
import styled from 'styled-components';

const { Header, Content, Footer, Sider } = AntdLayout;

type PropsType = {
    children: React.ReactNode
    title: string
}

const HeaderWrapper = styled.div`
  display: flex;

  h2 {
    color: white;
    margin-right: 2rem;
  }
`;

function Layout({ title, children }: PropsType) {
    console.log('title', title);
    return (
        <AntdLayout>
            <Header>
                <HeaderWrapper>
                    <h2>{title}</h2>
                    <Link href="/">
                        <a>返回首页</a>
                    </Link>
                </HeaderWrapper>
            </Header>
            <AntdLayout>
                <Content>{children}</Content>
            </AntdLayout>
        </AntdLayout>
    );
}

export default Layout;
