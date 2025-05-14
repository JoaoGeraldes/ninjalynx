import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    background: white;
    padding: 0.5em;
    color: black;
    width: 100%;
    min-width: 5em;
  }
  label {
    font-size: 1em;
    padding-bottom: 0.3em;
  }
`;

export default Form;
