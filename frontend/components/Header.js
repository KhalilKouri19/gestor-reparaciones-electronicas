'use client';
import Link from 'next/link';
export default function Header({ admin = false }) {
  function salir() { localStorage.removeItem('gestor_token'); window.location.href = '/login'; }
  return <header className="topbar"><Link href="/" className="brand">GESTOR<span>.</span></Link><nav className="nav"><Link href="/seguimiento">Seguimiento</Link>{admin ? <button className="btn btn-small btn-outline" onClick={salir}>Cerrar sesión</button> : <Link href="/login">Administración</Link>}</nav></header>;
}
