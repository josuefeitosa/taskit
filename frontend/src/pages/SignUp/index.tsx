import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Container,
  Form,
  FormGroup,
  // Card,
  // CardHeader,
  // CardBody,
  Input,
  Button,
} from 'reactstrap';

import api from '../../services/api';
import './styles.css';

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
  });

  const history = useHistory();

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.currentTarget;
      // console.log(name, value);

      setSignUpData({ ...signUpData, [name]: value });
    },
    [signUpData],
  );

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        await api.post('/v1/users', signUpData);

        alert('Cadastro efetuado com sucesso!');

        history.push('/');
      } catch (error) {
        alert('Cadastro falhou. Tente novamente!');
      }
    },
    [signUpData, history],
  );

  return (
    <Container className="background-container">
      <Container className="signup-container">
        <h3>Bem vindo ao TaskIt!</h3>
        <p>Faça seu cadastro em nossa plataforma</p>

        <Form onSubmit={handleFormSubmit}>
          <FormGroup>
            <label htmlFor="name">Nome</label>
            <Input
              className="form-control"
              type="text"
              id="name"
              name="name"
              value={signUpData.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <Input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={signUpData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password">Senha</label>
            <Input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={signUpData.password}
              onChange={handleInputChange}
            />
          </FormGroup>

          <Button type="submit" color="primary">
            Cadastrar-se
          </Button>
        </Form>

        <Link to="/">
          <p>Voltar para login</p>
        </Link>
      </Container>
    </Container>
  );
};

export default SignUp;
