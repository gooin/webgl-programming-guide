import React from 'react';
import Link from 'next/link';
import { Layout as AntdLayout } from 'antd';
import styled from 'styled-components';

const { Header } = AntdLayout;

type PropsType = {
    children: React.ReactNode
    title: string
}

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;

  h2 {
    color: white;
    margin-right: 2rem;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
  

  .markdown-body {
    flex: 1
  }

`;

function Layout({ title, children }: PropsType) {
    // console.log('title', title);
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
