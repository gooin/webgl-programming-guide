import React from 'react';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';

type PropsType = {
    children: React.ReactNode
}

const Container = styled.div`
  //flex: 1;
`;
const Content = styled.div`
  padding: 1rem;
`;

function MdxWrapper({ children }: PropsType) {
    return (
        <Container>
            <PerfectScrollbar>
                <Content className={'markdown-body'}>
                    {children}
                </Content>
            </PerfectScrollbar>
        </Container>
    );
}

export default MdxWrapper;
