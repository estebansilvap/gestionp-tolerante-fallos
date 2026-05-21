// ===========================
//  Datos iniciales
// ===========================
let orders = [
  { id: 1,  customer: 'Laura Gómez',      product: 'Laptop Pro X',       amount: 2850000, state: 'Entregado',  start_date: '2025-04-10' },
  { id: 2,  customer: 'Carlos Ruiz',       product: 'Monitor 4K',         amount: 980000,  state: 'Procesando', start_date: '2025-04-18' },
  { id: 3,  customer: 'María Torres',      product: 'Teclado Mecánico',   amount: 320000,  state: 'Enviado',    start_date: '2025-04-20' },
  { id: 4,  customer: 'Juan Pérez',        product: 'Mouse Inalámbrico',  amount: 150000,  state: 'Pendiente',  start_date: '2025-04-22' },
  { id: 5,  customer: 'Ana López',         product: 'Auriculares BT',     amount: 420000,  state: 'Entregado',  start_date: '2025-03-15' },
  { id: 6,  customer: 'Pedro Castro',      product: 'Webcam HD',          amount: 210000,  state: 'Cancelado',  start_date: '2025-04-05' },
  { id: 7,  customer: 'Sofia Herrera',     product: 'SSD 1TB',            amount: 380000,  state: 'Pendiente',  start_date: '2025-04-23' },
  { id: 8,  customer: 'Diego Morales',     product: 'Hub USB-C',          amount: 95000,   state: 'Procesando', start_date: '2025-04-21' },
  { id: 9,  customer: 'Camila Díaz',       product: 'Tablet 10"',         amount: 1250000, state: 'Enviado',    start_date: '2025-04-19' },
  { id: 10, customer: 'Ricardo Vargas',    product: 'Impresora Laser',    amount: 760000,  state: 'Entregado',  start_date: '2025-04-01' },
  { id: 11, customer: 'Valentina Cruz',    product: 'RAM 32GB',           amount: 430000,  state: 'Pendiente',  start_date: '2025-04-24' },
  { id: 12, customer: 'Mateo Jiménez',     product: 'GPU RTX 4060',       amount: 3200000, state: 'Procesando', start_date: '2025-04-17' },
];

let nextId    = 13;
let currentPage = 1;
const PER_PAGE  = 7;
let sortField   = 'id';
let sortDir     = 1;   // 1 = asc, -1 = desc


// ===========================
//  Utilidades de formato
// ===========================
function fmt(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(n);
}

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}


// ===========================
//  Mapas de estado
// ===========================
const STATE_CLASS = {
  Pendiente:  'badge-pending',
  Procesando: 'badge-processing',
  Enviado:    'badge-shipped',
  Entregado:  'badge-delivered',
  Cancelado:  'badge-cancelled',
};

const STATE_ICON = {
  Pendiente:  'ti-clock',
  Procesando: 'ti-refresh',
  Enviado:    'ti-truck',
  Entregado:  'ti-circle-check',
  Cancelado:  'ti-x',
};


// ===========================
//  Filtro y ordenamiento
// ===========================
function getFiltered() {
  const q  = document.getElementById('search').value.toLowerCase();
  const st = document.getElementById('filter-state').value;

  return orders
    .filter(o => {
      const matchQuery = !q ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchState = !st || o.state === st;
      return matchQuery && matchState;
    })
    .sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      if (sortField === 'amount' || sortField === 'id') {
        return (va - vb) * sortDir;
      }
      return String(va).localeCompare(String(vb)) * sortDir;
    });
}

function sortBy(field) {
  sortDir   = sortField === field ? sortDir * -1 : 1;
  sortField = field;
  currentPage = 1;
  render();
}

function goPage(p) {
  currentPage = p;
  render();
}


// ===========================
//  Render principal
// ===========================
function render() {
  const filtered = getFiltered();
  const total    = filtered.length;
  const pages    = Math.max(1, Math.ceil(total / PER_PAGE));
  if (currentPage > pages) currentPage = pages;

  const slice = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  renderTable(slice);
  renderPagination(total, pages);
  renderMetrics();
}

