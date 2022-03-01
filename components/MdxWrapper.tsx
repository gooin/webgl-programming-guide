import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { Layout as AntdLayout, Menu } from 'antd';
import styled from 'styled-components';

const { Header, Content, Footer, Sider } = AntdLayout;

type PropsType = {
    children: React.ReactNode
}

const Container = styled.div`
    padding: 1rem;
`;

function MdxWrapper({ children }: PropsType) {
    return (
        <Container className={'markdown-body'}>
            {children}
        </Container>
    );
}

export default MdxWrapper;
