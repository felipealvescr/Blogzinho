// MEU CSS
import styles from './Login.module.css'

import { useEffect, useState } from 'react'
import { useAuthentication } from '../../hooks/useAuthentication'
import { async } from '@firebase/util';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);
    console.log(res);
  };

  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  });

  return (
    <div>
      <section className={`${styles.login} container`}>
        <h1>Entrar</h1>
        <p>Faça o login para utilizar o sistema</p>
        <hr />
        <form>
          <label>
            <span>E-mail: </span>
            <input
            type="email"
            name='email'
            required
            placeholder='E-mail de usuário'
            onChange={(e) => setEmail(e.target.value)}
            value={email} />
          </label>
          
          <label>
            <span>Senha: </span>
            <input
            type="password"
            name='password'
            required
            placeholder='Insira a sua senha'
            onChange={(e) => setPassword(e.target.value)}
            value={password} />
          </label>

          {!loading && <button className='btn btn-success my-4'>Entrar</button>}
          {loading && <button className='btn btn-success my-4'>Aguarde...</button>}
          {error && <p className={`${styles.error} text-danger fw-bold`}>{error}</p>}

        </form>
      </section>
    </div>
  )
}

export default Login