import React, { useCallback, useState, useEffect, EventHandler } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Container, Button, Modal, Table } from 'reactstrap';
import { FiPlus, FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';

import './styles.css';

import api from '../../services/api';

import AddTask from '../../components/Forms/AddTask';
import EditTask from '../../components/Forms/EditTask';

interface Task {
  id: number;
  title: string;
  term: string;
  status: string;
  users: TaskUser[];
  owner_id: number;
}

interface TaskUser {
  id: number;
  name: string;
  email: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const token = JSON.parse(
      JSON.stringify(localStorage.getItem('@taskIt:token')),
    );

    api
      .get<Task[]>('/v1/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTasks(response.data);
      });

    api
      .get<User[]>('/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      });
  }, []);

  useEffect(() => {
    // console.log(users);
  }, [tasks, users]);

  const toggleModal = () => setModal(!modal);

  const history = useHistory();

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('@taskIt:user');
    localStorage.removeItem('@taskIt:token');

    history.push('/');
  }, [history]);

  const handleDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
      e.preventDefault();

      window.confirm('Deseja mesmo deletar esta tarefa?');

      const token = JSON.parse(
        JSON.stringify(localStorage.getItem('@taskIt:token')),
      );

      await api.delete(`/v1/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      history.push('/');
    },
    [history],
  );

  const handleEdit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
      setCurrentTask(tasks.find((task) => task.id === id));
      setModal(true);
      setEditing(true);
    },
    [tasks],
  );

  return (
    <>
      {modal && (
        <Modal isOpen={modal} toggle={toggleModal}>
          {editing ? (
            currentTask && (
              <EditTask
                currentTask={{
                  id: currentTask.id,
                  term: moment(currentTask.term, 'DD/MM/YYYY').format(
                    'YYYY-MM-DD',
                  ),
                  teamMates: currentTask.users,
                  owner_id: currentTask.owner_id,
                  status: currentTask.status,
                  title: currentTask.title,
                }}
                users={users}
              />
            )
          ) : (
            <AddTask users={users} />
          )}
        </Modal>
      )}
      <Container>
        <header className="dashboard-header">
          <div className="dashboard-title">
            <h1>Tarefas</h1>
            <Button
              type="button"
              color="success"
              onClick={(e) => {
                e.preventDefault();

                setModal(true);
                setEditing(false);
              }}
            >
              <FiPlus />
            </Button>
          </div>

          <div className="dashboard-title-logout">
            <a href="/" onClick={handleLogout}>
              {'Sair '}
              <FiLogOut />
            </a>
          </div>
        </header>

        <Container className="dashboard-table-container">
          <Table striped responsive styles={{ margin: '0 auto' }}>
            <thead>
              <tr>
                <th scope="col">Tarefa</th>
                <th scope="col">Status</th>
                <th scope="col">Prazo</th>
                <th scope="col">Responsável</th>
                <th scope="col">Envolvidos</th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const owner = users.find((user) => task.owner_id === user.id);

                if (owner)
                  return (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.status}</td>
                      <td>{task.term}</td>
                      <td>{owner.name}</td>
                      <td>
                        {task.users.map((user) => (
                          <p key={user.id}>{`${user.name}`}</p>
                        ))}
                      </td>
                      <td>
                        <Button
                          style={{ width: 40, marginRight: 5 }}
                          onClick={(e) => handleEdit(e, task.id)}
                          color="info"
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          style={{ width: 40 }}
                          onClick={(e) => handleDelete(e, task.id)}
                          color="danger"
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  );

                return <></>;
              })}
            </tbody>
          </Table>
        </Container>
      </Container>
    </>
  );
};

export default Dashboard;
