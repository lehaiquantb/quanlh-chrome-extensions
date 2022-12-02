import * as React from 'react';
import styled from 'styled-components/macro';
import { Logos } from './Logos';
import { Title } from './components/Title';
import { Lead } from './components/Lead';
import { A } from 'app/components/A';
import { Link, useNavigate } from 'react-router-dom';

export function Masthead() {
  const n = useNavigate();

  return (
    <Wrapper>
      <Logos />
      <Title>React Boilerplate meets CRAasdsad</Title>
      <Lead>
        Now you can use the{' '}
        <A
          href="https://www.reactboilerplate.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Boilerplate
        </A>{' '}
        as a{' '}
        <A
          href="https://github.com/facebook/create-react-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create React App
        </A>{' '}
        template.
        <Link to={process.env.PUBLIC_URL + '/hello'}>hello</Link>
        <button
          onClick={() => {
            n('/navi');
          }}
        >
          navi
        </button>
      </Lead>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
`;
