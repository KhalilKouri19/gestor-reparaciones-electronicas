'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { api } from '../../lib/api';
const estados=['Ingresado','En Diagnóstico','Reparado','Entregado'];
export default function Seguimiento(){const [codigo,setCodigo]=useState('');const [data,setData]=useState(null);const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 async function buscar(e){e.preventDefault();setError('');setData(null);setLoading(true);try{const r=await api(`/reparaciones/seguimiento/${encodeURIComponent(codigo.trim())}`);setData(r.data);}catch(err){setError(err.message);}finally{setLoading(false);}}
 const actual=data?estados.indexOf(data.estado):-1;
 return <div className="shell"><Header/><main className="container" style={{maxWidth:760}}><Link className="backlink" href="/">← Inicio</Link><section className="panel" style={{marginTop:20}}><h1 className="section-title">Seguimiento de reparación</h1><p className="muted">Ingresá el código que recibiste al dejar tu equipo en el servicio técnico.</p><form onSubmit={buscar}><div className="field"><label>Código de seguimiento</label><input value={codigo} onChange={e=>setCodigo(e.target.value.toUpperCase())} placeholder="REP-ABCD-1234" required/></div><button className="btn" disabled={loading}>{loading?'Consultando...':'Consultar estado'}</button></form>{error&&<div className="alert" style={{marginTop:18}}>{error}</div>}</section>{data&&<section className="panel track-result"><p className="muted" style={{marginTop:0}}>Código de seguimiento</p><div className="track-code">{data.codigoSeguimiento}</div><h2 style={{font: '700 21px Manrope',marginBottom:4}}>{data.marca} {data.modelo}</h2><p>Estado actual: <span className="status">{data.estado}</span></p><div className="steps">{estados.map((s,i)=><div key={s} className={`step ${i<=actual?'active':''}`}>{s}</div>)}</div><p className="notice">Fecha de ingreso: {String(data.fechaIngreso).slice(0,10)}{data.fechaSalida?` · Fecha de salida: ${String(data.fechaSalida).slice(0,10)}`:''}</p></section>}</main></div>;
}
