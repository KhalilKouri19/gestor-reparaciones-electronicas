'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import { api } from '../../lib/api';
const initial={nombreCliente:'',email:'',telefono:'',marca:'',modelo:'',problemaReportado:''};
const estados=['Ingresado','En Diagnóstico','Reparado','Entregado'];
export default function Admin(){const [rows,setRows]=useState([]);const [form,setForm]=useState(initial);const [filters,setFilters]=useState({cliente:'',estado:'',modelo:''});const [error,setError]=useState('');const [message,setMessage]=useState('');const [loading,setLoading]=useState(true);
const [autorizado,setAutorizado]=useState(false);
 const cargar = useCallback(async () => {
  try {
    const q = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      )
    );

    const r = await api(`/reparaciones?${q}`);
    setRows(r.data);
  } catch (e) {
    setError(e.message);

    if (
      e.message.toLowerCase().includes('token') ||
      e.message.toLowerCase().includes('autentic')
    ) {
      localStorage.removeItem('gestor_token');
      window.location.href = '/login';
    }
  } finally {
    setLoading(false);
  }
}, [filters]);
 useEffect(() => {
  const token = localStorage.getItem('gestor_token');

  if (!token) {
    window.location.replace('/login');
    return;
  }

  try {
    const payload = JSON.parse(
      atob(
        token.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
    );

    if (payload.rol !== 'admin') {
      window.location.replace('/seguimiento');
      return;
    }

    setAutorizado(true);
    cargar();

  } catch (error) {
    localStorage.removeItem('gestor_token');
    window.location.replace('/login');
  }
}, [cargar]);
 const stats=useMemo(()=>({total:rows.length,ingresado:rows.filter(x=>x.estado==='Ingresado').length,diagnostico:rows.filter(x=>x.estado==='En Diagnóstico').length,listo:rows.filter(x=>['Reparado','Entregado'].includes(x.estado)).length}),[rows]);
 async function crear(e){e.preventDefault();setError('');setMessage('');try{const r=await api('/reparaciones',{method:'POST',body:JSON.stringify(form)});setMessage(`Orden creada. Código de seguimiento: ${r.data.codigoSeguimiento}`);setForm(initial);await cargar();}catch(e){setError(e.message);}}
 async function cambiar(id,estado){try{await api(`/reparaciones/${id}/estado`,{method:'PATCH',body:JSON.stringify({estado})});setMessage('Estado actualizado.');await cargar();}catch(e){setError(e.message);}}
 async function editar(r){const nombreCliente=window.prompt('Nombre del cliente:',r.nombre_cliente);if(nombreCliente===null)return;const email=window.prompt('Email:',r.email);if(email===null)return;const telefono=window.prompt('Teléfono:',r.telefono);if(telefono===null)return;const marca=window.prompt('Marca:',r.marca);if(marca===null)return;const modelo=window.prompt('Modelo:',r.modelo);if(modelo===null)return;const problemaReportado=window.prompt('Problema reportado:',r.problema_reportado);if(problemaReportado===null)return;try{await api(`/reparaciones/${r.id}`,{method:'PUT',body:JSON.stringify({nombreCliente,email,telefono,marca,modelo,problemaReportado})});setMessage('Orden actualizada.');await cargar();}catch(e){setError(e.message);}}
 async function borrar(id){if(!window.confirm('¿Seguro que querés eliminar esta orden?'))return;try{await api(`/reparaciones/${id}`,{method:'DELETE'});setMessage('Orden eliminada.');await cargar();}catch(e){setError(e.message);}}
 if (!autorizado) return null;
 return <div className="shell"><Header admin/><main className="container"><div className="dashboard-head"><div><p className="muted" style={{margin:'0 0 5px'}}>PANEL DE CONTROL</p><h1 className="section-title" style={{margin:0}}>Gestión de reparaciones</h1></div><button className="btn btn-outline" onClick={cargar}>↻ Actualizar</button></div>{error&&<div className="alert">{error}</div>}{message&&<div className="alert success">{message}</div>}<div className="stats"><div className="card stat"><small>Órdenes visibles</small><strong>{stats.total}</strong></div><div className="card stat"><small>Ingresadas</small><strong>{stats.ingresado}</strong></div><div className="card stat"><small>En diagnóstico</small><strong>{stats.diagnostico}</strong></div><div className="card stat"><small>Reparadas / entregadas</small><strong>{stats.listo}</strong></div></div>
 <div className="two-col" style={{alignItems:'start'}}><section className="panel"><h2 className="section-title" style={{fontSize:21}}>Registrar equipo</h2><form onSubmit={crear}><div className="field"><label>Nombre del cliente</label><input value={form.nombreCliente} onChange={e=>setForm({...form,nombreCliente:e.target.value})} required/></div><div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div><div className="field"><label>Teléfono</label><input value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} required/></div><div className="field"><label>Marca</label><input value={form.marca} onChange={e=>setForm({...form,marca:e.target.value})} required/></div><div className="field"><label>Modelo</label><input value={form.modelo} onChange={e=>setForm({...form,modelo:e.target.value})} required/></div><div className="field"><label>Problema reportado</label><textarea value={form.problemaReportado} onChange={e=>setForm({...form,problemaReportado:e.target.value})} required/></div><button className="btn" style={{width:'100%'}}>Crear orden</button></form></section>
 <section className="panel"><h2 className="section-title" style={{fontSize:21}}>Buscar y filtrar</h2><div className="field"><label>Cliente</label><input value={filters.cliente} onChange={e=>setFilters({...filters,cliente:e.target.value})} placeholder="Nombre del cliente"/></div><div className="field"><label>Estado</label><select value={filters.estado} onChange={e=>setFilters({...filters,estado:e.target.value})}><option value="">Todos los estados</option>{estados.map(s=><option key={s}>{s}</option>)}</select></div><div className="field"><label>Modelo</label><input value={filters.modelo} onChange={e=>setFilters({...filters,modelo:e.target.value})} placeholder="Modelo del equipo"/></div><button className="btn" onClick={()=>{setLoading(true);cargar();}}>Aplicar filtros</button> <button className="btn btn-outline" onClick={()=>{setFilters({cliente:'',estado:'',modelo:''});setTimeout(()=>{setLoading(true);api('/reparaciones').then(r=>setRows(r.data)).catch(e=>setError(e.message)).finally(()=>setLoading(false));},0);}}>Limpiar</button><p className="notice" style={{marginTop:18}}>Los códigos de seguimiento se generan automáticamente en el servidor.</p></section></div>
 <section className="panel" style={{marginTop:22}}><div className="dashboard-head"><div><h2 className="section-title" style={{fontSize:21,margin:0}}>Órdenes registradas</h2><p className="muted" style={{fontSize:13,margin:'5px 0 0'}}>Administrá el avance de cada reparación.</p></div></div>{loading?<p className="empty">Cargando órdenes...</p>:rows.length===0?<p className="empty">No hay órdenes para mostrar.</p>:<div className="table-wrap"><table><thead><tr><th>Código</th><th>Cliente</th><th>Equipo</th><th>Estado</th><th>Ingreso</th><th>Acciones</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><strong>{r.codigo_seguimiento}</strong></td><td>{r.nombre_cliente}<br/><span className="muted">{r.telefono}</span></td><td>{r.marca} {r.modelo}</td><td><select aria-label="Estado" value={r.estado} onChange={e=>cambiar(r.id,e.target.value)} style={{border:'1px solid #d9e1ec',borderRadius:7,padding:7,fontSize:12}}>{estados.map(s=><option key={s}>{s}</option>)}</select></td><td>{String(r.fecha_ingreso).slice(0,10)}</td><td><div className="row-actions"><button className="btn btn-small btn-outline" onClick={()=>editar(r)}>Editar</button><button className="btn btn-danger btn-small" onClick={()=>borrar(r.id)}>Eliminar</button></div></td></tr>)}</tbody></table></div>}</section></main><footer className="footer">Gestor de Reparaciones Electrónicas · Panel administrativo</footer></div>;
}
