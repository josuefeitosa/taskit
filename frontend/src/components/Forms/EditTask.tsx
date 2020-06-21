import React, {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  MouseEvent,
  useEffect,
} from 'react';
import {
  Container,
  Form,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
} from 'reactstrap';
import { FiMinusCircle } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import './styles.css';

interface EditTaskProps {
  users: User[];
  currentTask: Task;
}

interface Task {
  id: number;
  title: string;
  term: string;
  status: string;
  teamMates: number[] | any;
  owner_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const EditTask: React.FC<EditTaskProps> = ({ users, currentTask }) => {
  const [taskData, setTaskData] = useState<Task>(currentTask);
  const [teamMates, setTeamMates] = useState<string[]>([]);
  const [ownerUser] = useState(() => {
    const storedUser = localStorage.getItem('@taskIt:user');

    if (storedUser) return JSON.parse(storedUser);

    return '';
  });

  useEffect(() => {
    setTeamMates(
      taskData.teamMates.map((innerTeamMate: User) => innerTeamMate.name),
    );
  }, [taskData]);

  const history = useHistory();

  useEffect(() => {
    console.log({ taskData, teamMates });
  }, [taskData, teamMates]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      // console.log(name, value);

      setTaskData({ ...taskData, [name]: value });
    },
    [taskData],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const teamMateUsers = taskData.teamMates.map(
        (innerTeamMate: User) => innerTeamMate.id,
      );

      const updatedTask = {
        title: taskData.title,
        term: taskData.term,
        status: taskData.status,
        owner_id: taskData.owner_id,
        teamMates: teamMateUsers,
      };

      const token = JSON.parse(
        JSON.stringify(localStorage.getItem('@taskIt:token')),
      );

      await api.put(`/v1/tasks/${taskData.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Tarefa atualizada com sucesso!');

      history.push('/');
    },
    [taskData, history],
  );

  const handleAddTeamMate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;

      const addedTeamMate = users.find(
        (user: User) => user.id === parseInt(value),
      );

      if (!taskData.teamMates.includes(parseInt(value))) {
        const newTeamMates = [...taskData.teamMates, addedTeamMate];

        setTaskData({ ...taskData, teamMates: newTeamMates });
      }
    },
    [taskData, users],
  );

  const handleRemoveTeamMate = useCallback(
    (e: MouseEvent, teamMate: string) => {
      e.preventDefault();

      const deletedTeamMateID = users.find(
        (user: User) => user.name === teamMate,
      )?.id;

      if (deletedTeamMateID === taskData.owner_id)
        return alert('Você não pode remover o criador desta tarefa!');

      const updatedTeamMates = taskData.teamMates.filter(
        (innerTeamMate: any) => innerTeamMate.id !== deletedTeamMateID,
      );

      return setTaskData({ ...taskData, teamMates: updatedTeamMates });
    },
    [taskData, users],
  );

  return (
    <Container className="form-container">
      <Card>
        <CardHeader>
          <h3>
            Atualizar <u>{taskData.title}</u>
          </h3>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit} className="form-div">
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
                onChange={handleAddTeamMate}
              >
                <option key={99} value="">
                  Selecione um usuário para adicioná-lo à tarefa
                </option>
                {users
                  .filter((user) => !teamMates.includes(user.name))
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                      {user.id === ownerUser.id ? ' (criador da tarefa)' : ''}
                    </option>
                  ))}
              </Input>
              <Container className="users-list-container border pt-1">
                <strong>Usuários relacionados à tarefa: </strong>
                {teamMates.length === 0 ? (
                  <p className="mt-2">Nenhum usuário relacionado</p>
                ) : (
                  ''
                )}
                <ul style={{ listStyleType: 'none' }}>
                  {teamMates.map((teamMate) => (
                    <li key={teamMate || 99} className="users-list-item">
                      <p>{teamMate}</p>
                      <Button
                        style={{ width: 40 }}
                        onClick={(e) => handleRemoveTeamMate(e, teamMate)}
                        color="danger"
                      >
                        <FiMinusCircle />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Container>
            </FormGroup>

            <Button type="submit" color="primary">
              Atualizar
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditTask;
