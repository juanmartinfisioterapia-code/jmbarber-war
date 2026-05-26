import React, { useState, useEffect } from 'react';

const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const DAYS_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const DEFAULT_HORARIO = {
  0: { active: true, open: '09:00', close: '19:00' },
  1: { active: true, open: '09:00', close: '19:00' },
  2: { active: true, open: '09:00', close: '19:00' },
  3: { active: true, open: '09:00', close: '19:00' },
  4: { active: true, open: '09:00', close: '14:00' },
  5: { active: false, open: '10:00', close: '14:00' },
  6: { active: false, open: '10:00', close: '14:00' },
};

function timeToMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function minToTime(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
function getInitials(name) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
function formatDate(dateStr) { const d = new Date(dateStr + 'T12:00:00'); return d.getDate() + ' de ' + MONTHS[d.getMonth()]; }

const s = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', height: 56, background: '#1a1a1a', borderBottom: '1px solid #333' },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  logoCircle: { width: 38, height: 38, borderRadius: '50%', background: '#2a2a2a', border: '1.5px solid #c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#c9a84c', flexShrink: 0 },
  brandName: { fontSize: 14, fontWeight: 600, color: '#c9a84c', letterSpacing: '0.08em', margin: 0 },
  brandSub: { fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 },
  tabs: { display: 'flex', gap: 4 },
  page: { minHeight: 'calc(100vh - 56px)', background: '#111', padding: '1.25rem' },
  card: { background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 14, padding: '1rem 1.25rem', marginBottom: '1rem' },
  sectionTitle: { fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 },
  label: { fontSize: 12, color: '#888', marginBottom: 4, display: 'block' },
  input: { width: '100%', padding: '10px 14px', fontSize: 15, border: '1px solid #333', borderRadius: 10, background: '#111', color: '#fff', outline: 'none', marginBottom: 0 },
  btnGold: { width: '100%', padding: '12px', fontSize: 15, fontWeight: 600, background: '#c9a84c', color: '#1a1a1a', border: 'none', borderRadius: 10, cursor: 'pointer', marginTop: 8 },
  btnGoldDisabled: { width: '100%', padding: '12px', fontSize: 15, fontWeight: 600, background: '#c9a84c', color: '#1a1a1a', border: 'none', borderRadius: 10, cursor: 'default', opacity: 0.35, marginTop: 8 },
  btnGray: { width: '100%', padding: '12px', fontSize: 15, fontWeight: 500, background: '#2a2a2a', color: '#ccc', border: '1px solid #333', borderRadius: 10, cursor: 'pointer', marginTop: 8 },
  row: { display: 'flex', gap: 8 },
  calGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 },
  calHeader: { fontSize: 11, textAlign: 'center', color: '#666', padding: '4px 0' },
  timeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 },
  menuItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, fontSize: 14, cursor: 'pointer', color: active ? '#fff' : '#888', background: active ? '#2a2a2a' : 'transparent', border: 'none', textAlign: 'left', width: '100%', marginBottom: 2, fontWeight: active ? 600 : 400 }),
  citaCard: { background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 14, padding: '1rem', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#c9a84c', flexShrink: 0 },
  btnConfirm: { padding: '6px 12px', fontSize: 12, fontWeight: 600, background: 'rgba(45,122,79,0.2)', color: '#4caf7d', border: '1px solid rgba(45,122,79,0.4)', borderRadius: 8, cursor: 'pointer' },
  btnReject: { padding: '6px 10px', fontSize: 12, background: 'rgba(163,48,48,0.2)', color: '#e57373', border: '1px solid rgba(163,48,48,0.4)', borderRadius: 8, cursor: 'pointer' },
  badgePending: { marginLeft: 'auto', background: 'rgba(163,48,48,0.2)', color: '#e57373', borderRadius: 99, fontSize: 11, fontWeight: 600, padding: '2px 8px' },
  agendaSlot: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 1rem', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 10, marginBottom: 4 },
  horarioRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 1rem', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 10, marginBottom: 6 },
  toast: (show) => ({ position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${show ? 0 : 80}px)`, background: '#1a1a1a', color: '#c9a84c', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 500, zIndex: 999, transition: 'transform 0.3s', pointerEvents: 'none', whiteSpace: 'nowrap', border: '1px solid #c9a84c' }),
  successIcon: { width: 56, height: 56, borderRadius: '50%', background: 'rgba(45,122,79,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24, color: '#4caf7d' },
  stepDot: (st) => ({ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, background: st === 'active' ? '#c9a84c' : st === 'done' ? 'rgba(45,122,79,0.3)' : '#2a2a2a', color: st === 'active' ? '#1a1a1a' : st === 'done' ? '#4caf7d' : '#666', border: `1px solid ${st === 'active' ? '#c9a84c' : st === 'done' ? '#4caf7d' : '#333'}` }),
};

function NavTab({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: active ? '1px solid #444' : '1px solid transparent', background: active ? '#2a2a2a' : 'transparent', color: active ? '#fff' : '#888', fontWeight: active ? 600 : 400 }}>
      {icon} {label}
    </button>
  );
}

function Toast({ msg, show }) {
  return <div style={s.toast(show)}>{msg}</div>;
}

export default function App() {
  const [view, setView] = useState('cliente');
  const [panel, setPanel] = useState('pendientes');
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(4);
  const [nombre, setNombre] = useState('');
  const [tel, setTel] = useState('');
  const [nota, setNota] = useState('');
  const [toast, setToast] = useState({ msg: '', show: false });
  const [citas, setCitas] = useState([]);
  const [horario, setHorario] = useState(DEFAULT_HORARIO);

  useEffect(() => {
    try { const c = localStorage.getItem('jmb-citas'); if (c) setCitas(JSON.parse(c)); } catch (e) {}
    try { const h = localStorage.getItem('jmb-horario'); if (h) setHorario(JSON.parse(h)); } catch (e) {}
  }, []);

  function saveCitas(newCitas) {
    setCitas(newCitas);
    try { localStorage.setItem('jmb-citas', JSON.stringify(newCitas)); } catch (e) {}
  }

  function saveHorario(newHorario) {
    setHorario(newHorario);
    try { localStorage.setItem('jmb-horario', JSON.stringify(newHorario)); } catch (e) {}
  }

  function showToast(msg) {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }

  const today = new Date();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  function getSlots() {
    if (!selectedDate) return [];
    const dow = new Date(selectedDate + 'T12:00:00').getDay();
    const dowIdx = dow === 0 ? 6 : dow - 1;
    const h = horario[dowIdx];
    const slots = [];
    let cur = timeToMin(h.open);
    const end = timeToMin(h.close) - 45;
    while (cur <= end) { slots.push(minToTime(cur)); cur += 45; }
    return slots;
  }

  function getTakenSlots() {
    return citas.filter(c => c.fecha === selectedDate && c.status !== 'rechazada').map(c => c.hora);
  }

  function handleSubmit() {
    const newCita = { id: Date.now(), nombre, tel, fecha: selectedDate, hora: selectedTime, nota, status: 'pendiente' };
    saveCitas([...citas, newCita]);
    setStep(4);
  }

  function resetClient() {
    setStep(1); setSelectedDate(null); setSelectedTime(null);
    setNombre(''); setTel(''); setNota('');
  }

  function confirmar(id) {
    const updated = citas.map(c => c.id === id ? { ...c, status: 'confirmada' } : c);
    saveCitas(updated);
    const cita = citas.find(c => c.id === id);
    showToast('Confirmada — WhatsApp a ' + cita.nombre.split(' ')[0]);
  }

  function rechazar(id) {
    const updated = citas.map(c => c.id === id ? { ...c, status: 'rechazada' } : c);
    saveCitas(updated);
    showToast('Rechazada — cliente notificado');
  }

  const pendientes = citas.filter(c => c.status === 'pendiente');
  const confirmadas = citas.filter(c => c.status === 'confirmada').sort((a, b) => a.fecha !== b.fecha ? a.fecha.localeCompare(b.fecha) : a.hora.localeCompare(b.hora));

  const byDate = {};
  confirmadas.forEach(c => { if (!byDate[c.fecha]) byDate[c.fecha] = []; byDate[c.fecha].push(c); });

  return (
    <div style={{ minHeight: '100vh', background: '#111', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* NAV */}
      <div style={s.nav}>
        <div style={s.brand}>
          <div style={s.logoCircle}>✂️</div>
          <div>
            <p style={s.brandName}>JMBARBER_WAR</p>
            <p style={s.brandSub}>Barbershop</p>
          </div>
        </div>
        <div style={s.tabs}>
          <NavTab label="Cliente" icon="👤" active={view === 'cliente'} onClick={() => setView('cliente')} />
          <NavTab label="Peluquero" icon="⚙️" active={view === 'peluquero'} onClick={() => { setView('peluquero'); setPanel('pendientes'); }} />
        </div>
      </div>

      {/* VISTA CLIENTE */}
      {view === 'cliente' && (
        <div style={{ ...s.page, maxWidth: 480, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#1a1a1a', border: '2px solid #c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: 32 }}>✂️</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Reserva tu cita</h2>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Elige día, hora y deja tus datos</p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            {[1, 2, 3, 4].map((n, i) => (
              <React.Fragment key={n}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={s.stepDot(step > n ? 'done' : step === n ? 'active' : 'idle')}>
                    {step > n ? '✓' : n}
                  </div>
                  <span style={{ fontSize: 11, color: step === n ? '#c9a84c' : '#555', fontWeight: step === n ? 600 : 400 }}>
                    {['Fecha', 'Hora', 'Datos', 'Listo'][i]}
                  </span>
                </div>
                {i < 3 && <div style={{ flex: '0 0 30px', height: 1, background: '#2a2a2a', marginBottom: 18 }} />}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Calendario */}
          {step === 1 && (
            <>
              <div style={s.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: '#888', fontSize: 16 }}>‹</button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: '#888', fontSize: 16 }}>›</button>
                </div>
                <div style={s.calGrid}>
                  {DAYS.map(d => <div key={d} style={s.calHeader}>{d}</div>)}
                </div>
                <div style={s.calGrid}>
                  {Array(offset).fill(null).map((_, i) => <div key={'e' + i} />)}
                  {Array(daysInMonth).fill(null).map((_, i) => {
                    const d = i + 1;
                    const dateObj = new Date(calYear, calMonth, d);
                    const dow = dateObj.getDay();
                    const dowIdx = dow === 0 ? 6 : dow - 1;
                    const isAvail = horario[dowIdx].active;
                    const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const isSel = selectedDate === dateStr;
                    const isToday = dateObj.toDateString() === today.toDateString();
                    const disabled = isPast || !isAvail;
                    return (
                      <div key={d} onClick={() => !disabled && setSelectedDate(dateStr)}
                        style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, borderRadius: 8, cursor: disabled ? 'default' : 'pointer', fontWeight: isAvail && !isPast ? 600 : 400, color: isSel ? '#1a1a1a' : disabled ? '#444' : isToday ? '#c9a84c' : '#ccc', background: isSel ? '#c9a84c' : 'transparent', border: isToday && !isSel ? '1px solid #c9a84c' : '1px solid transparent', opacity: disabled ? 0.4 : 1 }}>
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button disabled={!selectedDate} onClick={() => setStep(2)} style={selectedDate ? s.btnGold : s.btnGoldDisabled}>Continuar</button>
            </>
          )}

          {/* Step 2: Horas */}
          {step === 2 && (
            <>
              <div style={s.card}>
                <div style={s.sectionTitle}>{selectedDate ? formatDate(selectedDate) : 'Horas disponibles'}</div>
                <div style={s.timeGrid}>
                  {getSlots().map(slot => {
                    const taken = getTakenSlots().includes(slot);
                    const sel = selectedTime === slot;
                    return (
                      <div key={slot} onClick={() => !taken && setSelectedTime(slot)}
                        style={{ padding: '10px 4px', textAlign: 'center', fontSize: 13, fontWeight: sel ? 600 : 400, borderRadius: 8, cursor: taken ? 'default' : 'pointer', border: `1px solid ${sel ? '#c9a84c' : '#2a2a2a'}`, background: sel ? '#c9a84c' : '#111', color: sel ? '#1a1a1a' : taken ? '#333' : '#ccc', opacity: taken ? 0.3 : 1 }}>
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={s.row}>
                <button onClick={() => setStep(1)} style={s.btnGray}>Atrás</button>
                <button disabled={!selectedTime} onClick={() => setStep(3)} style={selectedTime ? s.btnGold : s.btnGoldDisabled}>Continuar</button>
              </div>
            </>
          )}

          {/* Step 3: Formulario */}
          {step === 3 && (
            <>
              <div style={s.card}>
                <div style={s.sectionTitle}>Tus datos</div>
                <div style={{ marginBottom: 12 }}>
                  <label style={s.label}>Nombre completo</label>
                  <input style={s.input} type="text" placeholder="Ej: Carlos García" value={nombre} onChange={e => setNombre(e.target.value)} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={s.label}>WhatsApp</label>
                  <input style={s.input} type="tel" placeholder="+34 600 000 000" value={tel} onChange={e => setTel(e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Notas (opcional)</label>
                  <input style={s.input} type="text" placeholder="Ej: Corte y barba" value={nota} onChange={e => setNota(e.target.value)} />
                </div>
              </div>
              <div style={s.row}>
                <button onClick={() => setStep(2)} style={s.btnGray}>Atrás</button>
                <button disabled={nombre.length < 3 || tel.length < 9} onClick={handleSubmit} style={nombre.length >= 3 && tel.length >= 9 ? s.btnGold : s.btnGoldDisabled}>Solicitar cita</button>
              </div>
            </>
          )}

          {/* Step 4: Éxito */}
          {step === 4 && (
            <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
              <div style={s.successIcon}>✓</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Solicitud enviada</h2>
              <p style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem' }}>Hola {nombre.split(' ')[0]}, el peluquero confirmará tu cita pronto.</p>
              <div style={s.card}>
                {[['Fecha', formatDate(selectedDate)], ['Hora', selectedTime], ['WhatsApp', tel]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#666', minWidth: 60 }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#ccc' }}>{v}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Recibirás un WhatsApp cuando se confirme y como recordatorio</p>
              <button onClick={resetClient} style={s.btnGold}>Hacer otra reserva</button>
            </div>
          )}
        </div>
      )}

      {/* VISTA PELUQUERO */}
      {view === 'peluquero' && (
        <div style={s.page}>
          {/* Menú horizontal en móvil */}
          <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', overflowX: 'auto' }}>
            {[['pendientes', '🕐', 'Pendientes'], ['agenda', '📅', 'Agenda'], ['horario', '⚙️', 'Horario']].map(([id, icon, label]) => (
              <button key={id} onClick={() => setPanel(id)} style={s.menuItem(panel === id)}>
                {icon} {label}
                {id === 'pendientes' && pendientes.length > 0 && <span style={s.badgePending}>{pendientes.length}</span>}
              </button>
            ))}
          </div>

          {/* Panel pendientes */}
          {panel === 'pendientes' && (
            <div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Solicitudes esperando confirmación</p>
              {pendientes.length === 0
                ? <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#555' }}><div style={{ fontSize: 32, marginBottom: 8 }}>✓</div><p>No hay solicitudes pendientes</p></div>
                : pendientes.map(c => (
                  <div key={c.id} style={s.citaCard}>
                    <div style={s.avatar}>{getInitials(c.nombre)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{c.nombre}</p>
                      <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>📅 {formatDate(c.fecha)} · 🕐 {c.hora}</p>
                      {c.nota && <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0', fontStyle: 'italic' }}>"{c.nota}"</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => confirmar(c.id)} style={s.btnConfirm}>✓ Confirmar</button>
                      <button onClick={() => rechazar(c.id)} style={s.btnReject}>✕</button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* Panel agenda */}
          {panel === 'agenda' && (
            <div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Citas confirmadas</p>
              {confirmadas.length === 0
                ? <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#555' }}><div style={{ fontSize: 32, marginBottom: 8 }}>📅</div><p>No hay citas confirmadas aún</p></div>
                : Object.entries(byDate).map(([fecha, cs]) => (
                  <div key={fecha} style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{formatDate(fecha)}</p>
                    {cs.map(c => (
                      <div key={c.id} style={s.agendaSlot}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#c9a84c', minWidth: 48 }}>{c.hora}</span>
                        <span style={{ fontSize: 13, color: '#ccc', flex: 1 }}>{c.nombre}</span>
                        <span style={{ fontSize: 12, color: '#666' }}>{c.nota || '—'}</span>
                        <span style={{ fontSize: 11, background: 'rgba(45,122,79,0.2)', color: '#4caf7d', borderRadius: 99, padding: '2px 8px' }}>✓ Confirmada</span>
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
          )}

          {/* Panel horario */}
          {panel === 'horario' && (
            <div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Configura tu disponibilidad semanal</p>
              {DAYS_FULL.map((day, i) => (
                <div key={i} style={s.horarioRow}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#ccc', minWidth: 80 }}>{day}</span>
                  <label style={{ position: 'relative', width: 36, height: 20, flexShrink: 0 }}>
                    <input type="checkbox" checked={horario[i].active} onChange={e => setHorario(h => ({ ...h, [i]: { ...h[i], active: e.target.checked } }))} style={{ opacity: 0, width: 0, height: 0 }} />
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: horario[i].active ? '#c9a84c' : '#333', cursor: 'pointer', transition: 'background 0.2s' }}>
                      <div style={{ position: 'absolute', top: 3, left: horario[i].active ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </div>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, opacity: horario[i].active ? 1 : 0.3 }}>
                    <input type="time" value={horario[i].open} disabled={!horario[i].active} onChange={e => setHorario(h => ({ ...h, [i]: { ...h[i], open: e.target.value } }))} style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #333', borderRadius: 8, background: '#111', color: '#ccc', width: 80 }} />
                    <span style={{ color: '#555' }}>–</span>
                    <input type="time" value={horario[i].close} disabled={!horario[i].active} onChange={e => setHorario(h => ({ ...h, [i]: { ...h[i], close: e.target.value } }))} style={{ padding: '4px 8px', fontSize: 13, border: '1px solid #333', borderRadius: 8, background: '#111', color: '#ccc', width: 80 }} />
                  </div>
                </div>
              ))}
              <button onClick={() => { saveHorario(horario); showToast('Horario guardado'); }} style={{ ...s.btnGold, marginTop: '1rem' }}>Guardar horario</button>
            </div>
          )}
        </div>
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </div>
  );
}
