'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { api } from '../../lib/api';
export default function Login() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  async function enviar(e){e.preventDefault();setError('');setLoading(true);try{const r=await api('/auth/login',{method:'POST',body:JSON.stringify({email,password})});localStorage.setItem('gestor_token',r.token);window.location.href='/admin';}catch(err){setError(err.message);}finally{setLoading(false);}}
  return <div className="shell"><Header/><main className="panel form-card"><Link className="backlink" href="/">← Volver al inicio</Link><div style={{marginTop:24}}><h1>Acceso administrativo</h1><p className="muted">Ingresá tus credenciales para gestionar las reparaciones.</p></div><form onSubmit={enviar}><div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@gestor.com" required/></div><div className="field"><label>Contraseña</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Tu contraseña" required/></div>{error&&<div className="alert">{error}</div>}<button className="btn" style={{width:'100%',marginTop:8}} disabled={loading}>{loading?'Ingresando...':'Ingresar'}</button></form><p className="notice" style={{marginTop:18}}>El acceso está reservado al personal autorizado.</p></main></div>;
}
