const productos=[
    {id:5, sku: '0000005', nombre:'Monitor de 27 Pulgadas 144Hz', precio:299, precioOferta: 259, categoria: 'PC', descripcion: 'Monitor de 27 pulgadas con panel IPS, resolución Full HD y frecuencia de actualización de 144Hz.', imagen: 'img/monitor.png'},
    {id:6, sku: '0000006', nombre:'Ratón Inalámbrico USB Pro XZ', precio:60, precioOferta: 340, categoria: 'PC', descripcion: 'Ratón inalámbrico con sensor óptico, diseño ergonómico y batería recargable integrada.', imagen: 'img/mouse.png'},
    {id:7, sku: '0000007', nombre:'Cámara Web 1080p HD', precio:75, precioOferta: 55, categoria: 'PC', descripcion: 'Cámara web con resolución 1080p, conexión USB y micrófono estéreo incorporado para videollamadas.', imagen: 'img/webcam.svg'},
    {id:8, sku: '0000008', nombre:'Micrófono de Condensador Studio', precio:130, precioOferta: 89, categoria: 'Audio', descripcion: 'Micrófono de condensador con patrón polar cardioide, base de escritorio y conexión USB.', imagen: 'img/mic.svg'},
    {id:9, sku: '0000009', nombre:'Consola de Videojuegos Doméstica', precio:499, precioOferta: 399, categoria: 'Gaming', descripcion: 'Consola de videojuegos doméstica con unidad de estado sólido interno y mando inalámbrico incluido (all).', imagen: 'img/console.svg'},
    {id:10, sku: '0000010', nombre:'Silla de Escritorio Ergonómica Gaming Pro', precio:250, precioOferta: 199, categoria: 'Gaming', descripcion: 'Silla de escritorio con diseño ergonómico, soporte lumbar ajustable y respaldo reclinable 100% PRO.', imagen: 'img/chair.svg'},
    {id:11, sku: '0000011', nombre:'Tableta de 10 Pulgadas L', precio:320, precioOferta: 289, categoria: 'Tablet', descripcion: 'Tableta electrónica de 10 pulgadas con pantalla táctil, conectividad Wi-Fi y cámaras frontal y trasera color negro.', imagen: 'img/tablet.svg'},
    {id:12, sku: '0000012', nombre:'Reloj Inteligente Deportivo PRO', precio:199, precioOferta: 189, categoria: 'Wearable', descripcion: 'Reloj inteligente con conectividad Bluetooth, monitor de frecuencia cardíaca y resistencia al agua y polvo.', imagen: 'img/watch.svg'},
    {id:13, sku: '0000013', nombre:'Audífonos Inalámbricos Básicos 2', precio:199, precioOferta: 129, categoria: 'Audio', descripcion: 'Audífonos inalámbricos intrauditivos con conectividad Bluetooth y estuche de carga recargable 25 watt.', imagen: 'img/p1.png'}
];

// Initialize cart from localStorage
let c = JSON.parse(localStorage.getItem('cart')) || [];

// Render products list if we are on productos.html
const productosContainer = document.getElementById('productos');
if (productosContainer) {
    let h='';
    productos.forEach(p=>h+=`
        <div class='col-md-3'>
            <div class='card glass-card border-0 h-100'>
                <img src='${p.imagen}' class='card-img-top' alt='${p.nombre}' style='object-fit: cover; height: 200px;'>
                <div class='card-body d-flex flex-column'>
                    <span class="badge bg-secondary mb-2 align-self-start">${p.categoria}</span>
                <h5 class='mb-1'>${p.nombre}</h5>
                <p class='text-primary fw-bold mb-3'>
                    ${p.precioOferta ? `<del class="text-muted small">$${p.precio}</del> $${p.precioOferta}` : `$${p.precio}`}
                </p>
                <div class="row g-2 mt-auto">
                    <div class="col-12 col-xl-6">
                        <button class='btn btn-outline-light w-100' onclick='verDetalles(${p.id})'>Detalles</button>
                    </div>
                    <div class="col-12 col-xl-6">
                        <button class='btn btn-success w-100' onclick='agregar(${p.id})'>Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `);
    productosContainer.innerHTML=h;
}

