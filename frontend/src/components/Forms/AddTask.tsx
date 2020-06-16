import React, {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  useEffect,
} from 'react';
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
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import './styles.css';

interface AddTaskProps {
  users: User[];
}

interface Task {
  title: string;
  term: string;
  status: string;
  teamMates: number[];
}

interface User {
  id: number;
  name: string;
  email: string;
}

const AddTask: React.FC<AddTaskProps> = ({ users }) => {
  const initialTask = {
    title: '',
    term: '',
    status: '',
    teamMates: [],
  };
  const [taskData, setTaskData] = useState<Task>(initialTask);
  const [teamMates, setTeamMates] = useState<string[]>([]);

  const history = useHistory();

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      // console.log(name, value);

      setTaskData({ ...taskData, [name]: value });
    },
    [taskData],
  );

  useEffect(() => {
    if (taskData.teamMates.length > 0)
      setTeamMates(
        users.map((user) =>
          taskData.teamMates.includes(user.id) ? user.name : '',
        ),
      );
  }, [taskData, users]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const token = JSON.parse(
        JSON.stringify(localStorage.getItem('@taskIt:token')),
      );

      await api.post('/v1/tasks', taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      history.push('/');
    },
    [taskData, history],
  );

  const handleTeamMate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;

      if (!taskData.teamMates.includes(parseInt(value))) {
        const newTeamMates = [...taskData.teamMates, parseInt(value)];

        setTaskData({ ...taskData, teamMates: newTeamMates });
      }
    },
    [taskData],
  );

  return (
    <Container className="form-container">
      <h3>Crie uma nova tarefa!</h3>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="title">Nome da Tarefa</label>
          <Input
            className="form-control"
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="term">Prazo</label>
          <Input
            className="form-control"
            type="date"
            id="term"
            name="term"
            value={taskData.term}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="status">Status</label>
          <Input
            className="form-control"
            type="select"
            id="status"
            name="status"
            value={taskData.status}
            onChange={handleInputChange}
          >
            <option value="Stand by">Stand by</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluída">Concluída</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <label htmlFor="teamMates">Participantes</label>
          <Input
            className="form-control"
            type="select"
            id="status"
            name="status"
            value={taskData.status}
            onChange={handleTeamMate}
          >
            {users
              .filter((user) => !taskData.teamMates.includes(user.id))
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </Input>
          <div>
            <ul style={{ listStyleType: 'none' }}>
              {teamMates.map((teamMate) => (
                <li key={teamMate || 99}>{teamMate}</li>
              ))}
            </ul>
          </div>
        </FormGroup>

        <Button type="submit" color="primary">
          Criar
        </Button>
      </Form>
    </Container>
  );
};

export default AddTask;
