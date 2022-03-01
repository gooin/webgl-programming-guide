import React from 'react';
import styled from 'styled-components';

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
