const productos=[
    {id:1,nombre:'Laptop',precio:899},
    {id:2,nombre:'Mouse',precio:25},
    {id:3,nombre:'Monitor',precio:200},
    {id:4,nombre:'Teclado',precio:60}
];
let c=[];
let h='';
productos.forEach(p=>h+=`<div class='col-md-3'><div class='card glass-card border-0'><img src='img/p${p.id}.png' class='card-img-top' alt='${p.nombre}' onerror="this.src='https://via.placeholder.com/300x200/0f172a/6366f1?text=${p.nombre}'"><div class='card-body'><h5>${p.nombre}</h5><p class='text-primary fw-bold'>$${p.precio}</p><button class='btn btn-success w-100 mt-2' onclick='agregar(${p.id})'>Agregar al Carrito</button></div></div></div>`);
document.getElementById('productos').innerHTML=h;

function actualizarCarritoUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cantidadElement = document.getElementById('cantidad');
    
    cantidadElement.textContent = c.length;

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
    cartTotalElement.textContent = `$${total}`;
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
    
    window.location.href = 'compra_exitosa.html';
}