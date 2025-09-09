const categoryList = document.getElementById('categoryList');
    const plantList = document.getElementById('plantList');
    const spinner = document.getElementById('spinner');
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
     const modalContain = document.getElementById('modalContainer');
    const newDetailsModal =document.getElementById("new-details-modal")
    

    let cart = [];
    let activeCategory = null;

    // Fetch categories
    async function loadCategories() {
      const res = await fetch('https://openapi.programming-hero.com/api/categories');
      const data = await res.json();
      categoryList.innerHTML = data.categories.map(cat => `
         <li>
          <button onclick="loadPlantsByCategory(${cat.id}, this)" 
            class="w-full text-left px-2 py-1 rounded hover:bg-green-300">
            ${cat.category_name}
          </button>
        </li>`).join('');
      loadPlantsByCategory(1, categoryList.querySelector('button'));
    }

    // Load plants by category
    async function loadPlantsByCategory(id, btn) {
      setActiveCategory(btn);
      spinner.classList.remove('hidden');
      plantList.innerHTML = '';
      const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
      const data = await res.json();
      spinner.classList.add('hidden');
      displayPlants(data.plants);
    }

    // Display plants
    function displayPlants(plants) {
      plantList.innerHTML = plants.map(plant => `
        <div class="bg-white rounded-xl shadow p-3">
          <img src="${plant.image}" class="h-32 w-full object-cover rounded" />
          <h3 onclick="showModal(${plant.id})" class="font-semibold mt-2 cursor-pointer text-green-600 hover:underline">${plant.name}</h3>
          <p class="text-sm text-gray-500">${plant.description}</p>
          <button class="bg-green-100 rounded-sm"><p class="text-xs text-green-500 mt-1">${plant.category}</p></button>
          <div class="flex justify-between items-center mt-2">
            <span class="font-bold">৳${plant.price}</span>
            <button onclick="addToCart(${plant.id}, '${plant.plant_name}', ${plant.price})" 
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Add to Cart
            </button>
          </div>
        </div>
      `).join('');
    }

    // Show modal



    // async function showModal(id) {
    //   const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    //   const plant = await res.json();
  
    // }


    const loadNewByCategory = (id) => {
  //   console.log(categoryId);
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => {
      ShowDetails(data.plants);
    })

  }
   const ShowDetails =(plants)=>{
    newDetailsModal.showModal()
    modalContain.innerHTML =`<h1>${plants.name}</h1>
    <img src="${plants.image[0].url}"/>
    <p>${plants.category}</p>
    <h2>${plants.price}</h2>
    <p>${plants.description}</p>
    
    `
   }


    // Add to cart
    function addToCart(id, name, price) {
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }
      updateCart();
    }

    // Remove from cart
    function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCart();
    }

    // Update cart UI
    function updateCart() {
      cartList.innerHTML = cart.map(item => `
        <li class="flex justify-between items-center bg-green-100 px-2 py-1 rounded">
          <span>${item.name} (x${item.qty})</span>
          <button onclick="removeFromCart(${item.id})" class="text-red-500">✖</button>
        </li>
      `).join('');
      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      cartTotal.textContent = `৳${total}`;
    }

     // Highlight active category
    function setActiveCategory(btn) {
      if (activeCategory) activeCategory.classList.remove('bg-green-500', 'text-white');
      btn.classList.add('bg-green-500', 'text-white');
      activeCategory = btn;
    }

    loadCategories();
    