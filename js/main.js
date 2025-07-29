document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost/api/products';
    const form = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const productIdInput = document.getElementById('productId');
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const submitButton = document.getElementById('submitButton');


    const cargarDatos = async () => {
        try {
            submitButton.classList.remove('bg-blue-700','hover:bg-blue-800');
            submitButton.classList.add('cursor-not-allowed','bg-blue-300');
            const response = await fetch(API_URL);
            const products = await response.json();

            productList.innerHTML = '';
            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.classList.add('odd:bg-white', 'even:bg-gray-50', 'border-b', 'border-gray-200')
                tr.innerHTML = `
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${product.name}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${product.price}</td>
                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <button class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" 
                                onclick="editProduct(${product.id}, '${product.name}', ${product.price})">Editar</button>
                                <button class="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
                                onclick="deleteProduct(${product.id})">Eliminar</button>
                            </td>
                        `;
                productList.appendChild(tr);
            });

            submitButton.classList.add('bg-blue-700','hover:bg-blue-800');
            submitButton.classList.remove('cursor-not-allowed','bg-blue-300');
        } catch (error) {
            console.error("Hubo un error al cargar los datos:", error);
            productList.innerHTML = `<tr><td colspan="3" class="text-center py-4">No se pudieron cargar los productos.</td></tr>`;
        }
        
    };


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = productIdInput.value;
        const name = nameInput.value;
        const price = priceInput.value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });

        form.reset();
        productIdInput.value = '';
        submitButton.textContent = 'Guardar Producto';
        await cargarDatos();
    });

    window.editProduct = (id, name, price) => {
        productIdInput.value = id;
        nameInput.value = name;
        priceInput.value = price;
         submitButton.textContent = 'Actualizar Producto'; 
    };

    window.deleteProduct = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            await cargarDatos();
        }
    };
    
    cargarDatos();
});
