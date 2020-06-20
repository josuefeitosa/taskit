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

import { useAuth } from '../../hooks/auth';
import './styles.css';

interface LoginForm {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const { signIn } = useAuth();
  const history = useHistory();

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      // console.log(name, value);

      setLoginData({ ...loginData, [name]: value });
    },
    [loginData],
  );

  // useEffect(() => {
  //   console.log(loginData);
  // }, [loginData]);

  const handleLoginSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        await signIn(loginData);

        history.push('/dashboard');
      } catch (error) {
        alert('Login falhou. Tente novamente!');
      }
    },
    [loginData, signIn, history],
  );

  return (
    <Container className="background-container">
      <Container className="login-container">
        <h3>Bem vindo ao TaskIt!</h3>
        <p>Faça seu logon em nossa plataforma</p>

        <Form onSubmit={handleLoginSubmit}>
          <FormGroup>
            <label htmlFor="email">Email</label>
            <Input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={loginData.email}
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
              value={loginData.password}
              onChange={handleInputChange}
            />
          </FormGroup>

          <Button type="submit" color="primary">
            Login
          </Button>
        </Form>
        <Link to="/signup">
          <p>Faça seu cadastro</p>
        </Link>
      </Container>
    </Container>
  );
};

export default SignIn;