// Initial UI update for cart
actualizarCarritoUI();

function actualizarCarritoUI() {
    localStorage.setItem('cart', JSON.stringify(c));
    const cartCountElement = document.getElementById('cantidad');
    if (cartCountElement) {
        cartCountElement.textContent = c.length;
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer) return;

    if (c.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-muted my-5">Tu carrito está vacío</p>';
        if (cartTotalElement) cartTotalElement.textContent = '$0';
        return;
    }

    let itemsHtml = '';
    let total = 0;

    c.forEach((item, index) => {
        const itemPrice = item.precioOferta || item.precio;
        total += itemPrice;
        itemsHtml += `
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-dark bg-opacity-50 rounded">
                <div>
                    <h6>${item.nombre}</h6>
                    <p class="mb-0 text-primary">$${itemPrice}</p>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminar(${index})">🗑️</button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHtml;
    if (cartTotalElement) cartTotalElement.textContent = `$${total}`;
}

function agregar(id){
    const p=productos.find(x=>x.id===id);
    c.push(p);
    actualizarCarritoUI();
    const currentPrice = p.precioOferta || p.precio;
    fbq('track','AddToCart',{content_ids: [String(p.id)],content_name:p.nombre,content_type:'product',value:currentPrice,currency:'USD'});
}

function eliminar(index) {
    c.splice(index, 1);
    actualizarCarritoUI();
}

function comprar() {
    if (c.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de comprar.");
        return;
    }
    
    const totalValue = c.reduce((sum, item) => sum + (item.precioOferta || item.precio), 0);
    const productIds = c.map(item => item.id);
    
    localStorage.setItem('cartTotal', totalValue);
    localStorage.setItem('cartIds', JSON.stringify(productIds));
    // Clear the cart when buying
    c = [];
    actualizarCarritoUI();
    
    window.location.href = 'compra_exitosa.html';
}

function verDetalles(id) {
    window.location.href = 'detalles.html?id=' + id;
}

// Logic for detalles.html
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    
    if (idParam) {
        const id = parseInt(idParam);
        const p = productos.find(x => x.id === id);
        
        if (p) {
            const detailImg = document.getElementById('detail-img');
            const detailCat = document.getElementById('detail-category');
            const detailTitle = document.getElementById('detail-title');
            const detailDesc = document.getElementById('detail-desc');
            const detailPrice = document.getElementById('detail-price');
            const detailAddBtn = document.getElementById('detail-add-btn');

            if (detailImg) detailImg.src = p.imagen;
            if (detailCat) detailCat.textContent = p.categoria;
            if (detailTitle) detailTitle.textContent = p.nombre;
            if (detailDesc) detailDesc.textContent = p.descripcion;
            
            const currentPrice = p.precioOferta || p.precio;
            if (detailPrice) {
                detailPrice.setAttribute('data-price', currentPrice);
                detailPrice.innerHTML = p.precioOferta ? `<del class="text-muted fs-6">$${p.precio}</del> $${currentPrice}` : `$${currentPrice}`;
            }
            
            if (detailAddBtn) {
                detailAddBtn.onclick = () => {
                    agregar(p.id);
                    // Open the offcanvas automatically when adding from details page
                    const cartOffcanvasEl = document.getElementById('cartOffcanvas');
                    if(cartOffcanvasEl) {
                        const bsOffcanvas = new bootstrap.Offcanvas(cartOffcanvasEl);
                        bsOffcanvas.show();
                    }
                };
            }

            // Trigger ViewContent event
            fbq('track', 'ViewContent', {
                content_ids: [String(p.id)],
                content_name: p.nombre,
                content_category: p.categoria,
                content_type: 'product',
                value: p.precioOferta || p.precio,
                currency: 'USD'
            });
        } else {
            const detailContainer = document.getElementById('detail-container');
            if (detailContainer) detailContainer.innerHTML = '<h3 class="text-center mt-5">Producto no encontrado</h3>';
        }
    }
});