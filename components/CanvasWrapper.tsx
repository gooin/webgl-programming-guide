import React from 'react';
import styled from 'styled-components';

type PropsType = {
    children: React.ReactNode
}

const Container = styled.div`
  //flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 2rem;

  #webgl {
    border: solid #6cf 3px;
    height: 500px;
    width: 500px;
  }
`;

function CanvasWrapper({ children }: PropsType) {
    return (
        <Container>
            {children}
        </Container>
    );
}

export default CanvasWrapper;