function renderTable(slice) {
  const tbody = document.getElementById('tbody');

  if (!slice.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty">
            <i class="ti ti-inbox" aria-hidden="true"></i>
            No se encontraron pedidos
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = slice.map(o => `
    <tr>
      <td class="td-id">#${o.id}</td>
      <td class="td-customer">
        <i class="ti ti-user" aria-hidden="true"></i>${o.customer}
      </td>
      <td title="${o.product}">${o.product}</td>
      <td class="td-amount">${fmt(o.amount)}</td>
      <td>
        <span class="badge ${STATE_CLASS[o.state]}">
          <i class="ti ${STATE_ICON[o.state]}" aria-hidden="true"></i>
          ${o.state}
        </span>
      </td>
      <td class="td-date">${fmtDate(o.start_date)}</td>
      <td>
        <div class="actions">
          <button class="btn btn-sm" onclick="openEdit(${o.id})" title="Editar pedido">
            <i class="ti ti-edit" aria-hidden="true"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="openDelete(${o.id})" title="Eliminar pedido">
            <i class="ti ti-trash" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

function renderPagination(total, pages) {
  document.getElementById('pag-info').textContent =
    `${total} pedido${total !== 1 ? 's' : ''}`;

  document.getElementById('pag-btns').innerHTML =
    Array.from({ length: pages }, (_, i) =>
      `<button class="page-btn ${i + 1 === currentPage ? 'active' : ''}"
               onclick="goPage(${i + 1})">${i + 1}</button>`
    ).join('');
}

function renderMetrics() {
  const total     = orders.length;
  const totalAmt  = orders.reduce((s, o) => s + o.amount, 0);
  const pending   = orders.filter(o => o.state === 'Pendiente').length;
  const delivered = orders.filter(o => o.state === 'Entregado').length;

  document.getElementById('metrics').innerHTML = `
    <div class="metric">
      <div class="metric-label">
        <i class="ti ti-list" aria-hidden="true"></i> Total pedidos
      </div>
      <div class="metric-value">${total}</div>
      <div class="metric-sub">En el sistema</div>
    </div>
    <div class="metric">
      <div class="metric-label">
        <i class="ti ti-currency-dollar" aria-hidden="true"></i> Ingresos totales
      </div>
      <div class="metric-value metric-value--amount">${fmt(totalAmt)}</div>
      <div class="metric-sub">Suma de pedidos</div>
    </div>
    <div class="metric">
      <div class="metric-label">
        <i class="ti ti-clock" aria-hidden="true"></i> Pendientes
      </div>
      <div class="metric-value metric-value--pending">${pending}</div>
      <div class="metric-sub">Por atender</div>
    </div>
    <div class="metric">
      <div class="metric-label">
        <i class="ti ti-circle-check" aria-hidden="true"></i> Entregados
      </div>
      <div class="metric-value metric-value--delivered">${delivered}</div>
      <div class="metric-sub">Completados</div>
    </div>`;
}


// ===========================
//  Toast
// ===========================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = `<i class="ti ti-check" aria-hidden="true"></i>${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}


// ===========================
//  Modal helpers
// ===========================
function showModal(html) {
  document.getElementById('modal-container').innerHTML =
    `<div class="overlay" onclick="handleOverlayClick(event)">
       <div class="modal">${html}</div>
     </div>`;
}

function closeModal() {
  document.getElementById('modal-container').innerHTML = '';
}

function handleOverlayClick(e) {
  if (e.target.classList.contains('overlay')) closeModal();
}

function stateOptions(selected = 'Pendiente') {
  return ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado']
    .map(s => `<option value="${s}" ${s === selected ? 'selected' : ''}>${s}</option>`)
    .join('');
}

function modalHeader(icon, title, danger = false) {
  return `
    <div class="modal-header">
      <h2 ${danger ? 'class="danger"' : ''}>
        <i class="ti ${icon}" aria-hidden="true"></i>${title}
      </h2>
      <button class="btn btn-sm" onclick="closeModal()" aria-label="Cerrar">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    </div>`;
}


// ===========================
//  CREATE
// ===========================
function openCreate() {
  const today = new Date().toISOString().split('T')[0];
  showModal(`
    ${modalHeader('ti-plus', 'Nuevo pedido')}
    <div class="modal-body">
      <div class="form-row">
        <div class="field">
          <label for="f-customer">Cliente *</label>
          <input id="f-customer" placeholder="Nombre del cliente" />
        </div>
        <div class="field">
          <label for="f-product">Producto *</label>
          <input id="f-product" placeholder="Nombre del producto" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="f-amount">Monto (COP) *</label>
          <input id="f-amount" type="number" placeholder="0" min="0" />
        </div>
        <div class="field">
          <label for="f-state">Estado *</label>
          <select id="f-state">${stateOptions()}</select>
        </div>
      </div>
      <div class="field">
        <label for="f-date">Fecha de inicio *</label>
        <input id="f-date" type="date" value="${today}" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveCreate()">
        <i class="ti ti-plus" aria-hidden="true"></i> Crear pedido
      </button>
    </div>`);
}

function saveCreate() {
  const customer   = document.getElementById('f-customer').value.trim();
  const product    = document.getElementById('f-product').value.trim();
  const amount     = parseFloat(document.getElementById('f-amount').value);
  const state      = document.getElementById('f-state').value;
  const start_date = document.getElementById('f-date').value;

  if (!customer || !product || isNaN(amount) || amount < 0 || !start_date) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  orders.unshift({ id: nextId++, customer, product, amount, state, start_date });
  currentPage = 1;
  closeModal();
  render();
  showToast('Pedido creado exitosamente');
}


// ===========================
//  READ (ver detalle)
// ===========================
// La lectura ocurre en la tabla principal.
// Si deseas un modal de detalle, puedes llamar openDetail(id).
function openDetail(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  showModal(`
    ${modalHeader('ti-file-description', `Pedido #${o.id}`)}
    <div class="modal-body">
      <div class="form-row">
        <div class="field"><label>Cliente</label><input value="${o.customer}" readonly /></div>
        <div class="field"><label>Producto</label><input value="${o.product}" readonly /></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Monto</label><input value="${fmt(o.amount)}" readonly /></div>
        <div class="field"><label>Estado</label><input value="${o.state}" readonly /></div>
      </div>
      <div class="field"><label>Fecha de inicio</label><input value="${fmtDate(o.start_date)}" readonly /></div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cerrar</button>
      <button class="btn btn-primary" onclick="closeModal(); openEdit(${o.id})">
        <i class="ti ti-edit" aria-hidden="true"></i> Editar
      </button>
    </div>`);
}


// ===========================
//  UPDATE
// ===========================
function openEdit(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  showModal(`
    ${modalHeader('ti-edit', `Editar pedido #${o.id}`)}
    <div class="modal-body">
      <div class="form-row">
        <div class="field">
          <label for="e-customer">Cliente *</label>
          <input id="e-customer" value="${o.customer}" />
        </div>
        <div class="field">
          <label for="e-product">Producto *</label>
          <input id="e-product" value="${o.product}" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="e-amount">Monto (COP) *</label>
          <input id="e-amount" type="number" value="${o.amount}" min="0" />
        </div>
        <div class="field">
          <label for="e-state">Estado *</label>
          <select id="e-state">${stateOptions(o.state)}</select>
        </div>
      </div>
      <div class="field">
        <label for="e-date">Fecha de inicio *</label>
        <input id="e-date" type="date" value="${o.start_date}" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="saveEdit(${id})">
        <i class="ti ti-device-floppy" aria-hidden="true"></i> Guardar cambios
      </button>
    </div>`);
}

function saveEdit(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;

  const customer   = document.getElementById('e-customer').value.trim();
  const product    = document.getElementById('e-product').value.trim();
  const amount     = parseFloat(document.getElementById('e-amount').value);
  const state      = document.getElementById('e-state').value;
  const start_date = document.getElementById('e-date').value;

  if (!customer || !product || isNaN(amount) || amount < 0 || !start_date) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  Object.assign(o, { customer, product, amount, state, start_date });
  closeModal();
  render();
  showToast('Pedido actualizado correctamente');
}


// ===========================
//  DELETE
// ===========================
function openDelete(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  showModal(`
    ${modalHeader('ti-trash', 'Eliminar pedido', true)}
    <div class="delete-confirm">
      <i class="ti ti-alert-triangle" aria-hidden="true"></i>
      <p>¿Estás seguro de eliminar el pedido <strong>#${o.id}</strong>
         de <strong>${o.customer}</strong>?</p>
      <p>Esta acción no se puede deshacer.</p>
    </div>
    <div class="modal-footer">
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-danger" onclick="confirmDelete(${id})">
        <i class="ti ti-trash" aria-hidden="true"></i> Eliminar
      </button>
    </div>`);
}

function confirmDelete(id) {
  orders = orders.filter(o => o.id !== id);
  closeModal();
  render();
  showToast('Pedido eliminado');
}


// ===========================
//  Init
// ===========================
render();
