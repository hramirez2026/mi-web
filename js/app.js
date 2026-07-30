const productos=[
    {id:1, nombre:'Laptop Gamer', precio:1299, categoria: 'PC', descripcion: 'Potente laptop para gaming con gráficos de última generación, pantalla de 144Hz y teclado retroiluminado RGB. Ideal para profesionales y entusiastas.', imagen: 'img/laptop.png'},
    {id:2, nombre:'Auriculares Premium', precio:150, categoria: 'Audio', descripcion: 'Auriculares inalámbricos con cancelación de ruido activa, sonido de alta fidelidad y batería de larga duración. Perfecto para música y podcasts.', imagen: 'img/audio.png'},
    {id:3, nombre:'Smart TV 55"', precio:499, categoria: 'TV', descripcion: 'Televisor inteligente 4K UHD con colores vibrantes, HDR y sonido envolvente para una experiencia cinematográfica inigualable en tu hogar.', imagen: 'img/tv.png'},
    {id:4, nombre:'Teclado Mecánico', precio:85, categoria: 'PC', descripcion: 'Teclado mecánico con switches táctiles, retroiluminación RGB personalizable y diseño ergonómico para largas sesiones de uso.', imagen: 'img/teclado.png'}
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
                    <p class='text-primary fw-bold mb-3'>$${p.precio}</p>
                    <div class="mt-auto d-flex gap-2">
                        <button class='btn btn-outline-light w-50' onclick='verDetalles(${p.id})'>Detalles</button>
                        <button class='btn btn-success w-50' onclick='agregar(${p.id})'>Agregar</button>
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
    // Save to localStorage whenever we update the UI
    localStorage.setItem('cart', JSON.stringify(c));

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cantidadElement = document.getElementById('cantidad');
    
    if (cantidadElement) cantidadElement.textContent = c.length;

    if (!cartItemsContainer) return; // Might not exist on all pages

    if (c.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-muted mt-4">Tu carrito está vacío.</p>';
        cartTotalElement.textContent = '$0';
        return;
    }

    let itemsHtml = '';
    let total = 0;
    c.forEach((item, index) => {
        total += item.precio;
        itemsHtml += `
            <div class="cart-item">
                <div>
                    <h6>${item.nombre}</h6>
                    <p class="mb-0 text-primary">$${item.precio}</p>
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
    fbq('track','AddToCart',{content_ids:[p.id],content_name:p.nombre,content_type:'product',value:p.precio,currency:'USD'});
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
    
    const totalValue = c.reduce((sum, item) => sum + item.precio, 0);
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
            if (detailPrice) detailPrice.textContent = `$${p.precio}`;
            
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
                content_ids: [p.id],
                content_name: p.nombre,
                content_category: p.categoria,
                content_type: 'product',
                value: p.precio,
                currency: 'USD'
            });
        } else {
            const detailContainer = document.getElementById('detail-container');
            if (detailContainer) detailContainer.innerHTML = '<h3 class="text-center mt-5">Producto no encontrado</h3>';
        }
    }
});